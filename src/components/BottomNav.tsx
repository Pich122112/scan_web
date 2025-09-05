'use client';

import { useState } from 'react';
import { RiQrScanFill } from 'react-icons/ri';
import { FaHome, FaFacebookMessenger, FaTimes } from 'react-icons/fa';
import { Scanner } from '@yudiel/react-qr-scanner';

// Define the type for detected barcodes
interface IDetectedBarcode {
  rawValue: string;
  // Add other properties if needed
}

export default function FloatingActionButton() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setScanResult(result);
      setIsScanning(false);

      // You can handle the scanned result here
      console.log('Scanned QR code:', result);

      // For example, you might want to navigate to a URL or process the data
      if (result.startsWith('http')) {
        window.open(result, '_blank');
      }

      // Reset after a delay
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  const handleError = (error: unknown) => {
    console.error('QR Scanner error:', error);
  };

  return (
    <>
      <div className="bottom-0 left-0 w-full z-40 mt-5">
        <div className="max-w-[1200px] mx-auto">
          {/* Main Orange Bar */}
          <div className="relative flex items-center justify-between bg-orange-500 rounded-full px-4 sm:px-6 py-4 shadow-lg w-full">

            {/* Home Button */}
            <button className="flex items-center gap-2 bg-black text-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <FaHome className="text-base" />
              Home
            </button>

            {/* Contact Button */}
            <button className="flex items-center gap-2 text-white border border-white px-3 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <FaFacebookMessenger className="text-base" />
              Contact
            </button>

            {/* Center Floating Button */}
            <div className="absolute bg-orange-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setIsScanning(true)}
                className="bg-orange p-4 rounded-full border-4 border-white shadow-xl drop-shadow-2xl hover:scale-105 transition"
              >
                <RiQrScanFill className="text-white text-5xl" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Scan QR Code</h2>
              <button
                onClick={() => setIsScanning(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="relative">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}   // ✅ move constraints here
                styles={{
                  container: {
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  },
                }}
              />


              {/* Scanner frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-orange-500 rounded-lg w-64 h-64 flex items-center justify-center">
                  <div className="animate-pulse border border-white w-60 h-60"></div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-4">
              Point your camera at a QR code
            </p>
          </div>
        </div>
      )}

      {/* Scan Result Notification */}
      {scanResult && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <p className="font-semibold">QR Code Scanned Successfully!</p>
          <p className="text-sm mt-1 truncate">{scanResult}</p>
        </div>
      )}
    </>
  );
}

//Correct with 130 line code changes
