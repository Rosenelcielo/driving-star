import planetArcImage from "../../pub_pic/1.png";
import planetDawnImage from "../../pub_pic/2.png";
import planetAuroraImage from "../../pub_pic/3.png";
import planetHaloImage from "../../pub_pic/4.png";
import planetRailImage from "../../pub_pic/5.png";
import type {
  ComboPack,
  DimensionKey,
  DimensionScores,
  EventCard,
  FeatureCard,
  MinorPlanetChallenge,
  PlanetTheme,
  SkillCard,
} from "../lib/game-types";

export const dimensionMeta: Array<{ key: DimensionKey; label: string }> = [
  { key: "safety", label: "安全" },
  { key: "convenience", label: "便捷" },
  { key: "comfort", label: "舒适" },
  { key: "family", label: "家庭" },
  { key: "style", label: "个性" },
  { key: "intelligence", label: "智能" },
];

export const baseDimensions: DimensionScores = {
  safety: 50,
  convenience: 50,
  comfort: 50,
  family: 50,
  style: 50,
  intelligence: 50,
};

export const planets: PlanetTheme[] = [
  {
    id: "arc",
    name: "弧光星",
    title: "冷静线控",
    description: "偏好稳定、效率和明确反馈的旅程起点。",
    colorAdvice: "银灰、深海蓝、冷白点光",
    accentClass: "planet-arc",
    imageSrc: planetArcImage,
  },
  {
    id: "dawn",
    name: "晨曦星",
    title: "陪伴手记",
    description: "更重视日常陪伴、轻松氛围与家庭友好。",
    colorAdvice: "暖白、砂金、淡珊瑚",
    accentClass: "planet-dawn",
    imageSrc: planetDawnImage,
  },
  {
    id: "aurora",
    name: "极光星",
    title: "探索回路",
    description: "喜欢新鲜功能、主动建议与科技感体验。",
    colorAdvice: "雾白、浅绿、石墨黑",
    accentClass: "planet-aurora",
    imageSrc: planetAuroraImage,
  },
  {
    id: "halo",
    name: "曜环星",
    title: "仪式座舱",
    description: "在乎空间质感、氛围与被照顾的细腻体验。",
    colorAdvice: "象牙白、煤黑、金属灰",
    accentClass: "planet-halo",
    imageSrc: planetHaloImage,
  },
  {
    id: "rail",
    name: "轨道星",
    title: "精密机械",
    description: "看重秩序、可靠性和顺手的工具协作。",
    colorAdvice: "黑白灰、冷金属、深钛蓝",
    accentClass: "planet-rail",
    imageSrc: planetRailImage,
  },
];

export const skillCards: SkillCard[] = [
  { id: "redraw", name: "重抽", summary: "刷新当前手牌，重新组合这一回合可用方案。", maxUses: 1 },
  { id: "boost-draw", name: "补牌", summary: "额外抽取 5 张候选牌，从中加入 1 张到手牌。", maxUses: 1 },
  { id: "swap", name: "换牌", summary: "替换当前选中的手牌，换一张新的功能卡。", maxUses: 1 },
  { id: "echo", name: "复制牌", summary: "本回合打出的功能卡效果翻倍一次。", maxUses: 1 },
];

