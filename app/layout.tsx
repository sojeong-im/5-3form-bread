import type { Metadata } from "next";
import { Jua } from 'next/font/google';
import "./globals.css";

const jua = Jua({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jua',
});

export const metadata: Metadata = {
  title: "빵실빵실 신입 부원 신청폼",
  description: "빵을 사랑하는 사람들의 모임, 빵실빵실의 신입 부원 신청폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable}`}>
      <body className="antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
