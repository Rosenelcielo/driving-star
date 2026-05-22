"use client";

import { ButtonLink } from "../components/Button";
import { HydrationGate } from "../components/GameGuards";
import { useGame } from "../components/GameProvider";
import { getHistoryPreview } from "../lib/game-engine";

export default function ReportsPage() {
  const {
    state: { currentRun, resultHistory },
  } = useGame();

  return (
    <HydrationGate>
      <main className="app-page">
        <header className="page-header">
          <div>
            <p className="game-label">Report Archive</p>
            <h1>�ó̵�����</h1>
          </div>
          <div className="hero-actions">
            <ButtonLink href={currentRun ? currentRun.stage === "challenge" ? "/journey/challenge" : currentRun.stage === "jump" ? "/journey/jump" : currentRun.stage === "result" ? "/result/reveal" : "/journey/play" : "/journey/setup"}>
              {currentRun ? "������ǰ�ó�" : "��ʼ���ó�"}
            </ButtonLink>
            <ButtonLink href="/" variant="secondary">
              ������ҳ
            </ButtonLink>
          </div>
        </header>

        {resultHistory.length === 0 ? (
          <section className="game-card empty-state-card">
            <div className="empty-planet" aria-hidden="true" />
            <p className="game-label">��û�н������</p>
            <h2>��ɵ�һ��֮��������Զ����ֿɻؿ����ó̼�¼��</h2>
          </section>
        ) : (
          <section className="report-list">
            {resultHistory.map((result) => {
              const preview = getHistoryPreview(result);
              return (
                <article className="game-card report-item" key={preview.id}>
                  <p className="game-label">{new Date(preview.createdAt).toLocaleString("zh-CN")}</p>
                  <h2>{preview.title}</h2>
                  <p>{preview.summary}</p>
                  <p>ʤ���ǣ�{preview.stars.length > 0 ? preview.stars.join("��") : "��"}</p>
                  <ButtonLink href={resultHistory[0].id === preview.id ? "/result/reveal" : "/result/insights"} variant="secondary">
                    {resultHistory[0].id === preview.id ? "�鿴������" : "�鿴ͬ�౨��"}
                  </ButtonLink>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </HydrationGate>
  );
}


