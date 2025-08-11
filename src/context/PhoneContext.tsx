"use client";

import { createContext, useContext, useState } from 'react';

const PhoneContext = createContext<{
    phoneNumber: string;
    tempPhoneNumber: string;
    setTempPhoneNumber: (phone: string) => void;
    confirmPhoneNumber: () => void;
}>(null!);

export const PhoneProvider = ({ children }: { children: React.ReactNode }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tempPhoneNumber, setTempPhoneNumber] = useState('');

    const confirmPhoneNumber = () => {
        setPhoneNumber(tempPhoneNumber);
    };

    return (
        <PhoneContext.Provider value={{ phoneNumber, tempPhoneNumber, setTempPhoneNumber, confirmPhoneNumber }}>
            {children}
        </PhoneContext.Provider>
    );
};

export const usePhone = () => useContext(PhoneContext);
