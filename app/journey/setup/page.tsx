"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import homeBgm from "../../../pub_pic/bgm.mp3";
import homeLogo from "../../../pub_pic/logo.png";
import stageNodeOne from "../../../pub_pic/page1_star/1.png";
import stageNodeTwo from "../../../pub_pic/page1_star/2.png";
import stageNodeThree from "../../../pub_pic/page1_star/3.png";
import stageNodeFour from "../../../pub_pic/page1_star/4.png";
import stageNodeFive from "../../../pub_pic/page1_star/5.png";
import { Button, ButtonLink } from "../../components/Button";
import { HydrationGate } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";
import { planets } from "../../data/game";

const MINOR_COUNT_OPTIONS = [0, 1, 2];

const SETUP_MINOR_NODES = [
  { name: "棉云星", imageSrc: stageNodeOne },
  { name: "守护星", imageSrc: stageNodeTwo },
  { name: "飞梭星", imageSrc: stageNodeThree },
  { name: "寻踪星", imageSrc: stageNodeFour },
  { name: "幻彩星", imageSrc: stageNodeFive },
];

function BrowserIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="journey-setup-browser-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

function MinorPlanetIcon() {
  return (
    <svg className="journey-setup-minor-icon" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="31" cy="34" r="18" />
      <path d="M10 38c9 8 31 11 44-1" />
      <path d="M13 30c10 7 29 9 41 0" />
      <path d="M24 19c4 4 9 5 15 3" />
      <path d="M20 43c5-2 10-1 15 3" />
      <path d="M44 20l2-7M49 24l7-2M45 46l5 5M17 22l-5-4" />
      <circle cx="25" cy="29" r="2" />
      <circle cx="39" cy="37" r="2" />
    </svg>
  );
}

