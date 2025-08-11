import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti';
import { usePhone } from '@/context/PhoneContext';

export default function ResultDialog({
  prize,
  onClose,
}: {
  prize: string;
  onClose: () => void;
}) {
  const [error, setError] = useState('');
  const { tempPhoneNumber, setTempPhoneNumber, confirmPhoneNumber } = usePhone();

  useEffect(() => {
    const colors = ['#3300ff', '#ffffff', '#fff700'];
    const burstCount = 4;
    const interval = 1000;
    let count = 0;

    const confettiBurst = () => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });

      count++;
      if (count < burstCount) {
        setTimeout(confettiBurst, interval);
      }
    };

    confettiBurst();

    return () => {
      clearTimeout(confettiBurst as unknown as number);
    };
  }, []);

  const handleSubmit = () => {
    if (!tempPhoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    confirmPhoneNumber(); // ✅ Save input to phoneNumber context only when confirmed
    onClose();
  };


  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-orange-500" />
      <Dialog.Panel className="relative z-10 bg-white rounded-2xl shadow-xl text-center p-6 w-[320px]">
        <div className="text-6xl mb-5">🎊</div>
        <div className="text-gray-800 font-medium text-base">
          សូមអបអរសាទរដល់អ្នកទទួលបាន
        </div>
        <div className="text-orange-500 font-extrabold text-3xl mt-4">
          {prize}
        </div>
        <div className="text-gray-900 font-bold text-lg mt-5">
          ពី GANZBERG
        </div>

        {/* Input field with error handling */}
        <div className="mt-5">
          <input
            type="text"
            value={tempPhoneNumber}
            onChange={(e) => {
              setTempPhoneNumber(e.target.value);
              setError('');
            }}
            placeholder="សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក"
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
          />

          {error && (
            <p className="text-red-500 text-xs mt-1 text-left pl-4">
              {error}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-orange-500 text-white font-semibold rounded-full flex items-center justify-center py-3 hover:bg-orange-600 transition"
        >
          បញ្ចាក់
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}