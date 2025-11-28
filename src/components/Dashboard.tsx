"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Code, Award, Clock } from 'lucide-react';
import { getSessionStats } from '@/lib/sessionStore';

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
            bgColor: 'bg-blue-900/20',
            borderColor: 'border-blue-700'
        },
        {
            label: 'Passed',
            value: sessionStats?.passedSessions || 0,
            icon: <Award size={24} />,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-900/20',
            borderColor: 'border-green-700'
        },
        {
            label: 'Avg Score',
            value: `${sessionStats?.avgScore || 0}%`,
            icon: <TrendingUp size={24} />,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-900/20',
            borderColor: 'border-purple-700'
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
                        className={`${stat.bgColor} backdrop-blur-sm p-6 rounded-xl border ${stat.borderColor} hover:scale-105 transition-transform duration-300 group`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
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
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-400" />
                        Difficulty Distribution
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(sessionStats.difficultyBreakdown).map(([difficulty, count]) => {
                            const total = sessionStats.totalSessions;
                            const percentage = total > 0 ? (count / total) * 100 : 0;
                            const color = difficulty === 'Easy' ? 'bg-green-500' : difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

                            return (
                                <div key={difficulty}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">{difficulty}</span>
                                        <span className="text-gray-400">{count} problems ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${color}`}
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
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                                className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${session.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <div>
                                        <div className="font-medium text-gray-200">{session.problemTitle}</div>
                                        <div className="text-xs text-gray-500">
                                            {session.difficulty} • {new Date(session.timestamp).toLocaleDateString()}
                                            {session.timeSpent && ` • ${Math.floor(session.timeSpent / 60)}m ${session.timeSpent % 60}s`}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold">
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
