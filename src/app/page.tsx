'use client';

import { useState, useEffect } from 'react';

import ScoreCard from '@/components/ScoreCard';
import QRButtons from '@/components/QRButtons';
import AnnouncementCard from '@/components/AnnouncementCard';
import DiamondBanner from '@/components/DiamondBanner';
import FloatingActionButton from '@/components/BottomNav';

import fantaLogo from '@/assets/image.png';
import up7Logo from '@/assets/image.png';
import spriteLogo from '@/assets/image.png';

import SpinWheelModal from '@/components/SpinWheelModal';
import ResultDialog from '@/components/ResultDialog';

export default function HomePage() {
  const [showSpinWheel, setShowSpinWheel] = useState(true);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [prize, setPrize] = useState<number | null>(null);

  const handleSpinComplete = (result: number) => {
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
      <div className="flex flex-row justify-between gap-2 overflow-hidden">
        <ScoreCard title="Score" value={123} image={fantaLogo} />
        <ScoreCard title="Score" value={456} image={up7Logo} />
        <ScoreCard title="Score" value={789} image={spriteLogo} />
      </div>
      <QRButtons />
      <AnnouncementCard />
      <FloatingActionButton />
    </div>
  );
}
