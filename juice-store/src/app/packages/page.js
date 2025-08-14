'use client';

import { useRouter } from 'next/navigation';

export default function PackagesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
            <button
                onClick={() => router.push('/')}
                className="w-full max-w-xs px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition text-lg mb-8"
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