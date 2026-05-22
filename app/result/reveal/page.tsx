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
            <p className="game-label">�ó̽���</p>
            <h1>��ļ�ʻ�����Ѿ��ִ�</h1>
            <h2>{latestResult.profile.title}</h2>
            <p>{latestResult.profile.userView.summary}</p>
            <p>
              ���ռ�ʤ���ǣ�
              {latestResult.earnedStars.length > 0 ? latestResult.earnedStars.join("��") : "������δ�ռ���ʤ����"}
            </p>
          </div>
        </section>
        <section className="game-card broadcast-card">
          <strong>ϵͳ����</strong>
          <p>{latestResult.profile.userView.comboLead}</p>
        </section>
        <div className="hero-actions">
          <ButtonLink href="/result/insights">�����鿴�������</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            ������ҳ
          </ButtonLink>
        </div>
      </main>
    </HydrationGate>
  );
}


