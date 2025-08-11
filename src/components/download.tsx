'use client';

import { FaDownload } from 'react-icons/fa';

export default function DownloadAppCard() {
    return (
        <div className="bg-white rounded-xl p-4 text-center shadow-md drop-shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
            <h2 className="text-xl font-bold text-black mb-4">ទាញយក App</h2>

            <div className="bg-orange-500 rounded-xl p-9 text-white flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
                <FaDownload
                    size={45}
                    className="mb-3 animate-smooth-bounce"
                />
                <span className="text-lg font-bold">សូមចុចទីនេះ</span>
            </div>
        </div>
    );
}