export const featureCards: FeatureCard[] = [
  {
    id: "rain-guard",
    name: "智能雨夜辅助",
    summary: "在湿滑和视野不佳时主动稳住车身与提醒节奏。",
    capability: "主动安全",
    tags: ["安全", "雨夜", "稳定"],
    effects: { safety: 2, intelligence: 1, comfort: 1 },
    recommendedFor: ["安全", "雨夜", "稳定", "复杂天气"],
  },
  {
    id: "auto-park",
    name: "自动泊车联动",
    summary: "在窄位停车或陌生场地减少重复操作压力。",
    capability: "泊车辅助",
    tags: ["便捷", "智能", "停车"],
    effects: { convenience: 2, intelligence: 1 },
    recommendedFor: ["停车", "省心", "狭窄", "便捷"],
  },
  {
    id: "family-alert",
    name: "家庭关怀提醒",
    summary: "上下车、儿童乘坐和长途疲劳时给出温和提醒。",
    capability: "家庭关怀",
    tags: ["家庭", "安全", "照顾"],
    effects: { family: 2, safety: 1, comfort: 1 },
    recommendedFor: ["家庭", "照顾", "儿童", "陪伴"],
  },
  {
    id: "cabin-scene",
    name: "座舱场景联动",
    summary: "根据场景自动切换灯光、空调和座椅预设。",
    capability: "场景联动",
    tags: ["舒适", "个性", "智能"],
    effects: { comfort: 2, style: 1, intelligence: 1 },
    recommendedFor: ["氛围", "放松", "场景", "仪式感"],
  },
  {
    id: "voice-assistant",
    name: "多轮语音管家",
    summary: "连续理解需求并主动执行多个车内指令。",
    capability: "语音交互",
    tags: ["智能", "便捷", "交互"],
    effects: { intelligence: 2, convenience: 1 },
    recommendedFor: ["语音", "效率", "交互", "少操作"],
  },
  {
    id: "surround-audio",
    name: "沉浸影音模式",
    summary: "营造更完整的通勤和驻车影音体验。",
    capability: "影音娱乐",
    tags: ["舒适", "个性", "娱乐"],
    effects: { comfort: 1, style: 2 },
    recommendedFor: ["娱乐", "氛围", "沉浸", "休息"],
  },
  {
    id: "air-purifier",
    name: "舱内空气净化",
    summary: "在拥堵和多人乘坐场景中保持车内空气舒适。",
    capability: "健康舒适",
    tags: ["舒适", "家庭", "健康"],
    effects: { comfort: 2, family: 1 },
    recommendedFor: ["家庭", "舒适", "长途", "清新"],
  },
  {
    id: "road-memory",
    name: "高频路线记忆",
    summary: "自动识别通勤路线并提前预警拥堵变化。",
    capability: "导航效率",
    tags: ["便捷", "智能", "通勤"],
    effects: { convenience: 2, intelligence: 1 },
    recommendedFor: ["通勤", "效率", "熟路", "省时"],
  },
  {
    id: "blind-spot",
    name: "盲区预警加强",
    summary: "变道、会车和复杂路况下提升周边感知提示。",
    capability: "主动安全",
    tags: ["安全", "视野", "变道"],
    effects: { safety: 2, intelligence: 1 },
    recommendedFor: ["安全", "视野", "复杂路况", "变道"],
  },
  {
    id: "seat-massage",
    name: "零压座椅按摩",
    summary: "长途通勤中减少疲劳，让身体放松下来。",
    capability: "健康舒适",
    tags: ["舒适", "家庭", "放松"],
    effects: { comfort: 2, family: 1 },
    recommendedFor: ["舒适", "长途", "放松"],
  },
  {
    id: "gesture-shortcut",
    name: "手势快捷控制",
    summary: "减少屏幕层级，快速切换常用功能。",
    capability: "语音交互",
    tags: ["便捷", "个性", "操作"],
    effects: { convenience: 2, style: 1, intelligence: 1 },
    recommendedFor: ["便捷", "效率", "少点击"],
  },
  {
    id: "device-bridge",
    name: "多设备无缝流转",
    summary: "手机、平板与车机之间任务和内容连续衔接。",
    capability: "设备互联",
    tags: ["便捷", "智能", "生态"],
    effects: { convenience: 2, intelligence: 2 },
    recommendedFor: ["生态", "效率", "连续性"],
  },
];

