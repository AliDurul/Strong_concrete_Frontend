import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import '../styles/tailwind.css';
import '../styles/datatables.css';

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Strong Concrete Admin Dashboard",
  description: "Strong Concrete Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}
