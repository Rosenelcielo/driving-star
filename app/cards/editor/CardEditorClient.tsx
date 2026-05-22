"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../components/Button";
import { CardArtwork } from "../../components/CardArtwork";
import { Card } from "../../components/Card";
import { useCardDrafts } from "../../components/useCardDrafts";
import { buildDefaultDraft, buildNewCardDraft, CAPABILITY_CATEGORY_OPTIONS, normalizeCapabilityCategory } from "../../lib/card-drafts";

export function CardEditorClient({ cardId, isNew = false }: { cardId: string; isNew?: boolean }) {
  const router = useRouter();
  const { getDraft, saveDraft } = useCardDrafts();
  const persistedDraft = getDraft(cardId);
  const initialDraft = useMemo(() => {
    if (persistedDraft) {
      return persistedDraft;
    }
    return isNew ? buildNewCardDraft(cardId) : buildDefaultDraft(cardId);
  }, [cardId, isNew, persistedDraft]);

  const [draft, setDraft] = useState(initialDraft);
  const [artworkStatus, setArtworkStatus] = useState(initialDraft.artwork ? "�Ѽ����ѱ���ͼƬ" : "δѡ��ͼƬ");
  const [saveStatus, setSaveStatus] = useState("");

  function patchDraft(nextPatch: Partial<typeof draft>) {
    setDraft((current) => ({
      ...current,
      ...nextPatch,
    }));
  }

  function markDirty() {
    setSaveStatus("��δ����ĸ���");
  }

  function handleArtworkChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        setArtworkStatus("ͼƬ��ȡʧ�ܣ�������");
        return;
      }

      patchDraft({ artwork: result });
      setArtworkStatus(`��ѡ��${file.name}`);
      markDirty();
    };
    reader.onerror = () => {
      setArtworkStatus("ͼƬ��ȡʧ�ܣ�������");
    };
    reader.readAsDataURL(file);
  }

  function clearArtwork() {
    patchDraft({ artwork: null });
    setArtworkStatus("���Ƴ�ͼƬ");
    markDirty();
  }

  function handleSave() {
    saveDraft(cardId, {
      ...draft,
      deleted: false,
    });
    setSaveStatus("�ѱ��浽���زݸ�");
    router.push("/cards");
  }

  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Card Editor Draft</p>
          <h1>���Ʊ༭���ݸ�</h1>
        </div>
        <ButtonLink href="/cards" variant="secondary">
          ���ؿ��ƿ�
        </ButtonLink>
      </header>

      <section className="editor-grid">
        <Card as="section" className="edit-form">
          <label>
            ��������
            <select
              value={draft.type}
              onChange={(event) => {
                patchDraft({ type: event.target.value });
                markDirty();
              }}
            >
              <option>���ܿ�</option>
              <option>�¼���</option>
              <option>���ܿ�</option>
            </select>
          </label>
          <label>
            ��������
            <input
              value={draft.name}
              onChange={(event) => {
                patchDraft({ name: event.target.value });
                markDirty();
              }}
            />
          </label>
          <label>
            ����ͼ��
            <input accept="image/*" onChange={handleArtworkChange} type="file" />
            <span className="field-note">ѡ��ͼƬ���ͬ�����Ҳ�ʵʱԤ������������ʾ�����ſ��Ŀ��ƿ���淨�����С�</span>
            <span className="field-note">���п���ͼ����ͳһ����չʾ�����������Զ����С�</span>
            <span className="field-note">{artworkStatus}</span>
            {draft.artwork ? (
              <button className="game-button game-button--secondary field-action" onClick={clearArtwork} type="button">
                �Ƴ���ǰͼƬ
              </button>
            ) : null}
          </label>
          <label>
            ��������
            <textarea
              value={draft.description}
              onChange={(event) => {
                patchDraft({ description: event.target.value });
                markDirty();
              }}
            />
          </label>
          <label>
            ��ǩ
            <input
              value={draft.tags}
              onChange={(event) => {
                patchDraft({ tags: event.target.value });
                markDirty();
              }}
            />
          </label>
          <div className="score-grid">
            <label>
              ��ȫ
              <input
                max="2"
                min="-2"
                type="range"
                value={draft.scores.safety}
                onChange={(event) => {
                  patchDraft({
                    scores: {
                      ...draft.scores,
                      safety: Number(event.target.value),
                    },
                  });
                  markDirty();
                }}
              />
              <div className="range-scale" aria-hidden="true">
                <span>-2</span>
                <span>-1</span>
                <span>0</span>
                <span>1</span>
                <span>2</span>
              </div>
            </label>
            <label>
              ����
              <input
                max="2"
                min="-2"
                type="range"
                value={draft.scores.comfort}
                onChange={(event) => {
                  patchDraft({
                    scores: {
                      ...draft.scores,
                      comfort: Number(event.target.value),
                    },
                  });
                  markDirty();
                }}
              />
              <div className="range-scale" aria-hidden="true">
                <span>-2</span>
                <span>-1</span>
                <span>0</span>
                <span>1</span>
                <span>2</span>
              </div>
            </label>
            <label>
              ����
              <input
                max="2"
                min="-2"
                type="range"
                value={draft.scores.intelligence}
                onChange={(event) => {
                  patchDraft({
                    scores: {
                      ...draft.scores,
                      intelligence: Number(event.target.value),
                    },
                  });
                  markDirty();
                }}
              />
              <div className="range-scale" aria-hidden="true">
                <span>-2</span>
                <span>-1</span>
                <span>0</span>
                <span>1</span>
                <span>2</span>
              </div>
            </label>
          </div>
          <label>
            ������Ŀ
            <select
              value={normalizeCapabilityCategory(draft.capability)}
              onChange={(event) => {
                patchDraft({ capability: event.target.value });
                markDirty();
              }}
            >
              {CAPABILITY_CATEGORY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="toggle-label">
            <input
              checked={draft.enabled}
              type="checkbox"
              onChange={(event) => {
                patchDraft({ enabled: event.target.checked });
                markDirty();
              }}
            />{" "}
            ���ÿ���
          </label>
          <div className="form-actions">
            <ButtonLink href="/cards" variant="secondary">
              ����
            </ButtonLink>
            <Button onClick={handleSave}>����༭</Button>
          </div>
          {saveStatus ? <p className="field-note">{saveStatus}</p> : null}
        </Card>

        <Card as="aside" className="live-preview">
          <p className="game-label">ʵʱԤ��</p>
          <div className="feature-card static-card preview-large">
            <CardArtwork alt={`${draft.name} ����ͼ��`} src={draft.artwork} />
            <span>{draft.type}</span>
            <strong>{draft.name}</strong>
            <small>
              ��ȫ {draft.scores.safety > 0 ? "+" : ""}
              {draft.scores.safety} �� ���� {draft.scores.comfort > 0 ? "+" : ""}
              {draft.scores.comfort} �� ���� {draft.scores.intelligence > 0 ? "+" : ""}
              {draft.scores.intelligence}
            </small>
          </div>
          <p>{draft.description}</p>
        </Card>
      </section>
    </main>
  );
}

