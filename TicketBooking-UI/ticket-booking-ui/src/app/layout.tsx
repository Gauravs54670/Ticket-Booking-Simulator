import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ticket Booking Simulator — Concurrent Booking Engine',
  description:
    'A real-time concurrent ticket booking simulator built with Spring Boot and Next.js. Visualize multi-threaded seat booking with live seat maps, console logs, and performance KPIs.',
  keywords: ['ticket booking', 'concurrent', 'simulator', 'spring boot', 'next.js'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
