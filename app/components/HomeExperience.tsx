"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import homeBgm from "../../pub_pic/bgm.mp3";
import homeLogo from "../../pub_pic/logo.png";
import stageLeftImage from "../../pub_pic/page1_left.png";
import stageRightImage from "../../pub_pic/page1_right.png";
import stageNodeOne from "../../pub_pic/page1_star/1.png";
import stageNodeTwo from "../../pub_pic/page1_star/2.png";
import stageNodeThree from "../../pub_pic/page1_star/3.png";
import stageNodeFour from "../../pub_pic/page1_star/4.png";
import stageNodeFive from "../../pub_pic/page1_star/5.png";
import type { GameRunState } from "../lib/game-types";
import { useGame } from "./GameProvider";

const HOME_STAGE_NODES = [
  { name: "棉云星", variant: "cotton", imageSrc: stageNodeOne },
  { name: "守护星", variant: "guard", imageSrc: stageNodeTwo },
  { name: "飞梭星", variant: "shuttle", imageSrc: stageNodeThree },
  { name: "寻踪星", variant: "trace", imageSrc: stageNodeFour },
  { name: "幻彩星", variant: "chroma", imageSrc: stageNodeFive },
];

const HOME_GUIDE_ITEMS = [
  { title: "功能卡", text: "影响座舱能力组合与六维偏好分数，是每回合真正打出的方案。" },
  { title: "事件卡", text: "呈现星际旅途中的驾驶场景，让你在不同情境里做方向选择。" },
  { title: "技能卡", text: "提供重抽、补牌、换牌等回合辅助，帮你调整当前手牌节奏。" },
];

const HOME_MEDIA_PLACEHOLDERS = [
  { side: "left", label: "左侧主视觉图", imageSrc: stageLeftImage },
  { side: "right", label: "右侧主视觉图", imageSrc: stageRightImage },
];

function getCurrentRunHref(currentRun: GameRunState) {
  if (currentRun.stage === "challenge") {
    return "/journey/challenge";
  }

  if (currentRun.stage === "jump") {
    return "/journey/jump";
  }

  if (currentRun.stage === "result") {
    return "/result/reveal";
  }

  return "/journey/play";
}

function BrowserIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="star-home-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

function PageIcon() {
  return (
    <svg className="star-home-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v5h5M9 12h6M9 16h6" />
    </svg>
  );
}

function CardsIcon() {
  return (
    <svg className="star-home-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 4 11 3-3.5 13-11-3Z" />
      <path d="m11 5 6-1 3 13-5 1" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg className="star-home-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6M10 22h4M8 10a4 4 0 1 1 8 0c0 2-1.5 3-2.5 4.5H10.5C9.5 13 8 12 8 10Z" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg className="star-home-guide-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.7 2.7 0 0 1 5.1 1.2c0 2-2.2 2.2-2.2 4M12 18h.01" />
    </svg>
  );
}

