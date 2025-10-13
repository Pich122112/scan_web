'use client';

import { FaDownload } from 'react-icons/fa';

export default function DownloadAppCard() {
    return (
        <div className="rounded-2xl p-6 text-center" style={{
            background: "rgba(251,96,0,0.8)",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.826), 0 0 10px rgba(255, 255, 255, 0.826)",
        }}>

            {/* Title */}
            <h2 className="text-xl mb-4 font-khmer font-bold ">
                Download App
            </h2>

            {/* Download button */}
            <a
                href="https://example.com/sample-app.apk"
                download
                className="bg-white relative group block overflow-hidden rounded-2xl px-8 py-10 
               text-white font-khmer font-bold text-lg flex flex-col items-center justify-center"
            >
                {/* Mirror reflection overlay */}
                <div
                    className="ng-white absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        boxShadow: "0 0 10px rgba(255,255,255,0.4), 0 0 10px rgba(255,255,255,0.4)",
                    }}
                />

                {/* Subtle orange glow accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-400/20 to-transparent opacity-50 rounded-2xl pointer-events-none" />

                {/* Download icon */}
                <FaDownload
                    size={45}
                    className="relative mb-3 drop-shadow-[0_4px_10px_rgba(255,255,255,0.3)]
  group-hover:scale-110 group-hover:drop-shadow-[0_6px_20px_rgba(251,96,0,0.5)]
  transition-transform duration-300 animate-smooth-bounce text-black"
                />
                {/* Text */}
                <span className="relative drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)] text-black">
                    Click here!
                </span>
            </a>

        </div>
    );
}
