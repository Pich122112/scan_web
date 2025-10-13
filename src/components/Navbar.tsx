'use client';

import Image from 'next/image';
import logo from '@/assets/logowhite.png';
import { FaBell, FaQrcode } from 'react-icons/fa';
import { usePhone } from '@/context/PhoneContext';
import { useState } from 'react';
import { formatPhoneNumber } from "@/utils/format_phone";

export default function Navbar() {
    const { tempPhoneNumber, userData } = usePhone();
    const [showDialog, setShowDialog] = useState(false);

    // ✅ Only show Navbar if user is logged in
    if (!userData) return null;

    const rawPhone = userData?.phone_number || tempPhoneNumber;
    const displayPhone = rawPhone ? formatPhoneNumber(rawPhone) : 'Guest';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning ☀️";
        if (hour < 18) return "Good Afternoon 🌤️";
        return "Good Night 🌙";
    };

    const handleDialog = () => {
        setShowDialog(true);
        setTimeout(() => setShowDialog(false), 2000);
    };

    return (
        <>
            {/* 🧊 Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "var(--background)" }}>
                <div className="max-w-[1200px] mx-auto py-3 px-4 flex items-center justify-between flex-wrap gap-3">
                    {/* Left Section: Logo + Greeting */}
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center p-1">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={60}
                                height={60}
                                className="object-contain rounded-full"
                            />
                        </div>
                        <div className="text-white">
                            <p className="font-medium text-sm sm:text-base text-white/90">
                                {getGreeting()}
                            </p>
                            <p className="font-bold text-lg sm:text-xl tracking-wide drop-shadow-sm">
                                {displayPhone}
                            </p>
                        </div>
                    </div>

                    {/* Right Section: Action Icons */}
                    <div className="flex items-center gap-3">
                        {/* 🔔 Notification */}
                        <button
                            onClick={handleDialog}
                            className="p-2 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full 
                                       transition duration-200 relative"
                        >
                            <FaBell className="text-lg text-white" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>

                        {/* 🧾 QR Code */}
                        <button
                            onClick={handleDialog}
                            className="p-2 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full 
                                       transition duration-200"
                        >
                            <FaQrcode className="text-lg text-white" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* 📱 Dialog Overlay */}
            {showDialog && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn">
                    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl 
                                    shadow-2xl px-8 py-6 text-center text-white transform transition-all animate-slideUp">
                        {/* Soft inner glow */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl" />

                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-14 h-14 flex items-center justify-center bg-white/25 text-orange-300 
                                            rounded-full shadow-inner backdrop-blur-lg text-3xl">
                                📱
                            </div>

                            <p className="font-bold text-xl drop-shadow-sm">Available on App</p>
                            <p className="text-white/80 text-sm max-w-[250px]">
                                This feature is accessible only from our mobile app.
                            </p>

                            <button
                                onClick={() => setShowDialog(false)}
                                className="mt-4 bg-white/20 hover:bg-white/40 text-white font-semibold px-6 py-2 rounded-full transition backdrop-blur-md shadow-md"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