export const eventCards: EventCard[] = [
  {
    id: "rainy-pickup",
    title: "雨夜接人",
    description: "道路湿滑，朋友在路边等你。你更希望车辆先帮你稳住安全，还是先减轻操作负担？",
    planetName: "第一主星球",
    choices: [
      {
        id: "steady-first",
        label: "先稳住安全",
        description: "优先感知与提醒，让我更安心。",
        recommendedTags: ["安全", "雨夜", "稳定"],
        recommendedCapabilities: ["主动安全"],
      },
      {
        id: "light-first",
        label: "先减轻操作",
        description: "先帮我把繁琐操作分担掉。",
        recommendedTags: ["便捷", "停车", "少操作"],
        recommendedCapabilities: ["泊车辅助", "语音交互"],
      },
    ],
  },
  {
    id: "commute-rush",
    title: "早高峰通勤",
    description: "连续会议前的通勤路上，你更在意节省时间的效率，还是尽量保持从容状态？",
    planetName: "第二主星球",
    choices: [
      {
        id: "fast-commute",
        label: "更重视效率",
        description: "希望系统帮我预判路线和时间。",
        recommendedTags: ["通勤", "效率", "省时"],
        recommendedCapabilities: ["导航效率", "设备互联"],
      },
      {
        id: "calm-commute",
        label: "更重视从容",
        description: "不想一上车就被信息轰炸。",
        recommendedTags: ["舒适", "安静", "放松"],
        recommendedCapabilities: ["健康舒适", "场景联动"],
      },
    ],
  },
  {
    id: "family-trip",
    title: "周末家庭出行",
    description: "一家人一起出门时，你更想先照顾后排成员，还是先让全车都更轻松好玩？",
    planetName: "第三主星球",
    choices: [
      {
        id: "care-family",
        label: "优先照顾家人",
        description: "老人小孩的状态最重要。",
        recommendedTags: ["家庭", "儿童", "照顾"],
        recommendedCapabilities: ["家庭关怀", "健康舒适"],
      },
      {
        id: "fun-family",
        label: "优先营造体验",
        description: "让大家都觉得这趟路程更有趣。",
        recommendedTags: ["娱乐", "氛围", "沉浸"],
        recommendedCapabilities: ["影音娱乐", "场景联动"],
      },
    ],
  },
  {
    id: "tight-parking",
    title: "商场地下车库",
    description: "车位狭窄又拥挤，你更偏向把停车变得更轻松，还是把周边风险看得更清楚？",
    planetName: "第四主星球",
    choices: [
      {
        id: "easy-park",
        label: "让我更省心",
        description: "越少重复操作越好。",
        recommendedTags: ["停车", "便捷", "省心"],
        recommendedCapabilities: ["泊车辅助", "语音交互"],
      },
      {
        id: "safe-park",
        label: "让我更放心",
        description: "我想要更明确的周边提示。",
        recommendedTags: ["安全", "视野", "复杂路况"],
        recommendedCapabilities: ["主动安全"],
      },
    ],
  },
  {
    id: "late-night-drive",
    title: "深夜独处返程",
    description: "一天结束后回家的路上，你更想要安静沉浸，还是想被一些聪明建议主动接住？",
    planetName: "第五主星球",
    choices: [
      {
        id: "quiet-night",
        label: "给我一个安静空间",
        description: "别打扰我，让车里更有氛围。",
        recommendedTags: ["安静", "氛围", "仪式感"],
        recommendedCapabilities: ["场景联动", "影音娱乐"],
      },
      {
        id: "smart-night",
        label: "主动帮我分担",
        description: "希望系统能更懂我下一步要做什么。",
        recommendedTags: ["智能", "效率", "交互"],
        recommendedCapabilities: ["语音交互", "设备互联"],
      },
    ],
  },
  {
    id: "holiday-highway",
    title: "假期长途返程",
    description: "长时间高速路段里，你更希望减轻驾驶负担，还是照顾全车人的疲劳状态？",
    planetName: "第六主星球",
    choices: [
      {
        id: "assist-drive",
        label: "帮我分担驾驶",
        description: "越稳越省心越好。",
        recommendedTags: ["长途", "安全", "省心"],
        recommendedCapabilities: ["主动安全", "导航效率"],
      },
      {
        id: "care-everyone",
        label: "照顾全车体验",
        description: "人舒服了，路程才不会变得漫长。",
        recommendedTags: ["家庭", "舒适", "长途"],
        recommendedCapabilities: ["健康舒适", "家庭关怀"],
      },
    ],
  },
];

