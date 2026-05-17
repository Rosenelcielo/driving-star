import { ButtonLink } from "../../components/Button";

export default function JumpPage() {
  return (
    <main className="jump-page">
      <div className="jump-orb" aria-hidden="true" />
      <div className="jump-track">
        <span />
      </div>
      <div className="jump-orb target" aria-hidden="true" />
      <h1>正在跃迁到下一颗星球</h1>
      <p>航线同步中，智能座舱偏好能量已写入旅途日志。</p>
      <div className="hero-actions">
        <ButtonLink href="/journey/play" variant="secondary">
          进入下一节点
        </ButtonLink>
        <ButtonLink href="/result/reveal">完成旅途演示</ButtonLink>
      </div>
    </main>
  );
}
