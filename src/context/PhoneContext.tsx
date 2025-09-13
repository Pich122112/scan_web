"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Wallet {
  wallet_id: number;
  wallet_name: string;
  wallet_code: string;
  balance: number;
}

interface UserData {
  id: number;
  name: string;
  status: number;
  phone_number: string;
  user_type: number;
  passcode: number;
  signature: string;
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
  useEffect(() => {
    const storedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Failed to parse stored user data", e);
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
