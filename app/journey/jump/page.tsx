"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "../../components/Button";
import { HydrationGate, useRunGuard } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";

export default function JumpPage() {
  const router = useRouter();
  const runState = useRunGuard(["jump"]);
  const { continueJourney } = useGame();
  const run = runState.currentRun;

  useEffect(() => {
    if (!run) {
      return;
    }
    if (run.stage === "play") {
      router.replace("/journey/play");
    }
  }, [router, run]);

  if (!run) {
    return null;
  }

  return (
    <HydrationGate>
      <main className="jump-page">
        <div className="jump-orb" aria-hidden="true" />
        <div className="jump-track">
          <span />
        </div>
        <div className="jump-orb target" aria-hidden="true" />
        <h1>正在跃迁到下一个主星球</h1>
        <p>
          上一回合已记录进旅程日志，
          {run.lastResolvedTurn ? `你在 ${run.lastResolvedTurn.planetName} 选择了“${run.lastResolvedTurn.choiceLabel}”，打出“${run.lastResolvedTurn.cardName}”。` : "回合结果已同步。"}
        </p>
        <div className="hero-actions">
          <button
            className="game-button game-button--secondary"
            onClick={() => {
              continueJourney();
              router.push("/journey/play");
            }}
            type="button"
          >
            进入下一节点
          </button>
          <ButtonLink href="/reports">先看当前档案</ButtonLink>
        </div>
      </main>
    </HydrationGate>
  );
}

