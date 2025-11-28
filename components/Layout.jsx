import React from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Outerview
                            </Link>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                                Home
                            </Link>
                            <Link href="/coding" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                                Coding
                            </Link>
                            <Link href="/communication" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                                Communication
                            </Link>
                            <Link href="/feedback" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                                Feedback
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
