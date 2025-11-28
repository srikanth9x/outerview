"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code, MessageSquare, Activity, Home } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: <Home size={18} /> },
        { href: '/coding', label: 'Coding', icon: <Code size={18} /> },
        { href: '/communication', label: 'Communication', icon: <MessageSquare size={18} /> },
        { href: '/feedback', label: 'Feedback', icon: <Activity size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-gray-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            O
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Outerview
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 group",
                                        isActive
                                            ? "text-white bg-gray-800/50 border border-[var(--border-color)]"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800/30 border border-transparent hover:border-[var(--border-color)]"
                                    )}
                                >
                                    <span className={clsx(
                                        "transition-colors duration-200",
                                        isActive ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400"
                                    )}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 rounded-md bg-gray-800/50 border border-[var(--border-color)] -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
