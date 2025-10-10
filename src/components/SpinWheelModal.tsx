'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { FaTimes } from 'react-icons/fa';
interface PrizeType {
    label: string;
    issuer: string;
    amount: number;
    wallet_name: string;
}

interface SpinWheelModalProps {
    onClose: (prize: string) => void;
    prize: PrizeType | null;
}

export default function SpinWheelModal({ onClose, prize }: SpinWheelModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [resultPrize, setResultPrize] = useState<PrizeType | null>(null);
    const animationRef = useRef<number | null>(null);
    const [randomPrizes, setRandomPrizes] = useState<PrizeType[]>([]);

    // Function to generate random prizes
    const generateRandomPrizes = (excludePrize?: PrizeType | null) => {
        const prizes: PrizeType[] = [];
        const prizeCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 random prizes

        // Define possible prize configurations
        const scoreAmounts = [1, 5, 10, 20, 30, 50, 100];
        const dAmounts = [30, 50, 100, 200, 300, 500];

        // Generate random Score prizes
        const scoreCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 Score prizes
        for (let i = 0; i < scoreCount; i++) {
            const amount = scoreAmounts[Math.floor(Math.random() * scoreAmounts.length)];
            // Skip if this amount matches the excluded prize
            if (excludePrize && excludePrize.wallet_name === "GB" && excludePrize.amount === amount) {
                continue;
            }
            prizes.push({
                label: `${amount} Score`,
                issuer: "GB",
                amount: amount,
                wallet_name: "GB"
            });
        }

        // Generate random D prizes
        const dCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 D prizes
        for (let i = 0; i < dCount; i++) {
            const amount = dAmounts[Math.floor(Math.random() * dAmounts.length)];
            // Skip if this amount matches the excluded prize
            if (excludePrize && excludePrize.wallet_name === "D" && excludePrize.amount === amount) {
                continue;
            }
            prizes.push({
                label: `${amount} D`,
                issuer: "GB",
                amount: amount,
                wallet_name: "D"
            });
        }

        // Shuffle the prizes array
        for (let i = prizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [prizes[i], prizes[j]] = [prizes[j], prizes[i]];
        }

        // Return only the requested number of prizes
        return prizes.slice(0, prizeCount);
    };

    // Generate random prizes on component mount
    useEffect(() => {
        const randomPrizes = generateRandomPrizes(prize);
        setRandomPrizes(randomPrizes);
        console.log('🎲 Generated random prizes:', randomPrizes);
    }, [prize]);

    // Ensure the won prize is always present in the wheel with random other prizes
    const wheelPrizes = useMemo(() => {
        if (!prize) return randomPrizes;

        // Check if prize already exists in random prizes
        const existingIndex = randomPrizes.findIndex(
            p => String(p.amount) === String(prize.amount) && p.wallet_name === prize.wallet_name
        );

        if (existingIndex !== -1) {
            console.log('✅ Prize found in random prizes at index:', existingIndex);
            return randomPrizes;
        }

        // If not found, add it to the wheel with random prizes
        const newPrize = {
            ...prize,
            label: prize.wallet_name === "GB"
                ? `${prize.amount} Score`
                : prize.wallet_name === "D"
                    ? `${prize.amount} D`
                    : `${prize.amount} ${prize.wallet_name}`,
        };

        console.log('➕ Adding scanned prize to random wheel:', newPrize);
        return [...randomPrizes, newPrize];
    }, [prize, randomPrizes]);

    const segmentCount = wheelPrizes.length;

    // Find the correct index of the prize
    const prizeIndex =
        prize && typeof prize.amount !== 'undefined'
            ? wheelPrizes.findIndex(
                p =>
                    String(p.amount) === String(prize.amount) &&
                    (p.wallet_name === prize.wallet_name || p.issuer === prize.issuer)
            )
            : -1;
    const finalIndex = prizeIndex === -1 ? 0 : prizeIndex;

    useEffect(() => {
        if (!prize || randomPrizes.length === 0) return;

        setIsVisible(true);

        // Always reset canvas transform before new spin
        if (canvasRef.current) {
            canvasRef.current.style.transform = `rotate(0deg)`;
        }

        const drawWheel = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const size = canvas.width;
            const radius = size / 2;
            const arc = (2 * Math.PI) / segmentCount;

            ctx.clearRect(0, 0, size, size);

            // Draw the wheel with the first segment starting at the top (12 o'clock position)
            wheelPrizes.forEach((prizeSeg, i) => {
                // Start drawing from the top (12 o'clock)
                const startAngle = -Math.PI / 2 + (i * arc);
                const endAngle = startAngle + arc;

                ctx.beginPath();
                ctx.moveTo(radius, radius);
                ctx.arc(radius, radius, radius - 12, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = i % 2 === 0 ? '#ff6600' : '#000';
                ctx.fill();

                // Draw text in the middle of each segment
                ctx.save();
                ctx.translate(radius, radius);
                const textAngle = startAngle + (arc / 2);
                ctx.rotate(textAngle);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(prizeSeg.label, radius - 30, 8);
                ctx.restore();
            });

            // Draw bulbs
            const bulbCount = 12;
            const bulbRadius = 6;
            const ringRadius = radius - 5;
            const effectiveRadius = Math.min(ringRadius, radius - bulbRadius - 2);

            for (let i = 0; i < bulbCount; i++) {
                const angle = (i / bulbCount) * 2 * Math.PI;
                const x = radius + Math.cos(angle) * effectiveRadius;
                const y = radius + Math.sin(angle) * effectiveRadius;

                ctx.beginPath();
                ctx.shadowColor = 'rgba(255, 255, 100, 0.9)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#fffac2';
                ctx.arc(x, y, bulbRadius + 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.arc(x, y, bulbRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.arc(x - bulbRadius / 3, y - bulbRadius / 3, bulbRadius / 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Center hub
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(radius, radius, 25, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = 'black';
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
            const baseRotations = 5;
            const segmentAngle = 360 / segmentCount;

            // DEBUG: Log all prizes and their indices
            console.log('🎡 Wheel prizes:', wheelPrizes.map((p, i) => `${i}: ${p.label}`));
            console.log('🎯 Target prize:', prize?.label, 'at index:', finalIndex);

            // Calculate spin to position target at bottom pointer (180°)
            const targetSegmentCenter = (finalIndex * segmentAngle) + (segmentAngle / 2);
            const rotationToTarget = 180 - targetSegmentCenter;
            const totalRotation = baseRotations * 360 + rotationToTarget;

            console.log('🔄 Spin calculation:', {
                segmentCount,
                segmentAngle,
                targetSegmentCenter,
                rotationToTarget,
                totalRotation
            });

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const rotation = easedProgress * totalRotation;

                if (canvasRef.current) {
                    canvasRef.current.style.transform = `rotate(${rotation}deg)`;
                }
                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    if (canvasRef.current) {
                        canvasRef.current.style.transform = `rotate(${totalRotation}deg)`;
                    }

                    setResultPrize(wheelPrizes[finalIndex]);
                    setSpinning(false);
                    fireConfetti();
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
    }, [finalIndex, prize, segmentCount, wheelPrizes, randomPrizes]);

    useEffect(() => {
        let to: NodeJS.Timeout;
        if (!spinning && resultPrize) {
            to = setTimeout(() => {
                onClose(resultPrize.label);
            }, 5000);
        }
        return () => {
            if (to) clearTimeout(to);
        };
    }, [spinning, resultPrize, onClose]);

    // Only render UI if prize exists and random prizes are loaded
    if (!prize || randomPrizes.length === 0) return null;

    return (
        <Dialog
            open={true}
            onClose={() => { }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <Dialog.Panel className="relative w-full h-full flex flex-col items-center justify-center bg-[#ff6600]">
                {/* Close button at top-left */}
                <button
                    onClick={() => onClose(resultPrize ? resultPrize.label : '')}
                    className="absolute top-4 left-4 z-50 p-2 rounded-full bg-black/50 hover:bg-yellow-500/80 text-white transition"
                >
                    <FaTimes className="text-white text-xl" />
                </button>

                {/* Logo at the top */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden animate-zoom">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={60}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="relative w-[300px] h-[300px] mt-4">
                    <canvas
                        ref={canvasRef}
                        width={280}
                        height={280}
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
                        Spinning...
                    </p>
                )}
                {!spinning && resultPrize && (
                    <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 mb-2">🎉 Congratulation!</h3>
                        <p className="text-xl text-white">You won <b>{resultPrize.label}</b> from <b>{prize.wallet_name}</b>!</p>
                    </div>
                )}
            </Dialog.Panel>
        </Dialog>
    );
}

//Correct with 363 line code changes
