'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from 'react';

import ScoreCardGroup from '@/components/ScoreCard';
import DiamondBanner from '@/components/DiamondBanner';
import FloatingActionButton from '@/components/BottomNav';
import DownloadAppCard from '@/components/download'; // ⬅️ Add this
import { usePhone } from '@/context/PhoneContext';

import fantaLogo from '@/assets/image.png';
import up7Logo from '@/assets/image.png';
import spriteLogo from '@/assets/image.png';

import SpinWheelModal from '@/components/SpinWheelModal';
import ResultDialog from '@/components/ResultDialog';

export default function HomePage() {
  const [showSpinWheel, setShowSpinWheel] = useState(true);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const { userData } = usePhone();

  const handleSpinComplete = (result: string) => {
    setPrize(result);
    setShowSpinWheel(false);
    setShowResultDialog(true);
  };
  const handleCloseResult = () => {
    setShowResultDialog(false);
  };

    // Extract wallet balances from user data
  const gbBalance = userData?.wallets?.find(w => w.wallet_code === '1')?.balance || 0;
  const BSBalance = userData?.wallets?.find(w => w.wallet_code === '2')?.balance || 0;
  const idBalance = userData?.wallets?.find(w => w.wallet_code === '3')?.balance || 0;
  const dmBalance = userData?.wallets?.find(w => w.wallet_code === '4')?.balance || 0;


  return (
    <div className="space-y-6">
      {showSpinWheel && <SpinWheelModal onClose={handleSpinComplete} />}
      {showResultDialog && prize !== null && (
        <ResultDialog prize={prize} onClose={handleCloseResult} />
      )}

      <DiamondBanner diamondCount={dmBalance} />
      <ScoreCardGroup
        scores={[
          { title: 'GB', value: gbBalance, image: fantaLogo },
          { title: 'BS', value: BSBalance, image: up7Logo },
          { title: 'ID', value: idBalance, image: spriteLogo },
        ]}
      />
      <DownloadAppCard />
      <FloatingActionButton />
    </div>
  );
}
