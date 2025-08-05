import Image, { StaticImageData } from 'next/image';

export default function ScoreCard({
    title,
    value,
    image,
}: {
    title: string;
    value: number;
    image: StaticImageData;
}) {
    return (
        <div className="bg-orange-500 px-2 py-4 mt-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center group flex-[1_1_0] min-w-[30%] max-w-[34%]">
            {/* Logo */}
            <div className="relative -mt-8 mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white p-1 shadow border-4 border-orange-100 group-hover:border-orange-200 flex items-center justify-center">
                    <Image
                        src={image}
                        alt={title}
                        width={36}
                        height={36}
                        className="object-contain"
                    />
                </div>
            </div>


            {/* Value */}
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-300 to-amber-100 bg-clip-text text-transparent mb-1">
                {value}
            </p>


            {/* Title */}
            <h2 className="text-base sm:text-2xl font-semibold text-white relative pb-1 mb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-orange-400 after:to-transparent">
                {title}
            </h2>

            {/* Decorative dots */}
            <div className="flex justify-center space-x-1 mt-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transitionDelay: `${i * 100}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
