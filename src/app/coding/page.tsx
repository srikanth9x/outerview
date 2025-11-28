"use client";
import React, { useEffect, useState } from 'react';
import { fetchProblemList, ProblemSummary } from '@/lib/leetcode';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Container from '@/components/Container';

export default function ProblemList() {
    const [problems, setProblems] = useState<ProblemSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProblems = async () => {
            const list = await fetchProblemList(50);
            setProblems(list);
            setLoading(false);
        };
        loadProblems();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-9rem)]">
                <Loader2 className="animate-spin text-blue-400" size={48} />
            </div>
        );
    }

    return (
        <Container className="shadow-lg shadow-white">
            <div className="h-[calc(100vh-9rem)] flex flex-col gap-6 p-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Coding Problems</h1>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-green-900/20 text-green-400 text-xs font-medium rounded border border-green-900/50">
                            Easy
                        </div>
                        <div className="px-3 py-1 bg-yellow-900/20 text-yellow-400 text-xs font-medium rounded border border-yellow-900/50">
                            Medium
                        </div>
                        <div className="px-3 py-1 bg-red-900/20 text-red-400 text-xs font-medium rounded border border-red-900/50">
                            Hard
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {problems.map((problem, index) => (
                        <Link key={problem.questionFrontendId} href={`/coding/${problem.titleSlug}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-xl hover:bg-gray-800/60 transition-all hover:border-gray-700 overflow-hidden"
                            >
                                <div className="flex items-center gap-4 z-10">
                                    <span className="text-gray-500 font-mono text-sm w-8">{problem.questionFrontendId}</span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                            {problem.title}
                                        </span>
                                        <span className={clsx(
                                            "text-xs mt-1 w-fit px-2 py-0.5 rounded",
                                            problem.difficulty === 'Easy' && "bg-green-900/20 text-green-400",
                                            problem.difficulty === 'Medium' && "bg-yellow-900/20 text-yellow-400",
                                            problem.difficulty === 'Hard' && "bg-red-900/20 text-red-400"
                                        )}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 z-10">
                                    {problem.isPaidOnly && (
                                        <span className="text-xs text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-900/30">
                                            Premium
                                        </span>
                                    )}
                                    <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </Container>
    );
}
