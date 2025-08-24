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
            const juice = juices[id];
            if (quantity > 0) {
                if (!juice.available) {
                    // Optionally, show a message for unavailable items
                    alert(`${juice.name} is currently unavailable and will not be added to your cart.`);
                    return;
                }
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
            localStorage.setItem('cart', JSON.stringify(itemsToAdd));
            router.push('/checkout');
        } else {
            alert('Please select at least one available item');
        }
    };

    const currentJuice = juiceEntries[currentIndex];
    const [id, juice] = currentJuice;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Home Button */}
            <div className="p-4 flex justify-center sticky top-0 bg-gray-50 z-20">
                <button
                    onClick={() => router.push('/')}
                    className="w-full max-w-xs px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition text-lg"
                >
                    Back to Home
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">

                {/* Product Display */}
                <div className="relative w-full max-w-6xl flex flex-col items-center">
                    <div className="flex w-full justify-between items-center mb-4">
                        <button
                            onClick={prevProduct}
                            className="bg-white border border-gray-300 rounded-lg h-48 w-10 flex items-center justify-center text-lg font-bold text-gray-700 shadow hover:bg-gray-100 transition flex-shrink-0"
                        >
                            {/* Left Arrow */}
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex-1 flex justify-center">
                            {/* Current Product Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md transition-all duration-500 ease-in-out transform animate-fadeIn">
                                <div className="flex flex-col items-center">
                                    <div className="w-40 h-40 sm:w-60 sm:h-96 relative flex-shrink-0 mb-4">
                                        <Image
                                            src={juice.image}
                                            alt={juice.name}
                                            fill
                                            className="object-cover rounded-xl shadow-md transition-transform duration-500"
                                        />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl text-center font-extrabold text-gray-900 mb-2 transition-all duration-500">
                                        {juice.name}
                                    </h2>
                                    <p className="text-xl sm:text-2xl text-orange-600 font-bold mb-2 transition-all duration-500">
                                        GHS {juice.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-700 mb-4 text-center transition-all duration-500">
                                        {juice.description}
                                    </p>
                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-center mb-4">
                                        <label className="mr-2 text-base font-medium text-gray-700">
                                            Qty:
                                        </label>
                                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-100 px-2 py-1">
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
                                                onClick={() => updateQuantity(id, (quantities[id] || 0) - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center text-xl font-bold select-none bg-white rounded mx-2 text-black transition-all duration-300">
                                                {quantities[id] || 0}
                                            </span>
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
                                                onClick={() => updateQuantity(id, (quantities[id] || 0) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm transition-all duration-500 mb-2">
                                        {currentIndex + 1} of {juiceEntries.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={nextProduct}
                            className="bg-white border border-gray-300 rounded-lg h-48 w-10 flex items-center justify-center text-lg font-bold text-gray-700 shadow hover:bg-gray-100 transition flex-shrink-0"
                        >
                            {/* Right Arrow */}
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Juice List for Bulk Selection */}
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-4 sm:p-6 mt-6 transition-all duration-500 ease-in-out transform animate-fadeIn">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Select Juice Quantity for Bulk Order
                    </h3>
                    <div className="flex flex-col">
                        {Object.entries(juices).map(([id, juice]) => (
                            <div key={id} className="flex items-center space-x-4 mb-2">
                                <span className="font-semibold">{juice.name}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={quantities[id] || 0}
                                    onChange={e => setQuantities(q => ({ ...q, [id]: Number(e.target.value) }))}
                                    disabled={!juice.available}
                                    className={`w-16 border rounded px-1 py-0.5 ml-2 ${!juice.available ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}`}
                                    placeholder="Qty"
                                />
                                {!juice.available && (
                                    <span className="text-gray-400 ml-2 text-sm font-medium">Unavailable</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="p-4 flex justify-center sticky bottom-0 bg-gray-50 z-20">
                <button
                    onClick={handleAddToCart}
                    className="w-full max-w-xs bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 transform hover:scale-105"
                >
                    Add to Cart & Checkout
                </button>
            </div>
        </div>
    );
}