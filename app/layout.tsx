import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'No Time Coffee',
    template: '%s | No Time Coffee',
  },
  description: 'Great coffee for people who live at full speed. Locations in Amsterdam, Arnhem & Den Haag.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://notimecoffee.nl'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
