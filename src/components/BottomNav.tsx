'use client';

import { RiQrScanFill } from 'react-icons/ri';
import { FaHome } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';

export default function FloatingActionButton() {
  return (
    <div className=" bottom-0 left-0 w-full z-50 mt-5">
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
            <button className="bg-orange p-4 rounded-full border-4 border-white shadow-xl drop-shadow-2xl hover:scale-105 transition">
              <RiQrScanFill className="text-white text-5xl" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
