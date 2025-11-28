"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Code, Award, Clock, MessageSquare, Target, Zap } from 'lucide-react';
import { getSessionStats, getDashboardMetrics } from '@/lib/sessionStore';
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
    const [dashboardMetrics, setDashboardMetrics] = useState<ReturnType<typeof getDashboardMetrics> | null>(null);

    useEffect(() => {
        setSessionStats(getSessionStats());
        setDashboardMetrics(getDashboardMetrics());
    }, []);

    const stats = sessionStats || propStats || {
        totalSessions: 0,
        passedSessions: 0,
        avgScore: 0
    };

    const metrics = dashboardMetrics || {
        codeAccuracy: 0,
        confidenceLevel: 0,
        communicationScore: 0,
        answerAccuracy: 0,
        totalCodingSessions: 0,
        totalCommunicationSessions: 0
    };

    // Main metric cards
    const mainMetrics = [
        {
            label: 'Code Accuracy',
            value: `${metrics.codeAccuracy}%`,
            rawValue: metrics.codeAccuracy,
            icon: <Code size={28} />,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-900/10',
            borderColor: 'border-blue-500/20',
            hoverBorder: 'group-hover:border-blue-500/50',
            description: `Based on ${metrics.totalCodingSessions} coding session${metrics.totalCodingSessions !== 1 ? 's' : ''}`,
            progressColor: 'bg-blue-500'
        },
        {
            label: 'Confidence Level',
            value: `${metrics.confidenceLevel}%`,
            rawValue: metrics.confidenceLevel,
            icon: <Target size={28} />,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-900/10',
            borderColor: 'border-green-500/20',
            hoverBorder: 'group-hover:border-green-500/50',
            description: `Based on ${metrics.totalCommunicationSessions} communication session${metrics.totalCommunicationSessions !== 1 ? 's' : ''}`,
            progressColor: 'bg-green-500'
        },
        {
            label: 'Communication Score',
            value: `${metrics.communicationScore}%`,
            rawValue: metrics.communicationScore,
            icon: <MessageSquare size={28} />,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-900/10',
            borderColor: 'border-purple-500/20',
            hoverBorder: 'group-hover:border-purple-500/50',
            description: 'AI feedback quality rating',
            progressColor: 'bg-purple-500'
        },
        {
            label: 'Answer Accuracy',
            value: `${metrics.answerAccuracy}%`,
            rawValue: metrics.answerAccuracy,
            icon: <Award size={28} />,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-900/10',
            borderColor: 'border-orange-500/20',
            hoverBorder: 'group-hover:border-orange-500/50',
            description: 'AI-evaluated answer quality',
            progressColor: 'bg-orange-500'
        }
    ];

    const getScoreGrade = (score: number) => {
        if (score >= 90) return { grade: 'A+', color: 'text-green-400' };
        if (score >= 80) return { grade: 'A', color: 'text-green-400' };
        if (score >= 70) return { grade: 'B', color: 'text-blue-400' };
        if (score >= 60) return { grade: 'C', color: 'text-yellow-400' };
        if (score >= 50) return { grade: 'D', color: 'text-orange-400' };
        return { grade: 'F', color: 'text-red-400' };
    };

    return (
        <div className="space-y-8">
            {/* Main Metrics - Large Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainMetrics.map((metric, index) => {
                    const gradeInfo = getScoreGrade(metric.rawValue);
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${metric.bgColor} backdrop-blur-sm p-8 rounded-2xl border ${metric.borderColor} ${metric.hoverBorder} transition-all duration-300 group hover:shadow-2xl relative overflow-hidden`}
                        >
                            {/* Background gradient effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            <div className="relative z-10">
                                {/* Icon and Label */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`bg-gradient-to-br ${metric.color} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {metric.icon}
                                    </div>
                                    <div className={`text-4xl font-black ${gradeInfo.color}`}>
                                        {gradeInfo.grade}
                                    </div>
                                </div>

                                {/* Metric Label */}
                                <p className="text-gray-400 text-sm mb-2 font-medium uppercase tracking-wider">{metric.label}</p>

                                {/* Large Value */}
                                <p className="text-5xl font-bold text-white mb-4">{metric.value}</p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-700 mb-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.rawValue}%` }}
                                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                        className={`h-full ${metric.progressColor} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                                    />
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-xs">{metric.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1 font-medium">Total Sessions</p>
                            <p className="text-3xl font-bold text-white">{sessionStats?.totalSessions || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg text-white shadow-lg">
                            <Zap size={24} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1 font-medium">Passed</p>
                            <p className="text-3xl font-bold text-white">{sessionStats?.passedSessions || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg text-white shadow-lg">
                            <Award size={24} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1 font-medium">Avg Score</p>
                            <p className="text-3xl font-bold text-white">{sessionStats?.avgScore || 0}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg text-white shadow-lg">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Difficulty Breakdown */}
            {sessionStats && sessionStats.totalSessions > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
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
                                            transition={{ duration: 1, delay: 0.7 }}
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
                    transition={{ delay: 0.7 }}
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
                                transition={{ delay: 0.8 + index * 0.1 }}
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
