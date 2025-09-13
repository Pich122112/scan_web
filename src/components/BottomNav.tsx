'use client';

import { useState } from 'react';
import { RiQrScanFill } from 'react-icons/ri';
import { FaHome, FaFacebookMessenger, FaTimes } from 'react-icons/fa';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CodeValidator } from '@/utils/codeValidator';
import SpinWheelModal from './SpinWheelModal';

interface IDetectedBarcode {
  rawValue: string;
}

export interface PrizeData {
  issuer: string;
  amount: number;
  wallet_id: number;
  wallet_name: string;
  new_amount: number;
  label: string; // Add this line

}

type BottomNavProps = {
  onPrizeWin?: () => void;
};

export default function BottomNav({ onPrizeWin }: BottomNavProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PrizeData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showWheel, setShowWheel] = useState(false);

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
      setErrorMsg('❌ This is not our code format.');
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
      const response = await fetch('https://redeemapi.piikmall.com/api/v2/redeem/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem('userAuthToken') || ''}`,
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
      <div className="bottom-0 left-0 w-full z-40 mt-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative flex items-center justify-between bg-orange-500 rounded-full px-4 sm:px-6 py-4 shadow-lg w-full">
            <button className="flex items-center gap-2 bg-black text-white border border-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <FaHome className="text-base" />
              Home
            </button>
            <button className="flex items-center gap-2 text-white border border-white px-3 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <FaFacebookMessenger className="text-base" />
              Contact
            </button>
            <div className="absolute bg-orange-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setIsScanning(true)}
                className="bg-orange p-4 rounded-full border-4 border-white shadow-xl hover:scale-105 transition"
              >
                <RiQrScanFill className="text-white text-5xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <button
            onClick={() => setIsScanning(false)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-50"
          >
            <FaTimes className="text-2xl" />
          </button>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{ facingMode: { ideal: 'environment' } }}
            styles={{
              container: { width: '100%', height: '100%' },
              video: { objectFit: 'cover', width: '100%', height: '100%' },
            }}
          />
        </div>
      )}

      {/* Error notification */}
      {errorMsg && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <p>{errorMsg}</p>
          <button
            className="mt-2 underline"
            onClick={() => setErrorMsg(null)}
          >
            Close
          </button>
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

//Correct with 197 line code changes
