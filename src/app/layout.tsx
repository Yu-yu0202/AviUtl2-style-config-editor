import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import '@radix-ui/themes/styles.css';
import RadixThemeProvider from './components/RadixThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AviUtl2 Style.conf Editor',
  description: 'Aviutl2 Style.conf Editor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <RadixThemeProvider asChild>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${notoSansJP.className} antialiased`}
        >
          <LanguageProvider>{children}</LanguageProvider>
        </body>
      </RadixThemeProvider>
    </html>
  );
}
