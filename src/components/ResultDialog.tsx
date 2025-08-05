// components/ResultDialog.tsx
import { Dialog } from '@headlessui/react';

export default function ResultDialog({ prize, onClose }: { prize: number, onClose: () => void }) {
  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl text-center">
        <div className="text-2xl font-bold text-green-600">🎉 Congratulations! 🎉</div>
        <p className="mt-4 text-lg">You won <span className="font-bold text-blue-500">{prize} Score</span></p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded" onClick={onClose}>
          OK
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
