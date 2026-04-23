// services/auth_api.ts

export const requestOtp = async (phone: string) => {
  try {
    const formData = new FormData();
    formData.append('phone', phone);
    const response = await fetch('https://api.sandbox.gzb.app/api/v2/auth/request-otp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-App-Package': 'com.ganzberg.scanprizefront'
        // DO NOT set Content-Type! The browser will set the correct one for FormData.
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const verifyOtp = async (
  phone: string,
  otp: string,
  deviceUuid: string,
  fcmToken?: string
) => {
  try {
    const payload: Record<string, string> = {
      phone,
      otp,
      device_uuid: deviceUuid,
      platform: 'web',
    };
    if (fcmToken && fcmToken.trim() !== '') {
      payload.fcm_token = fcmToken;
    }
    const response = await fetch('https://api.sandbox.gzb.app/api/v2/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-App-Package': 'com.ganzberg.scanprizefront'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const fetchUserProfile = async (token: string) => {
  try {
    const response = await fetch('https://api.sandbox.gzb.app/api/v2/user/profile', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Package': 'com.ganzberg.scanprizefront'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
};

export const checkApiHealth = async () => {
  try {
    const response = await fetch('https://api.sandbox.gzb.app/api/v2/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-App-Package': 'com.ganzberg.scanprizefront'
      },
    });
    return response.ok;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

export const PHONE_STORAGE_KEY = 'userVerifiedPhone';
export const TOKEN_STORAGE_KEY = 'userAuthToken';
export const USER_DATA_STORAGE_KEY = 'userProfileData';

