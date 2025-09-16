'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResultDialog from '@/components/ResultDialog';
import { TOKEN_STORAGE_KEY } from '@/services/auth_api';

interface PrizeData {
    issuer: string;
    amount: number;
    wallet_id: number;
    wallet_name: string;
    new_amount: number;
    label: string;
    status?: string;
}

const isValidCode = (code: string): boolean => {
    const pattern = /^GAC\d{3}C[A-Za-z0-9]+$/;
    return pattern.test(code);
};

export default function TPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [prize, setPrize] = useState<PrizeData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [code, setCode] = useState<string>('');
    const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);

    useEffect(() => {
        // Only run once on mount
        (async () => {
            const resolvedParams = await params;
            let cleanCode = decodeURIComponent(resolvedParams.id);

            // Accept all possible code formats (with /t/, with comma, etc)
            if (cleanCode.includes('/t/')) cleanCode = cleanCode.split('/t/')[1];
            cleanCode = cleanCode.split(',')[0].trim();

            // Support QR with name/phone or phone only
            let userName = '';
            let userPhone = '';

            if (cleanCode.includes('Name:')) {
                const match = cleanCode.match(/Name:(.*),Phone:(\d+)/);
                if (match) {
                    userName = match[1];
                    userPhone = match[2];
                }
            } else if (cleanCode.includes('Phone:')) {
                userPhone = cleanCode.replace('Phone:', '').trim();
            } else if (/^\d{8,}$/.test(cleanCode)) {
                userPhone = cleanCode.trim();
            }

            // Store for HomePage pickup
            if (userPhone) {
                localStorage.setItem('userVerifiedPhone', userPhone);
                if (userName) localStorage.setItem('userName', userName);
            }
            localStorage.setItem('scanCodeRaw', cleanCode);

            // Start backend check (do NOT redirect yet)
            setLoading(true);
            setCode(cleanCode);

            // Accept all possible code formats
            const pattern = /^[A-Z]{2,4}\d{3,4}C[A-Za-z0-9]+$/;
            if (!pattern.test(cleanCode)) {
                setErrorMsg('❌ This is not our code format.');
                setPrize(null);
                setAlreadyRedeemed(false);
                setLoading(false);
                setShowResultDialog(true);
                return;
            }

            // Call API
            try {
                const checkRes = await fetch(
                    `https://api.sandbox.gzb.app/api/v2/redeem-check?code=${encodeURIComponent(cleanCode)}`
                );
                const checkData = await checkRes.json();

                // Error/invalid/redeemed code: Show dialog, do NOT auto-redirect
                if (
                    !checkData.success ||
                    !checkData.data ||
                    (Array.isArray(checkData.data) && checkData.data.length === 0) ||
                    (checkData.message && (
                        checkData.message.toLowerCase().includes('already redeemed') ||
                        checkData.message.toLowerCase().includes('already used') ||
                        checkData.message.toLowerCase().includes('could not be found')
                    ))
                ) {
                    setPrize(null);
                    setErrorMsg('⚠️ This code has already been used.');
                    setAlreadyRedeemed(true);
                    setLoading(false);
                    setShowResultDialog(true);

                    // 🚀 Auto-redirect after 3 seconds
                    setTimeout(() => {
                        setShowResultDialog(false);
                        setPrize(null);
                        router.replace('/');
                    }, 5000);


                    return;
                }

                // Prize found & valid: show dialog, allow user to click "ចូលទៅគេហទំព័រ" to go to homepage
                const d = checkData.data;
                const prizeObj: PrizeData = {
                    issuer: d.issuer?.toString() ?? '',
                    amount: d.point ?? d.amount ?? 0,
                    wallet_id: d.wallet ?? d.wallet_id ?? 0,
                    wallet_name: d.wallet_name ?? '',
                    new_amount: d.new_amount ?? 0,
                    label: d.label || '',
                    status: d.status
                };

                if (!prizeObj.label) {
                    if (prizeObj.wallet_name === "GB") {
                        prizeObj.label = `${prizeObj.amount} Score`;
                    } else if (prizeObj.wallet_name === "D") {
                        prizeObj.label = `${prizeObj.amount} D`;
                    } else if (prizeObj.wallet_name) {
                        prizeObj.label = `${prizeObj.amount} ${prizeObj.wallet_name}`;
                    } else if (prizeObj.amount) {
                        prizeObj.label = `${prizeObj.amount}`;
                    } else {
                        prizeObj.label = 'Prize';
                    }
                }

                // If backend provides status: used (for extra safety)
                if (prizeObj.status && prizeObj.status.toLowerCase().includes('used')) {
                    setPrize(prizeObj);
                    setErrorMsg('⚠️ This code has already been used.');
                    setAlreadyRedeemed(true);
                    setLoading(false);
                    setShowResultDialog(true);
                    // DO NOT AUTO-REDIRECT! User must click button in dialog.
                    return;
                }

                setPrize(prizeObj);
                setErrorMsg(null);
                setAlreadyRedeemed(false);
                setLoading(false);
                setShowResultDialog(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // Only for real network or other code errors!
                setErrorMsg('❌ Failed to process code.');
                setPrize(null);
                setAlreadyRedeemed(false);
                setLoading(false);
                setShowResultDialog(true);
            }

            setIsVerified(!!localStorage.getItem('userVerifiedPhone'));
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // Remove auto route from dialog close (user must click to go homepage)
    const handleDialogClose = async () => {
        // If you want to redeem before closing, you can keep this
        await redeemPrize();
        setShowResultDialog(false);
        setPrize(null);
        router.push('/');
    };

    const handleVerificationSuccess = () => {
        setIsVerified(true);
        redeemPrize();
    };

    const redeemPrize = async () => {
        try {
            if (!isValidCode(code)) {
                setErrorMsg('❌ This is not our code format.');
                return;
            }
            // Check code status again before actual redeem
            const checkRes = await fetch(`https://api.sandbox.gzb.app/api/v2/redeem-check?code=${encodeURIComponent(code)}`);
            if (!checkRes.ok) throw new Error(`Check API error: ${checkRes.status}`);
            const checkData = await checkRes.json();
            if (!checkData.success || !checkData.data) {
                setPrize(null);
                setErrorMsg(checkData.message || '❌ Invalid or already redeemed code.');
                setAlreadyRedeemed(true);
                return;
            }

            // Prepare headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-App-Package': 'com.ganzberg.scanprizefront'
            };
            const token = localStorage.getItem('userAuthToken') || localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // Redeem code
            const response = await fetch('https://api.sandbox.gzb.app/api/v2/redeem/scan', {
                method: 'POST',
                headers,
                body: new URLSearchParams({ code }),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(`Server returned non-JSON response: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            if (data.success === false) {
                setPrize(null);
                setErrorMsg(data.message || '❌ Invalid or already redeemed code.');
                setAlreadyRedeemed(true);
            } else if (data.success && data.data && typeof data.data === 'object') {
                const prizeData = data.data;
                if (!prizeData.label) {
                    prizeData.label = prizeData.wallet_name === "GB"
                        ? `${prizeData.amount} Score`
                        : prizeData.wallet_name === "D"
                            ? `${prizeData.amount} D`
                            : `${prizeData.amount} ${prizeData.wallet_name}`;
                }
                setPrize(prizeData);
                setErrorMsg(null);
                setAlreadyRedeemed(false);
            } else {
                setPrize(null);
                setErrorMsg('❌ Unexpected response from server.');
                setAlreadyRedeemed(false);
            }
        } catch (err) {
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setErrorMsg('❌ Network error. Please check your connection.');
            } else if (err instanceof Error && err.message.includes('HTTP error')) {
                setErrorMsg('❌ Server error. Please try again.');
            } else {
                setErrorMsg('❌ Failed to process request.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            {/* Always show a fallback UI */}
            <p className="text-gray-600">Loading...</p>

            {/* Overlay spinner */}
            {loading && (
                <div className="absolute flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                    <p>🔄 Checking your code...</p>
                </div>
            )}

            {showResultDialog && (
                <ResultDialog
                    prize={prize ? prize.label : null}
                    errorMsg={errorMsg}
                    onClose={handleDialogClose}
                    onVerificationSuccess={handleVerificationSuccess}
                    isVerified={isVerified}
                    code={code}
                    alreadyRedeemed={alreadyRedeemed}
                    prizeRaw={prize}
                />
            )}
        </div>
    );

}

//Correct with 286 line code changes
