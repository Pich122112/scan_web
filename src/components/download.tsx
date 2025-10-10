'use client';

import { FaDownload } from 'react-icons/fa';

export default function DownloadAppCard() {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center 
                        shadow-[0_8px_32px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)]">

            {/* Title */}
            <h2 className="text-xl font-khmer font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 
                           bg-clip-text text-transparent drop-shadow-sm">
                Download App
            </h2>

            {/* Download button */}
            <a
                href="https://example.com/sample-app.apk"
                download
                className="relative group block overflow-hidden rounded-2xl px-8 py-10 
               text-white font-khmer font-bold text-lg flex flex-col items-center justify-center
               bg-white/10 backdrop-blur-2xl border border-white/20
               shadow-[0_8px_32px_rgba(251,96,0,0.25)] 
               hover:shadow-[0_8px_48px_rgba(251,96,0,0.4)] 
               transition-all duration-300 hover:scale-[1.04]"
            >
                {/* Mirror reflection overlay */}
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0.05) 100%)',
                        boxShadow: 'inset 0 0 25px rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(20px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    }}
                />

                {/* Subtle orange glow accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-400/20 to-transparent opacity-50 rounded-2xl pointer-events-none" />

                {/* Download icon */}
                {/* Download icon with jump animation */}
                <FaDownload
                    size={45}
                    className="relative mb-3 drop-shadow-[0_4px_10px_rgba(255,255,255,0.3)]
  group-hover:scale-110 group-hover:drop-shadow-[0_6px_20px_rgba(251,96,0,0.5)]
  transition-transform duration-300 animate-smooth-bounce"
                />
                {/* Text */}
                <span className="relative drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]">
                    Click here!
                </span>
            </a>

        </div>
    );
}
