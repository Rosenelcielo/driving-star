import { ButtonLink } from "../components/Button";

export default function ReportsPage() {
  return (
    <main className="empty-page">
      <div className="empty-planet" aria-hidden="true" />
      <p className="game-label">Report Archive</p>
      <h1>还没有发现你的驾驶星球</h1>
      <p>完成一次座舱旅途后，报告会在这里出现。现在可以直接启程。</p>
      <div className="hero-actions">
        <ButtonLink href="/journey/setup">开始旅途</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          返回首页
        </ButtonLink>
      </div>
    </main>
  );
}
