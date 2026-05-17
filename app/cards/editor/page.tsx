import { ButtonLink } from "../../components/Button";
import { Card } from "../../components/Card";

export default function CardEditorPage() {
  return (
    <main className="app-page">
      <header className="page-header">
        <div>
          <p className="game-label">Card Editor</p>
          <h1>编辑卡牌</h1>
        </div>
        <ButtonLink href="/cards" variant="secondary">
          返回卡牌库
        </ButtonLink>
      </header>

      <section className="editor-grid">
        <Card as="section" className="edit-form">
          <label>
            卡牌类型
            <select defaultValue="功能卡">
              <option>功能卡</option>
              <option>事件卡</option>
              <option>技能卡</option>
            </select>
          </label>
          <label>
            卡牌名称
            <input defaultValue="智能泊车辅助" />
          </label>
          <label>
            卡牌描述
            <textarea defaultValue="在复杂停车场景中主动规划路线，减少操作负担。" />
          </label>
          <label>
            标签
            <input defaultValue="智能，便捷，安全" />
          </label>
          <div className="score-grid">
            <label>
              安全
              <input defaultValue="1" max="2" min="-2" type="range" />
            </label>
            <label>
              便捷
              <input defaultValue="2" max="2" min="-2" type="range" />
            </label>
            <label>
              智能
              <input defaultValue="1" max="2" min="-2" type="range" />
            </label>
          </div>
          <label>
            产品能力类目
            <input defaultValue="语音与交互 / 设备互联与生态扩展" />
          </label>
          <label className="toggle-label">
            <input defaultChecked type="checkbox" /> 启用卡牌
          </label>
          <div className="form-actions">
            <ButtonLink href="/cards" variant="secondary">
              取消
            </ButtonLink>
            <ButtonLink href="/cards">保存</ButtonLink>
          </div>
        </Card>

        <Card as="aside" className="live-preview">
          <p className="game-label">实时预览</p>
          <div className="feature-card static-card preview-large">
            <span>功能卡</span>
            <strong>智能泊车辅助</strong>
            <small>安全 +1 · 便捷 +2 · 智能 +1</small>
          </div>
        </Card>
      </section>
    </main>
  );
}
