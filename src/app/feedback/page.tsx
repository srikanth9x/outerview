"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MessageCircle, Brain, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Container from '@/components/Container';

export default function Feedback() {
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
        <Container className="shadow-lg shadow-white">
            <div className="space-y-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Performance Insights
                    </h1>
                    <p className="text-gray-400">Detailed analysis of your recent practice sessions</p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* Metrics Section */}
                    <motion.div variants={item} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                            <TrendingUp className="text-gray-400" /> Session Metrics
                        </h2>
                        <div className="space-y-6">
                            {[
                                { label: "Code Quality", score: 85, icon: <Brain size={18} /> },
                                { label: "Communication", score: 78, icon: <MessageCircle size={18} /> },
                                { label: "Problem Solving", score: 92, icon: <TrendingUp size={18} /> }
                            ].map((metric, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2 text-sm font-medium">
                                        <span className="flex items-center gap-2 text-gray-300">
                                            {metric.icon} {metric.label}
                                        </span>
                                        <span className="text-white">{metric.score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.score}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: "easeOut" }}
                                            className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <motion.div variants={item} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-white/50 transition-colors shadow-lg group">
                            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                <CheckCircle size={20} /> Strengths
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Strong problem-solving approach",
                                    "Clean and readable code structure",
                                    "Excellent time management"
                                ].map((strength, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + i * 0.1 }}
                                        className="flex items-start gap-2 text-gray-300 group-hover:text-white transition-colors"
                                    >
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                        {strength}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Areas for Improvement */}
                        <motion.div variants={item} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-400/50 transition-colors shadow-lg group">
                            <h3 className="text-lg font-semibold mb-4 text-gray-400 flex items-center gap-2">
                                <AlertTriangle size={20} /> Areas for Growth
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Consider edge cases earlier in solution",
                                    "Articulate thought process more clearly",
                                    "Review time complexity analysis"
                                ].map((area, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.3 + i * 0.1 }}
                                        className="flex items-start gap-2 text-gray-300 group-hover:text-white transition-colors"
                                    >
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                        {area}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-white hover:bg-gray-200 rounded-xl font-bold text-lg text-black shadow-lg shadow-white/25 transition-all flex items-center justify-center gap-2"
                    >
                        Start New Practice Session <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </div>
        </Container>
    );
}
