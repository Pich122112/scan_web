'use client';

import Image from 'next/image';
import logo from '@/assets/logowhite.png';
import { FaBell, FaQrcode } from 'react-icons/fa';
import { usePhone } from '@/context/PhoneContext';
import { formatPhoneNumber } from "@/utils/format_phone";

export default function Navbar() {
    const { tempPhoneNumber, userData } = usePhone();

    // ✅ Only show Navbar if the user is verified (has userData)
    if (!userData) return null;

    // Use the phone number from user data if available, otherwise use the temporary one
    const rawPhone = userData?.phone_number || tempPhoneNumber;
    const displayPhone = rawPhone ? formatPhoneNumber(rawPhone) : null;

    // ⏰ Dynamic greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning ☀️";
        if (hour < 18) return "Good Afternoon 🌤️";
        return "Good Night 🌙";
    };

    return (
        <nav className="bg-orange-500 w-full fixed top-0 left-0 right-0 z-50">
            <div className="w-full absolute h-full bg-orange-500 -z-10"></div>

            <div className="max-w-[1200px] w-full mx-auto py-3 px-4 flex flex-row items-center justify-between flex-wrap gap-2">
                {/* Left: Logo and Greeting */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-1 border-2 border-white/30">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                    <div className="text-white">
                        <p className="font-semibold text-white/90 text-sm sm:text-base">
                            {getGreeting()}
                        </p>
                        <p className="font-bold text-white text-sm sm:text-xl">
                            {displayPhone || 'Guest'}
                        </p>
                    </div>
                </div>

                {/* Right: Language and Icons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Bell */}
                    <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 relative">
                        <FaBell className="text-lg text-white" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {/* User */}
                    <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200">
                        <FaQrcode className="text-lg text-white" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
