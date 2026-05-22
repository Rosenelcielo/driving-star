"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../components/Button";
import { HydrationGate, useRunGuard } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";
import { ProgressBar } from "../../components/ProgressBar";
import { Card } from "../../components/Card";
import { dimensionLabelMap, evaluateMinorPlanet } from "../../lib/game-engine";

export default function ChallengePage() {
  const router = useRouter();
  const runState = useRunGuard(["challenge"]);
  const { resolveMinorPlanet } = useGame();
  const run = runState.currentRun;

  useEffect(() => {
    if (!run) {
      return;
    }
    if (run.stage === "jump") {
      router.replace("/journey/jump");
    }
  }, [router, run]);

  if (!run) {
    return (
      <HydrationGate>
        <main className="app-page">
          <section className="game-card empty-state-card">
            <h1>正在进入小星球挑战…</h1>
          </section>
        </main>
      </HydrationGate>
    );
  }

  const evaluation = evaluateMinorPlanet(run);
  const challenge = evaluation.challenge;

  if (!challenge) {
    return null;
  }

  return (
    <HydrationGate>
      <main className="app-page">
        <header className="page-header">
          <div>
            <p className="game-label">Minor Planet Challenge</p>
            <h1>小星球挑战：{challenge.name}</h1>
          </div>
          <Button
            onClick={() => {
              resolveMinorPlanet();
              router.push("/journey/jump");
            }}
          >
            领取挑战结算
          </Button>
        </header>
        <section className="challenge-board">
          <div className="challenge-orb" aria-hidden="true" />
          <Card as="section" className="challenge-list">
            <h2>用当前六维结果检测你拿到了哪些胜利星</h2>
            {challenge.thresholds.map((threshold) => {
              const achieved = run.dimensions[threshold.dimension] >= threshold.target;
              return (
                <div className={`challenge-line ${achieved ? "is-achieved" : ""}`} key={threshold.reward}>
                  <ProgressBar label={`${dimensionLabelMap[threshold.dimension]} / 目标 ${threshold.target}`} value={run.dimensions[threshold.dimension]} />
                  <strong>{achieved ? `达成：${threshold.reward}` : `未达成：${threshold.reward}`}</strong>
                </div>
              );
            })}
            <div className="reward-strip">{evaluation.rewards.length > 0 ? `本次获得：${evaluation.rewards.join("、")}` : "本次没有新增胜利星，但旅程会继续推进。"}</div>
          </Card>
        </section>
      </main>
    </HydrationGate>
  );
}

