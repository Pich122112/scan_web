'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import sliderImage1 from '@/assets/slider2.png';
import sliderImage2 from '@/assets/logowhite.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
}

export default function AnnouncementCard() {
    const slides = [
        {
            title: '2NE1',
            description: 'ប្រពន្ធិចិត្តធម៌',
            image: sliderImage1,
            cta: 'Learn More',
            bgGradient: 'from-rose-500 to-amber-500',
        },
        {
            title: 'BLACKPINK',
            description: 'កម្មវិធីថ្មីៗជាមួយកញ្ញា Lisa',
            image: sliderImage2,
            cta: 'View Details',
            bgGradient: 'from-rose-500 to-amber-500',
        },
        {
            title: 'BigBang',
            description: 'យើងត្រលប់មកវិញហើយ!',
            image: sliderImage1,
            cta: 'Get Tickets',
            bgGradient: 'from-rose-500 to-amber-500',
        },
        {
            title: 'Treasure',
            description: 'កម្មវិធីរង្វាន់ពិសេស',
            image: sliderImage2,
            cta: 'Register Now',
            bgGradient: 'from-rose-500 to-amber-500',
        },
    ];

    const NextArrow = ({ onClick }: ArrowProps) => (
        <button
            onClick={onClick}
            className="absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
        >
            <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
    );

    const PrevArrow = ({ onClick }: ArrowProps) => (
        <button
            onClick={onClick}
            className="absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
        >
            <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
    );

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        pauseOnHover: true,
        appendDots: (dots: React.ReactNode) => (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
                <ul className="flex space-x-2">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50 transition-all duration-300 hover:opacity-100"></div>
        ),
    };

    return (
        <div className="bg-white w-full p-4 sm:p-6 mt-6 sm:mt-10 rounded-xl sm:rounded-2xl shadow-xl space-y-6 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-y-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 sm:gap-3 leading-tight">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 sm:p-3 rounded">
                        📢
                    </span>
                    <span className="whitespace-pre-line">
                        Announcements <span className="text-orange-500">&</span> Information
                    </span>
                </h3>
                <div className="text-xs sm:text-sm text-gray-500 self-start xs:self-auto">
                    {slides.length} Updates
                </div>
            </div>


            {/* Slider container */}
            <div className="min-h-[200px] sm:min-h-[260px] max-h-[90vh] relative">
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={index} className="px-1 sm:px-2">
                            <div
                                className={`flex flex-row justify-between items-center gap-2 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r ${slide.bgGradient} h-[200px] p-3 sm:p-6 text-white`}
                            >
                                {/* Text section */}
                                <div className="w-1/2 flex flex-col justify-center h-full p-2 sm:p-4 space-y-3 sm:space-y-5">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium w-max">
                                        New Update
                                    </span>
                                    <h4 className="font-bold text-lg sm:text-2xl md:text-3xl leading-tight">
                                        {slide.title}
                                    </h4>
                                    <p className="text-sm sm:text-base md:text-lg opacity-90">
                                        {slide.description}
                                    </p>
                                    <button className="mt-2 sm:mt-4 bg-white text-gray-800 hover:bg-gray-100 font-medium py-2 px-4 sm:py-3 sm:px-6 text-xs sm:text-base rounded-full w-fit transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        {slide.cta} →
                                    </button>
                                </div>

                                {/* Image section */}
                                <div className="w-1/2 h-full flex justify-center items-center p-2 sm:p-4">
                                    <div className="relative w-full h-full max-h-[240px] sm:max-h-full">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
