"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "../../components/Button";
import { HydrationGate, useLatestResultGuard } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { dimensionMeta } from "../../data/game";

type ResultView = "user" | "sales";

export default function ResultInsightsPage() {
  const latestResult = useLatestResultGuard();
  const { saveAiNarrative } = useGame();
  const [resultView, setResultView] = useState<ResultView>("user");
  const [aiStatus, setAiStatus] = useState<"idle" | "done" | "error">("idle");

  useEffect(() => {
    if (!latestResult || latestResult.aiNarrative || aiStatus !== "idle") {
      return;
    }

    let cancelled = false;

    void fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resultId: latestResult.id,
        aiInput: latestResult.aiInput,
        planet: latestResult.planet,
        dimensions: latestResult.dimensions,
      }),
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          ok?: boolean;
          aiNarrative?: {
            userViewNarrative: string;
            salesViewNarrative: string;
            toneWarnings?: string[];
          } | null;
        };

        if (!response.ok || !data.ok || !data.aiNarrative) {
          throw new Error("ai-report-unavailable");
        }

        if (!cancelled) {
          saveAiNarrative(latestResult.id, data.aiNarrative);
          setAiStatus("done");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAiStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [aiStatus, latestResult, saveAiNarrative]);

  if (!latestResult) {
    return null;
  }

  const copy = resultView === "user" ? latestResult.profile.userView : latestResult.profile.salesView;
  const aiCopy = latestResult.aiNarrative
    ? resultView === "user"
      ? latestResult.aiNarrative.userViewNarrative
      : latestResult.aiNarrative.salesViewNarrative
    : null;

  return (
    <HydrationGate>
      <main className="app-page">
        <header className="page-header">
          <div>
            <p className="game-label">完整结果</p>
            <h1>同一趟旅程，两种解读视角</h1>
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
            <p className="game-label">总结结果</p>
            <h2>{copy.title}</h2>
            <p>{copy.summary}</p>
            <p className="result-pill">
              主人格：{latestResult.profile.primaryLabel} / 副人格：{latestResult.profile.secondaryLabel}
            </p>
            <p className="hint">
              AI 报告状态：
              {latestResult.aiNarrative ? "已补全 AI 版叙述" : aiStatus === "error" ? "当前使用规则版结果" : "正在尝试生成增强文案…"}
            </p>
          </Card>

          <Card as="section" className="dimension-panel">
            <p className="game-label">六维画像</p>
            <div className="dimension-list">
              {dimensionMeta.map((dimension) => (
                <ProgressBar key={dimension.key} label={dimension.label} value={latestResult.dimensions[dimension.key]} />
              ))}
            </div>
          </Card>

          <Card as="section" className="combo-panel">
            <p className="game-label">功能组合</p>
            <h2>{copy.comboLead}</h2>
            <div className="combo-list">
              {latestResult.comboPacks.map((pack) => (
                <article key={pack.id}>
                  <strong>{pack.name}</strong>
                  <span>{pack.items.join(" / ")}</span>
                  <span>{pack.whyItFits}</span>
                </article>
              ))}
            </div>
          </Card>

          <Card as="section" className="replay-panel">
            <p className="game-label">旅程回放</p>
            <ol>
              {latestResult.journeyLog.map((step) => (
                <li key={`${step.step}-${step.cardId}`}>
                  <strong>
                    {step.planetName} · {step.eventTitle}
                  </strong>
                  <span>
                    你选择了“{step.choiceLabel}”，打出“{step.cardName}”
                    {step.duplicateApplied ? "（效果翻倍）" : ""}
                    {step.gainedStars.length > 0 ? `，并获得 ${step.gainedStars.join("、")}。` : "。"}
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card as="section" className="advice-panel">
            <p className="game-label">延伸建议</p>
            <h2>{copy.advice}</h2>
            {aiCopy ? <p>{aiCopy}</p> : null}
            {!aiCopy && aiStatus === "error" ? <p>AI 文案暂时不可用，当前页面已自动回退到规则版内容。</p> : null}
          </Card>
        </section>

        <div className="page-actions">
          <ButtonLink href="/cards" variant="secondary">
            浏览卡牌库
          </ButtonLink>
          <ButtonLink href="/reports" variant="secondary">
            查看报告档案
          </ButtonLink>
          <ButtonLink href="/">回到首页</ButtonLink>
        </div>
      </main>
    </HydrationGate>
  );
}
