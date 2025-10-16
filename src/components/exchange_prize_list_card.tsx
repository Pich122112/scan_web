'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import motorImg from '../assets/Yamaha.png';
import carImg from '../assets/fordranger.png';
import GBCan from '../assets/CanGB.png';
import IdolCan from '../assets/CanIdol.png';
import BsCan from '../assets/bscan.png';
import BallGB from '../assets/BallGb.png';
import GbSnow from '../assets/snow.png';
import dolla from '../assets/dollas.png';
import gbcase from '../assets/gbcase.png';
import gbsnowcase from '../assets/gbsnowcase.png';

interface ExchangePrizeListCardProps {
    title: string;
    imageSrc: StaticImageData;
    onClick: () => void;
}

function ExchangePrizeListCard({ title, imageSrc, onClick }: ExchangePrizeListCardProps) {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-2xl overflow-hidden relative transition-transform hover:scale-105"
            style={{
                background: 'rgba(251,96,0,0.8)',
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.826), 0 0 10px rgba(255, 255, 255, 0.826)",
            }}
        >
            <div className="w-full h-48 flex items-center justify-center relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    className="object-contain mt-6"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className="p-2 text-center mb-8">
                <h3 className="text-white font-semibold text-xl"></h3>
            </div>
        </div>
    );
}

export default function ExchangePrizeListPage() {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const products = [
        { title: '60 GB', imageSrc: GbSnow },
        { title: '40 GB', imageSrc: GBCan },
        { title: '200 GB', imageSrc: gbsnowcase },
        { title: '150 GB', imageSrc: gbcase },
        { title: '40 ID', imageSrc: IdolCan },
        { title: '50 BS', imageSrc: BsCan },
        { title: '100 GB', imageSrc: BallGB },
        { title: '200 DM', imageSrc: dolla },
        { title: '888888 GB', imageSrc: motorImg },
        { title: '999999 GB', imageSrc: carImg },
    ];

    const handleCardClick = (title: string) => {
        setSelectedProduct(title);
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSelectedProduct(null);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-2 text-white drop-shadow-md">Available Exchange on App</h2>

            <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                    <ExchangePrizeListCard
                        key={index}
                        title={product.title}
                        imageSrc={product.imageSrc}
                        onClick={() => handleCardClick(product.title)}
                    />
                ))}
            </div>

            {/* Small Dialog */}
            {showDialog && selectedProduct && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn" onClick={closeDialog}>
                    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl 
          shadow-2xl px-8 py-6 text-center text-white transform transition-all animate-slideUp" onClick={(e) => e.stopPropagation()}>

                        {/* Soft inner glow */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl" />

                        {/* Close button top-right */}
                        <button
                            onClick={() => setShowDialog(false)}
                            className="absolute top-3 right-3 text-white/80 hover:text-white text-xl font-bold"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-14 h-14 flex items-center justify-center bg-white/25 text-orange-300 
                        rounded-full shadow-inner backdrop-blur-lg text-3xl">
                                📱
                            </div>

                            <p className="font-bold text-xl drop-shadow-sm">Available on App</p>
                            <p className="text-white/80 text-sm max-w-[250px]">
                                Get the app to convert your points into exciting rewards! More other exchange prizes has on app
                            </p>
                            <div className="mt-4 flex justify-center gap-4">
                                <button
                                    onClick={() => window.open('https://yourappdownloadlink.com', '_blank')}
                                    className="bg-white/20 hover:bg-white/40 text-white font-semibold px-6 py-2 rounded-full transition backdrop-blur-md shadow-md"
                                >
                                    Download App
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

//Correct with 129 line code changes
