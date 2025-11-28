"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MessageCircle, Brain, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import Container from '@/components/Container';
import { generatePerformanceInsights, type PerformanceInsights } from '@/lib/performanceInsights';
import Link from 'next/link';

export default function Feedback() {
    const [insights, setInsights] = useState<PerformanceInsights | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInsights() {
            try {
                const data = await generatePerformanceInsights();
                setInsights(data);
            } catch (error) {
                console.error("Failed to load insights:", error);
                // Set default insights on error
                setInsights({
                    metrics: {
                        codeQuality: 0,
                        communication: 0,
                        problemSolving: 0
                    },
                    strengths: [
                        "Ready to start your practice journey",
                        "Clean slate for improvement",
                        "Opportunity to build strong foundations"
                    ],
                    areasForGrowth: [
                        "Complete coding practice sessions",
                        "Practice communication skills",
                        "Build consistent practice habits"
                    ]
                });
            } finally {
                setLoading(false);
            }
        }

        loadInsights();
    }, []);

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

    const metrics = insights ? [
        { label: "Code Quality", score: insights.metrics.codeQuality, icon: <Brain size={18} /> },
        { label: "Communication", score: insights.metrics.communication, icon: <MessageCircle size={18} /> },
        { label: "Problem Solving", score: insights.metrics.problemSolving, icon: <TrendingUp size={18} /> }
    ] : [];

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
                    <p className="text-gray-400">AI-powered analysis of your practice sessions</p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                        <p className="text-gray-400">Analyzing your performance...</p>
                    </div>
                ) : (
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
                                {metrics.map((metric, index) => (
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
                                    {insights?.strengths.map((strength, i) => (
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
                                    {insights?.areasForGrowth.map((area, i) => (
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

                        <Link href="/coding">
                            <motion.button
                                variants={item}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-white hover:bg-gray-200 rounded-xl font-bold text-lg text-black shadow-lg shadow-white/25 transition-all flex items-center justify-center gap-2"
                            >
                                Start New Practice Session <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </Container>
    );
}
