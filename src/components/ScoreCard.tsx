'use client';

import Image, { StaticImageData } from 'next/image';

type ScoreItem = {
    title: string;
    value: number;
    image: StaticImageData;
};

export default function ScoreCardGroup({ scores }: { scores: ScoreItem[] }) {
    return (
        <div className="relative rounded-xl mt-8 py-6 px-4 flex justify-around items-start
                    shadow-lg overflow-visible backdrop-blur-xl
                    bg-white/10 border border-white/20">
            {/* Soft glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none rounded-xl" />

            {scores.map((item, index) => (
                <div
                    key={index}
                    className="flex-1 flex flex-col items-center text-center relative"
                >
                    {/* Floating glassy circle (now truly above the card) */}
                    <div className="absolute -top-10 w-14 h-14 rounded-full 
                          bg-white/20 backdrop-blur-lg border border-white/30
                          flex items-center justify-center shadow-[0_6px_16px_rgba(255,255,255,0.15)] z-10">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={33}
                            height={33}
                            className="object-contain drop-shadow-md"
                        />
                    </div>

                    {/* Value */}
                    <p className="mt-8 text-2xl font-bold text-white drop-shadow-sm">
                        {item.value}
                    </p>

                    {/* Title */}
                    <p className="text-white/90 text-base font-semibold mt-1">
                        {item.title}
                    </p>

                    {/* Divider */}
                    {index < scores.length - 1 && (
                        <div className="absolute right-0 top-6 h-10 w-[1px] bg-white/25" />
                    )}
                </div>
            ))}
        </div>
    );
}
