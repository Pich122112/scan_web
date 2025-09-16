// app/layout.tsx

import './globals.css';
import Navbar from '@/components/Navbar';
import { PhoneProvider } from '@/context/PhoneContext';

export const metadata = {
  title: 'ScanPrize Web',
  description: 'Scan QR and earn points',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km">
      <body className="bg-gray-100 font-khmer">
        <PhoneProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <div className="flex-1 w-full">
              <Navbar />
              <main className="pt-16 md:pt-20 px-4 pb-4 max-w-[1200px] mx-auto">
                {children}
              </main>
            </div>
          </div>
        </PhoneProvider>
      </body>
    </html>
  );
}
