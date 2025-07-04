"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/hooks/useCart';

export default function ThankYou() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [paymentStatus, setPaymentStatus] = useState('verifying');
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get('reference');
            
            if (!reference) {
                setPaymentStatus('error');
                setError('No payment reference found');
                return;
            }

            try {
                const response = await fetch(`/api/verify-payment?reference=${reference}`);
                const data = await response.json();

                if (data.success) {
                    setPaymentStatus('success');
                    // Clear cart after successful payment
                    clearCart();
                } else {
                    setPaymentStatus('error');
                    setError(data.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setPaymentStatus('error');
                setError('Failed to verify payment');
            }
        };

        verifyPayment();
    }, [searchParams, clearCart]);

    useEffect(() => {
        if (paymentStatus === 'success') {
            const timer = setTimeout(() => {
                router.push('/');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus, router]);

    if (paymentStatus === 'verifying') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-8">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-orange-600 mx-auto"></div>
                    <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
                    <p className="text-gray-600">Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 mx-auto">
                        <svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800">Payment Failed</h1>
                    <p className="text-xl text-gray-600">{error}</p>
                    <Link 
                        href="/checkout" 
                        className="inline-block mt-4 bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 font-medium"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-8">
                {/* Animated Check Mark */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                            className="w-16 h-16 text-green-500 animate-scale-in"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="3" 
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-800 animate-slideDown">
                    Thank You!
                </h1>
                <p className="text-xl text-gray-600 font-medium animate-fadeIn">
                    Your payment was successful and order has been placed.
                </p>
                <p className="text-lg text-gray-500 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                    Redirecting you back to home page...
                </p>
                <Link 
                    href="/" 
                    className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium animate-fadeIn"
                    style={{ animationDelay: '1s' }}
                >
                    Click here if you're not redirected automatically
                </Link>
            </div>
        </div>
    );
} 