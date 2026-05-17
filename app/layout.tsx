import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能座舱卡牌测试小游戏",
  description: "一场星际旅途感的智能座舱偏好测试小游戏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
