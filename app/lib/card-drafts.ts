import { cardLibraryRows, eventCards, featureCards, skillCards } from "../data/game";

export const CARD_DRAFT_STORAGE_KEY = "driver-star-card-drafts-v1";
export const DEFAULT_EDITOR_CARD_ID = "rain-guard";
export const CAPABILITY_CATEGORY_OPTIONS = [
  "语音与交互",
  "影音娱乐与内容体验",
  "座舱氛围与舒适体验",
  "空间与家庭关怀",
  "设备互联与生态扩展",
  "个性化与形象表达",
] as const;

export type EditableCardDraft = {
  id?: string;
  type: string;
  name: string;
  artwork: string | null;
  description: string;
  tags: string;
  capability: string;
  enabled: boolean;
  deleted?: boolean;
  isCustom?: boolean;
  scores: {
    safety: number;
    comfort: number;
    intelligence: number;
  };
};

export type CardDraftStore = Record<string, EditableCardDraft>;

export function normalizeCapabilityCategory(value: string) {
  if ((CAPABILITY_CATEGORY_OPTIONS as readonly string[]).includes(value)) {
    return value;
  }

  if (value.includes("语音") || value.includes("交互") || value.includes("泊车")) {
    return "语音与交互";
  }
  if (value.includes("影音") || value.includes("娱乐")) {
    return "影音娱乐与内容体验";
  }
  if (value.includes("舒适") || value.includes("氛围") || value.includes("健康") || value.includes("场景")) {
    return "座舱氛围与舒适体验";
  }
  if (value.includes("家庭") || value.includes("关怀") || value.includes("儿童") || value.includes("宠物")) {
    return "空间与家庭关怀";
  }
  if (value.includes("互联") || value.includes("设备") || value.includes("生态") || value.includes("导航")) {
    return "设备互联与生态扩展";
  }

  return "个性化与形象表达";
}

export function buildDefaultDraft(cardId: string): EditableCardDraft {
  const featureCard = featureCards.find((card) => card.id === cardId);
  if (featureCard) {
    return {
      id: cardId,
      type: "功能卡",
      name: featureCard.name,
      artwork: null,
      description: featureCard.summary,
      tags: featureCard.tags.join("、"),
      capability: normalizeCapabilityCategory(featureCard.capability),
      enabled: true,
      deleted: false,
      isCustom: false,
      scores: {
        safety: featureCard.effects.safety ?? 0,
        comfort: featureCard.effects.comfort ?? 0,
        intelligence: featureCard.effects.intelligence ?? 0,
      },
    };
  }

  const eventCard = eventCards.find((card) => card.id === cardId);
  if (eventCard) {
    return {
      id: cardId,
      type: "事件卡",
      name: eventCard.title,
      artwork: null,
      description: eventCard.description,
      tags: eventCard.choices.map((choice) => choice.label).join("、"),
      capability: "个性化与形象表达",
      enabled: true,
      deleted: false,
      isCustom: false,
      scores: {
        safety: 0,
        comfort: 0,
        intelligence: 0,
      },
    };
  }

  const skillCard = skillCards.find((card) => card.id === cardId);
  if (skillCard) {
    return {
      id: cardId,
      type: "技能卡",
      name: skillCard.name,
      artwork: null,
      description: skillCard.summary,
      tags: "策略、回合辅助",
      capability: "语音与交互",
      enabled: true,
      deleted: false,
      isCustom: false,
      scores: {
        safety: 0,
        comfort: 0,
        intelligence: 0,
      },
    };
  }

  const row = cardLibraryRows.find((item) => item.id === cardId) ?? cardLibraryRows[0];
  return {
    id: cardId,
    type: row.type,
    name: row.name,
    artwork: null,
    description: row.detail,
    tags: row.tags,
    capability: "个性化与形象表达",
    enabled: row.enabled,
    deleted: false,
    isCustom: false,
    scores: {
      safety: 0,
      comfort: 0,
      intelligence: 0,
    },
  };
}

export function buildNewCardDraft(cardId: string): EditableCardDraft {
  return {
    id: cardId,
    type: "功能卡",
    name: "新卡牌",
    artwork: null,
    description: "请填写这张卡牌的说明。",
    tags: "自定义",
    capability: "语音与交互",
    enabled: true,
    deleted: false,
    isCustom: true,
    scores: {
      safety: 0,
      comfort: 0,
      intelligence: 0,
    },
  };
}

export function readCardDraftStore(storage: Storage | null | undefined): CardDraftStore {
  if (!storage) {
    return {};
  }

  try {
    const raw = storage.getItem(CARD_DRAFT_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as CardDraftStore;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCardDraftStore(storage: Storage | null | undefined, drafts: CardDraftStore) {
  if (!storage) {
    return;
  }

  storage.setItem(CARD_DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

export function getCardDraft(store: CardDraftStore, cardId: string) {
  return store[cardId] ?? null;
}
