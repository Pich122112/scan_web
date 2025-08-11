'use client';

import Image, { StaticImageData } from 'next/image';

type ScoreItem = {
    title: string;
    value: number;
    image: StaticImageData;
};

export default function ScoreCardGroup({ scores }: { scores: ScoreItem[] }) {
    return (
        <div className="relative bg-orange-500 rounded-xl mt-10 py-6 px-4 flex justify-around items-start shadow-md">
            {scores.map((item, index) => (
                <div
                    key={index}
                    className="flex-1 flex flex-col items-center text-center relative"
                >
                    {/* Circle Image */}
                    <div className="absolute -top-12 w-13 h-13 rounded-full bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center">
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={30}
                            height={30}
                            className="object-contain"
                        />
                    </div>


                    {/* Value */}
                    <p className="mt-10 text-2xl font-bold text-white">{item.value}</p>

                    {/* Title */}
                    <p className="text-white text-base font-semibold mt-1">
                        {item.title}
                    </p>

                    {/* Vertical divider */}
                    {index < scores.length - 1 && (
                        <div className="absolute right-0 top-6 h-10 w-[1px] bg-white opacity-50" />
                    )}
                </div>
            ))}
        </div>
    );
}
