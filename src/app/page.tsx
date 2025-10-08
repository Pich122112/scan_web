'use client';

import { useState, useEffect } from 'react';
import ScoreCardGroup from '@/components/ScoreCard';
import DiamondBanner from '@/components/DiamondBanner';
import DownloadAppCard from '@/components/download';
import { usePhone } from '@/context/PhoneContext';
import BottomAppbar from '@/components/BottomNav';
import fantaLogo from '@/assets/logo.png';
import up7Logo from '@/assets/newbslogo.png';
import spriteLogo from '@/assets/idol.png';
import SpinWheelModal from '@/components/SpinWheelModal';
import ResultDialog from '@/components/ResultDialog';
import { fetchUserProfile, TOKEN_STORAGE_KEY, USER_DATA_STORAGE_KEY } from '@/services/auth_api';

export default function HomePage() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { userData, setUserData } = usePhone();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUserProfile() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
    if (token) {
      try {
        const profileData = await fetchUserProfile(token);
        setUserData(profileData.data || profileData);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(profileData.data || profileData));
      } catch (e) {
        console.error('Failed to fetch user profile:', e);
      }
    }
  }

  useEffect(() => {
    const checkUserVerification = async () => {
      const storedPhone = localStorage.getItem('userVerifiedPhone'); // ✅ unified key
      const storedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedPhone || !storedUserData || !token) {
        setShowResultDialog(true);
        setIsVerified(false);
      } else {
        try {
          const profileData = await fetchUserProfile(token);
          if (profileData.success) {
            setUserData(profileData.data || profileData);
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(profileData.data || profileData));
            setIsVerified(true);
          } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_DATA_STORAGE_KEY);
            localStorage.removeItem('userVerifiedPhone'); // ✅ match key
            setShowResultDialog(true);
            setIsVerified(false);
          }
        } catch (e) {
          console.error('Failed to verify user token', e);
          setShowResultDialog(true);
          setIsVerified(false);
        }
      }
      setIsLoading(false);
    };

    checkUserVerification();
  }, [setUserData]);

  useEffect(() => {
    if (!isVerified) return;
    const hasSpun = localStorage.getItem('hasSpunWheel') === 'true';
    if (!hasSpun) setShowSpinWheel(true);
  }, [isVerified]);

  const handleSpinComplete = (result: string) => {
    setPrize(result);
    setShowSpinWheel(false);
    setShowResultDialog(true);
    localStorage.setItem('hasSpunWheel', 'true');
    refreshUserProfile();
  };

  const handleCloseResult = () => {
    setShowResultDialog(false);
    setIsVerified(true);
  };

  const gbBalance = userData?.wallets?.find(w => w.wallet_code === '1')?.balance || 0;
  const BSBalance = userData?.wallets?.find(w => w.wallet_code === '2')?.balance || 0;
  const idBalance = userData?.wallets?.find(w => w.wallet_code === '3')?.balance || 0;
  const dmBalance = userData?.wallets?.find(w => w.wallet_code === '4')?.balance || 0;

  return (
    <div className="space-y-8">
      {showResultDialog && (
        <ResultDialog
          prize={prize || ''}
          errorMsg={null}
          onClose={handleCloseResult}
          onVerificationSuccess={() => { }}
          isVerified={isVerified}
          code=""
        />
      )}

      {isVerified && (
        <>
          {showSpinWheel && <SpinWheelModal onClose={handleSpinComplete} prize={null} />}
          <DiamondBanner diamondCount={dmBalance} />
          <ScoreCardGroup
            scores={[
              { title: 'GB', value: gbBalance, image: fantaLogo },
              { title: 'ID', value: idBalance, image: spriteLogo },
              { title: 'BS', value: BSBalance, image: up7Logo },
            ]}
          />
          <DownloadAppCard />
          <div className="bottom-0 left-0 right-0">
            <BottomAppbar onPrizeWin={refreshUserProfile} />
          </div>
        </>
      )}
    </div>
  );
}

//Correct with 130 line code changes
