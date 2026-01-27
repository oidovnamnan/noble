export default function TestDebugPage() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold text-green-600">Deployment Works!</h1>
            <p>If you see this, the server is serving new files correctly.</p>
            <div className="mt-8 p-4 bg-green-50 rounded-lg inline-block">
                <p className="font-bold text-green-600">Version 4 DEBUG CONFIG</p>
                <p className="text-sm text-gray-500">Update pushed at 19:54</p>
            </div>

            <div className="mt-8 text-left max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold mb-4">Firebase Config Check:</h2>
                <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
                    {JSON.stringify({
                        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                        apiKeyPrefix: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5) + '...' : 'UNDEFINED',
                        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
                    }, null, 2)}
                </pre>
                <p className="text-xs text-gray-500 mt-2">
                    If any of these are "UNDEFINED" or empty, Vercel Environment Variables are missing.
                </p>
            </div>
        </div>
    );
}
