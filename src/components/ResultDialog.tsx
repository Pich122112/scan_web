'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import confetti from 'canvas-confetti';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { usePhone } from '@/context/PhoneContext';
import { requestOtp, verifyOtp, fetchUserProfile, PHONE_STORAGE_KEY, TOKEN_STORAGE_KEY, USER_DATA_STORAGE_KEY } from '@/services/auth_api';
import { DeviceUUID } from '@/utils/deviceUUID';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const countryCodes = [
  { code: '855', name: 'Cambodia', flag: '🇰🇭' },
  { code: '1', name: 'USA', flag: '🇺🇸' },
  { code: '44', name: 'UK', flag: '🇬🇧' },
  { code: '86', name: 'China', flag: '🇨🇳' },
  { code: '91', name: 'India', flag: '🇮🇳' },
  { code: '84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '66', name: 'Thailand', flag: '🇹🇭' },
  { code: '95', name: 'Myanmar', flag: '🇲🇲' },
  { code: '856', name: 'Laos', flag: '🇱🇦' },
];

interface ResultDialogProps {
  prize: string | null;
  errorMsg: string | null;
  onClose: () => void;
  onVerificationSuccess: () => void;
  isVerified: boolean;
  code: string;
}
interface VerifiedPrizeDialogProps {
  prize: string | null;
  onClose: () => void;
}

// --- VerifiedPrizeDialog for auto-click ---
function VerifiedPrizeDialog({ prize, onClose }: VerifiedPrizeDialogProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-click after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <div className="text-black text-xl">You have receive</div>

      {prize ? (
        <div className="text-center mt-4 text-orange-500 font-extrabold leading-tight">
          <div className="text-6xl">
            {prize.split(' ')[0]} {/* e.g. 10 */}
          </div>
          <div className="text-2xl text-gray-900 font-bold mt-1">
            {(() => {
              const parts = prize.split(' ');
              const rest = parts.slice(1).join(' ');
              const match = rest.match(/(Score|Diamond|D|ID|BS)\s*\((\w+)\)/);
              if (match) {
                const [, type, wallet] = match;
                return `${type} from ${wallet}`;
              } else {
                return rest;
              }
            })()}
          </div>
        </div>
      ) : (
        <div className="text-orange-500 font-extrabold text-4xl md:text-3xl lg:text-4xl mt-4">
          No prize available
        </div>
      )}

      <div className="mt-6 text-green-600 font-semibold">
        ✅ Your account already verify.
      </div>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white font-bold 
            text-lg rounded-full flex items-center justify-center py-3 
            hover:bg-blue-600 transition"
        >
          OK
        </button>
      </div>
    </>
  );
}

