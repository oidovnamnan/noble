export default function TestDebugPage() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold text-green-600">Deployment Works!</h1>
            <p>If you see this, the server is serving new files correctly.</p>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg inline-block">
                <p className="font-bold text-blue-600">Version 2 CHECK</p>
                <p className="text-sm text-gray-500">Update pushed at 19:37</p>
            </div>
        </div>
    );
}
