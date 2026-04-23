"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Wallet {
  wallet_id: number;
  wallet_name: string;
  wallet_code: string;
  balance: number;
}

// ⚠️ SECURITY WARNING (Finding #3): User data contains sensitive fields
// - passcode: User's PIN (should NOT be stored in localStorage)
// - signature: User's signature (should NOT be stored in localStorage)
// - phone_number: PII (should be minimized)
// Backend should remove passcode and signature from API response
interface UserData {
  id: number;
  name: string;
  status: number;
  phone_number: string; // ⚠️ Sensitive - should not be stored
  user_type: number;
  passcode: number;
  signature: string; // ⚠️ Sensitive - should not be stored
  wallets: Wallet[];
}

interface PhoneContextType {
  tempPhoneNumber: string;
  setTempPhoneNumber: (phone: string) => void;
  confirmPhoneNumber: () => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const usePhone = () => {
  const context = useContext(PhoneContext);
  if (context === undefined) {
    throw new Error('usePhone must be used within a PhoneProvider');
  }
  return context;
};

interface PhoneProviderProps {
  children: ReactNode;
}

const USER_DATA_STORAGE_KEY = "userProfileData";


export const PhoneProvider: React.FC<PhoneProviderProps> = ({ children }) => {
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  const confirmPhoneNumber = () => {
    // Any additional logic when phone number is confirmed
  };

  // ✅ Hydrate userData from localStorage on app load
  // ⚠️ SECURITY WARNING (Finding #3): Reading user data from localStorage
  // Contains sensitive data (passcode, signature). Backend should:
  // 1. Remove passcode and signature from API response
  // 2. Migrate to HttpOnly cookies
  useEffect(() => {
    const storedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
      }
    }
  }, []);

  return (
    <PhoneContext.Provider
      value={{
        tempPhoneNumber,
        setTempPhoneNumber,
        confirmPhoneNumber,
        userData,
        setUserData,
      }}
    >
      {children}
    </PhoneContext.Provider>
  );
};
