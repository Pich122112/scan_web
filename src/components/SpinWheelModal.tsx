'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';

const prizes = [20, 30, 40, 50, 60, 100];
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

export default function SpinWheelModal({ onClose }: { onClose: (prize: number) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = useState(true);
    const [resultPrize, setResultPrize] = useState<number | null>(null);
    const animationRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Ensure component is visible before starting animation
        setIsVisible(true);

        const drawWheel = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const size = canvas.width;
            const radius = size / 2;
            const arc = (2 * Math.PI) / prizes.length;

            // Clear canvas
            ctx.clearRect(0, 0, size, size);

            // Draw wheel segments
            prizes.forEach((prize, i) => {
                const angle = i * arc;
                ctx.beginPath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.moveTo(radius, radius);
                ctx.arc(radius, radius, radius, angle, angle + arc, false);
                ctx.lineTo(radius, radius);
                ctx.fill();

                // Draw text
                ctx.save();
                ctx.translate(radius, radius);
                ctx.rotate(angle + arc / 2);
                ctx.textAlign = 'right';
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px sans-serif';
                ctx.fillText(`${prize} Score`, radius - 10, 10);
                ctx.restore();
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            drawWheel();
            spinWheel();
        }, 50);

        const spinWheel = () => {
            let startTime: number | null = null;
            const duration = 3000;
            const spinAngle = Math.random() * 360 + 720; // 2 full rotations + random angle

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth deceleration
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const rotation = easedProgress * spinAngle;

                if (canvasRef.current) {
                    canvasRef.current.style.transform = `rotate(${rotation}deg)`;
                    canvasRef.current.style.willChange = 'transform'; // Optimize for animation
                }

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    // Calculate final prize
                    const finalAngle = spinAngle % 360;
                    const segmentAngle = 360 / prizes.length;
                    const index = Math.floor((360 - finalAngle + segmentAngle / 2) % 360 / segmentAngle);
                    const prize = prizes[index];

                    setResultPrize(prize);
                    setSpinning(false);
                    setTimeout(() => onClose(prize), 2000);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        };

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [onClose]);

    return (
        <Dialog
            open={true}
            onClose={() => { }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 text-center relative transform transition-all duration-300">
                <div className="relative w-[300px] h-[300px] mx-auto">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="transition-transform duration-300 ease-out rounded-full"
                        style={{
                            transform: 'rotate(0deg)',
                            backfaceVisibility: 'hidden' // Improve rendering performance
                        }}
                    />
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
                    {/* Pointer */}
                    <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-500 z-20" />
                </div>

                {spinning ? (
                    <p className="mt-4 text-lg font-semibold animate-pulse">Spinning the wheel...</p>
                ) : (
                    <div className="mt-4 text-2xl font-bold text-green-600 animate-bounce">
                        🎉 You won {resultPrize} points! 🎉
                    </div>
                )}
            </Dialog.Panel>
        </Dialog>
    );
}