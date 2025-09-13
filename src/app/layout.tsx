import Navbar from '@/components/Navbar';
import './globals.css';
import { PhoneProvider } from '@/context/PhoneContext';

export const metadata = {
  title: 'ScanPrize Web',
  description: 'Scan QR and earn points',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <PhoneProvider> {/* ✅ Wrap the entire layout */}
          <div className="flex flex-col md:flex-row min-h-screen">
            <div className="flex-1 w-full">
              <Navbar /> {/* ✅ Now inside the context */}
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

//Correct with 33 line code changes
