import type { Metadata } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import { AuthGateProvider } from '@/components/AuthGate';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import { AppProvider } from '@/lib/store';
import './globals.css';

const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  title: 'JobMatch — find work that actually fits you',
  description: 'Relevant jobs. Transparent matches. Fresh listings. Less wasted time.',
  icons: { icon: '/brand/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body>
        <AppProvider>
          <ToastProvider>
            <AuthGateProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </AuthGateProvider>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
