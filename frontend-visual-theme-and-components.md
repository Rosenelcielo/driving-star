# 前端统一视觉风格主题与组件模板

本文档用于封装黑白极简、扁平化、手绘感游戏 UI 的全局主题与基础组件模板。目标是让项目后续可以批量替换硬编码样式，并统一使用 `Button`、`Card`、`ProgressBar` 三类基础组件。

## 1. 视觉原则

- 色彩只使用黑、白、浅灰、深灰强调色。
- 禁止使用渐变、阴影、浮雕、复杂纹理和多彩装饰。
- 所有文本、边框、图标默认使用纯黑色。
- 背景和卡片填充默认使用纯白色。
- 图标与插画统一使用 2-3px 黑色粗线条。
- 组件圆角保持 8-12px，按钮高度保持 40-50px。
- 文本居中对齐，按钮文字加粗，标题层级清晰。

## 2. 全局 CSS 变量

建议放入 `app/globals.css` 的 `:root` 中，后续所有组件样式只引用变量，不直接写硬编码颜色、圆角或间距。

```css
:root {
  color-scheme: light;

  /* Colors */
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-100: #f4f4f4;
  --color-gray-200: #e8e8e8;
  --color-gray-300: #d6d6d6;
  --color-gray-700: #333333;
  --color-accent: #222222;

  /* Semantic colors */
  --color-bg: var(--color-white);
  --color-surface: var(--color-white);
  --color-text: var(--color-black);
  --color-border: var(--color-black);
  --color-muted: var(--color-gray-700);
  --color-progress-track: var(--color-gray-100);
  --color-progress-fill: var(--color-accent);

  /* Typography */
  --font-game-ui: "Poppins", "Montserrat", "Roboto", "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;
  --font-size-character-name: 24px;
  --font-size-title: 20px;
  --font-size-subtitle: 16px;
  --font-size-body: 14px;
  --font-size-button: 16px;
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --letter-spacing-readable: 0.02em;

  /* Spacing */
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;

  /* Shape and stroke */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-round: 999px;
  --stroke-width: 2px;
  --stroke-width-strong: 3px;

  /* Components */
  --button-height: 44px;
  --icon-button-size: 44px;
  --progress-height: 12px;
  --card-padding: var(--space-5);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-game-ui);
  letter-spacing: var(--letter-spacing-readable);
}

button,
input,
select,
textarea {
  font: inherit;
}
```

## 3. 基础 CSS 类

这些类可以直接作为组件样式，也可以迁移到 CSS Modules。

```css
.game-button {
  min-height: var(--button-height);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-5);
  border: var(--stroke-width) solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-black);
  color: var(--color-white);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  text-align: center;
  cursor: pointer;
}

.game-button:hover {
  background: var(--color-gray-700);
}

.game-button:active {
  background: var(--color-accent);
}

.game-button:focus-visible {
  outline: var(--stroke-width) solid var(--color-black);
  outline-offset: 3px;
}

.game-button--secondary {
  background: var(--color-white);
  color: var(--color-black);
}

.game-button--secondary:hover {
  background: var(--color-gray-100);
}

.game-button--icon {
  width: var(--icon-button-size);
  height: var(--icon-button-size);
  min-height: var(--icon-button-size);
  padding: 0;
  border-radius: var(--radius-round);
  background: var(--color-white);
  color: var(--color-black);
}

.game-card {
  padding: var(--card-padding);
  border: var(--stroke-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: center;
}

.game-card--clickable {
  cursor: pointer;
}

.game-card--clickable:hover,
.game-card--selected {
  border-width: var(--stroke-width-strong);
}

.game-progress {
  width: 100%;
}

.game-progress__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
}

.game-progress__track {
  width: 100%;
  height: var(--progress-height);
  overflow: hidden;
  border: var(--stroke-width) solid var(--color-border);
  border-radius: var(--radius-round);
  background: var(--color-progress-track);
}

.game-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-progress-fill);
}
```

