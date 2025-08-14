"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/hooks/useCart";
import LoadingScreen from "../components/LoadingScreen";

export default function Checkout() {
    const router = useRouter();
    const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart();

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCheckout = async () => {
        if (!email || !phone) {
            alert("Email and phone number are required.");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    phone,
                    name,
                    items: cartItems
                })
            });

            const data = await response.json();

            if (response.ok && data.success && data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert(`An error occurred during checkout: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayOnDelivery = async () => {
        if (!email || !phone) {
            alert("Email and phone number are required.");
            return;
        }
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        setIsProcessing(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    phone,
                    name,
                    items: cartItems,
                    payOnDelivery: true // flag for backend
                })
            });
            const data = await response.json();
            if (response.ok && data.success && data.orderId) {
                router.push(`/thank-you?reference=${data.orderId}`);
            } else {
                throw new Error(data.message || "Order failed");
            }
        } catch (error) {
            console.error("Pay on Delivery Error:", error);
            alert(`An error occurred: ${error.message}`);
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some delicious organic juices to get started!</p>
                        <button
                            onClick={() => router.push("/")}
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
            {/* Header */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <button onClick={() => router.push("/")} className="text-orange-600 font-medium">
                        ← Back
                    </button>
                    <h1 className="text-lg font-bold text-orange-600">Checkout</h1>
                    <div></div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Your Items</h2>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-orange-600 font-bold">GH₵{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 border rounded">
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">
                                        +
                                    </button>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-20">
                    <h3 className="text-lg font-bold mb-4">Order Details</h3>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name (optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    {/* Summary */}
                    <div className="mb-4 border-t pt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>GH₵{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Delivery</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>GH₵{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing || !email || !phone}
                        className={`w-full py-3 rounded-lg font-bold ${
                            isProcessing ? "bg-gray-300 text-gray-500" : "bg-orange-600 text-white hover:bg-green-500"
                        }`}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                    <button
                        onClick={handlePayOnDelivery}
                        disabled={isProcessing || !email || !phone}
                        className={`w-full py-3 mt-3 rounded-lg font-bold ${
                            isProcessing ? "bg-gray-300 text-gray-500" : "bg-orange-600 text-white hover:bg-green-500"
                        }`}
                    >
                        Pay on Delivery
                    </button>
                    <button
                        onClick={clearCart}
                        className="w-full mt-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
