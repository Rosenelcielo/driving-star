"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { FinalResult, GameRunState, GameStoreState } from "../lib/game-types";
import { useGame } from "./GameProvider";

export function useRunGuard(allowedStages?: GameRunState["stage"][]) {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }
    if (!state.currentRun) {
      router.replace("/journey/setup");
      return;
    }
    if (allowedStages && !allowedStages.includes(state.currentRun.stage)) {
      router.replace(
        state.currentRun.stage === "challenge"
          ? "/journey/challenge"
          : state.currentRun.stage === "jump"
            ? "/journey/jump"
            : state.currentRun.stage === "result"
              ? "/result/reveal"
              : "/journey/play",
      );
    }
  }, [allowedStages, router, state]);

  return state;
}

export function useLatestResultGuard() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }
    if (!state.resultHistory[0]) {
      router.replace("/reports");
    }
  }, [router, state.hydrated, state.resultHistory]);

  return state.resultHistory[0] ?? null;
}

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const { state } = useGame();
  if (!state.hydrated) {
    return (
      <main className="app-page">
        <section className="game-card empty-state-card">
          <p className="game-label">Driver Star</p>
          <h1>正在读取本地旅程数据…</h1>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}

export function getLatestResult(state: GameStoreState): FinalResult | null {
  return state.resultHistory[0] ?? null;
}
