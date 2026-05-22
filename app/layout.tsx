import type { Metadata } from "next";
import { ClickSparkles } from "./components/ClickSparkles";
import { GameProvider } from "./components/GameProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driver Star 驾乘星球计划",
  description: "一个把智能座舱偏好测试做成可玩旅程的在线小游戏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <GameProvider>
          {children}
          <ClickSparkles />
        </GameProvider>
      </body>
    </html>
  );
}

