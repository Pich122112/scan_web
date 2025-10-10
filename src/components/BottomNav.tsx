'use client';

import { useState } from 'react';
import { RiQrScanFill } from 'react-icons/ri';
import { FaHome, FaFacebookMessenger, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';
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
  type?: string;
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
  const [showThankYou, setShowThankYou] = useState(false);


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
      setErrorMsg('⚠️ QR already use.');
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

        // ✅ Handle Thank You separately (always show, ignore usedCodes)
        if (
          data.message?.toLowerCase().includes('thank you') ||
          data.data?.type?.toLowerCase().includes('thank you')
        ) {
          setShowThankYou(true);
          setTimeout(() => setShowThankYou(false), 3000);
          return; // Don't check usedCodes
        }
        // Normal prize flow: prevent multiple use
        if (usedCodes.has(codePart)) {
          setErrorMsg('⚠️ QR already used.');
          setTimeout(() => setErrorMsg(null), 3000);
          return;
        }

        const prizeData = data.data;

        if (!prizeData.label) {
          const wallet = prizeData.wallet_name || '';

          switch (wallet) {
            case 'GB':
            case 'ID':
            case 'BS':
              prizeData.label = `${prizeData.amount} Score (${wallet})`;
              break;
            case 'DM':
              prizeData.label = `${prizeData.amount} Diamond (${wallet})`;
              break;
            case 'D':
              prizeData.label = `${prizeData.amount} D (${wallet})`;
              break;
            default:
              prizeData.label = prizeData.amount
                ? `${prizeData.amount} ${wallet}`.trim()
                : 'Prize';
          }
        }

        setUsedCodes(prev => new Set(prev).add(codePart));
        setScanResult(prizeData);
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
    if (onPrizeWin) onPrizeWin(); 
  };

  return (
    <>
      {/* Bottom bar with floating button */}
      <div className="fixed bottom-0 left-0 w-full z-40 mt-5 mb-4">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="relative flex items-center justify-between 
                 rounded-full px-4 sm:px-6 py-6 w-full
                 bg-white/10 backdrop-blur-2xl border border-white/20 
                 shadow-[0_8px_32px_rgba(255,255,255,0.15)]
                 hover:shadow-[0_8px_48px_rgba(255,255,255,0.25)]
                 transition-all duration-300"
          >
            {/* Left - Home */}
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/30 
                         text-white border border-white/20 px-4 sm:px-6 py-2 
                         rounded-full text-sm font-semibold shadow-md 
                         backdrop-blur-md transition">
              <FaHome className="text-base" />
              Home
            </button>

            {/* Right - Contact */}
            <button
              className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/30 
                   border border-white/20 px-3 sm:px-6 py-2 rounded-full 
                   text-sm font-semibold shadow-md backdrop-blur-md transition"
              onClick={() => setIsContactOpen(true)}
            >
              <FaFacebookMessenger className="text-base" />
              Contact
            </button>

            {/* Center Floating Glassy QR Button */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   rounded-full bg-gradient-to-br from-orange-400/60 via-pink-500/40 to-purple-500/50
                   p-[3px] shadow-[0_8px_24px_rgba(255,255,255,0.2)] backdrop-blur-xl"
            >
              <button
                onClick={() => setIsScanning(true)}
                className="bg-white/20 hover:bg-white/40 rounded-full border border-white/30
                     p-5 shadow-[0_8px_20px_rgba(251,96,0,0.3)] transition-transform
                     duration-300 hover:scale-105 backdrop-blur-2xl"
              >
                <RiQrScanFill className="text-white text-5xl drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)]" />
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
            <div className="fixed top-4 left-0 w-full px-4 z-50 mt-14">
              <div className="bg-red-600/95 text-white flex items-center justify-center px-6 py-4 rounded-lg shadow-lg animate-slide-down space-x-2">
                {errorMsg === 'Incorrect QR !' && (
                  <FaTimes className="text-white text-xl" />
                )}
                <span className="text-lg font-medium">{errorMsg}</span>
              </div>
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
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={() => setShowThankYou(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full h-[250px] text-center flex flex-col items-center justify-center space-y-4 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl">🙏</div>
            <div className="text-orange-500 font-bold text-4xl">Thank You !</div>
          </div>
        </div>
      )}

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-500/30 via-rose-300/20 to-yellow-300/30 backdrop-blur-md">
          {/* Glassy modal container */}
          <div className="relative w-[90%] max-w-md bg-white/10 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-8 text-center text-white">
            {/* Close button */}
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            >
              <FaTimes className="text-xl" />
            </button>


            {/* Title */}
            <h2 className="text-2xl font-bold mb-3 tracking-wide drop-shadow-sm">
              Contact Us
            </h2>
            <p className="text-white/80 mb-8 text-sm leading-relaxed">
              Reach us via Messenger, Email, or Phone — we’re happy to assist you!
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <a
                href="https://m.me/yourpage"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-full font-semibold transition backdrop-blur-md"
              >
                <FaFacebookMessenger className="text-xl" />
                Messenger
              </a>

              <a
                href="mailto:support@example.com"
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-full font-semibold transition backdrop-blur-md"
              >
                <FaEnvelope className="text-xl" />
                Email
              </a>

              <a
                href="tel:+1234567890"
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-full font-semibold transition backdrop-blur-md"
              >
                <FaPhone className="text-xl" />
                Call
              </a>
            </div>
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

//Correct with 368 line code changes
