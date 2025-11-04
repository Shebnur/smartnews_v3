// This is app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // <-- MAKE SURE THIS LINE EXISTS

const inter = Inter({ subsets: ['latin'] });

// I have updated this for you
export const metadata: Metadata = {
  title: 'Smart News',
  description: 'Smart News Intelligence System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Your 'page.tsx' file (with the bg-slate-900 class) 
        will be put inside this <body> tag 
      */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}