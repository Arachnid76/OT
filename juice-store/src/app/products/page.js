'use client';

import { useState } from 'react';
import Image from 'next/image';
import { juices } from '../data/juices'; // Assuming this path is correct
import { useCart } from '../hooks/useCart'; // Assuming this path is correct
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (id, value) => {
        const newQuantity = Math.max(0, Number(value));
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    const handleAddToCart = (productId) => {
        const product = juices[productId];
        const quantity = quantities[productId] || 0;

        if (!product || !product.available) {
            alert('This product is currently unavailable.');
            return;
        }

        if (quantity <= 0) {
            alert('Please enter a quantity to add to the cart.');
            return;
        }

        // Assuming useCart().addToCart handles the logic of adding to the cart
        addToCart({
            id: Number(productId),
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });

        alert(`${quantity} of ${product.name} added to cart!`);
        // Reset quantity for this product after adding to cart for better UX
        setQuantities(prev => ({ ...prev, [productId]: 0 }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">All Juices</h1>
                    <div>
                        <button
                            onClick={() => router.push('/')}
                            className="mr-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
                        >
                            Go to Cart
                        </button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.entries(juices).map(([id, product]) => (
                      <div key={id} className="relative bg-white rounded-xl shadow-lg overflow-hidden p-4 flex flex-col justify-between">
                        <div>
                            <div className="relative h-48 w-full mb-4">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                                  Organic
                                </span>
                              </div>
                              {!product.available && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                  <span