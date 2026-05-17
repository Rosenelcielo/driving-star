# Next Migration Template

用于把静态页面迁移到 Next.js App Router 时快速起步，覆盖三类常见坑：

- PowerShell 中文显示乱码：先运行 `scripts/use-utf8.ps1`。
- Next 基础工程配置：复制本模板根目录文件到目标项目。
- 新版 Next/ESLint：使用 `eslint .`，不要使用旧的 `next lint`。

## 使用方式

在目标项目目录中复制模板文件后执行：

```powershell
.\scripts\use-utf8.ps1
npm install
npm run dev
```

如果默认 npm registry 超时，可先设置镜像：

```powershell
npm config set registry https://registry.npmmirror.com
```

## 文件说明

- `package.json`：Next、React、TypeScript、ESLint 依赖和脚本。
- `app/layout.tsx`：App Router 根布局。
- `app/page.tsx`：迁移入口页面占位。
- `app/globals.css`：全局样式入口。
- `eslint.config.mjs`：ESLint 9 flat config，兼容 Next 新版本。
- `scripts/use-utf8.ps1`：当前 PowerShell 会话切到 UTF-8 输出。
