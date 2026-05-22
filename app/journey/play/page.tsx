"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { CardArtwork } from "../../components/CardArtwork";
import { useCardDrafts } from "../../components/useCardDrafts";
import { HydrationGate, useRunGuard } from "../../components/GameGuards";
import { useGame } from "../../components/GameProvider";
import { ProgressBar } from "../../components/ProgressBar";
import { dimensionMeta, skillCards } from "../../data/game";
import { dimensionLabelMap, getCurrentEvent, getFeatureById, getPlanetById, isRecommendedForChoice } from "../../lib/game-engine";
import type { FeatureCard } from "../../lib/game-types";

export default function JourneyPlayPage() {
  const router = useRouter();
  const runState = useRunGuard(["play"]);
  const { selectChoice, selectFeature, openCandidates, pickCandidate, resolvePlay, useSkill: activateSkill } = useGame();
  const { getDraft } = useCardDrafts();
  const [toast, setToast] = useState("");

  const run = runState.currentRun;
  const event = run ? getCurrentEvent(run) : null;
  const planet = run ? getPlanetById(run.config.planetId) : null;

  useEffect(() => {
    if (!run) {
      return;
    }
    if (run.stage === "challenge") {
      router.replace("/journey/challenge");
    } else if (run.stage === "jump") {
      router.replace("/journey/jump");
    }
  }, [router, run]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(""), 1200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handCards = useMemo(() => (run ? run.hand.map((cardId) => getFeatureById(cardId)) : []), [run]);
  const candidateCards = useMemo(() => (run ? run.currentCandidates.map((cardId) => getFeatureById(cardId)) : []), [run]);

  function getDisplayCard(card: FeatureCard) {
    const draft = getDraft(card.id);
    return {
      artwork: draft?.artwork ?? null,
      capability: draft?.capability ?? card.capability,
      name: draft?.name ?? card.name,
      summary: draft?.description ?? card.summary,
      effects: draft
        ? {
            ...card.effects,
            safety: draft.scores.safety,
            comfort: draft.scores.comfort,
            intelligence: draft.scores.intelligence,
          }
        : card.effects,
    };
  }

  if (!run || !event || !planet) {
    return (
      <HydrationGate>
        <main className="app-page">
          <section className="game-card empty-state-card">
            <p className="game-label">Journey</p>
            <h1>���ڻָ��ó̡�</h1>
          </section>
        </main>
      </HydrationGate>
    );
  }

  const selectedChoice = event.choices.find((choice) => choice.id === run.selectedChoiceId) ?? event.choices[0];
  const selectedFeature = getDisplayCard(getFeatureById(run.selectedFeatureId));

  function handleSkill(skillId: (typeof skillCards)[number]["id"]) {
    const result = activateSkill(skillId);
    setToast(result.message);
  }

  function handleConfirmPlay() {
    if (!run) {
      return;
    }
    const completedStep = run.currentMainIndex + 1;
    const nextRoute =
      completedStep >= run.eventDeck.length ? "/result/reveal" : run.config.minorPlanetSlots.includes(completedStep) ? "/journey/challenge" : "/journey/jump";
    const result = resolvePlay();
    if (!result.ok) {
      setToast(result.message);
      return;
    }
    router.push(nextRoute);
  }

  return (
    <HydrationGate>
      <main className="game-page">
        <header className="status-layer">
          <div className="dimension-strip">
            {dimensionMeta.map((dimension) => (
              <ProgressBar
                key={dimension.key}
                label={`${dimension.label} ${run.dimensions[dimension.key]}`}
                value={run.dimensions[dimension.key]}
              />
            ))}
          </div>
          <div className="stage-status">
            <strong>
              ������ {Math.min(run.currentMainIndex + 1, run.eventDeck.length)} / {run.eventDeck.length}
            </strong>
            <span>��������{planet.name}</span>
            <span>���ռ�ʤ���ǣ�{run.earnedStars.length} ��</span>
          </div>
        </header>

        <section className="journey-stage" aria-label="�ó�����̨">
          <div className="stage-map">
            {run.eventDeck.map((eventId, index) => (
              <span className={`stage-dot ${index < run.currentMainIndex ? "passed" : ""} ${index === run.currentMainIndex ? "current" : ""}`} key={eventId} />
            ))}
          </div>
          <span className="drawn-ship stage-ship" />
          <Card as="article" className="event-card">
            <p className="game-label">
              {planet.name} �� {event.planetName}
            </p>
            <h1>
              <span>{event.title}</span>
            </h1>
            <p>{event.description}</p>
            <div className="choice-row">
              {event.choices.map((choice) => (
                <button
                  className={`choice-card ${selectedChoice.id === choice.id ? "is-selected" : ""}`}
                  key={choice.id}
                  onClick={() => selectChoice(choice.id)}
                  type="button"
                >
                  {choice.label}
                </button>
              ))}
            </div>
            <p className="hint">{selectedChoice.description}</p>
          </Card>
        </section>

        <footer className="action-layer">
          <section className="skill-zone" aria-label="���ܿ���">
            <span className="zone-title">���ܿ�</span>
            {skillCards.map((skill) => {
              const usedCount = run.skillUses[skill.id];
              const disabled = usedCount >= skill.maxUses;
              return (
                <button className="skill-card" disabled={disabled} key={skill.id} onClick={() => handleSkill(skill.id)} type="button" title={skill.summary}>
                  <strong>{skill.name}</strong>
                  <small>{skill.summary}</small>
                  <small>{disabled ? "��������" : `ʣ�� ${skill.maxUses - usedCount} ��`}</small>
                </button>
              );
            })}
          </section>

          <section className="hand-zone" aria-label="��ǰ������">
            {handCards.map((card) => {
              const displayCard = getDisplayCard(card);
              return (
                <button
                  className={`feature-card ${isRecommendedForChoice(card.id, event.id, selectedChoice.id) ? "is-recommended" : ""} ${
                    run.selectedFeatureId === card.id ? "is-selected" : ""
                  }`}
                  key={card.id}
                  onClick={() => selectFeature(card.id)}
                  type="button"
                >
                  <CardArtwork alt={`${displayCard.name} ����ͼ��`} src={displayCard.artwork} />
                  <span>{displayCard.capability}</span>
                  <strong>{displayCard.name}</strong>
                  <small>{displayCard.summary}</small>
                  <small>
                    {Object.entries(displayCard.effects)
                      .map(([key, value]) => `${dimensionLabelMap[key as keyof typeof dimensionLabelMap]} ${value! > 0 ? "+" : ""}${value}`)
                      .join(" �� ")}
                  </small>
                </button>
              );
            })}
          </section>

          <div className="confirm-strip">
            <Button
              onClick={() => {
                if (run.manualDrawUsed) {
                  setToast("���غ��Ѿ������������ˡ�");
                  return;
                }
                openCandidates("manual-draw");
              }}
              variant="secondary"
            >
              {run.manualDrawUsed ? "���غ��Ѳ���" : "��������"}
            </Button>
            <span>
              ��ѡ����{selectedChoice.label} / ��ѡ���ܿ���{selectedFeature.name}
              {run.duplicateCardId === run.selectedFeatureId ? " / ���غ�Ч������" : ""}
            </span>
            <Button onClick={handleConfirmPlay}>ȷ�ϳ���</Button>
          </div>
        </footer>

        <div
          aria-hidden={candidateCards.length === 0}
          className={`modal-backdrop ${candidateCards.length > 0 ? "is-open" : ""}`}
          onClick={(eventTarget) => {
            if (eventTarget.target === eventTarget.currentTarget) {
              setToast("��ѡ��һ�ź�ѡ���������ơ�");
            }
          }}
        >
          <section aria-labelledby="draw-title" aria-modal="true" className="draw-modal" role="dialog">
            <h2 id="draw-title">{run.candidateSource === "skill-draw" ? "���ܲ��ƣ�ѡ�� 1 �ż�������" : "�������ƣ�ѡ�� 1 �ż�������"}</h2>
            <p>��Щ��ѡ��������㱾�غϵĿ��÷�����ѡ�����Զ���Ϊ��ǰ��ѡ���ܿ���</p>
            <div className="candidate-row">
              {candidateCards.map((card) => {
                const displayCard = getDisplayCard(card);
                return (
                  <button className="feature-card" key={card.id} onClick={() => pickCandidate(card.id)} type="button">
                    <CardArtwork alt={`${displayCard.name} ����ͼ��`} src={displayCard.artwork} />
                    <span>{displayCard.capability}</span>
                    <strong>{displayCard.name}</strong>
                    <small>{displayCard.summary}</small>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div aria-live="polite" className={`skill-toast ${toast ? "is-visible" : ""}`}>
          {toast || "�����ɹ�"}
        </div>
      </main>
    </HydrationGate>
  );
}

