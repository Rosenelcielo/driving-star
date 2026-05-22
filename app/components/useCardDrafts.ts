"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  CARD_DRAFT_STORAGE_KEY,
  buildDefaultDraft,
  getCardDraft,
  readCardDraftStore,
  writeCardDraftStore,
  type CardDraftStore,
  type EditableCardDraft,
} from "../lib/card-drafts";

const CARD_DRAFTS_EVENT = "driver-star-card-drafts-updated";
const EMPTY_SNAPSHOT = "{}";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CARD_DRAFTS_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CARD_DRAFTS_EVENT, handleChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  return window.localStorage.getItem(CARD_DRAFT_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function publishDrafts(next: CardDraftStore) {
  writeCardDraftStore(window.localStorage, next);
  window.dispatchEvent(new Event(CARD_DRAFTS_EVENT));
}

export function useCardDrafts() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const drafts = useMemo<CardDraftStore>(() => {
    try {
      return JSON.parse(snapshot) as CardDraftStore;
    } catch {
      return {};
    }
  }, [snapshot]);

  const saveDraft = useCallback((cardId: string, draft: EditableCardDraft) => {
    const current = readCardDraftStore(window.localStorage);
    const next = {
      ...current,
      [cardId]: draft,
    };
    publishDrafts(next);
  }, []);

  const deleteDraft = useCallback((cardId: string) => {
    const current = readCardDraftStore(window.localStorage);
    const existing = current[cardId] ?? buildDefaultDraft(cardId);
    const next = {
      ...current,
      [cardId]: {
        ...existing,
        deleted: true,
      },
    };
    publishDrafts(next);
  }, []);

  const replaceDrafts = useCallback((next: CardDraftStore) => {
    publishDrafts(next);
  }, []);

  const actions = useMemo(
    () => ({
      getDraft: (cardId: string) => getCardDraft(drafts, cardId),
      saveDraft,
      deleteDraft,
      replaceDrafts,
    }),
    [deleteDraft, drafts, replaceDrafts, saveDraft],
  );

  return {
    drafts,
    ...actions,
  };
}
