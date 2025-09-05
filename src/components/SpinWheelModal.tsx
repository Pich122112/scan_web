'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import confetti from 'canvas-confetti';


const prizes = ["20 Score", "1 Score", "30 Score", "50 Score", "30 D", "300 D"];
const segmentCount = prizes.length;

export default function SpinWheelModal({ onClose }: { onClose: (prize: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [resultPrize, setResultPrize] = useState<string | null>(null);
    const animationRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        setIsVisible(true);

        const drawWheel = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const size = canvas.width;
            const radius = size / 2;
            const arc = (2 * Math.PI) / segmentCount;

            ctx.clearRect(0, 0, size, size);

            // Wheel background and segments
            prizes.forEach((prize, i) => {
                const angle = i * arc;
                ctx.beginPath();
                ctx.moveTo(radius, radius);
                ctx.arc(radius, radius, radius - 12, angle, angle + arc);
                ctx.closePath();

                // Alternate colors: even = orange, odd = black
                ctx.fillStyle = i % 2 === 0 ? "#ff6600" : "#000";
                ctx.fill();

                // Text
                ctx.save();
                ctx.translate(radius, radius);
                ctx.rotate(angle + arc / 2);
                ctx.fillStyle = "white";
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = "right";
                ctx.fillText(prize, radius - 30, 8);
                ctx.restore();
            });

            // Lamps - 13 bulbs at original position (radius - 5) but fully visible
            const bulbCount = 12;
            const bulbRadius = 6; // Slightly smaller to ensure full visibility
            const ringRadius = radius - 5; // Original position

            // Adjust bulb positions to stay within canvas
            const effectiveRadius = Math.min(ringRadius, radius - bulbRadius - 2);

            // Draw bulbs
            for (let i = 0; i < bulbCount; i++) {
                const angle = (i / bulbCount) * 2 * Math.PI;
                const x = radius + Math.cos(angle) * effectiveRadius;
                const y = radius + Math.sin(angle) * effectiveRadius;

                // Glow effect
                ctx.beginPath();
                ctx.shadowColor = "rgba(255, 255, 100, 0.9)";
                ctx.shadowBlur = 15;
                ctx.fillStyle = "#fffac2";
                ctx.arc(x, y, bulbRadius + 2, 0, Math.PI * 2);
                ctx.fill();

                // Bulb core
                ctx.beginPath();
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff";
                ctx.arc(x, y, bulbRadius, 0, Math.PI * 2);
                ctx.fill();

                // Highlight
                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.arc(x - bulbRadius / 3, y - bulbRadius / 3, bulbRadius / 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Center hub
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(radius, radius, 25, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(radius, radius, 6, 0, 2 * Math.PI);
            ctx.fill();
        };

        const fireConfetti = () => {
            confetti({
                particleCount: 100,
                spread: 50,
                origin: { y: 0.6 },
                colors: ['#3300ff', '#ffffff', '#fff700'],
            });
        };

        const spinWheel = () => {
            let startTime: number | null = null;
            const duration = 3000;
            const spinAngle = Math.random() * 360 + 720;

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const rotation = easedProgress * spinAngle;

                if (canvasRef.current) {
                    canvasRef.current.style.transform = `rotate(${rotation}deg)`;
                }

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    const finalAngle = spinAngle % 360;
                    const segmentAngle = 360 / segmentCount;
                    const index = Math.floor(
                        ((360 - finalAngle - segmentAngle / 2) % 360 / segmentAngle)
                    );
                    const prize = prizes[index >= 0 ? index : prizes.length + index];

                    setResultPrize(prize);
                    setSpinning(false);
                    fireConfetti(); // Add confetti here
                    setTimeout(() => onClose(prize), 2000);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        };


        const timer = setTimeout(() => {
            drawWheel();
            spinWheel();
        }, 50);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [onClose]);

    return (
        <Dialog
            open={true}
            onClose={() => { }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <Dialog.Panel className="relative w-full h-full flex flex-col items-center justify-center bg-[#ff6600]">
                {/* Logo at the top */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[#ff6600] font-bold text-xl">LOGO</span>
                        {/* <img src="/path-to-your-logo.png" alt="Logo" className="w-12 h-12" /> */}
                    </div>
                </div>
                {/* Title */}
                <h2 className="text-white text-xl font-bold my-3 font-[Poppins]">សូមស្វាគមន៍មកកាន់គេហទំព័រការស្កេន</h2>
                <p className="text-white text-lg mb-4 font-bold font-[Poppins]">ផ្សងសំណាងរបស់យើង</p>

                <div className="relative w-[300px] h-[300px] mt-4">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="transition-transform duration-300 p-1 ease-out rounded-full bg-[#000000]"
                        style={{
                            transform: 'rotate(0deg)',
                            backfaceVisibility: 'hidden',
                            border: '4px solid white',
                            borderRadius: '50%'
                        }}
                    />
                    {/* Pointer at bottom pointing to top */}
                    <div
                        className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-0 h-3 
                            border-l-[12px] border-l-transparent 
                            border-r-[12px] border-r-transparent 
                            border-b-[20px] border-b-white z-20"
                    />
                </div>

                {spinning && (
                    <p className="mt-4 text-lg font-semibold animate-pulse text-white">
                        កំពុងបង្វិលសូមរង់ចាំ...
                    </p>
                )}

            </Dialog.Panel>
        </Dialog>
    );
}