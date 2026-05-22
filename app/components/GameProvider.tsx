"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  continueJourney,
  createNewRun,
  getSkillById,
  openCandidatePool,
  resolveMinorPlanet,
  resolvePlay,
  rerollHand,
  swapSelectedCard,
  withAiNarrative,
} from "../lib/game-engine";
import type { CandidateSource, FinalResult, GameConfig, GameRunState, GameStoreState, SkillCard } from "../lib/game-types";

const STORAGE_KEY = "driver-star-store-v1";

type GameAction =
  | { type: "hydrate"; payload: Omit<GameStoreState, "hydrated"> }
  | { type: "start"; config: GameConfig }
  | { type: "select-choice"; choiceId: string }
  | { type: "select-feature"; featureId: string }
  | { type: "open-candidates"; source: CandidateSource }
  | { type: "pick-candidate"; featureId: string }
  | { type: "use-skill"; skillId: SkillCard["id"] }
  | { type: "resolve-play" }
  | { type: "resolve-minor-planet" }
  | { type: "continue-journey" }
  | { type: "save-ai-narrative"; resultId: string; aiNarrative: FinalResult["aiNarrative"] }
  | { type: "clear-current-run" };

type GameContextValue = {
  state: GameStoreState;
  startNewGame: (config: GameConfig) => void;
  selectChoice: (choiceId: string) => void;
  selectFeature: (featureId: string) => void;
  openCandidates: (source: CandidateSource) => void;
  pickCandidate: (featureId: string) => void;
  useSkill: (skillId: SkillCard["id"]) => { ok: boolean; message: string };
  resolvePlay: () => { ok: boolean; message: string };
  resolveMinorPlanet: () => void;
  continueJourney: () => void;
  saveAiNarrative: (resultId: string, aiNarrative: FinalResult["aiNarrative"]) => void;
  clearCurrentRun: () => void;
};

const initialState: GameStoreState = {
  hydrated: false,
  currentRun: null,
  resultHistory: [],
};

function reducer(state: GameStoreState, action: GameAction): GameStoreState {
  switch (action.type) {
    case "hydrate":
      return {
        hydrated: true,
        currentRun: action.payload.currentRun,
        resultHistory: action.payload.resultHistory,
      };
    case "start":
      return {
        ...state,
        currentRun: createNewRun(action.config),
      };
    case "select-choice":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: {
          ...state.currentRun,
          selectedChoiceId: action.choiceId,
        },
      };
    case "select-feature":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: {
          ...state.currentRun,
          selectedFeatureId: action.featureId,
        },
      };
    case "open-candidates":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: {
          ...openCandidatePool(state.currentRun, action.source),
          manualDrawUsed: action.source === "manual-draw" ? true : state.currentRun.manualDrawUsed,
        },
      };
    case "pick-candidate":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: {
          ...state.currentRun,
          hand: Array.from(new Set([action.featureId, ...state.currentRun.hand])).slice(0, 6),
          selectedFeatureId: action.featureId,
          currentCandidates: [],
          candidateSource: null,
        },
      };
    case "use-skill":
      if (!state.currentRun) {
        return state;
      }

      if (action.skillId === "redraw") {
        return {
          ...state,
          currentRun: {
            ...rerollHand(state.currentRun),
            skillUses: {
              ...state.currentRun.skillUses,
              redraw: state.currentRun.skillUses.redraw + 1,
            },
          },
        };
      }

      if (action.skillId === "swap") {
        return {
          ...state,
          currentRun: {
            ...swapSelectedCard(state.currentRun),
            skillUses: {
              ...state.currentRun.skillUses,
              swap: state.currentRun.skillUses.swap + 1,
            },
          },
        };
      }

      if (action.skillId === "boost-draw") {
        return {
          ...state,
          currentRun: {
            ...openCandidatePool(state.currentRun, "skill-draw"),
            skillUses: {
              ...state.currentRun.skillUses,
              "boost-draw": state.currentRun.skillUses["boost-draw"] + 1,
            },
          },
        };
      }

      return {
        ...state,
        currentRun: {
          ...state.currentRun,
          duplicateCardId: state.currentRun.selectedFeatureId,
          skillUses: {
            ...state.currentRun.skillUses,
            echo: state.currentRun.skillUses.echo + 1,
          },
        },
      };
    case "resolve-play":
      if (!state.currentRun) {
        return state;
      }
      {
        const { run, result } = resolvePlay(state.currentRun);
        return {
          ...state,
          currentRun: run,
          resultHistory: result ? [result, ...state.resultHistory].slice(0, 12) : state.resultHistory,
        };
      }
    case "resolve-minor-planet":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: resolveMinorPlanet(state.currentRun),
      };
    case "continue-journey":
      if (!state.currentRun) {
        return state;
      }
      return {
        ...state,
        currentRun: continueJourney(state.currentRun),
      };
    case "save-ai-narrative":
      return {
        ...state,
        resultHistory: state.resultHistory.map((result) =>
          result.id === action.resultId ? withAiNarrative(result, action.aiNarrative) : result,
        ),
      };
    case "clear-current-run":
      return {
        ...state,
        currentRun: null,
      };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

function parseStoredValue(value: string | null): Omit<GameStoreState, "hydrated"> {
  if (!value) {
    return {
      currentRun: null,
      resultHistory: [],
    };
  }

  try {
    const parsed = JSON.parse(value) as Omit<GameStoreState, "hydrated">;
    return {
      currentRun: parsed.currentRun ?? null,
      resultHistory: parsed.resultHistory ?? [],
    };
  } catch {
    return {
      currentRun: null,
      resultHistory: [],
    };
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: "hydrate",
      payload: parseStoredValue(window.localStorage.getItem(STORAGE_KEY)),
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentRun: state.currentRun,
        resultHistory: state.resultHistory,
      }),
    );
  }, [state.currentRun, state.hydrated, state.resultHistory]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      startNewGame: (config) => dispatch({ type: "start", config }),
      selectChoice: (choiceId) => dispatch({ type: "select-choice", choiceId }),
      selectFeature: (featureId) => dispatch({ type: "select-feature", featureId }),
      openCandidates: (source) => dispatch({ type: "open-candidates", source }),
      pickCandidate: (featureId) => dispatch({ type: "pick-candidate", featureId }),
      useSkill: (skillId) => {
        const run = state.currentRun;
        if (!run) {
          return { ok: false, message: "当前没有正在进行的旅程" };
        }
        const used = run.skillUses[skillId];
        const maxUses = getSkillById(skillId).maxUses;
        if (used >= maxUses) {
          return { ok: false, message: "这个技能本局已经用完了" };
        }
        dispatch({ type: "use-skill", skillId });
        return { ok: true, message: "技能已生效" };
      },
      resolvePlay: () => {
        const run = state.currentRun;
        if (!run) {
          return { ok: false, message: "当前没有正在进行的旅程" };
        }
        if (!run.selectedChoiceId || !run.selectedFeatureId) {
          return { ok: false, message: "请先选择方向和功能卡" };
        }
        dispatch({ type: "resolve-play" });
        return { ok: true, message: "本回合已记录" };
      },
      resolveMinorPlanet: () => dispatch({ type: "resolve-minor-planet" }),
      continueJourney: () => dispatch({ type: "continue-journey" }),
      saveAiNarrative: (resultId, aiNarrative) => dispatch({ type: "save-ai-narrative", resultId, aiNarrative }),
      clearCurrentRun: () => dispatch({ type: "clear-current-run" }),
    }),
    [state],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