export default function JourneySetupPage() {
  const router = useRouter();
  const { startNewGame } = useGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0].id);
  const [minorCount, setMinorCount] = useState(2);
  const [slots, setSlots] = useState([true, true, false, false]);

  useEffect(() => {
    const audio = new Audio(homeBgm);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!musicOn) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    void audio.play().catch(() => {
      setMusicOn(false);
    });
  }, [musicOn]);

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

  const routeSummary = useMemo(
    () =>
      slots
        .map((selected, index) => (selected ? `主星球 ${index + 1} 后` : ""))
        .filter(Boolean)
        .join("、"),
    [slots],
  );

  const selectedSlotIndexes = useMemo(() => slots.map((selected, index) => (selected ? index : -1)).filter((index) => index >= 0), [slots]);

  function startJourney() {
    const minorPlanetSlots = slots
      .map((selected, index) => (selected ? index + 1 : 0))
      .filter(Boolean)
      .slice(0, minorCount);

    startNewGame({
      planetId: selectedPlanet,
      minorPlanetCount: minorCount,
      minorPlanetSlots,
    });
    router.push("/journey/play");
  }

  return (
    <HydrationGate>
      <main className="journey-setup-page">
        <section className="journey-setup-shell" aria-label="旅程设定">
          <header className="journey-setup-browser" aria-label="浏览器外框">
            <div className="journey-setup-window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="journey-setup-browser-actions" aria-hidden="true">
              <BrowserIcon>
                <path d="m14 6-6 6 6 6" />
              </BrowserIcon>
              <BrowserIcon>
                <path d="m10 6 6 6-6 6" />
              </BrowserIcon>
              <BrowserIcon>
                <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v6h-6" />
              </BrowserIcon>
            </div>
            <div className="journey-setup-address">
              <BrowserIcon>
                <rect x="6" y="10" width="12" height="9" rx="1.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </BrowserIcon>
              <span>smart-cockpit-journey.com</span>
              <BrowserIcon>
                <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9Z" />
              </BrowserIcon>
            </div>
            <div className="journey-setup-browser-end" aria-hidden="true">
              <BrowserIcon>
                <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9Z" />
              </BrowserIcon>
              <BrowserIcon>
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </BrowserIcon>
            </div>
          </header>

          <div className="journey-setup-canvas">
            <div className="journey-setup-topline">
              <div className="journey-setup-brand">
                <span className="journey-setup-logo-slot" aria-label="驾驶星球计划 Logo">
                  <Image className="journey-setup-logo-image" src={homeLogo} alt="驾驶星球计划 Logo" priority />
                </span>
                <span>驾驶星球计划</span>
              </div>
              <button className="journey-setup-music" type="button" aria-pressed={musicOn} onClick={() => setMusicOn((value) => !value)}>
                音乐：{musicOn ? "开" : "关"}
              </button>
            </div>

            <div className="journey-setup-hero">
              <div className="journey-setup-reserve" aria-hidden="true" />
              <div className="journey-setup-title-card">
                <h1>设定你的旅途</h1>
                <p>选择你的出生星球与旅途节奏，规划一段专属于你的星际旅程。</p>
              </div>
              <div className="journey-setup-reserve" aria-hidden="true" />
            </div>

            <div className="journey-setup-layout">
              <div className="journey-setup-flow">
                <section className="journey-setup-panel journey-setup-panel--planets" aria-labelledby="setup-planets-title">
                  <div className="journey-setup-step-heading">
                    <span>1</span>
                    <h2 id="setup-planets-title">选择出生星球</h2>
                  </div>
                  <div className="planet-options journey-setup-planet-options">
                    {planets.map((planet) => (
                      <button
                        className={`planet-option ${planet.accentClass} ${selectedPlanet === planet.id ? "is-selected" : ""}`}
                        key={planet.id}
                        onClick={() => setSelectedPlanet(planet.id)}
                        type="button"
                      >
                        <div className="planet-option-media">
                          <Image alt={`${planet.name}星球图示`} className="planet-option-image" fill sizes="92px" src={planet.imageSrc} />
                        </div>
                        <strong>{planet.name}</strong>
                        <small>{planet.description}</small>
                        <em>{planet.title}</em>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="journey-setup-panel" aria-labelledby="setup-count-title">
                  <div className="journey-setup-step-heading">
                    <span>2</span>
                    <h2 id="setup-count-title">选择小星球数量</h2>
                  </div>
                  <div className="journey-setup-count-control" role="group" aria-label="小星球数量">
                    {MINOR_COUNT_OPTIONS.map((count) => (
                      <button
                        className={minorCount === count ? "is-selected" : ""}
                        key={count}
                        onClick={() => updateMinorCount(count)}
                        type="button"
                      >
                        <strong>{count} 颗</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="journey-setup-panel" aria-labelledby="setup-slots-title">
                  <div className="journey-setup-step-heading">
                    <span>3</span>
                    <h2 id="setup-slots-title">设置小星球插入位置</h2>
                  </div>
                  <div className="journey-setup-route" aria-label="小星球插入位置">
                    {SETUP_MINOR_NODES.map((node, index) => {
                      const slotIndex = index - 1;
                      const isSlot = index > 0;
                      const isSelectedSlot = isSlot && selectedSlotIndexes.includes(slotIndex);

                      return (
                        <div className="journey-setup-route-unit" key={node.name}>
                          {isSlot ? (
                            <button
                              className={`journey-setup-slot ${isSelectedSlot ? "is-selected" : ""}`}
                              disabled={minorCount === 0 && !isSelectedSlot}
                              onClick={() => toggleSlot(slotIndex)}
                              type="button"
                              aria-label={`在第 ${slotIndex + 1} 个主星球后插入小星球`}
                            >
                              {isSelectedSlot ? <MinorPlanetIcon /> : <span aria-hidden="true">+</span>}
                            </button>
                          ) : null}
                          <div className="journey-setup-route-node">
                            <Image src={node.imageSrc} alt="" aria-hidden="true" />
                            <strong>{node.name}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="journey-setup-route-hint">点击虚线框，可在该位置插入小星球。</p>
                </section>
              </div>

              <aside className="journey-setup-info" aria-label="旅途设定说明">
                <h2>旅途设定说明</h2>
                <article>
                  <h3>出生星球的影响</h3>
                  <p>决定你的视觉主题与报告配色。</p>
                </article>
                <article>
                  <h3>小星球的影响</h3>
                  <p>影响旅途总长度与挑战事件密度。</p>
                </article>
                <div className="journey-setup-ready">
                  <strong>设定完成后即可启航</strong>
                  <span>当前选择：{minorCount} 颗小星球</span>
                  <span>插入位置：{routeSummary || "暂未选择"}</span>
                </div>
              </aside>
            </div>

            <div className="journey-setup-bottom-reserves" aria-hidden="true">
              <span />
              <span />
            </div>

            <footer className="journey-setup-actions">
              <ButtonLink href="/" variant="secondary">
                返回首页
              </ButtonLink>
              <Button onClick={startJourney}>开始这段旅途</Button>
            </footer>
          </div>
        </section>
      </main>
    </HydrationGate>
  );
}
