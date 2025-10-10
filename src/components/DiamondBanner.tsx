import { FaGem } from "react-icons/fa";

interface DiamondBannerProps {
    diamondCount: number;
}

export default function DiamondBanner({ diamondCount }: DiamondBannerProps) {
    return (
        <div className="relative mt-8 sm:mx-0 rounded-2xl h-40 sm:h-60 flex items-center justify-center overflow-hidden group">
            {/* Glassy background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-2xl" />

            {/* Soft glowing orbs for depth */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/30 to-pink-400/20 rounded-full blur-3xl"></div>

            {/* Diamond Icon */}
            <div className="relative text-4xl sm:text-5xl mr-2 sm:mr-4">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
                <FaGem className="relative text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            </div>

            {/* Diamond Count */}
            <span className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-md">
                {diamondCount}
            </span>

            {/* Subtle divider line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
    );
}
