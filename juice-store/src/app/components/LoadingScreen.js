export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 border-8 border-orange-200 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-8 border-orange-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
} 