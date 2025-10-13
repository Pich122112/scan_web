'use client';

import Image, { StaticImageData } from 'next/image';

type ScoreItem = {
    title: string;
    value: number;
    image: StaticImageData;
};

export default function ScoreCardGroup({ scores }: { scores: ScoreItem[] }) {
    return (
        <div
            className="rounded-xl py-6 px-4 flex justify-around items-start relative"
            style={{
                background: "rgba(251,96,0,0.8)",
                boxShadow: "0 0 10px rgba(255,255,255,0.4), 0 0 10px rgba(255,255,255,0.4)",
            }}
        >
            {/* Soft glow overlay */}
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    boxShadow: "0 0 10px rgba(255,255,255,0.4), 0 0 10px rgba(255,255,255,0.4)",
                }}
            />

            {scores.map((item, index) => (
                <div
                    key={index}
                    className="flex-1 flex flex-col items-center text-center relative"
                >
                    {/* Glassy white circle behind logo */}
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                        style={{
                            background: "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={33}
                            height={33}
                            className="object-contain drop-shadow-md"
                        />
                    </div>

                    {/* Value */}
                    <p className="text-2xl font-bold text-white drop-shadow-sm">{item.value}</p>

                    {/* Title */}
                    <p className="text-white/90 text-base font-semibold mt-4">{item.title}</p>

                    {/* Divider except for last item */}
                    {index < scores.length - 1 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-white" />
                    )}

                </div>
            ))}
        </div>
    );
}
