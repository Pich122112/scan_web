'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from 'react';

import ScoreCardGroup from '@/components/ScoreCard';
import DiamondBanner from '@/components/DiamondBanner';
import FloatingActionButton from '@/components/BottomNav';
import DownloadAppCard from '@/components/download'; // ⬅️ Add this

import fantaLogo from '@/assets/image.png';
import up7Logo from '@/assets/image.png';
import spriteLogo from '@/assets/image.png';

import SpinWheelModal from '@/components/SpinWheelModal';
import ResultDialog from '@/components/ResultDialog';

export default function HomePage() {
  const [showSpinWheel, setShowSpinWheel] = useState(true);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  const handleSpinComplete = (result: string) => {
    setPrize(result);
    setShowSpinWheel(false);
    setShowResultDialog(true);
  };
  const handleCloseResult = () => {
    setShowResultDialog(false);
  };

  return (
    <div className="space-y-6">
      {showSpinWheel && <SpinWheelModal onClose={handleSpinComplete} />}
      {showResultDialog && prize !== null && (
        <ResultDialog prize={prize} onClose={handleCloseResult} />
      )}

      <DiamondBanner />
      <ScoreCardGroup
        scores={[
          { title: 'ពិន្ទុ', value: 50, image: fantaLogo },
          { title: 'ពិន្ទុ', value: 0, image: up7Logo },
          { title: 'ពិន្ទុ', value: 0, image: spriteLogo },
        ]}
      />
      <DownloadAppCard />
      <FloatingActionButton />
    </div>
  );
}
