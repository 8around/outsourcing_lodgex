import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lodgex - 호텔 위탁운영 & 컨설팅',
    template: '%s | Lodgex',
  },
  description:
    '프리미엄 호텔 위탁운영 및 전문 컨설팅 서비스를 통해 호텔의 가치를 극대화합니다.',
  keywords: [
    '호텔 위탁운영',
    '호텔 컨설팅',
    '호텔 매니지먼트',
    '호텔 경영',
    '숙박업 컨설팅',
  ],
  authors: [{ name: 'Lodgex' }],
  creator: 'Lodgex',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://lodgex.co.kr',
    title: 'Lodgex - 호텔 위탁운영 & 컨설팅',
    description:
      '프리미엄 호텔 위탁운영 및 전문 컨설팅 서비스를 통해 호텔의 가치를 극대화합니다.',
    siteName: 'Lodgex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lodgex - 호텔 위탁운영 & 컨설팅',
    description:
      '프리미엄 호텔 위탁운영 및 전문 컨설팅 서비스를 통해 호텔의 가치를 극대화합니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable}`}>
      <head>
        {/* Font preloads for performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1C2A44" />
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lodgex" />
        {/* Microsoft specific meta tags */}
        <meta name="msapplication-TileColor" content="#1C2A44" />
        <meta name="msapplication-config" content="none" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
