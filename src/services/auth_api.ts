// services/auth_api.ts

// Helper function to encode form data
const encodeFormData = (data: Record<string, string>): string => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
};

// API service functions
export const requestOtp = async (phone: string) => {
    const formData = encodeFormData({ phone });

    const response = await fetch('https://redeemapi.piikmall.com/api/v2/auth/request-otp', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
    return response.json();
};



export const verifyOtp = async (
  phone: string,
  otp: string,
  deviceUuid: string,
  fcmToken?: string // optional
) => {
  const payload: Record<string, string> = {
    phone,
    otp,
    device_uuid: deviceUuid,
    platform: 'web',
  };

  // Only add fcm_token if provided
  if (fcmToken && fcmToken.trim() !== '') {
    payload.fcm_token = fcmToken;
  }

  const formData = encodeFormData(payload);

  const response = await fetch('https://redeemapi.piikmall.com/api/v2/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  return response.json();
};

// Fetch user profile data
export const fetchUserProfile = async (token: string) => {
    const response = await fetch('https://redeemapi.piikmall.com/api/v2/user/profile', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
};

// Storage keys
export const PHONE_STORAGE_KEY = 'userVerifiedPhone';
export const TOKEN_STORAGE_KEY = 'userAuthToken';
export const USER_DATA_STORAGE_KEY = 'userProfileData';