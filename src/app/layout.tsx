import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { divisions } from '@/lib/divisions';

export const metadata = {
  title: 'AutoBots Intelligence Scaffold v4',
  description: 'Multi-division public-signal dashboard scaffold with DB wiring hooks and operator controls',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">AutoBots Research Grid</div>
            <nav>
              <Link href="/" className="navLink">Home</Link>
              {divisions.map((division) => (
                <Link key={division.slug} href={`/${division.slug}`} className="navLink">
                  {division.name}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="mainContent">{children}</main>
        </div>
      </body>
    </html>
  );
}
