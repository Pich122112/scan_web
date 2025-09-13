// components/ResultDialog.tsx
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti';
import { usePhone } from '@/context/PhoneContext';
import { requestOtp, verifyOtp, fetchUserProfile, PHONE_STORAGE_KEY, TOKEN_STORAGE_KEY, USER_DATA_STORAGE_KEY } from '@/services/auth_api';
import { DeviceUUID } from '@/utils/deviceUUID';

// Country code data
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

export default function ResultDialog({
  prize,
  onClose,
}: {
  prize: string;
  onClose: () => void;
}) {
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Default to Cambodia
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const { tempPhoneNumber, setTempPhoneNumber, confirmPhoneNumber, setUserData } = usePhone();

  // Check on mount if phone is already verified and stored
  useEffect(() => {
    const storedPhone = localStorage.getItem(PHONE_STORAGE_KEY);
    const storedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);

    if (storedPhone && storedUserData) {
      // User is already verified, skip dialog
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
      }
      onClose();
    }
  }, [onClose, setUserData]);

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

  // Update the full phone number when country code or phone number changes
  useEffect(() => {
    const fullPhone = selectedCountry.code + phoneNumber;
    setTempPhoneNumber(fullPhone);
  }, [selectedCountry, phoneNumber, setTempPhoneNumber]);

  const handleRequestOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក។');
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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
      // Get device UUID
      const deviceUuid = await DeviceUUID.getUUID();


      // 🐛 Debug log UUID
      console.log("📌 Sending UUID to backend:", deviceUuid);

      // Get FCM token if available (optional)
      const fcmToken = ''; // You can implement FCM token retrieval here

      const result = await verifyOtp(tempPhoneNumber, otp, deviceUuid, fcmToken);

      // 🐛 Debug log response
      console.log("✅ verifyOtp response:", result);

      if (result.success) {
        // Store the authentication token
        const authToken = result.data?.token || result.token;
        if (authToken) {
          localStorage.setItem(TOKEN_STORAGE_KEY, authToken);

          // Fetch user profile data
          const userProfile = await fetchUserProfile(authToken);
          if (userProfile.success) {
            // Store user data in context and localStorage
            setUserData(userProfile.data);
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userProfile.data));

            // Also store the verified phone
            confirmPhoneNumber();
            localStorage.setItem(PHONE_STORAGE_KEY, tempPhoneNumber);

            onClose();
          } else {
            setError('Failed to fetch user data');
          }
        } else {
          setError('Authentication token not received');
        }
      } else {
        setError(result.message || 'Invalid OTP');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Only show input if phone is not stored
  const storedPhone = typeof window !== 'undefined' ? localStorage.getItem(PHONE_STORAGE_KEY) : null;
  if (storedPhone) {
    return null;
  }

  return (
    <Dialog
      open={true}
      onClose={() => { }}   // ⛔ do nothing so user can't close
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-orange-500" />
      <Dialog.Panel className="relative z-10 bg-white rounded-2xl shadow-xl text-center px-4 py-6 w-[340px] focus:outline-none">
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

        {/* Phone input field with country code */}
        <div className="mt-5">
          <div className="flex items-center space-x-2">
            {/* Country code dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center space-x-1 px-3 py-3 border border-gray-300 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[80px]"
              // disabled={otpSent}
              >
                <span>{selectedCountry.flag}</span>
                <span className='text-gray-900 font-bold'>+{selectedCountry.code}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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

            {/* Phone number input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="លេខទូរស័ព្ទ"
              className={`flex-1 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400`}
              // disabled={otpSent}
              maxLength={15}
            />
          </div>
        </div>

        {/* OTP input field (shown after OTP is requested) */}
        {showOtpInput && (
          <div className="mt-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4));
                setError('');
              }}
              placeholder="បញ្ចូលកូដ OTP"
              className="w-full border border-gray-300 rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
              maxLength={4}
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error}
          </p>
        )}

        {/* Conditional buttons */}
        <div className="mt-6">
          {!otpSent ? (
            <button
              onClick={handleRequestOtp}
              // disabled={isLoading}
              className="w-full bg-orange-500 text-white font-semibold rounded-full flex items-center justify-center py-3 hover:bg-orange-600 transition disabled:opacity-50"
            >
              {isLoading ? 'កំពុងផ្ញើ...' : 'យកកូដ'}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              // disabled={isLoading}
              className="w-full bg-green-500 text-white font-semibold rounded-full flex items-center justify-center py-3 hover:bg-green-600 transition disabled:opacity-50"
            >
              {isLoading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'បញ្ជាក់'}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

//Correct with 316 line code changes
