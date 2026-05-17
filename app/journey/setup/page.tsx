"use client";

import { useState } from "react";
import { ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";
import { planets } from "../../data/game";

export default function JourneySetupPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(0);
  const [minorCount, setMinorCount] = useState(2);
  const [slots, setSlots] = useState([true, true, false, false]);

  function updateMinorCount(count: number) {
    setMinorCount(count);
    setSlots((current) => current.map((_, index) => index < count));
  }

  function toggleSlot(index: number) {
    setSlots((current) => {
      const activeCount = current.filter(Boolean).length;
      if (current[index]) {
        return current.map((value, currentIndex) => (currentIndex === index ? false : value));
      }
      if (activeCount >= minorCount) {
        return current;
      }
      return current.map((value, currentIndex) => (currentIndex === index ? true : value));
    });
  }

  const routeSummary = slots
    .map((selected, index) => (selected ? `主${index + 1}后` : ""))
    .filter(Boolean)
    .join("、");

  return (
    <main className="app-page">
      <header className="page-header">
        <ButtonLink href="/" variant="secondary">
          返回首页
        </ButtonLink>
        <div>
          <p className="game-label">步骤 1 / 2</p>
          <h1>设定这趟座舱星际旅途</h1>
        </div>
        <ButtonLink href="/journey/play">开始旅途</ButtonLink>
      </header>

      <section className="setup-grid">
        <Card as="section" className="planets-panel">
          <p className="game-label">出生星球</p>
          <h2>选择整局视觉气质</h2>
          <div className="planet-options">
            {planets.map((planet, index) => (
              <button
                className={`planet-option ${planet.className} ${selectedPlanet === index ? "is-selected" : ""}`}
                key={planet.name}
                onClick={() => setSelectedPlanet(index)}
                type="button"
              >
                <span className="line-planet" />
                <strong>{planet.name}</strong>
                <small>{planet.desc}</small>
                <em>{planet.theme}</em>
              </button>
            ))}
          </div>
        </Card>

        <Card as="section" className="route-panel">
          <p className="game-label">小星球挑战</p>
          <h2>设置挑战密度和插入位置</h2>
          <div className="segmented-control" role="group" aria-label="小星球数量">
            {[1, 2, 3].map((count) => (
              <button className={minorCount === count ? "is-selected" : ""} key={count} onClick={() => updateMinorCount(count)} type="button">
                {count} 颗
              </button>
            ))}
          </div>
          <p className="hint">
            当前旅途：5 个主星球 + <strong>{minorCount}</strong> 个小星球。小星球只增加挑战与荣誉感，不改变主测试结果。
          </p>
          <div className="route-map" aria-label="小星球插入位置">
            <span className="route-node start">出发</span>
            {[0, 1, 2, 3].map((slotIndex) => (
              <span className="route-segment" key={slotIndex}>
                <span className="route-line" />
                <span className="route-node">主{slotIndex + 1}</span>
                <button className={`slot-node ${slots[slotIndex] ? "is-selected" : ""}`} onClick={() => toggleSlot(slotIndex)} type="button">
                  {slots[slotIndex] ? "小" : "+"}
                </button>
              </span>
            ))}
            <span className="route-line" />
            <span className="route-node">主5</span>
          </div>
          <div className="summary-strip">
            <span>主题：{planets[selectedPlanet].theme}</span>
            <span>挑战位置：{routeSummary || "未插入"}</span>
            <span>配色建议：{planets[selectedPlanet].colorAdvice}</span>
          </div>
        </Card>
      </section>
    </main>
  );
}
