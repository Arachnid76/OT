'use client';

import { useRouter } from 'next/navigation';

export default function PackagesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
            <button
                onClick={() => router.push('/')}
                className="mb-8 px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
            >
                Back to Home
            </button>
            
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4 text-center">
                    Packages
                </h1>
                <p className="text-gray-600 text-center">
                    Packages page coming soon...
                </p>
            </div>
        </div>
    );
} 