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
  { name: "������", variant: "cotton", imageSrc: stageNodeOne },
  { name: "�ػ���", variant: "guard", imageSrc: stageNodeTwo },
  { name: "������", variant: "shuttle", imageSrc: stageNodeThree },
  { name: "Ѱ����", variant: "trace", imageSrc: stageNodeFour },
  { name: "�ò���", variant: "chroma", imageSrc: stageNodeFive },
];

const HOME_GUIDE_ITEMS = [
  { title: "���ܿ�", text: "Ӱ�����������������άƫ�÷�������ÿ�غ���������ķ�����" },
  { title: "�¼���", text: "�����Ǽ���;�еļ�ʻ�����������ڲ�ͬ�龳��������ѡ��" },
  { title: "���ܿ�", text: "�ṩ�س顢���ơ����ƵȻغϸ��������������ǰ���ƽ��ࡣ" },
];

const HOME_MEDIA_PLACEHOLDERS = [
  { side: "left", label: "������Ӿ�ͼ", imageSrc: stageLeftImage },
  { side: "right", label: "�Ҳ����Ӿ�ͼ", imageSrc: stageRightImage },
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
      <section className="star-home-shell" aria-label="��ʻ����ƻ���ҳ">
        <header className="star-home-browser" aria-label="ҳ������">
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
              <span className="star-home-logo-slot" aria-label="��ʻ����ƻ�Ʒ�� Logo">
                <Image className="star-home-logo-image" src={homeLogo} alt="��ʻ����ƻ� Logo" priority />
              </span>
              <span>��ʻ����ƻ�</span>
            </div>
            <button className="star-home-music" type="button" aria-pressed={musicOn} onClick={() => setMusicOn((value) => !value)}>
              ���֣�{musicOn ? "��" : "��"}
            </button>
          </div>

          <section className="star-home-stage" aria-label="���Ӿ���">
            {HOME_MEDIA_PLACEHOLDERS.map((item) => (
              <div className={`star-home-media-slot ${item.side}`} key={item.side} aria-label={item.label}>
                <Image className="star-home-media-asset" src={item.imageSrc} alt="" aria-hidden="true" priority={item.side === "left"} />
              </div>
            ))}

            <div className="star-home-copy">
              <h1>
                <span>������գ����ѡ��</span>
                <span className="star-home-title-final">��������Ǽ���;��</span>
              </h1>
              <p>ͨ������ѡ�񣬹��������������ƫ�ã�����ר����;��֣�</p>
              <button className="star-home-primary" type="button" onClick={handlePrimaryClick}>
                <span>��ʼ��;</span>
              </button>
              <div className="star-home-actions" aria-label="�����������">
                <Link className="star-home-secondary" href="/reports">
                  <PageIcon />
                  <span>��;����</span>
                </Link>
                <Link className="star-home-secondary" href="/cards">
                  <CardsIcon />
                  <span>������ƿ�</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="star-home-journey" aria-label="����Ǽ���;">
            <div className="star-home-journey-title">
              <span />
              <h2>����Ǽ���;</h2>
              <span />
            </div>
            <div className="star-home-track">
              {HOME_STAGE_NODES.map((node, index) => (
                <div className={["star-home-node", "star-home-node--stage", index === 0 ? "is-active" : ""].filter(Boolean).join(" ")} key={node.name}>
                  <span className={`star-home-node-image star-home-node-image--stage ${node.variant}`} aria-label={`${node.name}ͼƬ`}>
                    <Image className="star-home-node-image-asset" src={node.imageSrc} alt="" aria-hidden="true" />
                  </span>
                  <strong>{node.name}</strong>
                </div>
              ))}
              <div className="star-home-node star-home-node--minor">
                <span className="star-home-mini-cluster" aria-label="���С����ͼƬռλ">
                  <i />
                  <i />
                  <i />
                </span>
                <strong>1-3��С����</strong>
                <small>�漴��ս</small>
              </div>
              <div className="star-home-node is-final">
                <span className="star-home-node-image final" aria-label="���ռ�ʻ����ͼƬռλ" />
                <strong>���ռ�ʻ����</strong>
                <small>������;���</small>
              </div>
            </div>
          </section>
        </div>

        <footer className="star-home-bottom">
          <span>
            <LightIcon />
            �������У�Ѱ��������ǣ�
          </span>
          <div className="star-home-guide-wrap">
            <button className="star-home-guide" type="button" aria-describedby="star-home-guide-popover">
              ����ָ��
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
              <h2 id="star-home-confirm-title">�Ƿ������ǰ�ó̽��ȣ�</h2>
              <p>ȷ�Ϻ����µ��ó��趨��ʼ��ȡ������������ڽ��е��Ǽ���;��</p>
              <div className="star-home-confirm-actions">
                <button className="star-home-secondary" type="button" onClick={handleContinueRun}>
                  ȡ����������ǰ����
                </button>
                <button className="star-home-primary star-home-primary--compact" type="button" onClick={handleClearAndRestart}>
                  ȷ��������ؿ�
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

