"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";
import { juices } from "./data/juices";

export default function Home() {
    const [showShop, setShowShop] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const hasVisited = localStorage.getItem('hasVisitedBefore');
        if (!hasVisited) {
            setShowShop(false);
            localStorage.setItem('hasVisitedBefore', 'true');
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleShopTransition = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowShop(true);
            setIsTransitioning(false);
        }, 800);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
            {!showShop ? (
                <div className={`min-h-screen flex flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50
                    ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-orange-600 animate-slideDown">
                            Organic Things
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium animate-fadeIn max-w-2xl px-4">
                            Premium organic juices for your wellness journey. Fresh, natural, and delivered to your doorstep.
                        </p>
                    </div>
                    <button
                        onClick={handleShopTransition}
                        className="bg-orange-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-bounce touch-manipulation"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className={`min-h-screen ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
                    {/* Mobile-Optimized Header */}
                    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-orange-600 animate-slideDown">
                                    Organic Things
                                </h1>
                                <div className="flex items-center space-x-3 sm:space-x-6">
                                <Link href="/event" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm sm:text-base hidden sm:block">
                                        Events
                                    </Link>
                                    <Link href="/packages" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm sm:text-base hidden sm:block">
                                        Packages
                                    </Link>
                                    <Link href="/bulk" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm sm:text-base hidden sm:block">
                                        Bulk Order
                                    </Link>
                                    <Link href="/checkout" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation">
                                        <Image src="/Cart.jpeg" alt="Cart" width={28} height={28} className="sm:w-8 sm:h-8 opacity-80" />
                                    </Link>
                                </div>
                            </div>
                            {/* Mobile Navigation */}
                            <div className="flex justify-center space-x-4 mt-3 sm:hidden">
                                <Link href="/packages" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm">
                                    Packages
                                </Link>
                                <Link href="/bulk" className="text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm">
                                    Bulk Orders
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-8 sm:py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Fresh Organic Juices
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                Discover our premium selection of handcrafted organic juices, carefully sourced and prepared for your health and wellness.
                            </p>
                        </div>
                    </section>

                    {/* Product Grid */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            {Object.entries(juices).map(([id, juice]) => (
                                <div
                                    key={id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group w-full max-w-sm m-2"
                                    onClick={() => router.push(`/product/${id}`)}
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                                        <Image
                                            src={juice.image}
                                            alt={juice.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Organic
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                            {juice.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                                            {juice.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-orange-600">
                                                GH₵{juice.price.toFixed(2)}
                                            </span>
                                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gray-900 text-white py-8 sm:py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Organic Things</h3>
                                    <p className="text-gray-400 text-sm sm:text-base">
                                        Organic products, Organic people, 
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
                                    <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                                        <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
                                        <li><Link href="/bulk" className="hover:text-white transition-colors">Bulk Orders</Link></li>
                                        <li><Link href="/checkout" className="hover:text-white transition-colors">Cart</Link></li>
                                        <li><Link href="/event" className="hover:text-white transition-colors">Event</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
                                    <p className="text-gray-400 text-sm sm:text-base">
                                        Email: info@organicthings.com<br />
                                        Phone: +233 27 598 2028
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
                                <p>&copy; 2024 Organic Things. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            )}
        </div>
    );
}
