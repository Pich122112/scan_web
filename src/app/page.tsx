'use client';

import { useState, useEffect, useRef } from 'react';
import ScoreCardGroup from '@/components/ScoreCard';
import DiamondBanner from '@/components/DiamondBanner';
import DownloadAppCard from '@/components/download';
import { usePhone } from '@/context/PhoneContext';
import BottomAppbar from '@/components/BottomNav';
import fantaLogo from '@/assets/logowhite.png';
import up7Logo from '@/assets/newbslogo.png';
import spriteLogo from '@/assets/idol.png';
import SpinWheelModal from '@/components/SpinWheelModal';
import ResultDialog from '@/components/ResultDialog';
import { fetchUserProfile, TOKEN_STORAGE_KEY, USER_DATA_STORAGE_KEY } from '@/services/auth_api';
import ExchangePrizeListPage from '@/components/exchange_prize_list_card';

export default function HomePage() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { userData, setUserData } = usePhone();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const touchStartY = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = async (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    // Pulling down from top (scrollY == 0)
    if (window.scrollY === 0 && distance > 100 && !isRefreshing) {
      setIsRefreshing(true);
      await refreshUserProfile();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

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
    <div className="relative space-y-8" onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}>
      {isRefreshing && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 z-50 flex justify-center items-center">
          <div
            className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin drop-shadow-lg"
            style={{
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          ></div>
        </div>
      )}
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
          <ExchangePrizeListPage />
          <div className='h-20'></div>
        </>
      )}
    </div>
  );
}

//Correct with 130 line code changes
