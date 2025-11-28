"use client";
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, MessageSquare, Activity, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center md:text-left border-b border-[var(--border-color)] pb-8"
            >
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 tracking-tight">
                    Welcome to Outerview
                </h1>
                <p className="text-gray-400 text-xl max-w-3xl leading-relaxed font-light">
                    Master your technical interview skills with AI-powered practice sessions, real-time feedback, and comprehensive analytics.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Dashboard />
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={item}>
                    <Link href="/coding" className="block h-full p-8 glass-card rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Code size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">Coding Practice</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">Solve algorithmic problems with automated test validation and AI feedback.</p>
                            <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                Start Practice <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/communication" className="block h-full p-8 glass-card rounded-xl hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-green-900/30 border border-green-500/30 rounded-xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">Communication</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">Practice behavioral questions with real-time speech analysis and face detection.</p>
                            <div className="flex items-center text-green-400 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                Start Session <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div variants={item}>
                    <Link href="/feedback" className="block h-full p-8 glass-card rounded-xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-purple-900/30 border border-purple-500/30 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Get Feedback</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">View detailed performance analytics and AI-powered insights.</p>
                            <div className="flex items-center text-purple-400 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                View Insights <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
