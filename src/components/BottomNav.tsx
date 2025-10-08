'use client';

import { useState } from 'react';
import { RiQrScanFill } from 'react-icons/ri';
import { FaHome, FaFacebookMessenger, FaTimes, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CodeValidator } from '@/utils/codeValidator';
import SpinWheelModal from './SpinWheelModal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { div } from 'framer-motion/m';

interface IDetectedBarcode {
  rawValue: string;
}

export interface PrizeData {
  issuer: string;
  amount: number;
  wallet_id: number;
  wallet_name: string;
  new_amount: number;
  label: string;

}

type BottomNavProps = {
  onPrizeWin?: () => void;
};

export default function BottomNav({ onPrizeWin }: BottomNavProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PrizeData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showWheel, setShowWheel] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Use the FULL code as the "used" key!
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const result = detectedCodes[0].rawValue.trim();

    // Extract code from URL or direct string
    let codeWithSuffix = result;
    if (result.includes('/t/')) {
      const urlParts = result.split('/t/');
      codeWithSuffix = urlParts.length > 1 ? urlParts[1] : result;
    }
    // Get just the code part (before comma if any)
    const codePart = codeWithSuffix.split(',')[0].trim();

    // 1️⃣ Validate format and signature
    if (!CodeValidator.isValidCode(codePart)) {
      setErrorMsg('Incorrect QR !');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    // 2️⃣ Extract the NATURAL CODE (11 chars)
    const naturalCode = codePart.substring(0, 11);
    console.log('🟡 [DEBUG] Code sent to backend:', codePart); // Now full code
    console.log('🟢 [DEBUG] Full code part:', codePart);
    console.log('🟢 [DEBUG] Natural code:', naturalCode);
    console.log('🟢 [DEBUG] Signature:', codePart.substring(11));

    // Use full codePart for used check!
    if (usedCodes.has(codePart)) {
      setErrorMsg('⚠️ Code already redeemed.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    // 4️⃣ Redeem API call: send FULL codePart!
    try {
      const response = await fetch('https://api.sandbox.gzb.app/api/v2/redeem/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem('userAuthToken') || ''}`,
          'X-App-Package': 'com.ganzberg.scanprizefront'
        },
        body: new URLSearchParams({ code: codePart }),
      });

      interface ApiResponse {
        success: boolean;
        message: string;
        data: PrizeData | [];
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        // Generate label if not provided by API
        const prizeData = data.data;
        if (!prizeData.label) {
          prizeData.label = prizeData.wallet_name === "GB"
            ? `${prizeData.amount} Score`
            : prizeData.wallet_name === "D"
              ? `${prizeData.amount} D`
              : `${prizeData.amount} ${prizeData.wallet_name}`;
        }
        // Use full codePart for used check!
        setUsedCodes(prev => new Set(prev).add(codePart));
        setScanResult(data.data);
        setShowWheel(true);
      } else {
        setErrorMsg(data.message || '❌ Invalid or already redeemed code.');
        setTimeout(() => setErrorMsg(null), 3000);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrorMsg('❌ Network error. Try again.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleError = (error: unknown) => {
    console.error('QR Scanner error:', error);
  };

  const handleWheelClose = () => {
    setShowWheel(false);
    setScanResult(null);
    if (onPrizeWin) onPrizeWin(); // <-- Refresh wallet after prize
  };

  return (
    <>
      {/* Bottom bar with floating button */}
      <div className="bottom-0 left-0 w-full z-40 mt-5 border border-4 border-white rounded-full shadow-lg">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative flex items-center justify-between bg-orange-500 rounded-full px-4 sm:px-6 py-4 shadow-lg w-full">
            <button className="flex items-center gap-2 bg-black text-white border border-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <FaHome className="text-base" />
              Home
            </button>
            <button
              className="flex items-center gap-2 text-white border border-white px-3 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md"
              onClick={() => setIsContactOpen(true)}
            >
              <FaFacebookMessenger className="text-base" />
              Contact
            </button>

            <div className="absolute bg-orange-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setIsScanning(true)}
                className="bg-orange p-5 rounded-full border-4 border-white shadow-xl hover:scale-105 transition"
              >
                <RiQrScanFill className="text-white text-5xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Error message at top */}
          {errorMsg && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600/95 text-white flex items-center justify-between px-4 py-3 rounded-lg shadow-lg z-50 max-w-md md:max-w-sm space-x-3 animate-slide-down">
              {/* Error text */}
              <span className="flex-1 text-4lg font-medium">{errorMsg}</span>
            </div>
          )}


          {/* Close button */}
          <button
            onClick={() => setIsScanning(false)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-50 hover:bg-yellow-500/80 transition"
          >
            <FaTimes className="text-2xl" />
          </button>

          {/* 🔦 Flash toggle button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
            <button
              onClick={() => setTorchOn((prev) => !prev)}
              className={`flex flex-col items-center justify-center p-4 rounded-full transition-all duration-200 shadow-lg  ${torchOn
                ? 'bg-yellow-400 text-white shadow-yellow-500/50'
                : 'bg-black/60 text-white hover:bg-yellow-500 hover:text-black'
                }`}
            >
              {/* Flash icon */}
              <span className="text-3xl">🔦</span>
              {/* Label */}
              <span className="text-xs mt-1 font-semibold">
                {torchOn ? 'Flash ON' : 'Flash OFF'}
              </span>
            </button>
          </div>

          {/* Full-screen scanner */}
          <div className="absolute inset-0">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={
                {
                  facingMode: { ideal: 'environment' },
                  ...(torchOn ? { advanced: [{ torch: true }] } : {}),
                } as MediaTrackConstraints // 👈 Fix the type error
              }
              components={{
                finder: false,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                tracker: (_detectedCodes: unknown[], _ctx: CanvasRenderingContext2D) => { },
              }}
              styles={{
                container: { width: '100%', height: '100%' },
                video: { objectFit: 'cover', width: '100%', height: '100%' },
              }}
            />

          </div>

          {/* Small centered scanning frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[200px] h-[200px] md:w-[200px] md:h-[200px]">

              {/* 4 corners with zoom animation */}
              <div className="absolute -left-4 -top-4 w-12 h-12 border-t-6 border-l-6 border-yellow-400 rounded-tl-lg animate-zoom-in-out"></div>
              <div className="absolute -right-4 -top-4 w-12 h-12 border-t-6 border-r-6 border-yellow-400 rounded-tr-lg animate-zoom-in-out"></div>
              <div className="absolute -left-4 -bottom-4 w-12 h-12 border-b-6 border-l-6 border-yellow-400 rounded-bl-lg animate-zoom-in-out"></div>
              <div className="absolute -right-4 -bottom-4 w-12 h-12 border-b-6 border-r-6 border-yellow-400 rounded-br-lg animate-zoom-in-out"></div>

            </div>
          </div>
        </div>
      )}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-white">
          {/* Close button */}
          <button
            onClick={() => setIsContactOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-yellow-500/80 transition"
          >
            <FaTimes className="text-2xl" />
          </button>

          {/* Modal content */}
          <h2 className="text-2xl font-bold mb-8">Contact Us</h2>
          <p className="text-center mb-6 max-w-md">
            You can reach us via Facebook Messenger, Email, or Phone. We are happy to assist you!
          </p>

          {/* Example buttons */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <a
              href="https://m.me/yourpage"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <FaFacebookMessenger className="text-xl" />
              Messenger
            </a>

            <a
              href="mailto:support@example.com"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <FaEnvelope className="text-xl" />
              Email
            </a>

            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <FaPhone className="text-xl" />
              Call
            </a>
          </div>
        </div>
      )}

      {/* Spin wheel modal (Prize) */}
      {showWheel && scanResult && (
        <SpinWheelModal
          onClose={handleWheelClose}
          prize={scanResult}
        />
      )}
    </>
  );
}

//Correct with 246 line code changes
