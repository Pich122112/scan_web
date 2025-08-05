'use client';

import { useEffect, useState } from 'react';
import { RiQrScanFill } from 'react-icons/ri';

export default function FloatingActionButton() {
    const [show, setShow] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY - lastScrollY > 10 && currentScrollY > 30) {
                // Scrolling down and past 30px
                setShow(true);
            } else if (lastScrollY - currentScrollY > 10) {
                // Scrolling up
                setShow(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`fixed bottom-4 sm:bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
                ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} 
                flex flex-col items-center`}
        >
            <button
                className="bg-gradient-to-tr from-orange-400 to-orange-600 text-white rounded-full p-5 shadow-2xl hover:shadow-orange-500 transition duration-300"
                aria-label="Scan QR"
            >
                <RiQrScanFill className="text-3xl" />
            </button>
        </div>
    );
}
