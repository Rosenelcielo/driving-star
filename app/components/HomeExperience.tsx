"use client";

import Link from "next/link";
import { useState } from "react";

const journeyNodes = ["舒适星球", "安全星球", "连接星球", "效率星球", "探索星球", "1-3 个小星球", "最终驾驶星球"];

type BrowserIconProps = {
  kind: "back" | "forward" | "refresh" | "lock" | "star" | "menu" | "report" | "cards" | "help" | "light";
};

function BrowserIcon({ kind }: BrowserIconProps) {
  if (kind === "back" || kind === "forward") {
    return (
      <svg aria-hidden="true" className="star-home-icon" viewBox="0 0 24 24">
        <path d={kind === "back" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"} />
        <path d={kind === "back" ? "M9 12h11" : "M4 12h11"} />
      </svg>
    );
  }

  const paths = {
    refresh: ["M20 11a8 8 0 1 0-2.3 5.6", "M20 4v7h-7"],
    lock: ["M7 11h10v9H7z", "M9 11V8a3 3 0 0 1 6 0v3"],
    star: ["m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"],
    menu: ["M12 5.5h.01", "M12 12h.01", "M12 18.5h.01"],
    report: ["M6 3h9l3 3v15H6z", "M15 3v4h4", "M9 12h6", "M9 16h5"],
    cards: ["M8 6 17 3l3 12-9 3z", "M4 8h10v13H4z"],
    help: ["M12 17h.01", "M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1.2-1.5 2.5"],
    light: ["M12 3v3", "M5.6 5.6l2.1 2.1", "M3 12h3", "M18 12h3", "M16.3 7.7l2.1-2.1", "M8 17h8", "M9 21h6", "M9 14a4 4 0 1 1 6 0"],
  };

  return (
    <svg aria-hidden="true" className="star-home-icon" viewBox="0 0 24 24">
      {paths[kind].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

function BrandMark() {
  return (
    <svg aria-hidden="true" className="star-home-brand-mark" viewBox="0 0 96 72">
      <ellipse cx="43" cy="42" rx="34" ry="14" transform="rotate(-16 43 42)" />
      <circle cx="41" cy="36" r="20" />
      <path d="M18 47c16 4 38 1 61-9" />
      <path d="M30 24c4-4 10-7 17-7" />
      <circle cx="33" cy="30" r="3" />
      <circle cx="52" cy="41" r="4" />
      <path d="M75 13v11M69 18h12" />
      <path d="M82 25v7M78.5 28.5h7" />
    </svg>
  );
}

function Rocket() {
  return (
    <svg aria-hidden="true" className="star-home-rocket" viewBox="0 0 220 120">
      <path d="M40 73c35-42 100-55 152-31-19 33-63 53-137 48z" />
      <path d="M67 54 42 39l35-4" />
      <path d="M74 90 58 111l38-17" />
      <ellipse cx="139" cy="54" rx="23" ry="12" transform="rotate(-8 139 54)" />
      <path d="M44 77c-14 6-24 11-35 21M51 89c-11 5-19 10-27 17M35 63c-14 2-24 5-32 9" />
      <path d="M90 43c23-8 49-10 77-3" />
    </svg>
  );
}

function BigMoon() {
  return (
    <svg aria-hidden="true" className="star-home-moon" viewBox="0 0 190 190">
      <circle cx="95" cy="95" r="70" />
      <path d="M46 118c24 23 64 28 97 7" />
      <path d="M53 129c17 12 43 17 74 8" />
      <circle cx="73" cy="78" r="9" />
      <circle cx="109" cy="59" r="10" />
      <circle cx="123" cy="105" r="14" />
      <circle cx="70" cy="126" r="8" />
      <path d="M95 15V3M95 187v-12M16 95H4M186 95h-12M39 39l-9-9M151 39l9-9M39 151l-9 9M151 151l9 9" />
      <path d="M91 25V0h20" />
      <path d="M111 0c12 4 19 8 27 3v26c-9 6-17 1-27-3z" />
    </svg>
  );
}

function SmallPlanet({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`star-home-small-planet ${className}`} viewBox="0 0 90 90">
      <circle cx="45" cy="45" r="27" />
      <path d="M17 51c19 8 42 7 64-7" />
      <path d="M23 37c15 5 31 4 48-4" />
      <circle cx="34" cy="31" r="4" />
      <circle cx="55" cy="55" r="5" />
    </svg>
  );
}

function Sparkles() {
  return (
    <>
      <span className="star-home-sparkle sparkle-one" />
      <span className="star-home-sparkle sparkle-two" />
      <span className="star-home-sparkle sparkle-three" />
      <span className="star-home-dot dot-one" />
      <span className="star-home-dot dot-two" />
      <span className="star-home-dot dot-three" />
      <span className="star-home-dot dot-four" />
    </>
  );
}

export function HomeExperience() {
  const [musicOn, setMusicOn] = useState(true);
  const [activeNode, setActiveNode] = useState(journeyNodes.length - 1);

  return (
    <main className="home-page star-home">
      <section className="star-home-shell" aria-label="驾驶星球计划首页">
        <header className="star-home-browser" aria-label="模拟浏览器导航栏">
          <div className="star-home-window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="star-home-browser-actions" aria-hidden="true">
            <BrowserIcon kind="back" />
            <BrowserIcon kind="forward" />
            <BrowserIcon kind="refresh" />
          </div>
          <div className="star-home-address" aria-hidden="true">
            <BrowserIcon kind="lock" />
            <span>smart-cockpit-journey.com</span>
            <BrowserIcon kind="star" />
          </div>
          <div className="star-home-browser-end" aria-hidden="true">
            <BrowserIcon kind="star" />
            <BrowserIcon kind="menu" />
          </div>
        </header>

        <div className="star-home-canvas">
          <nav className="star-home-topline" aria-label="首页控制">
            <div className="star-home-brand">
              <BrandMark />
              <span>驾驶星球计划</span>
            </div>
            <button
              aria-pressed={musicOn}
              className="star-home-music"
              onClick={() => setMusicOn((current) => !current)}
              type="button"
            >
              音乐：{musicOn ? "开" : "关"}
            </button>
          </nav>

          <div className="star-home-stage">
            <Sparkles />
            <svg aria-hidden="true" className="star-home-route route-left" viewBox="0 0 520 180">
              <path d="M11 153C78 55 160 94 220 52c64-45 136-50 202-23 38 16 48 83 88 96" />
              <circle cx="13" cy="153" r="9" />
              <circle cx="509" cy="126" r="8" />
            </svg>
            <svg aria-hidden="true" className="star-home-route route-right" viewBox="0 0 580 220">
              <path d="M8 168c80-7 91-74 134-98 53-31 130-5 178-28 45-22 82-56 143-27 65 31 65 100 105 128" />
              <circle cx="9" cy="168" r="8" />
              <circle cx="323" cy="42" r="8" />
              <circle cx="567" cy="145" r="8" />
            </svg>

            <Rocket />
            <SmallPlanet className="planet-a" />
            <SmallPlanet className="planet-b" />
            <SmallPlanet className="planet-c" />
            <BigMoon />
            <span className="star-home-final-label">最终驾驶星球</span>

            <section className="star-home-copy">
              <h1>
                <span className="star-home-title-first">你的座舱，</span>
                <span className="star-home-title-second">你的星球</span>
              </h1>
              <p>通过卡牌选择，构建你的智能座舱偏好，解锁专属旅途结局！</p>
              <Link className="star-home-primary" href="/journey/setup">
                <span>开始旅途</span>
              </Link>
              <div className="star-home-actions" aria-label="次要入口">
                <Link className="star-home-secondary" href="/reports">
                  <BrowserIcon kind="report" />
                  <span>旅途报告</span>
                </Link>
                <Link className="star-home-secondary" href="/cards">
                  <BrowserIcon kind="cards" />
                  <span>浏览卡牌库</span>
                </Link>
              </div>
            </section>
          </div>

          <section className="star-home-journey" aria-label="你的星际旅途">
            <div className="star-home-journey-title">
              <span />
              <h2>你的星际旅途</h2>
              <span />
            </div>
            <div className="star-home-track" role="list">
              {journeyNodes.map((node, index) => (
                <button
                  aria-label={`查看${node}`}
                  className={`star-home-node ${activeNode === index ? "is-active" : ""} ${index === journeyNodes.length - 1 ? "is-final" : ""}`}
                  key={node}
                  onBlur={() => setActiveNode(journeyNodes.length - 1)}
                  onFocus={() => setActiveNode(index)}
                  onMouseEnter={() => setActiveNode(index)}
                  type="button"
                >
                  <span className="star-home-node-orbit" aria-hidden="true">
                    {index === 5 ? (
                      <span className="star-home-mini-cluster">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : index === 6 ? (
                      <BigMoon />
                    ) : (
                      <SmallPlanet />
                    )}
                  </span>
                  <strong>{node}</strong>
                  {index === 6 ? <small>解锁旅途结局</small> : null}
                  {index === 5 ? <small>随机事件</small> : null}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="star-home-bottom">
          <span>
            <BrowserIcon kind="light" />
            在宇宙中，寻找你的星星！
          </span>
          <button className="star-home-guide" type="button">
            新手指引
            <BrowserIcon kind="help" />
          </button>
        </footer>
      </section>
    </main>
  );
}
