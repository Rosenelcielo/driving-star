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

const ALL_TYPES = "ȫ������";

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
    const confirmed = window.confirm(`ȷ��Ҫɾ����${cardName}����ɾ��������ӵ�ǰ���ƿ���ͼ�����ء�`);
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
    setBackupStatus("��������ѵ���");
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
        setBackupStatus("��������ѵ���");
      } catch {
        setBackupStatus("����ʧ�ܣ���ȷ�ϱ����ļ���ʽ��ȷ");
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => {
      setBackupStatus("����ʧ�ܣ�������ѡ���ļ�");
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
          <h1>���ƿ�</h1>
        </div>
        <div className="page-actions">
          <ButtonLink className="header-action" href="/" variant="secondary">
            �ص���ҳ
          </ButtonLink>
          <Button className="header-action" onClick={handleExportBackup} variant="secondary">
            ��������
          </Button>
          <Button className="header-action" onClick={handleImportClick}>
            ��������
          </Button>
          <input ref={fileInputRef} accept="application/json" className="sr-only" onChange={handleImportBackup} type="file" />
        </div>
      </header>
      {backupStatus ? <p className="field-note page-status">{backupStatus}</p> : null}

      <section className="library-layout">
        <Card as="section" className="library-main">
          <div className="filters">
            <input placeholder="�����������ơ���ǩ��˵��" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select aria-label="��������" value={type} onChange={(event) => setType(event.target.value)}>
              <option>{ALL_TYPES}</option>
              <option>���ܿ�</option>
              <option>�¼���</option>
              <option>���ܿ�</option>
            </select>
            <select aria-label="����״̬">
              <option>ȫ��״̬</option>
              <option>����</option>
            </select>
            <Button className="filters__create" onClick={handleCreateCard}>
              ��ӿ���
            </Button>
          </div>
          <div className="card-table">
            {filteredRows.map((row) => (
              <div className={`table-row ${selectedCard === row.id ? "is-selected" : ""}`} key={row.id}>
                <button className="table-row__main" onClick={() => setSelectedCard(row.id)} type="button">
                  <span>��</span>
                  <strong>{row.name}</strong>
                  <em>{row.type}</em>
                  <small>{row.tags}</small>
                  <b>{row.enabled ? "����" : "ͣ��"}</b>
                </button>
                <div className="table-row__actions">
                  <Link className="table-row__link" href={`/cards/editor?id=${row.id}`}>
                    �༭
                  </Link>
                  <button className="table-row__link is-danger" onClick={() => handleDelete(row.id, row.name)} type="button">
                    ɾ��
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card as="aside" className="detail-drawer">
          {activeCard ? (
            <>
              <p className="game-label">��������</p>
              <div className="feature-card static-card detail-preview-card">
                <strong>{activeCard.name}</strong>
                <span>{activeCard.type}</span>
                <CardArtwork alt={`${activeCard.name} ����ͼ��`} src={activeCard.artwork} />
                <p className="detail-preview-card__description">{activeCard.detail}</p>
              </div>
              <dl>
                <dt>״̬</dt>
                <dd>{activeCard.enabled ? "������" : "δ����"}</dd>
              </dl>
            </>
          ) : (
            <>
              <p className="game-label">��������</p>
              <p>��ǰû�п���ʾ�Ŀ��ơ������ͨ���Ϸ�����ӿ��ơ���ť����һ�ſ���</p>
            </>
          )}
        </Card>
      </section>
    </main>
  );
}

