"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ButtonLink } from "../components/Button";
import { CardArtwork } from "../components/CardArtwork";
import { Card } from "../components/Card";
import { useCardDrafts } from "../components/useCardDrafts";
import { cardLibraryRows } from "../data/game";
import type { CardDraftStore, EditableCardDraft } from "../lib/card-drafts";

const ALL_TYPES = "全部类型";

export default function CardsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { drafts, getDraft, deleteDraft, replaceDrafts } = useCardDrafts();
  const [query, setQuery] = useState("");
  const [type, setType] = useState(ALL_TYPES);
  const [selectedCard, setSelectedCard] = useState(cardLibraryRows[0].id);
  const [backupStatus, setBackupStatus] = useState("");

  const mergedRows = useMemo(() => {
    const baseIds = new Set(cardLibraryRows.map((row) => row.id));

    const baseRows = cardLibraryRows.map((row) => {
      const draft = getDraft(row.id);
      return {
        ...row,
        name: draft?.name ?? row.name,
        type: draft?.type ?? row.type,
        tags: draft?.tags ?? row.tags,
        enabled: draft?.enabled ?? row.enabled,
        detail: draft?.description ?? row.detail,
        artwork: draft?.artwork ?? null,
        deleted: draft?.deleted ?? false,
      };
    });

    const customRows = (Object.entries(drafts) as Array<[string, EditableCardDraft]>)
      .filter(([id, draft]) => draft.isCustom && !draft.deleted && !baseIds.has(id))
      .map(([id, draft]) => ({
        id,
        name: draft.name,
        type: draft.type,
        tags: draft.tags,
        enabled: draft.enabled,
        detail: draft.description,
        artwork: draft.artwork,
        deleted: false,
      }));

    return [...baseRows, ...customRows].filter((row) => !row.deleted);
  }, [drafts, getDraft]);

  const filteredRows = useMemo(() => {
    return mergedRows.filter((row) => {
      const matchQuery = `${row.name}${row.type}${row.tags}${row.detail}`.includes(query);
      const matchType = type === ALL_TYPES || row.type === type;
      return matchQuery && matchType;
    });
  }, [mergedRows, query, type]);

  const activeCard = filteredRows.find((row) => row.id === selectedCard) ?? filteredRows[0] ?? null;

  function handleDelete(cardId: string, cardName: string) {
    const confirmed = window.confirm(`确定要删除“${cardName}”吗？删除后它会从当前卡牌库视图中隐藏。`);
    if (!confirmed) {
      return;
    }

    deleteDraft(cardId);

    if (selectedCard === cardId) {
      const nextCard = filteredRows.find((row) => row.id !== cardId);
      if (nextCard) {
        setSelectedCard(nextCard.id);
      }
    }
  }

  function handleCreateCard() {
    const newCardId = `custom-${Date.now()}`;
    router.push(`/cards/editor?id=${newCardId}&mode=new`);
  }

  function handleExportBackup() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      drafts,
      cards: mergedRows,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `driver-star-card-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupStatus("备份牌库已导出");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = typeof reader.result === "string" ? reader.result : "";
        const parsed = JSON.parse(raw) as unknown;
        const nextDrafts = extractDraftStore(parsed);

        replaceDrafts(nextDrafts ?? {});
        setBackupStatus("备份牌库已导入");
      } catch {
        setBackupStatus("导入失败，请确认备份文件格式正确");
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => {
      setBackupStatus("导入失败，请重新选择文件");
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function extractDraftStore(value: unknown): CardDraftStore {
    if (!value || typeof value !== "object") {
      return {};
    }

    if ("drafts" in value && value.drafts && typeof value.drafts === "object") {
      return value.drafts as CardDraftStore;
    }

    return value as CardDraftStore;
  }

  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Card Library</p>
          <h1>卡牌库</h1>
        </div>
        <div className="page-actions">
          <ButtonLink className="header-action" href="/" variant="secondary">
            回到首页
          </ButtonLink>
          <Button className="header-action" onClick={handleExportBackup} variant="secondary">
            导出牌组
          </Button>
          <Button className="header-action" onClick={handleImportClick}>
            导入牌组
          </Button>
          <input ref={fileInputRef} accept="application/json" className="sr-only" onChange={handleImportBackup} type="file" />
        </div>
      </header>
      {backupStatus ? <p className="field-note page-status">{backupStatus}</p> : null}

      <section className="library-layout">
        <Card as="section" className="library-main">
          <div className="filters">
            <input placeholder="搜索卡牌名称、标签或说明" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select aria-label="卡牌类型" value={type} onChange={(event) => setType(event.target.value)}>
              <option>{ALL_TYPES}</option>
              <option>功能卡</option>
              <option>事件卡</option>
              <option>技能卡</option>
            </select>
            <select aria-label="卡牌状态">
              <option>全部状态</option>
              <option>启用</option>
            </select>
            <Button className="filters__create" onClick={handleCreateCard}>
              添加卡牌
            </Button>
          </div>
          <div className="card-table">
            {filteredRows.map((row) => (
              <div className={`table-row ${selectedCard === row.id ? "is-selected" : ""}`} key={row.id}>
                <button className="table-row__main" onClick={() => setSelectedCard(row.id)} type="button">
                  <span>◆</span>
                  <strong>{row.name}</strong>
                  <em>{row.type}</em>
                  <small>{row.tags}</small>
                  <b>{row.enabled ? "启用" : "停用"}</b>
                </button>
                <div className="table-row__actions">
                  <Link className="table-row__link" href={`/cards/editor?id=${row.id}`}>
                    编辑
                  </Link>
                  <button className="table-row__link is-danger" onClick={() => handleDelete(row.id, row.name)} type="button">
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card as="aside" className="detail-drawer">
          {activeCard ? (
            <>
              <p className="game-label">卡牌详情</p>
              <div className="feature-card static-card detail-preview-card">
                <strong>{activeCard.name}</strong>
                <span>{activeCard.type}</span>
                <CardArtwork alt={`${activeCard.name} 卡牌图面`} src={activeCard.artwork} />
                <p className="detail-preview-card__description">{activeCard.detail}</p>
              </div>
              <dl>
                <dt>状态</dt>
                <dd>{activeCard.enabled ? "启用中" : "未启用"}</dd>
              </dl>
            </>
          ) : (
            <>
              <p className="game-label">空状态</p>
              <p>当前没有可显示的卡牌。你可以通过上方“添加卡牌”按钮新增一张卡。</p>
            </>
          )}
        </Card>
      </section>
    </main>
  );
}
