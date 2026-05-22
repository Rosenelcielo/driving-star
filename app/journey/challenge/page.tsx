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
            <h1>���ڽ���С������ս��</h1>
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
            <h1>С������ս��{challenge.name}</h1>
          </div>
          <Button
            onClick={() => {
              resolveMinorPlanet();
              router.push("/journey/jump");
            }}
          >
            ��ȡ��ս����
          </Button>
        </header>
        <section className="challenge-board">
          <div className="challenge-orb" aria-hidden="true" />
          <Card as="section" className="challenge-list">
            <h2>�õ�ǰ��ά���������õ�����Щʤ����</h2>
            {challenge.thresholds.map((threshold) => {
              const achieved = run.dimensions[threshold.dimension] >= threshold.target;
              return (
                <div className={`challenge-line ${achieved ? "is-achieved" : ""}`} key={threshold.reward}>
                  <ProgressBar label={`${dimensionLabelMap[threshold.dimension]} / Ŀ�� ${threshold.target}`} value={run.dimensions[threshold.dimension]} />
                  <strong>{achieved ? `��ɣ�${threshold.reward}` : `δ��ɣ�${threshold.reward}`}</strong>
                </div>
              );
            })}
            <div className="reward-strip">{evaluation.rewards.length > 0 ? `���λ�ã�${evaluation.rewards.join("��")}` : "����û������ʤ���ǣ����ó̻�����ƽ���"}</div>
          </Card>
        </section>
      </main>
    </HydrationGate>
  );
}


