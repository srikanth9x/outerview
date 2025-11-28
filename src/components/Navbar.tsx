import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Outerview
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                            Home
                        </Link>
                        <Link href="/coding" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                            Coding
                        </Link>
                        <Link href="/communication" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                            Communication
                        </Link>
                        <Link href="/feedback" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
                            Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
