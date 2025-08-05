import ScoreCard from '@/components/ScoreCard';
import QRButtons from '@/components/QRButtons';
import AnnouncementCard from '@/components/AnnouncementCard';
import DiamondBanner from '@/components/DiamondBanner';
import FloatingActionButton from '@/components/BottomNav';


import fantaLogo from '@/assets/logowhite.png';
import up7Logo from '@/assets/idol.png';
import spriteLogo from '@/assets/bstrong.png';

export default function HomePage() {
  return (
    <div className="space-y-6">
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
