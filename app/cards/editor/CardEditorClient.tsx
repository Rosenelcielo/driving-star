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
  const [artworkStatus, setArtworkStatus] = useState(initialDraft.artwork ? "已加载已保存图片" : "未选择图片");
  const [saveStatus, setSaveStatus] = useState("");

  function patchDraft(nextPatch: Partial<typeof draft>) {
    setDraft((current) => ({
      ...current,
      ...nextPatch,
    }));
  }

  function markDirty() {
    setSaveStatus("有未保存的更改");
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
        setArtworkStatus("图片读取失败，请重试");
        return;
      }

      patchDraft({ artwork: result });
      setArtworkStatus(`已选择：${file.name}`);
      markDirty();
    };
    reader.onerror = () => {
      setArtworkStatus("图片读取失败，请重试");
    };
    reader.readAsDataURL(file);
  }

  function clearArtwork() {
    patchDraft({ artwork: null });
    setArtworkStatus("已移除图片");
    markDirty();
  }

  function handleSave() {
    saveDraft(cardId, {
      ...draft,
      deleted: false,
    });
    setSaveStatus("已保存到本地草稿");
    router.push("/cards");
  }

  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Card Editor Draft</p>
          <h1>卡牌编辑器草稿</h1>
        </div>
        <ButtonLink href="/cards" variant="secondary">
          返回卡牌库
        </ButtonLink>
      </header>

      <section className="editor-grid">
        <Card as="section" className="edit-form">
          <label>
            卡牌类型
            <select
              value={draft.type}
              onChange={(event) => {
                patchDraft({ type: event.target.value });
                markDirty();
              }}
            >
              <option>功能卡</option>
              <option>事件卡</option>
              <option>技能卡</option>
            </select>
          </label>
          <label>
            卡牌名称
            <input
              value={draft.name}
              onChange={(event) => {
                patchDraft({ name: event.target.value });
                markDirty();
              }}
            />
          </label>
          <label>
            卡牌图面
            <input accept="image/*" onChange={handleArtworkChange} type="file" />
            <span className="field-note">选中图片后会同步到右侧实时预览，保存后会显示在这张卡的卡牌库和玩法卡面中。</span>
            <span className="field-note">所有卡面图都按统一比例展示，超出部分自动裁切。</span>
            <span className="field-note">{artworkStatus}</span>
            {draft.artwork ? (
              <button className="game-button game-button--secondary field-action" onClick={clearArtwork} type="button">
                移除当前图片
              </button>
            ) : null}
          </label>
          <label>
            卡牌描述
            <textarea
              value={draft.description}
              onChange={(event) => {
                patchDraft({ description: event.target.value });
                markDirty();
              }}
            />
          </label>
          <label>
            标签
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
              安全
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
              舒适
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
              智能
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
            能力类目
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
            启用卡牌
          </label>
          <div className="form-actions">
            <ButtonLink href="/cards" variant="secondary">
              返回
            </ButtonLink>
            <Button onClick={handleSave}>保存编辑</Button>
          </div>
          {saveStatus ? <p className="field-note">{saveStatus}</p> : null}
        </Card>

        <Card as="aside" className="live-preview">
          <p className="game-label">实时预览</p>
          <div className="feature-card static-card preview-large">
            <CardArtwork alt={`${draft.name} 卡牌图面`} src={draft.artwork} />
            <span>{draft.type}</span>
            <strong>{draft.name}</strong>
            <small>
              安全 {draft.scores.safety > 0 ? "+" : ""}
              {draft.scores.safety} · 舒适 {draft.scores.comfort > 0 ? "+" : ""}
              {draft.scores.comfort} · 智能 {draft.scores.intelligence > 0 ? "+" : ""}
              {draft.scores.intelligence}
            </small>
          </div>
          <p>{draft.description}</p>
        </Card>
      </section>
    </main>
  );
}
