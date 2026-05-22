import {
  baseDimensions,
  comboPacks,
  dimensionMeta,
  eventCards,
  featureCards,
  minorPlanetTemplates,
  planets,
  skillCards,
} from "../data/game";
import {
  dimensionKeys,
  type CandidateSource,
  type ComboPack,
  type DimensionKey,
  type DimensionScores,
  type EventChoice,
  type FeatureCard,
  type FinalResult,
  type GameConfig,
  type GameRunState,
  type JourneyLogEntry,
  type PlanetTheme,
  type ResultProfile,
  type SkillCard,
} from "./game-types";

const MAIN_EVENT_COUNT = 5;
const HAND_SIZE = 5;
const CANDIDATE_COUNT = 5;
const DIMENSION_DELTA = 6;

const primaryProfiles: Record<
  DimensionKey,
  {
    label: string;
    title: string;
    summary: string;
    comboLead: string;
    advice: string;
    sales: string;
  }
> = {
  safety: {
    label: "安全掌控型",
    title: "稳定判断，先把风险接住",
    summary: "你会优先选择能降低不确定性的能力，愿意让系统先帮你看见风险，再谈其他体验。",
    comboLead: "最适合你的组合，往往先解决安全感，再补足效率和舒适。",
    advice: "适合关注高阶辅助驾驶、清晰反馈和稳健氛围的车型与配置主题。",
    sales: "用户对主动安全与驾驶确定性有明显偏好，推荐沟通应先从风险分担与可靠性建立信任。",
  },
  convenience: {
    label: "便捷顺滑型",
    title: "讨厌重复操作，偏爱顺手体验",
    summary: "你最看重的是省步骤、省时间和低心智负担，能让流程更丝滑的功能更容易打动你。",
    comboLead: "你真正需要的不是更多功能，而是更少阻力的流程组合。",
    advice: "适合强调泊车效率、路线记忆和设备流转顺畅度的配置方向。",
    sales: "用户对节省操作和流畅衔接高度敏感，推荐时应突出效率收益和学习成本低。",
  },
  comfort: {
    label: "舒适沉浸型",
    title: "空间感受优先，旅程要松弛",
    summary: "你会把车看成生活延伸，能否让人放松、安静、舒服，往往比参数更重要。",
    comboLead: "适合你的组合会先营造舒适的空间，再慢慢补充科技能力。",
    advice: "适合关注座椅、空气、静音和情绪场景联动的舒适型路线。",
    sales: "用户对空间体感和长时间乘坐舒适度更敏感，推荐应围绕身心放松与氛围稳定展开。",
  },
  family: {
    label: "家庭关怀型",
    title: "只要家人舒服，这趟路就值得了",
    summary: "你会自然把注意力放在家人、后排乘客与陪伴质量上，偏好能主动照顾人的座舱能力。",
    comboLead: "你的理想组合，更像一个会陪伴、会照顾人的座舱搭档。",
    advice: "适合重点关注儿童守护、后排体验与细节照顾的家庭取向配置。",
    sales: "用户在家庭出行和后排体验上的权重明显更高，推荐沟通可以从陪伴与守护切入。",
  },
  style: {
    label: "个性表达型",
    title: "功能之外，也想让车替你表达",
    summary: "你在意的不只是能不能用，还在意好不好看、有没有情绪，以及是否能代表自己的风格。",
    comboLead: "适合你的方案会把氛围、主题和个性化控制一起做完整。",
    advice: "适合关注主题外观、灯光联动和内容氛围感更强的产品方向。",
    sales: "用户在表达感、设计感和情绪价值上更活跃，推荐应强调差异化体验而非纯参数。",
  },
  intelligence: {
    label: "智能效率型",
    title: "希望系统主动接住你的下一步",
    summary: "你期待的是更懂场景、更会分担的座舱体验，不只是会响应，而是会预判。",
    comboLead: "最能打动你的，是主动建议、跨设备协作和可连续执行的智能能力。",
    advice: "适合关注语音交互、场景预测和生态联动更完整的车型方案。",
    sales: "用户对智能协作和主动建议高度敏感，推荐时应突出系统主动性与可扩展生态。",
  },
};

export const dimensionLabelMap = Object.fromEntries(dimensionMeta.map((item) => [item.key, item.label])) as Record<DimensionKey, string>;

function cloneDimensions(source: DimensionScores): DimensionScores {
  return { ...source };
}

