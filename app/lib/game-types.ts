import type { StaticImageData } from "next/image";

export const dimensionKeys = ["safety", "convenience", "comfort", "family", "style", "intelligence"] as const;

export type DimensionKey = (typeof dimensionKeys)[number];

export type DimensionScores = Record<DimensionKey, number>;

export type PlanetTheme = {
  id: string;
  name: string;
  title: string;
  description: string;
  colorAdvice: string;
  accentClass: string;
  imageSrc: StaticImageData;
};

export type FeatureCard = {
  id: string;
  name: string;
  summary: string;
  capability: string;
  tags: string[];
  effects: Partial<Record<DimensionKey, number>>;
  recommendedFor: string[];
};

export type EventChoice = {
  id: string;
  label: string;
  description: string;
  recommendedTags: string[];
  recommendedCapabilities: string[];
};

export type EventCard = {
  id: string;
  title: string;
  description: string;
  planetName: string;
  choices: [EventChoice, EventChoice];
};

export type SkillCard = {
  id: "redraw" | "boost-draw" | "swap" | "echo";
  name: string;
  summary: string;
  maxUses: number;
};

export type MinorPlanetChallenge = {
  id: string;
  name: string;
  slot: number;
  thresholds: Array<{
    dimension: DimensionKey;
    target: number;
    reward: string;
  }>;
};

export type JourneyLogEntry = {
  step: number;
  planetName: string;
  eventTitle: string;
  choiceLabel: string;
  cardName: string;
  cardId: string;
  recommended: boolean;
  duplicateApplied: boolean;
  dimensionSnapshot: DimensionScores;
  gainedStars: string[];
};

export type GameConfig = {
  planetId: string;
  minorPlanetCount: number;
  minorPlanetSlots: number[];
};

export type CandidateSource = "manual-draw" | "skill-draw";

export type GameStage = "setup" | "play" | "challenge" | "jump" | "result";

export type GameRunState = {
  config: GameConfig;
  stage: GameStage;
  eventDeck: string[];
  currentMainIndex: number;
  selectedChoiceId: string;
  hand: string[];
  selectedFeatureId: string;
  currentCandidates: string[];
  candidateSource: CandidateSource | null;
  manualDrawUsed: boolean;
  skillUses: Record<SkillCard["id"], number>;
  duplicateCardId: string | null;
  dimensions: DimensionScores;
  earnedStars: string[];
  journeyLog: JourneyLogEntry[];
  lastResolvedTurn: JourneyLogEntry | null;
  pendingMinorPlanet: MinorPlanetChallenge | null;
  completedAt: string | null;
};

export type ResultNarrative = {
  title: string;
  summary: string;
  comboLead: string;
  advice: string;
};

export type ResultProfile = {
  primaryLabel: string;
  secondaryLabel: string;
  title: string;
  topDimensions: DimensionKey[];
  comboPackIds: string[];
  userView: ResultNarrative;
  salesView: ResultNarrative;
};

export type ComboPack = {
  id: string;
  name: string;
  capability: string;
  items: string[];
  whyItFits: string;
};

export type FinalResult = {
  id: string;
  createdAt: string;
  planet: PlanetTheme;
  dimensions: DimensionScores;
  profile: ResultProfile;
  journeyLog: JourneyLogEntry[];
  earnedStars: string[];
  comboPacks: ComboPack[];
  aiInput: {
    planetTitle: string;
    primaryLabel: string;
    secondaryLabel: string;
    topDimensions: string[];
    cardsPlayed: string[];
    journeySummary: string[];
  };
  aiNarrative?: {
    userViewNarrative: string;
    salesViewNarrative: string;
    toneWarnings?: string[];
  } | null;
};

export type GameStoreState = {
  hydrated: boolean;
  currentRun: GameRunState | null;
  resultHistory: FinalResult[];
};
