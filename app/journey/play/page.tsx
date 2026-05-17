"use client";

import { useState } from "react";
import { Button, ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { candidateCards, currentEvent, dimensions, featureCards, skillCards } from "../../data/game";

export default function JourneyPlayPage() {
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [drawOpen, setDrawOpen] = useState(false);
  const [toast, setToast] = useState("");

  function triggerSkill(name: string) {
    setToast(`${name} 技能发动`);
    window.setTimeout(() => setToast(""), 1100);
  }

  return (
    <main className="game-page">
      <header className="status-layer">
        <div className="dimension-strip">
          {dimensions.map((dimension) => (
            <ProgressBar key={dimension.name} label={`${dimension.name} ${dimension.score}`} value={dimension.value} />
          ))}
        </div>
        <div className="stage-status">
          <strong>主星球 2 / 5</strong>
          <span>阶段：打出功能卡</span>
          <span>胜利星 ★★★</span>
        </div>
      </header>

      <section className="journey-stage" aria-label="旅途主舞台">
        <div className="stage-map">
          <span className="stage-dot passed" />
          <span className="stage-dot passed" />
          <span className="stage-dot current" />
          <span className="stage-dot" />
          <span className="stage-dot" />
        </div>
        <span className="drawn-ship stage-ship" />
        <Card as="article" className="event-card">
          <p className="game-label">{currentEvent.type}</p>
          <h1>
            <span>复杂天气下，</span>
            <span>你要完成一次临时接送</span>
          </h1>
          <p>{currentEvent.copy}</p>
          <div className="choice-row">
            {currentEvent.choices.map((choice, index) => (
              <button className={`choice-card ${selectedChoice === index ? "is-selected" : ""}`} key={choice} onClick={() => setSelectedChoice(index)} type="button">
                {choice}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <footer className="action-layer">
        <section className="skill-zone" aria-label="技能卡区">
          <span className="zone-title">技能卡</span>
          {skillCards.map((skill) => (
            <button className="skill-card" key={skill.name} onClick={() => triggerSkill(skill.name)} type="button" title={skill.use}>
              <strong>{skill.name}</strong>
              <small>{skill.use}</small>
            </button>
          ))}
          <span className="usage-count">本场 1 / 3</span>
        </section>

        <section className="hand-zone" aria-label="当前手牌区">
          {featureCards.map((card, index) => (
            <button
              className={`feature-card ${card.recommended ? "is-recommended" : ""} ${selectedFeature === index ? "is-selected" : ""}`}
              key={card.title}
              onClick={() => setSelectedFeature(index)}
              type="button"
            >
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <small>{card.score}</small>
            </button>
          ))}
        </section>

        <div className="confirm-strip">
          <Button variant="secondary" onClick={() => setDrawOpen(true)}>
            主动补牌
          </Button>
          <span>已选：{featureCards[selectedFeature].title}</span>
          <ButtonLink href="/journey/challenge">确认出牌</ButtonLink>
        </div>
      </footer>

      <div
        aria-hidden={!drawOpen}
        className={`modal-backdrop ${drawOpen ? "is-open" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setDrawOpen(false);
          }
        }}
      >
        <section aria-labelledby="draw-title" aria-modal="true" className="draw-modal" role="dialog">
          <h2 id="draw-title">选择一张支援卡</h2>
          <p>这张卡将加入牌组，并作为本次行动打出。</p>
          <div className="candidate-row">
            {candidateCards.map((card, index) => (
              <button
                className={`feature-card ${selectedCandidate === index ? "is-selected" : ""}`}
                key={card.title}
                onClick={() => setSelectedCandidate(index)}
                type="button"
              >
                <span>{card.label}</span>
                <strong>{card.title}</strong>
                <small>{card.score}</small>
              </button>
            ))}
          </div>
          <div className="confirm-strip">
            <Button variant="secondary" onClick={() => setDrawOpen(false)}>
              返回
            </Button>
            <span>当前选择：{candidateCards[selectedCandidate].title}</span>
            <Button onClick={() => setDrawOpen(false)}>确认选择</Button>
          </div>
        </section>
      </div>

      <div aria-live="polite" className={`skill-toast ${toast ? "is-visible" : ""}`}>
        {toast || "技能卡发动"}
      </div>
    </main>
  );
}
