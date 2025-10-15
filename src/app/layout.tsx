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
    default: 'Lodgense - 숙박업 위탁운영 & 컨설팅',
    template: '%s | Lodgense',
  },
  description:
    '숙박업 위탁운영 및 전문 컨설팅 서비스를 통해 숙박업의 가치를 극대화합니다.',
  keywords: [
    '숙박업 위탁운영',
    '숙박업 컨설팅',
    '숙박업 매니지먼트',
    '숙박업 경영',
    '숙박업 컨설팅',
  ],
  authors: [{ name: 'Lodgense' }],
  creator: 'Lodgense',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://lodgense.com',
    title: 'Lodgense - 숙박업 위탁운영 & 컨설팅',
    description:
      '숙박업 위탁운영 및 전문 컨설팅 서비스를 통해 숙박업의 가치를 극대화합니다.',
    siteName: 'Lodgense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lodgense - 숙박업 위탁운영 & 컨설팅',
    description:
      '숙박업 위탁운영 및 전문 컨설팅 서비스를 통해 숙박업의 가치를 극대화합니다.',
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
        <meta name="apple-mobile-web-app-title" content="Lodgense" />
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