function clampDimension(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function getPlanetById(id: string): PlanetTheme {
  return planets.find((planet) => planet.id === id) ?? planets[0];
}

export function getFeatureById(id: string): FeatureCard {
  return featureCards.find((card) => card.id === id) ?? featureCards[0];
}

export function getEventById(id: string) {
  return eventCards.find((card) => card.id === id) ?? eventCards[0];
}

export function getSkillById(id: SkillCard["id"]): SkillCard {
  return skillCards.find((card) => card.id === id) ?? skillCards[0];
}

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function seededShuffle<T>(items: T[], seedSource: string) {
  const list = [...items];
  let seed = hashSeed(seedSource);

  for (let index = list.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [list[index], list[target]] = [list[target], list[index]];
  }

  return list;
}

function uniqueById(items: FeatureCard[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function pickRecommendedCards(choice: EventChoice) {
  return featureCards.filter((card) => {
    const matchTag = card.tags.some((tag) => choice.recommendedTags.includes(tag));
    const matchCapability = choice.recommendedCapabilities.includes(card.capability);
    const matchKeyword = card.recommendedFor.some((keyword) => choice.recommendedTags.includes(keyword));
    return matchTag || matchCapability || matchKeyword;
  });
}

export function buildFeatureCandidates(eventId: string, choiceId: string, excludedIds: string[], seedSource: string, count = HAND_SIZE) {
  const event = getEventById(eventId);
  const choice = event.choices.find((item) => item.id === choiceId) ?? event.choices[0];
  const recommended = seededShuffle(
    pickRecommendedCards(choice).filter((card) => !excludedIds.includes(card.id)),
    `${seedSource}:recommended`,
  );
  const fillers = seededShuffle(
    featureCards.filter((card) => !excludedIds.includes(card.id) && !recommended.some((item) => item.id === card.id)),
    `${seedSource}:fillers`,
  );

  return uniqueById([...recommended.slice(0, count), ...fillers]).slice(0, count);
}

function buildMinorPlanets(config: GameConfig) {
  return config.minorPlanetSlots.slice(0, config.minorPlanetCount).map((slot, index) => {
    const template = minorPlanetTemplates[index % minorPlanetTemplates.length];
    return {
      ...template,
      slot,
    };
  });
}

function createInitialHand(eventId: string, choiceId: string, planetId: string) {
  return buildFeatureCandidates(eventId, choiceId, [], `initial:${planetId}`).map((card) => card.id);
}

export function createNewRun(config: GameConfig): GameRunState {
  const eventDeck = seededShuffle(eventCards, `${config.planetId}:${config.minorPlanetSlots.join("-")}`).slice(0, MAIN_EVENT_COUNT).map((event) => event.id);
  const firstEvent = getEventById(eventDeck[0]);
  const selectedChoiceId = firstEvent.choices[0].id;
  const hand = createInitialHand(firstEvent.id, selectedChoiceId, config.planetId);

  return {
    config,
    stage: "play",
    eventDeck,
    currentMainIndex: 0,
    selectedChoiceId,
    hand,
    selectedFeatureId: hand[0],
    currentCandidates: [],
    candidateSource: null,
    manualDrawUsed: false,
    skillUses: {
      redraw: 0,
      "boost-draw": 0,
      swap: 0,
      echo: 0,
    },
    duplicateCardId: null,
    dimensions: cloneDimensions(baseDimensions),
    earnedStars: [],
    journeyLog: [],
    lastResolvedTurn: null,
    pendingMinorPlanet: null,
    completedAt: null,
  };
}

export function getCurrentEvent(run: GameRunState) {
  return getEventById(run.eventDeck[Math.min(run.currentMainIndex, run.eventDeck.length - 1)]);
}

export function isRecommendedForChoice(cardId: string, eventId: string, choiceId: string) {
  const card = getFeatureById(cardId);
  const event = getEventById(eventId);
  const choice = event.choices.find((item) => item.id === choiceId) ?? event.choices[0];

  return card.tags.some((tag) => choice.recommendedTags.includes(tag)) || choice.recommendedCapabilities.includes(card.capability);
}

export function rerollHand(run: GameRunState): GameRunState {
  const event = getCurrentEvent(run);
  const nextHand = buildFeatureCandidates(event.id, run.selectedChoiceId, [], `${event.id}:reroll:${run.journeyLog.length}`).map((card) => card.id);
  return {
    ...run,
    hand: nextHand,
    selectedFeatureId: nextHand[0],
  };
}

export function swapSelectedCard(run: GameRunState): GameRunState {
  const event = getCurrentEvent(run);
  const remaining = run.hand.filter((cardId) => cardId !== run.selectedFeatureId);
  const next = buildFeatureCandidates(event.id, run.selectedChoiceId, remaining, `${event.id}:swap:${run.selectedFeatureId}:${run.journeyLog.length}`, 1)[0];
  const nextHand = run.hand.map((cardId) => (cardId === run.selectedFeatureId ? next.id : cardId));
  return {
    ...run,
    hand: nextHand,
    selectedFeatureId: next.id,
  };
}

export function openCandidatePool(run: GameRunState, source: CandidateSource): GameRunState {
  const event = getCurrentEvent(run);
  const excluded = [...run.hand];
  const pool = buildFeatureCandidates(event.id, run.selectedChoiceId, excluded, `${event.id}:${source}:${run.journeyLog.length}`, CANDIDATE_COUNT).map(
    (card) => card.id,
  );

  return {
    ...run,
    currentCandidates: pool,
    candidateSource: source,
  };
}

function applyCardEffects(source: DimensionScores, card: FeatureCard, duplicated: boolean) {
  const next = cloneDimensions(source);
  const multiplier = duplicated ? 2 : 1;

  dimensionKeys.forEach((dimension) => {
    const delta = (card.effects[dimension] ?? 0) * DIMENSION_DELTA * multiplier;
    next[dimension] = clampDimension(next[dimension] + delta);
  });

  return next;
}

function buildNextHand(currentEventId: string, nextChoiceId: string, previousHand: string[], nextStep: number) {
  return buildFeatureCandidates(currentEventId, nextChoiceId, previousHand, `${currentEventId}:next:${nextStep}`).map((card) => card.id);
}

function getNextChoiceId(eventId: string) {
  return getEventById(eventId).choices[0].id;
}

function summarizeGainedStars(stars: string[]) {
  if (stars.length === 0) {
    return "本次没有收集到新的胜利星。";
  }
  return `收集到：${stars.join("、")}`;
}

export function resolvePlay(run: GameRunState): { run: GameRunState; result: FinalResult | null } {
  const event = getCurrentEvent(run);
  const choice = event.choices.find((item) => item.id === run.selectedChoiceId) ?? event.choices[0];
  const card = getFeatureById(run.selectedFeatureId);
  const duplicateApplied = run.duplicateCardId === card.id;
  const dimensions = applyCardEffects(run.dimensions, card, duplicateApplied);
  const completedStep = run.currentMainIndex + 1;
  const logEntry: JourneyLogEntry = {
    step: completedStep,
    planetName: event.planetName,
    eventTitle: event.title,
    choiceLabel: choice.label,
    cardName: card.name,
    cardId: card.id,
    recommended: isRecommendedForChoice(card.id, event.id, choice.id),
    duplicateApplied,
    dimensionSnapshot: dimensions,
    gainedStars: [],
  };

  const minorPlanet = buildMinorPlanets(run.config).find((item) => item.slot === completedStep) ?? null;

  if (completedStep >= run.eventDeck.length) {
    const finishedRun: GameRunState = {
      ...run,
      stage: "result",
      currentMainIndex: completedStep,
      dimensions,
      selectedChoiceId: run.selectedChoiceId,
      currentCandidates: [],
      candidateSource: null,
      manualDrawUsed: false,
      duplicateCardId: null,
      journeyLog: [...run.journeyLog, logEntry],
      lastResolvedTurn: logEntry,
      completedAt: new Date().toISOString(),
      pendingMinorPlanet: null,
    };

    return { run: finishedRun, result: buildFinalResult(finishedRun) };
  }

  const nextEventId = run.eventDeck[completedStep];
  const nextChoiceId = getNextChoiceId(nextEventId);
  const nextHand = buildNextHand(nextEventId, nextChoiceId, run.hand, completedStep);
  const nextRun: GameRunState = {
    ...run,
    stage: minorPlanet ? "challenge" : "jump",
    currentMainIndex: completedStep,
    selectedChoiceId: nextChoiceId,
    hand: nextHand,
    selectedFeatureId: nextHand[0],
    currentCandidates: [],
    candidateSource: null,
    manualDrawUsed: false,
    duplicateCardId: null,
    dimensions,
    journeyLog: [...run.journeyLog, logEntry],
    lastResolvedTurn: logEntry,
    pendingMinorPlanet: minorPlanet,
  };

  return { run: nextRun, result: null };
}

export function evaluateMinorPlanet(run: GameRunState) {
  const challenge = run.pendingMinorPlanet;
  if (!challenge) {
    return { challenge: null, rewards: [] as string[] };
  }

  const rewards = challenge.thresholds
    .filter((threshold) => run.dimensions[threshold.dimension] >= threshold.target)
    .map((threshold) => threshold.reward)
    .filter((reward) => !run.earnedStars.includes(reward));

  return { challenge, rewards };
}

export function resolveMinorPlanet(run: GameRunState): GameRunState {
  const { challenge, rewards } = evaluateMinorPlanet(run);
  if (!challenge || !run.lastResolvedTurn) {
    return run;
  }

  const updatedLog = run.journeyLog.map((entry, index) =>
    index === run.journeyLog.length - 1
      ? {
          ...entry,
          gainedStars: rewards,
        }
      : entry,
  );

  return {
    ...run,
    stage: "jump",
    earnedStars: [...run.earnedStars, ...rewards],
    journeyLog: updatedLog,
    lastResolvedTurn: {
      ...run.lastResolvedTurn,
      gainedStars: rewards,
    },
    pendingMinorPlanet: null,
  };
}

export function continueJourney(run: GameRunState): GameRunState {
  if (run.stage !== "jump") {
    return run;
  }

  return {
    ...run,
    stage: "play",
  };
}

function getTopDimensions(dimensions: DimensionScores) {
  return [...dimensionKeys].sort((left, right) => dimensions[right] - dimensions[left]).slice(0, 2);
}

function getSecondaryLabel(log: JourneyLogEntry[]) {
  const capabilityCounter = new Map<string, number>();

  log.forEach((entry) => {
    const capability = getFeatureById(entry.cardId).capability;
    capabilityCounter.set(capability, (capabilityCounter.get(capability) ?? 0) + 1);
  });

  const [topCapability = "场景联动"] = [...capabilityCounter.entries()].sort((left, right) => right[1] - left[1])[0] ?? [];

  const labelMap: Record<string, string> = {
    主动安全: "风险处理副人格",
    泊车辅助: "流程减负副人格",
    家庭关怀: "照顾陪伴副人格",
    场景联动: "空间氛围副人格",
    语音交互: "主动协作副人格",
    影音娱乐: "情绪表达副人格",
    健康舒适: "松弛修复副人格",
    导航效率: "节奏规划副人格",
    设备互联: "数字流转副人格",
  };

  return labelMap[topCapability] ?? "平衡体验副人格";
}

function pickComboPacks(log: JourneyLogEntry[]): ComboPack[] {
  const capabilityCounter = new Map<string, number>();

  log.forEach((entry) => {
    const capability = getFeatureById(entry.cardId).capability;
    capabilityCounter.set(capability, (capabilityCounter.get(capability) ?? 0) + 1);
  });

  const ranked = [...capabilityCounter.entries()].sort((left, right) => right[1] - left[1]).slice(0, 3);
  const packs = ranked
    .map(([capability]) => comboPacks.find((pack) => pack.capability === capability))
    .filter((pack): pack is ComboPack => Boolean(pack));

  if (packs.length > 0) {
    return packs;
  }

  return comboPacks.slice(0, 2);
}

function buildResultProfile(run: GameRunState): ResultProfile {
  const topDimensions = getTopDimensions(run.dimensions);
  const primary = primaryProfiles[topDimensions[0]];
  const secondaryLabel = getSecondaryLabel(run.journeyLog);
  const comboPackIds = pickComboPacks(run.journeyLog).map((pack) => pack.id);
  const planet = getPlanetById(run.config.planetId);

  return {
    primaryLabel: primary.label,
    secondaryLabel,
    title: `${planet.name} · ${primary.label}`,
    topDimensions,
    comboPackIds,
    userView: {
      title: primary.title,
      summary: primary.summary,
      comboLead: primary.comboLead,
      advice: `${primary.advice} 你的出生星球建议色是 ${planet.colorAdvice}。`,
    },
    salesView: {
      title: `${primary.label}用户画像`,
      summary: primary.sales,
      comboLead: "推荐优先从最能减负和建立感知价值的能力组合切入。",
      advice: `导购表达可结合“${planet.title}”的气质包装，强化用户的审美认同。`,
    },
  };
}

export function buildAiInput(run: GameRunState, profile: ResultProfile) {
  return {
    planetTitle: getPlanetById(run.config.planetId).title,
    primaryLabel: profile.primaryLabel,
    secondaryLabel: profile.secondaryLabel,
    topDimensions: profile.topDimensions.map((key) => dimensionLabelMap[key]),
    cardsPlayed: run.journeyLog.map((entry) => entry.cardName),
    journeySummary: run.journeyLog.map(
      (entry) => `${entry.planetName}：选择“${entry.choiceLabel}”，打出“${entry.cardName}”。${summarizeGainedStars(entry.gainedStars)}`,
    ),
  };
}

export function buildFinalResult(run: GameRunState): FinalResult {
  const profile = buildResultProfile(run);
  const packs = pickComboPacks(run.journeyLog);

  return {
    id: `result-${Date.now()}`,
    createdAt: run.completedAt ?? new Date().toISOString(),
    planet: getPlanetById(run.config.planetId),
    dimensions: cloneDimensions(run.dimensions),
    profile,
    journeyLog: run.journeyLog,
    earnedStars: run.earnedStars,
    comboPacks: packs,
    aiInput: buildAiInput(run, profile),
    aiNarrative: null,
  };
}

export function withAiNarrative(result: FinalResult, aiNarrative: FinalResult["aiNarrative"]) {
  return {
    ...result,
    aiNarrative,
  };
}

export function getHistoryPreview(result: FinalResult) {
  return {
    id: result.id,
    title: result.profile.title,
    createdAt: result.createdAt,
    summary: result.profile.userView.summary,
    stars: result.earnedStars,
  };
}
