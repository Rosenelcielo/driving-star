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
        <h1>����ԾǨ����һ��������</h1>
        <p>
          ��һ�غ��Ѽ�¼���ó���־��
          {run.lastResolvedTurn ? `���� ${run.lastResolvedTurn.planetName} ѡ���ˡ�${run.lastResolvedTurn.choiceLabel}���������${run.lastResolvedTurn.cardName}����` : "�غϽ����ͬ����"}
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
            ������һ�ڵ�
          </button>
          <ButtonLink href="/reports">�ȿ���ǰ����</ButtonLink>
        </div>
      </main>
    </HydrationGate>
  );
}


