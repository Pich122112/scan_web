import { FaArrowAltCircleUp, FaQrcode } from 'react-icons/fa';

export default function QRButtons() {
    return (
        <div className="flex flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-10 items-stretch">
            <button className="bg-orange-500 text-white h-28 sm:h-auto rounded-xl text-base sm:text-lg font-bold shadow flex flex-col items-center justify-center gap-2 flex-1 min-w-[150px]">
                <FaArrowAltCircleUp className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                <span className="text-center">Scan Transfer</span>
            </button>
            <button className="bg-orange-500 text-white h-28 sm:h-auto rounded-xl text-base sm:text-lg font-bold shadow flex flex-col items-center justify-center gap-2 flex-1 min-w-[150px]">
                <FaQrcode className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <span className="text-center">Show QR</span>
            </button>
        </div>
    );
}