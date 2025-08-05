import { FaGem } from 'react-icons/fa';

export default function DiamondBanner() {
    const diamondCount = 250; // Replace with dynamic value if needed

    return (
        <div className="relative bg-orange-500 mt-10 rounded-xl h-30 sm:h-60 flex items-center justify-center text-white shadow-lg overflow-hidden group sm:mx-0">
            {/* Shimmer effect background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30"></div>

            {/* Diamond icon with shine effect */}
            <div className="text-amber-100 text-3xl sm:text-4xl md:text-5xl mr-2 sm:mr-4 relative transition-transform duration-500 group-hover:rotate-[15deg]">
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <FaGem className="drop-shadow-lg animate-pulse" />
            </div>

            {/* Count display */}
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-md transition-all duration-300 group-hover:scale-105">
                {diamondCount}
            </span>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: '0 0 30px 10px rgba(255, 255, 255, 0.3)'
                }}>
            </div>
        </div>
    );
}
