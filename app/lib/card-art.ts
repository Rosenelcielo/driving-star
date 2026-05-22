export const CARD_ART_STORAGE_KEY = "driver-star-card-art-v1";
export const DEFAULT_EDITOR_CARD_ID = "rain-guard";

export type CardArtDrafts = Record<string, string>;

export function readCardArtDrafts(storage: Storage | null | undefined): CardArtDrafts {
  if (!storage) {
    return {};
  }

  try {
    const raw = storage.getItem(CARD_ART_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as CardArtDrafts;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCardArtDrafts(storage: Storage | null | undefined, drafts: CardArtDrafts) {
  if (!storage) {
    return;
  }

  storage.setItem(CARD_ART_STORAGE_KEY, JSON.stringify(drafts));
}
