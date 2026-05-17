import { ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";

export default function ResultRevealPage() {
  return (
    <main className="reveal-page">
      <section className="reveal-stage">
        <div className="driving-planet" aria-hidden="true" />
        <div className="reveal-copy">
          <p className="game-label">旅途结算</p>
          <h1>你的驾驶星球已抵达</h1>
          <h2>蓝弧驾驶星 · 智能效率型</h2>
          <p>
            你倾向于选择能让驾驶更稳定、更少打断、更主动分担操作的智能座舱。你的胜利星后缀是：安全、娱乐、智能。
          </p>
        </div>
      </section>
      <Card as="section" className="broadcast-card">
        <strong>系统播报</strong>
        <p>建议优先关注高阶辅助驾驶、自动泊车联动、语音多轮交互与场景主动建议。</p>
      </Card>
      <div className="hero-actions">
        <ButtonLink href="/result/insights">继续查看完整结果</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          返回首页
        </ButtonLink>
      </div>
    </main>
  );
}