## 4. 可选 SCSS 主题模板

当前项目未安装 Sass，因此 CSS Variables 是默认方案。如果后续引入 SCSS，可使用下面的主题 map 与 mixin。

```scss
$game-theme: (
  color-black: #000000,
  color-white: #ffffff,
  color-gray-100: #f4f4f4,
  color-gray-300: #d6d6d6,
  color-accent: #222222,
  font-game-ui: ("Poppins", "Montserrat", "Roboto", "Microsoft YaHei", "PingFang SC", system-ui, sans-serif),
  radius-md: 10px,
  radius-lg: 12px,
  stroke-width: 2px,
  button-height: 44px,
  progress-height: 12px,
);

@mixin game-card {
  padding: 20px;
  border: map-get($game-theme, stroke-width) solid map-get($game-theme, color-black);
  border-radius: map-get($game-theme, radius-lg);
  background: map-get($game-theme, color-white);
  color: map-get($game-theme, color-black);
  text-align: center;
}

@mixin game-button($variant: primary) {
  min-height: map-get($game-theme, button-height);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: map-get($game-theme, stroke-width) solid map-get($game-theme, color-black);
  border-radius: map-get($game-theme, radius-md);
  font-weight: 700;
  cursor: pointer;

  @if $variant == primary {
    background: map-get($game-theme, color-black);
    color: map-get($game-theme, color-white);
  }

  @if $variant == secondary {
    background: map-get($game-theme, color-white);
    color: map-get($game-theme, color-black);
  }
}

@mixin game-progress {
  overflow: hidden;
  height: map-get($game-theme, progress-height);
  border: map-get($game-theme, stroke-width) solid map-get($game-theme, color-black);
  border-radius: 999px;
  background: map-get($game-theme, color-gray-100);
}
```

## 5. React / Next.js 组件模板

### Button

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({ className = "", variant = "primary", icon, children, ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "" : `game-button--${variant}`;

  return (
    <button className={["game-button", variantClass, className].filter(Boolean).join(" ")} type="button" {...props}>
      {icon}
      {variant !== "icon" ? children : <span className="sr-only">{children}</span>}
    </button>
  );
}
```

### Card

```tsx
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  selected?: boolean;
  clickable?: boolean;
  children: ReactNode;
};

export function Card({ as: Component = "article", className = "", selected = false, clickable = false, children, ...props }: CardProps) {
  const classes = [
    "game-card",
    clickable ? "game-card--clickable" : "",
    selected ? "game-card--selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
```

### ProgressBar

```tsx
type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
};

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  return (
    <div className="game-progress">
      {label ? (
        <div className="game-progress__header">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div className="game-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={value}>
        <div className="game-progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
```

## 6. 使用约定

- 新增按钮必须使用 `Button`，不再新增 `.primary-button`、`.secondary-button` 这类零散按钮类。
- 新增卡片必须使用 `Card`，选中态通过 `selected` 控制。
- 新增进度条必须使用 `ProgressBar`，不得直接手写 `div` 宽度逻辑。
- 批量替换硬编码样式时，优先替换颜色、边框、圆角、间距、按钮高度。
- 图标按钮使用 `variant="icon"`，图标本身保持黑色 2-3px 线条。
- 如果需要强调状态，优先使用边框粗细或深灰填充，不引入彩色高亮。

## 7. 批量迁移建议

1. 将 `:root` 变量加入全局样式。
2. 将按钮相关类统一替换为 `Button` 或 `.game-button`。
3. 将面板、功能卡、预览卡统一替换为 `Card` 或 `.game-card`。
4. 将仪表、分数、经验等条形展示统一替换为 `ProgressBar`。
5. 删除渐变、阴影、发光、复杂背景和多色主题类。
6. 最后进行移动端检查，确保按钮文字、卡片标题和进度条标签不溢出。
