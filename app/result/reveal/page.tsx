"use client";

import { useEffect } from "react";
import { ButtonLink } from "../../components/Button";
import { HydrationGate, useLatestResultGuard } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";

export default function ResultRevealPage() {
  const latestResult = useLatestResultGuard();
  const { state, clearCurrentRun } = useGame();

  useEffect(() => {
    if (state.currentRun?.stage === "result") {
      clearCurrentRun();
    }
  }, [clearCurrentRun, state.currentRun]);

  if (!latestResult) {
    return null;
  }

  return (
    <HydrationGate>
      <main className="reveal-page">
        <section className="reveal-stage">
          <div className="driving-planet" aria-hidden="true" />
          <div className="reveal-copy">
            <p className="game-label">旅程结算</p>
            <h1>你的驾驶星球已经抵达</h1>
            <h2>{latestResult.profile.title}</h2>
            <p>{latestResult.profile.userView.summary}</p>
            <p>
              已收集胜利星：
              {latestResult.earnedStars.length > 0 ? latestResult.earnedStars.join("、") : "本局尚未收集到胜利星"}
            </p>
          </div>
        </section>
        <section className="game-card broadcast-card">
          <strong>系统播报</strong>
          <p>{latestResult.profile.userView.comboLead}</p>
        </section>
        <div className="hero-actions">
          <ButtonLink href="/result/insights">继续查看完整结果</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            返回首页
          </ButtonLink>
        </div>
      </main>
    </HydrationGate>
  );
}

