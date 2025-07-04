"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/hooks/useCart';
import LoadingScreen from '../components/LoadingScreen';

export default function Checkout() {
    const router = useRouter();
    const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCheckout = async () => {
        if (!phone) {
            alert('Please enter your phone number to proceed.');
            return;
        }
        setIsProcessing(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    name,
                    items: cartItems,
                    total,
                }),
            });
            const data = await response.json();
            if (data.success) {
                // Redirect to Paystack payment page
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.message || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            alert(`An error occurred during checkout: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <LoadingScreen />;

    if (!cartItems.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some delicious organic juices to get started!</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
            {/* Mobile-Optimized Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm touch-manipulation"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Return</span>
                        </button>
                        <h1 className="text-lg sm:text-2xl font-bold text-orange-600">
                            Shopping Cart
                        </h1>
                        <div className="w-16 sm:w-20"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                            <div className="space-y-4 sm:space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-orange-600 font-bold text-sm sm:text-base">GH₵{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 sm:px-3 py-1 sm:py-1 text-base sm:text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 sm:px-4 py-1 sm:py-1 text-base sm:text-lg text-orange-400 font-semibold bg-gray-50 min-w-[40px] sm:min-w-[50px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 sm:px-3 py-1 sm:py-1 text-base sm:text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors touch-manipulation"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors touch-manipulation p-1"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 sticky top-24">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Details</h3>
                            
                            {/* Phone Input */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    required
                                />
                            </div>
                            {/* Name Input (optional) */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name (optional)"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-sm sm:text-base"
                                />
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <div className="flex justify-between text-orange-600 text-sm sm:text-base">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>GH₵{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 sm:pt-3">
                                    <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>GH₵{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing || !phone}
                                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold transition-all duration-300 transform touch-manipulation ${
                                        isProcessing || !phone
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors touch-manipulation text-sm sm:text-base"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl">
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-orange-800">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure payment powered by Paystack</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
