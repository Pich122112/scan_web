"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

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

export const PhoneProvider: React.FC<PhoneProviderProps> = ({ children }) => {
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  const confirmPhoneNumber = () => {
    // Any additional logic when phone number is confirmed
  };

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