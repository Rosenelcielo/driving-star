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
            <h1>旅程档案库</h1>
          </div>
          <div className="hero-actions">
            <ButtonLink href={currentRun ? currentRun.stage === "challenge" ? "/journey/challenge" : currentRun.stage === "jump" ? "/journey/jump" : currentRun.stage === "result" ? "/result/reveal" : "/journey/play" : "/journey/setup"}>
              {currentRun ? "继续当前旅程" : "开始新旅程"}
            </ButtonLink>
            <ButtonLink href="/" variant="secondary">
              返回首页
            </ButtonLink>
          </div>
        </header>

        {resultHistory.length === 0 ? (
          <section className="game-card empty-state-card">
            <div className="empty-planet" aria-hidden="true" />
            <p className="game-label">还没有结果报告</p>
            <h2>完成第一局之后，这里会自动出现可回看的旅程记录。</h2>
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
                  <p>胜利星：{preview.stars.length > 0 ? preview.stars.join("、") : "无"}</p>
                  <ButtonLink href={resultHistory[0].id === preview.id ? "/result/reveal" : "/result/insights"} variant="secondary">
                    {resultHistory[0].id === preview.id ? "查看最近结果" : "查看同类报告"}
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

