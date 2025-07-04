'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { juices } from '../data/juices';
import { useCart } from '../hooks/useCart';

export default function BulkPage() {
    const router = useRouter();
    const { addToCart, clearCart } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantities, setQuantities] = useState({});

    const juiceEntries = Object.entries(juices);

    const nextProduct = () => {
        setCurrentIndex((prev) => (prev + 1) % juiceEntries.length);
    };

    const prevProduct = () => {
        setCurrentIndex((prev) => (prev - 1 + juiceEntries.length) % juiceEntries.length);
    };

    const updateQuantity = (id, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, newQuantity)
        }));
    };

    const handleAddToCart = () => {
        const itemsToAdd = [];
        Object.entries(quantities).forEach(([id, quantity]) => {
            if (quantity > 0) {
                const juice = juices[id];
                itemsToAdd.push({
                    id: Number(id),
                    name: juice.name,
                    price: juice.price,
                    quantity: quantity,
                    image: juice.image
                });
            }
        });

        if (itemsToAdd.length > 0) {
            // Directly set the cart in localStorage
            localStorage.setItem('cart', JSON.stringify(itemsToAdd));
            
            // Navigate to checkout
            router.push('/checkout');
        } else {
            alert('Please select at least one item');
        }
    };

    const currentJuice = juiceEntries[currentIndex];
    const [id, juice] = currentJuice;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Home Button */}
            <div className="p-6 flex justify-center">
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
                >
                    Back to Home
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    Bulk Orders
                </h1>

                {/* Product Display */}
                <div className="relative w-full max-w-6xl">
                    {/* Left Arrow */}
                    <button
                        onClick={prevProduct}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Product Cards Container */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Previous Product Preview */}
                        <div className="w-48 h-64 relative opacity-30 transform scale-75 transition-all duration-500 ease-in-out">
                            <div className="bg-white rounded-xl shadow-md p-4 h-full">
                                <div className="w-full h-32 relative mb-3">
                                    <Image
                                        src={juiceEntries[(currentIndex - 1 + juiceEntries.length) % juiceEntries.length][1].image}
                                        alt="Previous"
                                        fill
                                        className="object-cover rounded-lg transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 truncate transition-all duration-500">
                                    {juiceEntries[(currentIndex - 1 + juiceEntries.length) % juiceEntries.length][1].name}
                                </h3>
                                <p className="text-xs text-orange-600 font-bold transition-all duration-500">
                                    GHS {juiceEntries[(currentIndex - 1 + juiceEntries.length) % juiceEntries.length][1].price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Current Product Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out transform animate-fadeIn">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Product Image */}
                                <div className="w-60 h-96 relative flex-shrink-0">
                                    <Image
                                        src={juice.image}
                                        alt={juice.name}
                                        fill
                                        className="object-cover rounded-xl shadow-md transition-transform duration-500"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 transition-all duration-500">
                                        {juice.name}
                                    </h2>
                                    <p className="text-2xl text-orange-600 font-bold mb-4 transition-all duration-500">
                                        GHS {juice.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-700 mb-6 transition-all duration-500">
                                        {juice.description}
                                    </p>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-center md:justify-start mb-6">
                                        <label className="mr-4 text-lg font-medium text-gray-700">
                                            Quantity:
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-100 px-2 py-1">
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-2xl font-bold text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
                                                onClick={() => updateQuantity(id, (quantities[id] || 0) - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="w-16 text-center text-2xl font-bold select-none bg-white rounded mx-2 text-black transition-all duration-300">
                                                {quantities[id] || 0}
                                            </span>
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-2xl font-bold text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
                                                onClick={() => updateQuantity(id, (quantities[id] || 0) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Counter */}
                                    <p className="text-gray-500 text-sm transition-all duration-500">
                                        {currentIndex + 1} of {juiceEntries.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Next Product Preview */}
                        <div className="w-48 h-64 relative opacity-30 transform scale-75 transition-all duration-500 ease-in-out">
                            <div className="bg-white rounded-xl shadow-md p-4 h-full">
                                <div className="w-full h-32 relative mb-3">
                                    <Image
                                        src={juiceEntries[(currentIndex + 1) % juiceEntries.length][1].image}
                                        alt="Next"
                                        fill
                                        className="object-cover rounded-lg transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 truncate transition-all duration-500">
                                    {juiceEntries[(currentIndex + 1) % juiceEntries.length][1].name}
                                </h3>
                                <p className="text-xs text-orange-600 font-bold transition-all duration-500">
                                    GHS {juiceEntries[(currentIndex + 1) % juiceEntries.length][1].price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextProduct}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="p-6 flex justify-center">
                <button
                    onClick={handleAddToCart}
                    className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 transform hover:scale-105"
                >
                    Add to Cart & Checkout
                </button>
            </div>
        </div>
    );
} 