export default function ResultDialog({
  prize,
  onClose,
  errorMsg,
  onVerificationSuccess,
  isVerified,
  code
}: ResultDialogProps) {
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const { tempPhoneNumber, setTempPhoneNumber, confirmPhoneNumber, setUserData } = usePhone();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prizeState, setPrizeState] = useState<string | null>(prize);

  // Confetti on load (only for real prizes)
  useEffect(() => {
    // Only trigger confetti when prize is NOT a Thank You or error message
    if (prize && !prize.toLowerCase().includes('thank you')) {
      const colors = ['#3300ff', '#ffffff', '#fff700'];
      let count = 0;
      const burst = () => {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors });
        count++;
        if (count < 4) setTimeout(burst, 1000);
      };
      burst();
      return () => clearTimeout(burst as unknown as number);
    }
  }, [prize]);


  useEffect(() => {
    const fullPhone = selectedCountry.code + phoneNumber;
    setTempPhoneNumber(fullPhone);
  }, [selectedCountry, phoneNumber, setTempPhoneNumber]);

  const handleRequestOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('Please Enter Your Phone Number');
      return;
    }
    if (phoneNumber.length < 8) {
      setError('Phone number must be at least 8 digits');
      return;
    }
    setIsLoading(true);
    try {
      const result = await requestOtp(tempPhoneNumber);
      if (result.success) {
        setOtpSent(true);
        setShowOtpInput(true);
        setError('');
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      const deviceUuid = await DeviceUUID.getUUID();
      const fcmToken = '';
      const result = await verifyOtp(tempPhoneNumber, otp, deviceUuid, fcmToken);
      if (result.success) {
        const authToken = result.data?.token || result.token;
        if (authToken) {
          localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
          const userProfile = await fetchUserProfile(authToken);
          if (userProfile.success) {
            setUserData(userProfile.data);
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userProfile.data));
            confirmPhoneNumber();
            localStorage.setItem(PHONE_STORAGE_KEY, tempPhoneNumber);
            localStorage.setItem('userVerifiedPhone', tempPhoneNumber);
            onVerificationSuccess();
            await handleRedeem();
            onClose();
          } else {
            setError('Failed to fetch user data');
          }
        } else {
          setError('Authentication token not received');
        }
      } else {
        if (result.message && result.message.includes('login')) {
          setError('Verification failed. Please try again.');
        } else {
          setError(result.message || 'Invalid OTP');
        }
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!isVerified) return;
    setRedeemStatus('processing');
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      const response = await fetch('https://api.sandbox.gzb.app/api/v2/redeem/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
          'X-App-Package': 'com.ganzberg.scanprizefront'
        },
        body: new URLSearchParams({ code }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setRedeemStatus('success');
        if (result.data && result.data.label) setPrizeState(result.data.label);
        const userProfile = await fetchUserProfile(token);
        if (userProfile.success) {
          setUserData(userProfile.data);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userProfile.data));
        }
        setTimeout(() => { onClose(); }, 2000);
      } else {
        setRedeemStatus('error');
        setError(result.message || 'Failed to redeem');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setRedeemStatus('error');
      setError('Network error. Try again.');
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    setError('');
  };

  const selectCountry = (country: typeof countryCodes[0]) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  return (
    <Dialog
      open={true}
      onClose={() => { }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-orange-500 bg-opacity-90 overflow-auto px-2"
    >
      <div className="absolute inset-0 bg-orange-500" />
      <div className="absolute top-15 mt-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center">
          <Image src={logo} alt="GANZBERG Logo" width={80} height={80} className="object-contain" />
        </div>
        <div className="mt-2 text-center text-white font-bold text-md">
          GANZBERG GERMAN PREMIUM BEER
        </div>
      </div>
      <Dialog.Panel className="relative mt-20 z-10 bg-white rounded-2xl shadow-xl text-center px-3 py-6 w-full max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl focus:outline-none overflow-visible">
        {errorMsg ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full h-[200px] text-center flex flex-col items-center justify-center space-y-4 space-x-4 mx-2">
              {errorMsg && (
                <>
                  {/* Split emoji and text dynamically */}
                  <div className="text-4xl">
                    {errorMsg.split(" ")[0]} {/* 🙏 */}
                  </div>
                  <div className="text-black font-bold text-2xl">
                    {errorMsg.split(" ").slice(1).join(" ")} {/* Thank You ! */}
                  </div>
                </>
              )}
            </div>
          </div>

        ) : isVerified ? (
          <VerifiedPrizeDialog prize={prize} onClose={onClose} />
        ) : (
          <>
            {/* 🎁 Show prize first if available */}
            {prize && (
              <div className="mb-6 text-center">
                <div className="text-orange-500 font-extrabold mt-2 leading-tight">
                  {/* Split amount and label */}
                  <div className="text-6xl">
                    {prize.split(' ')[0]} {/* 10 */}
                  </div>
                  <div className="text-2xl mt-1">
                    {prize.split(' ').slice(1).join(' ')} {/* Score (GB) */}
                  </div>
                </div>
              </div>
            )}

            {/* Flexible register text */}
            <div className="text-gray-800 font-medium text-lg mb-2 text-center">
              {prize ? "Create or Login your account to get score" : "Create or Login your account"}
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center space-x-2 px-3 py-3 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[100px] shadow-sm"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span className="text-gray-900 font-bold">+{selectedCountry.code}</span>

                    {/* Custom Arrow */}
                    {showCountryDropdown ? (
                      <MdKeyboardArrowUp className="w-5 h-5 text-gray-600 transition-transform" />
                    ) : (
                      <MdKeyboardArrowDown className="w-5 h-5 text-gray-600 transition-transform" />
                    )}
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 text-gray-900 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {countryCodes.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => selectCountry(country)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex text-gray-900 items-center space-x-2"
                        >
                          <span>{country.flag}</span>
                          <span>+{country.code}</span>
                          <span className="text-gray-500 text-sm">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  maxLength={15}
                />
              </div>
            </div>
            {showOtpInput && (
              <div className="mt-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4));
                    setError('');
                  }}
                  placeholder="Get Code OTP"
                  className="w-full border border-gray-300 rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  maxLength={4}
                />
              </div>
            )}
            <div className="mt-10">
              {!otpSent ? (
                <button
                  onClick={handleRequestOtp}
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white font-semibold rounded-full flex items-center justify-center py-3 hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Get Code OTP'}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white font-semibold rounded-full flex items-center justify-center py-3 hover:bg-green-600 transition disabled:opacity-50"
                >
                  {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </>
        )}
        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error}
          </p>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}

//Correct with 405 line code change