export function HomeExperience() {
  const router = useRouter();
  const {
    state: { currentRun },
    clearCurrentRun,
  } = useGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [showRunConfirm, setShowRunConfirm] = useState(false);

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

  function handlePrimaryClick() {
    if (!currentRun) {
      router.push("/journey/setup");
      return;
    }

    setShowRunConfirm(true);
  }

  function handleClearAndRestart() {
    clearCurrentRun();
    setShowRunConfirm(false);
    router.push("/journey/setup");
  }

  function handleContinueRun() {
    if (!currentRun) {
      setShowRunConfirm(false);
      return;
    }

    setShowRunConfirm(false);
    router.push(getCurrentRunHref(currentRun));
  }

  return (
    <main className="star-home">
      <section className="star-home-shell" aria-label="驾驶星球计划首页">
        <header className="star-home-browser" aria-label="浏览器外框">
          <div className="star-home-window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="star-home-browser-actions" aria-hidden="true">
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
          <div className="star-home-address">
            <BrowserIcon>
              <rect x="6" y="10" width="12" height="9" rx="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </BrowserIcon>
            <span>smart-cockpit-journey.com</span>
            <BrowserIcon>
              <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9Z" />
            </BrowserIcon>
          </div>
          <div className="star-home-browser-end" aria-hidden="true">
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

        <div className="star-home-canvas">
          <div className="star-home-topline">
            <div className="star-home-brand">
              <span className="star-home-logo-slot" aria-label="驾驶星球计划 Logo">
                <Image className="star-home-logo-image" src={homeLogo} alt="驾驶星球计划 Logo" priority />
              </span>
              <span>驾驶星球计划</span>
            </div>
            <button className="star-home-music" type="button" aria-pressed={musicOn} onClick={() => setMusicOn((value) => !value)}>
              音乐：{musicOn ? "开" : "关"}
            </button>
          </div>

          <section className="star-home-stage" aria-label="首页主视觉">
            {HOME_MEDIA_PLACEHOLDERS.map((item) => (
              <div className={`star-home-media-slot ${item.side}`} key={item.side} aria-label={item.label}>
                <Image className="star-home-media-asset" src={item.imageSrc} alt="" aria-hidden="true" priority={item.side === "left"} />
              </div>
            ))}

            <div className="star-home-copy">
              <h1>
                <span>你的座舱，你的选择，</span>
                <span className="star-home-title-final">决定你的星际旅途。</span>
              </h1>
              <p>通过卡牌选择，构建你的智能座舱偏好，解锁专属旅途结局。</p>
              <button className="star-home-primary" type="button" onClick={handlePrimaryClick}>
                <span>开始旅途</span>
              </button>
              <div className="star-home-actions" aria-label="首页快捷入口">
                <Link className="star-home-secondary" href="/reports">
                  <PageIcon />
                  <span>旅途报告</span>
                </Link>
                <Link className="star-home-secondary" href="/cards">
                  <CardsIcon />
                  <span>浏览卡牌库</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="star-home-journey" aria-label="星际旅途路线">
            <div className="star-home-journey-title">
              <span />
              <h2>你的星际旅途</h2>
              <span />
            </div>
            <div className="star-home-track">
              {HOME_STAGE_NODES.map((node, index) => (
                <div className={["star-home-node", "star-home-node--stage", index === 0 ? "is-active" : ""].filter(Boolean).join(" ")} key={node.name}>
                  <span className={`star-home-node-image star-home-node-image--stage ${node.variant}`} aria-label={`${node.name}图片`}>
                    <Image className="star-home-node-image-asset" src={node.imageSrc} alt="" aria-hidden="true" />
                  </span>
                  <strong>{node.name}</strong>
                </div>
              ))}
              <div className="star-home-node star-home-node--minor">
                <span className="star-home-mini-cluster" aria-label="可选小星球">
                  <i />
                  <i />
                  <i />
                </span>
                <strong>1-3 个小星球</strong>
                <small>随机挑战</small>
              </div>
              <div className="star-home-node is-final">
                <span className="star-home-node-image final" aria-label="最终驾驶星球" />
                <strong>最终驾驶星球</strong>
                <small>解锁旅途结局</small>
              </div>
            </div>
          </section>
        </div>

        <footer className="star-home-bottom">
          <span>
            <LightIcon />
            在宇宙中，寻找你的星星！
          </span>
          <div className="star-home-guide-wrap">
            <button className="star-home-guide" type="button" aria-describedby="star-home-guide-popover">
              新手指引
              <QuestionIcon />
            </button>
            <div className="star-home-guide-popover" id="star-home-guide-popover" role="tooltip">
              {HOME_GUIDE_ITEMS.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </footer>

        {showRunConfirm ? (
          <div className="star-home-confirm-backdrop" role="presentation">
            <section className="star-home-confirm" role="dialog" aria-modal="true" aria-labelledby="star-home-confirm-title">
              <h2 id="star-home-confirm-title">是否清除当前旅程进度？</h2>
              <p>确认后会从新的旅程设定开始；取消会继续你正在进行的星际旅途。</p>
              <div className="star-home-confirm-actions">
                <button className="star-home-secondary" type="button" onClick={handleContinueRun}>
                  取消，继续当前进度
                </button>
                <button className="star-home-primary star-home-primary--compact" type="button" onClick={handleClearAndRestart}>
                  确认清除并重开
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
