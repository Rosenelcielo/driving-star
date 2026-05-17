"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "../components/Button";
import { Card } from "../components/Card";
import { libraryRows } from "../data/game";

export default function CardsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("全部类型");
  const [selectedCard, setSelectedCard] = useState(libraryRows[0].name);

  const filteredRows = useMemo(() => {
    return libraryRows.filter((row) => {
      const matchQuery = `${row.name}${row.type}${row.tags}`.includes(query);
      const matchType = type === "全部类型" || row.type === type;
      return matchQuery && matchType;
    });
  }, [query, type]);

  const activeCard = libraryRows.find((row) => row.name === selectedCard) ?? libraryRows[0];

  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Card Library</p>
          <h1>卡牌库</h1>
        </div>
        <ButtonLink href="/cards/editor">上传卡牌</ButtonLink>
      </header>

      <section className="library-layout">
        <Card as="section" className="library-main">
          <div className="filters">
            <input placeholder="搜索卡牌名称、标签或能力类目" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select aria-label="卡牌类型" value={type} onChange={(event) => setType(event.target.value)}>
              <option>全部类型</option>
              <option>功能卡</option>
              <option>事件卡</option>
              <option>技能卡</option>
            </select>
            <select aria-label="标签">
              <option>全部标签</option>
              <option>安全</option>
              <option>便捷</option>
              <option>智能</option>
            </select>
            <select aria-label="状态">
              <option>全部状态</option>
              <option>启用</option>
              <option>停用</option>
            </select>
          </div>
          <div className="card-table">
            {filteredRows.map((row) => (
              <button className={`table-row ${selectedCard === row.name ? "is-selected" : ""}`} key={row.name} onClick={() => setSelectedCard(row.name)} type="button">
                <span>☆</span>
                <strong>{row.name}</strong>
                <em>{row.type}</em>
                <small>{row.tags}</small>
                <b className={row.enabled ? "" : "is-muted"}>{row.enabled ? "启用" : "停用"}</b>
              </button>
            ))}
          </div>
        </Card>

        <Card as="aside" className="detail-drawer">
          <p className="game-label">卡牌详情</p>
          <div className="feature-card static-card">
            <span>{activeCard.type}</span>
            <strong>{activeCard.name}</strong>
            <small>{activeCard.tags} · 安全 +1 · 便捷 +2</small>
          </div>
          <dl>
            <dt>产品能力</dt>
            <dd>语音与交互 / 设备互联</dd>
            <dt>二级功能点</dt>
            <dd>自动泊车、路线记忆、远程召唤</dd>
            <dt>状态</dt>
            <dd>{activeCard.enabled ? "启用" : "停用"}</dd>
          </dl>
          <ButtonLink href="/cards/editor" variant="secondary">
            编辑卡牌
          </ButtonLink>
        </Card>
      </section>
    </main>
  );
}
