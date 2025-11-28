"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Code, Award, Clock } from 'lucide-react';
import { getSessionStats } from '@/lib/sessionStore';
import clsx from 'clsx';

interface DashboardProps {
    stats?: {
        totalSessions: number;
        completedTasks: number;
        avgScore: number;
    };
}

export default function Dashboard({ stats: propStats }: DashboardProps) {
    const [sessionStats, setSessionStats] = useState<ReturnType<typeof getSessionStats> | null>(null);

    useEffect(() => {
        setSessionStats(getSessionStats());
    }, []);

    const stats = sessionStats || propStats || {
        totalSessions: 0,
        passedSessions: 0,
        avgScore: 0
    };

    const statCards = [
        {
            label: 'Total Sessions',
            value: sessionStats?.totalSessions || 0,
            icon: <Code size={24} />,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-900/10',
            borderColor: 'border-blue-500/20',
            hoverBorder: 'group-hover:border-blue-500/50'
        },
        {
            label: 'Passed',
            value: sessionStats?.passedSessions || 0,
            icon: <Award size={24} />,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-900/10',
            borderColor: 'border-green-500/20',
            hoverBorder: 'group-hover:border-green-500/50'
        },
        {
            label: 'Avg Score',
            value: `${sessionStats?.avgScore || 0}%`,
            icon: <TrendingUp size={24} />,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-900/10',
            borderColor: 'border-purple-500/20',
            hoverBorder: 'group-hover:border-purple-500/50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} backdrop-blur-sm p-6 rounded-xl border ${stat.borderColor} ${stat.hoverBorder} transition-all duration-300 group hover:shadow-lg`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {stat.icon}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Difficulty Breakdown */}
            {sessionStats && sessionStats.totalSessions > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                        <TrendingUp size={20} className="text-blue-400" />
                        Difficulty Distribution
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(sessionStats.difficultyBreakdown).map(([difficulty, count]) => {
                            const total = sessionStats.totalSessions;
                            const percentage = total > 0 ? (count / total) * 100 : 0;
                            const color = difficulty === 'Easy' ? 'bg-green-500' : difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

                            return (
                                <div key={difficulty}>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span className="text-gray-300">{difficulty}</span>
                                        <span className="text-gray-400">{count} problems ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-700">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Recent Sessions */}
            {sessionStats && sessionStats.recentSessions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                        <Clock size={20} className="text-purple-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {sessionStats.recentSessions.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gray-900/40 rounded-lg border border-[var(--border-color)] hover:border-gray-600 transition-all hover:bg-gray-800/40 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2.5 h-2.5 rounded-full ${session.passed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                                    <div>
                                        <div className="font-medium text-gray-200 group-hover:text-white transition-colors">{session.problemTitle}</div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <span className={clsx(
                                                "px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                                                session.difficulty === 'Easy' ? "bg-green-900/30 text-green-400 border border-green-900/50" :
                                                    session.difficulty === 'Medium' ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50" :
                                                        "bg-red-900/30 text-red-400 border border-red-900/50"
                                            )}>
                                                {session.difficulty}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                                            {session.timeSpent && (
                                                <>
                                                    <span>•</span>
                                                    <span>{Math.floor(session.timeSpent / 60)}m {session.timeSpent % 60}s</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold bg-gray-900/50 px-3 py-1.5 rounded border border-gray-700">
                                    <span className={session.passed ? 'text-green-400' : 'text-red-400'}>
                                        {session.passedTests}/{session.totalTests}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
