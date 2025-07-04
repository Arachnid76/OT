'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/hooks/useCart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { juices } from '../../data/juices';

export default function ProductPage() {
    const { id: idParam } = useParams();
    const id = Number(idParam);
    const product = juices[id];
    const [quantity, setQuantity] = useState(0);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        try {
            addToCart({
                id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image
            });
            router.push('/checkout');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (!product) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex flex-col">
            {/* Compact Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="text-lg font-bold text-orange-600">
                            Organic Things
                        </h1>
                        <div className="w-16"></div>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable on mobile, fixed on desktop */}
            <div className="flex-1 flex items-center justify-center p-4 lg:h-screen lg:overflow-hidden">
                <div className="w-full max-w-6xl h-full lg:max-h-[calc(100vh-80px)]">
                    <div className="bg-white rounded-2xl shadow-xl h-full overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                            {/* Product Image */}
                            <div className="relative h-64 sm:h-80 lg:h-full bg-gradient-to-br from-gray-50 to-gray-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        Organic
                                    </span>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-6 lg:p-8 flex flex-col justify-center h-full overflow-y-auto">
                                <div className="space-y-4">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                            {product.name}
                                        </h1>
                                        <p className="text-xl font-bold text-orange-600 mb-4">
                                            GH₵{product.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Compact Benefits */}
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h3>
                                        <ul className="space-y-1 text-xs lg:text-sm text-gray-700">
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                100% Organic Ingredients
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                No Artificial Preservatives
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Fresh Daily Production
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Compact Quantity Selector */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Quantity
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                                    onClick={() => setQuantity(q => Math.max(0, q - 1))}
                                                >
                                                    -
                                                </button>
                                                <span className="w-16 text-center text-lg font-bold select-none bg-gray-50 px-3 py-2 text-gray-900">
                                                    {quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                                    onClick={() => setQuantity(q => Math.min(99, q + 1))}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={quantity === 0}
                                        className={`w-full py-3 px-6 rounded-lg text-base font-bold transition-all duration-300 transform ${
                                            quantity === 0 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg'
                                        }`}
                                    >
                                        {quantity === 0 ? 'Select Quantity' : `Add to Cart - GH₵${(product.price * quantity).toFixed(2)}`}
                                    </button>

                                    {/* Compact Additional Info */}
                                    <div className="text-center text-xs text-gray-500">
                                        <p>Free delivery on orders over GH₵100 • Same day delivery available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
