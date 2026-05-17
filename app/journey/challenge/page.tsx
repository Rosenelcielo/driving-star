import { ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { challengeLines } from "../../data/game";

export default function ChallengePage() {
  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Minor Planet Challenge</p>
          <h1>小星球挑战：回声星</h1>
        </div>
        <ButtonLink href="/journey/jump">继续旅途</ButtonLink>
      </header>
      <section className="challenge-board">
        <div className="challenge-orb" aria-hidden="true" />
        <Card as="section" className="challenge-list">
          <h2>检测你的当前座舱偏好能量</h2>
          {challengeLines.map((line) => (
            <div className={`challenge-line ${line.achieved ? "is-achieved" : ""}`} key={line.name}>
              <ProgressBar label={line.name} value={line.value} />
              <strong>{line.label}</strong>
            </div>
          ))}
          <div className="reward-strip">本次获得：安全胜利星、娱乐胜利星、智能胜利星</div>
        </Card>
      </section>
    </main>
  );
}
