"use client";

import { useState } from "react";
import { ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { comboPacks, dimensions, journeyReplay, resultCopy, type ResultView } from "../../data/game";

export default function ResultInsightsPage() {
  const [resultView, setResultView] = useState<ResultView>("user");
  const copy = resultCopy[resultView];

  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">完整结果</p>
          <h1>同一份旅途，两种解读视角</h1>
        </div>
        <div className="view-switch" role="group" aria-label="结果视角">
          {(["user", "sales"] as const).map((view) => (
            <button className={resultView === view ? "is-selected" : ""} key={view} onClick={() => setResultView(view)} type="button">
              {view === "user" ? "用户视角" : "销售视角"}
            </button>
          ))}
        </div>
      </header>

      <section className="insights-grid">
        <Card as="section" className="result-summary">
          <p className="game-label">总结果</p>
          <h2>{copy.title}</h2>
          <p>{copy.copy}</p>
        </Card>

        <Card as="section" className="dimension-panel">
          <p className="game-label">六维画像</p>
          <div className="dimension-list">
            {dimensions.map((dimension) => (
              <ProgressBar key={dimension.name} label={dimension.name} value={dimension.value} />
            ))}
          </div>
        </Card>

        <Card as="section" className="combo-panel">
          <p className="game-label">功能组合</p>
          <h2>{copy.comboLead}</h2>
          <div className="combo-list">
            {comboPacks.map((pack) => (
              <article key={pack.title}>
                <strong>{pack.title}</strong>
                <span>{pack.items}</span>
              </article>
            ))}
          </div>
        </Card>

        <Card as="section" className="replay-panel">
          <p className="game-label">旅途回放</p>
          <ol>
            {journeyReplay.map((step) => (
              <li key={`${step.planet}-${step.action}`}>
                <strong>{step.planet}</strong>
                <span>
                  {step.action}，{step.feature}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card as="section" className="advice-panel">
          <p className="game-label">延伸建议</p>
          <h2>{copy.advice}</h2>
          <p>颜色建议：银灰、深蓝或冷白氛围光方案。该建议来自出生星球审美，不参与人格分值计算。</p>
        </Card>
      </section>

      <div className="page-actions">
        <ButtonLink href="/cards" variant="secondary">
          浏览卡牌库
        </ButtonLink>
        <ButtonLink href="/">回到首页</ButtonLink>
      </div>
    </main>
  );
}
