"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CARD_ART_STORAGE_KEY, readCardArtDrafts, writeCardArtDrafts } from "../lib/card-art";

const CARD_ART_EVENT = "driver-star-card-art-updated";
const EMPTY_SNAPSHOT = "{}";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CARD_ART_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CARD_ART_EVENT, handleChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  return window.localStorage.getItem(CARD_ART_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function publishDrafts(next: Record<string, string>) {
  writeCardArtDrafts(window.localStorage, next);
  window.dispatchEvent(new Event(CARD_ART_EVENT));
}

export function useCardArtworkDrafts() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const drafts = useMemo<Record<string, string>>(() => {
    try {
      return JSON.parse(snapshot) as Record<string, string>;
    } catch {
      return {};
    }
  }, [snapshot]);

  const setArtwork = useCallback((cardId: string, artwork: string | null) => {
    const current = readCardArtDrafts(window.localStorage);
    const next = { ...current };

    if (artwork) {
      next[cardId] = artwork;
    } else {
      delete next[cardId];
    }

    publishDrafts(next);
  }, []);

  const actions = useMemo(
    () => ({
      getArtwork: (cardId: string) => drafts[cardId] ?? null,
      setArtwork,
    }),
    [drafts, setArtwork],
  );

  return {
    drafts,
    ...actions,
  };
}
