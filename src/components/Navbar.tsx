"use client";

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import logo from '@/assets/logowhite.png';
import { FaBell, FaUser, FaChevronDown } from 'react-icons/fa';
import khFlag from '@/assets/kh.png';
import usFlag from '@/assets/en.png';

interface Language {
    code: string;
    flag: string;
    name: string;
    native: string;
    flagImage: StaticImageData;
}

export default function Navbar() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>({
        code: 'KH',
        flag: 'KH',
        name: 'Khmer',
        native: 'ភាសាខ្មែរ',
        flagImage: khFlag
    });

    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    const languages: Language[] = [
        {
            code: 'KH',
            flag: 'KH',
            name: 'Khmer',
            native: 'ភាសាខ្មែរ',
            flagImage: khFlag
        },
        {
            code: 'EN',
            flag: 'US',
            name: 'English',
            native: 'English',
            flagImage: usFlag
        }
    ];

    const handleLanguageChange = (language: Language) => {
        setCurrentLanguage(language);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <nav className="bg-orange-500 w-full fixed top-0 left-0 right-0 z-50">
            <div className="w-full absolute h-full bg-orange-500 -z-10"></div>

            <div className="max-w-[1200px] w-full mx-auto py-3 px-4 flex flex-row items-center justify-between flex-wrap gap-2">
                {/* Left: Logo and Welcome */}
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
                        <p className="font-semibold text-white/90 text-sm sm:text-base">Welcome 👋</p>
                        <p className="font-bold text-white text-sm sm:text-xl">092 787 171</p>
                    </div>
                </div>

                {/* Right: Language and Icons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 py-2 rounded-lg transition-all duration-200 border border-white/10"
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        >
                            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src={currentLanguage.flagImage}
                                    alt={`${currentLanguage.name} flag`}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-medium text-white">{currentLanguage.code}</span>
                            <FaChevronDown className={`text-xs text-white/80 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLanguageDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-gray-800 ${currentLanguage.code === language.code ? 'bg-gray-50' : ''}`}
                                        onClick={() => handleLanguageChange(language)}
                                    >
                                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                            <Image
                                                src={language.flagImage}
                                                alt={`${language.name} flag`}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{language.name}</p>
                                            <p className="text-xs text-gray-500">{language.native}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bell */}
                    <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 relative">
                        <FaBell className="text-lg text-white" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {/* User */}
                    <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200">
                        <FaUser className="text-lg text-white" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