export const comboPacks: ComboPack[] = [
  {
    id: "safe-cocoon",
    name: "安心领航包",
    capability: "主动安全",
    items: ["智能雨夜辅助", "盲区预警加强", "高频路线记忆"],
    whyItFits: "适合偏向稳定、安全感和确定性的驾驶者。",
  },
  {
    id: "parking-saver",
    name: "省心泊车包",
    capability: "泊车辅助",
    items: ["自动泊车联动", "手势快捷控制", "多轮语音管家"],
    whyItFits: "适合希望减少重复操作、停车更轻松的场景。",
  },
  {
    id: "cozy-life",
    name: "舒适生活包",
    capability: "健康舒适",
    items: ["舱内空气净化", "零压座椅按摩", "座舱场景联动"],
    whyItFits: "适合把日常舒适和细节照顾放在前面的用户。",
  },
  {
    id: "family-orbit",
    name: "家庭陪伴包",
    capability: "家庭关怀",
    items: ["家庭关怀提醒", "舱内空气净化", "沉浸影音模式"],
    whyItFits: "适合高频家庭出行与后排成员体验优先的用户。",
  },
  {
    id: "immersive-vibe",
    name: "氛围沉浸包",
    capability: "影音娱乐",
    items: ["沉浸影音模式", "座舱场景联动", "手势快捷控制"],
    whyItFits: "适合想把车内空间经营得更有情绪和娱乐感的人。",
  },
  {
    id: "smart-flow",
    name: "智慧流转包",
    capability: "设备互联",
    items: ["多设备无缝流转", "高频路线记忆", "多轮语音管家"],
    whyItFits: "适合在效率、数字生态和自我表达之间找平衡。",
  },
];

export const minorPlanetTemplates: Omit<MinorPlanetChallenge, "slot">[] = [
  {
    id: "echo",
    name: "回声星",
    thresholds: [
      { dimension: "safety", target: 58, reward: "安全胜利星" },
      { dimension: "comfort", target: 58, reward: "舒适胜利星" },
    ],
  },
  {
    id: "pulse",
    name: "脉冲星",
    thresholds: [
      { dimension: "convenience", target: 60, reward: "便捷胜利星" },
      { dimension: "intelligence", target: 60, reward: "智能胜利星" },
    ],
  },
  {
    id: "harbor",
    name: "港湾星",
    thresholds: [
      { dimension: "family", target: 58, reward: "家庭胜利星" },
      { dimension: "comfort", target: 60, reward: "舒适胜利星" },
    ],
  },
  {
    id: "flare",
    name: "焰尾星",
    thresholds: [
      { dimension: "style", target: 58, reward: "个性胜利星" },
      { dimension: "intelligence", target: 58, reward: "智能胜利星" },
    ],
  },
];

export const cardLibraryRows = [
  ...featureCards.map((card) => ({
    id: card.id,
    name: card.name,
    type: "功能卡",
    tags: card.tags.join(" / "),
    enabled: true,
    detail: `${card.capability} · ${card.summary}`,
  })),
  ...eventCards.map((card) => ({
    id: card.id,
    name: card.title,
    type: "事件卡",
    tags: card.choices.map((choice) => choice.label).join(" / "),
    enabled: true,
    detail: card.description,
  })),
  ...skillCards.map((card) => ({
    id: card.id,
    name: card.name,
    type: "技能卡",
    tags: "策略 / 回合辅助",
    enabled: true,
    detail: card.summary,
  })),
];
