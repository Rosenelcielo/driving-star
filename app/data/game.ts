export type PlanetTheme = {
  name: string;
  theme: string;
  className: string;
  desc: string;
  colorAdvice: string;
};

export type DimensionScore = {
  name: string;
  value: number;
  score: number;
};

export type FeatureCard = {
  label: string;
  title: string;
  score: string;
  recommended?: boolean;
};

export type EventCard = {
  type: string;
  title: string;
  copy: string;
  choices: string[];
};

export type SkillCard = {
  name: string;
  use: string;
};

export type JourneyStep = {
  planet: string;
  action: string;
  feature: string;
};

export type ResultView = "user" | "sales";

export const planets: PlanetTheme[] = [
  { name: "蓝弧星", theme: "冷静线稿", className: "planet-arc", desc: "理性、冷静、未来感", colorAdvice: "银灰、深蓝、冷白" },
  { name: "霞光星", theme: "柔和手绘", className: "planet-dawn", desc: "温暖、陪伴、生活感", colorAdvice: "暖白、浅灰、珊瑚点缀" },
  { name: "极光星", theme: "探索轨迹", className: "planet-aurora", desc: "清爽、智能、探索感", colorAdvice: "石墨灰、雾白、浅绿点缀" },
  { name: "晨曦星", theme: "仪式刻线", className: "planet-morning", desc: "舒适、尊贵、仪式感", colorAdvice: "象牙白、炭黑、金属灰" },
  { name: "银轨星", theme: "机械轨道", className: "planet-rail", desc: "机械、精准、秩序感", colorAdvice: "银灰、黑白、冷金属" },
];

export const dimensions: DimensionScore[] = [
  { name: "安全", value: 76, score: 12 },
  { name: "便捷", value: 64, score: 8 },
  { name: "娱乐", value: 42, score: 5 },
  { name: "家庭", value: 48, score: 6 },
  { name: "个性", value: 34, score: 3 },
  { name: "智能", value: 82, score: 10 },
];

export const currentEvent: EventCard = {
  type: "事件卡 · 雨夜接人",
  title: "复杂天气下，你要完成一次临时接送",
  copy: "道路湿滑、乘客正在等待，你更希望座舱优先帮你稳住安全感，还是减少操作负担？",
  choices: ["更稳妥", "更省心"],
};

export const skillCards: SkillCard[] = [
  { name: "重抽", use: "刷新当前候选" },
  { name: "补牌", use: "追加一张机会" },
  { name: "换牌", use: "替换不理想手牌" },
  { name: "复制牌", use: "复制已有功能卡" },
];

export const featureCards: FeatureCard[] = [
  { label: "建议", title: "智能雨夜辅助", score: "安全 +2 · 智能 +1", recommended: true },
  { label: "功能", title: "沉浸影音模式", score: "娱乐 +2 · 个性 +1" },
  { label: "建议", title: "自动泊车联动", score: "便捷 +2 · 智能 +1", recommended: true },
  { label: "功能", title: "家庭关怀提醒", score: "家庭 +2 · 安全 +1" },
  { label: "功能", title: "座舱氛围律动", score: "娱乐 +1 · 个性 +2" },
];

export const candidateCards: FeatureCard[] = [
  { label: "候选", title: "智能泊车辅助", score: "便捷 +2" },
  { label: "候选", title: "车内空气净化", score: "家庭 +1" },
  { label: "候选", title: "语音多轮对话", score: "智能 +2" },
  { label: "候选", title: "儿童守护模式", score: "家庭 +2" },
  { label: "候选", title: "氛围灯律动", score: "娱乐 +1" },
];

export const challengeLines = [
  { name: "安全", value: 82, label: "达成 · 安全胜利星", achieved: true },
  { name: "便捷", value: 58, label: "未达成", achieved: false },
  { name: "娱乐", value: 72, label: "达成 · 娱乐胜利星", achieved: true },
  { name: "家庭", value: 44, label: "未达成", achieved: false },
  { name: "个性", value: 52, label: "未达成", achieved: false },
  { name: "智能", value: 88, label: "达成 · 智能胜利星", achieved: true },
];

export const journeyReplay: JourneyStep[] = [
  { planet: "蓝弧星", action: "选择更稳妥", feature: "打出智能雨夜辅助" },
  { planet: "回声星", action: "通过小星球检测", feature: "获得安全、娱乐、智能胜利星" },
  { planet: "轨道星", action: "选择减少操作", feature: "打出自动泊车联动" },
];

export const resultCopy: Record<ResultView, { title: string; copy: string; comboLead: string; advice: string }> = {
  user: {
    title: "智能效率型 · 便捷顺滑型",
    copy: "你更容易被能主动分担操作、提升安全确定性的座舱能力打动。你的驾驶星球偏向冷静、高效、可控。",
    comboLead: "适合你的座舱组合更像一套可靠副驾驶，会先帮你稳住关键场景，再减少重复操作。",
    advice: "适合关注中大型智能 SUV 或高阶辅助驾驶配置车型，颜色建议延续冷静线稿主题。",
  },
  sales: {
    title: "高智能与高便捷需求用户 · 安全敏感度较高",
    copy: "用户需求重心集中在智能辅助、操作减负与安全确定性，可优先推荐高阶辅助驾驶、自动泊车和主动交互能力。",
    comboLead: "推荐重点应落在语音与交互、设备互联、高阶辅助驾驶和泊车便利能力上。",
    advice: "导购沟通可先建立安全信任，再展开智能辅助、自动泊车与场景联动的可感知价值。",
  },
};

export const comboPacks = [
  { title: "安心巡航包", items: "雨夜辅助 / 盲区提醒 / 车距预警" },
  { title: "省心泊车包", items: "自动泊车 / 远程召唤 / 记忆路线" },
  { title: "智能交互包", items: "语音多轮 / 场景联动 / 主动建议" },
];

export const libraryRows = [
  { name: "智能泊车辅助", type: "功能卡", tags: "智能 / 便捷", enabled: true },
  { name: "雨夜接人", type: "事件卡", tags: "安全 / 家庭", enabled: true },
  { name: "重抽指令", type: "技能卡", tags: "操作", enabled: false },
  { name: "座舱氛围律动", type: "功能卡", tags: "娱乐 / 个性", enabled: true },
];
