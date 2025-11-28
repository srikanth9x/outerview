"use client";
import React, { useEffect, useState } from 'react';
import { fetchProblemList, ProblemSummary } from '@/lib/leetcode';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight, Search, Filter } from 'lucide-react';
import clsx from 'clsx';
import Container from '@/components/Container';

const PROBLEMS_PER_PAGE = 50;

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

export default function ProblemList() {
    const [allProblems, setAllProblems] = useState<ProblemSummary[]>([]);
    const [filteredProblems, setFilteredProblems] = useState<ProblemSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');

    useEffect(() => {
        loadInitialProblems();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allProblems, searchQuery, difficultyFilter]);

    const loadInitialProblems = async () => {
        setLoading(true);
        const list = await fetchProblemList(PROBLEMS_PER_PAGE, 0);
        setAllProblems(list);
        setHasMore(list.length === PROBLEMS_PER_PAGE);
        setLoading(false);
    };

    const loadMoreProblems = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const skip = allProblems.length;
        const newProblems = await fetchProblemList(PROBLEMS_PER_PAGE, skip);

        if (newProblems.length > 0) {
            setAllProblems([...allProblems, ...newProblems]);
            setHasMore(newProblems.length === PROBLEMS_PER_PAGE);
        } else {
            setHasMore(false);
        }

        setLoadingMore(false);
    };

    const applyFilters = () => {
        let filtered = [...allProblems];

        // Apply difficulty filter
        if (difficultyFilter !== 'All') {
            filtered = filtered.filter(p => p.difficulty === difficultyFilter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.questionFrontendId.includes(query)
            );
        }

        setFilteredProblems(filtered);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-900/20 text-green-400 border-green-900/50';
            case 'Medium': return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50';
            case 'Hard': return 'bg-red-900/20 text-red-400 border-red-900/50';
            default: return 'bg-gray-900/20 text-gray-400 border-gray-900/50';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-9rem)]">
                <Loader2 className="animate-spin text-white" size={48} />
            </div>
        );
    }

    return (
        <Container className="shadow-lg shadow-white">
            <div className="h-[calc(100vh-9rem)] flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Coding Problems</h1>
                        <div className="text-sm text-gray-400">
                            {filteredProblems.length} problems {allProblems.length > filteredProblems.length && `(filtered from ${allProblems.length})`}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search problems by title or number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                            />
                        </div>

                        {/* Difficulty Filter */}
                        <div className="flex gap-2">
                            {(['All', 'Easy', 'Medium', 'Hard'] as DifficultyFilter[]).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficultyFilter(diff)}
                                    className={clsx(
                                        "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                                        difficultyFilter === diff
                                            ? diff === 'All'
                                                ? 'bg-white text-black border-white'
                                                : diff === 'Easy'
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : diff === 'Medium'
                                                        ? 'bg-yellow-600 text-white border-yellow-600'
                                                        : 'bg-red-600 text-white border-red-600'
                                            : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-600'
                                    )}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Problem List */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {filteredProblems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-gray-500"
                            >
                                <Filter size={48} className="mb-4 opacity-50" />
                                <p>No problems found matching your filters</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {filteredProblems.map((problem, index) => (
                                    <motion.div
                                        key={problem.titleSlug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                    >
                                        <Link
                                            href={`/coding/${problem.titleSlug}`}
                                            className="block group"
                                        >
                                            <div className="flex items-center justify-between p-4 bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <span className="text-gray-500 font-mono text-sm shrink-0">
                                                        #{problem.questionFrontendId}
                                                    </span>
                                                    <span className="text-white font-medium truncate group-hover:text-gray-200 transition-colors">
                                                        {problem.title}
                                                    </span>
                                                    {problem.isPaidOnly && (
                                                        <span className="px-2 py-0.5 bg-yellow-900/20 text-yellow-500 text-xs font-medium rounded border border-yellow-900/50 shrink-0">
                                                            Premium
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={clsx(
                                                        "px-3 py-1 text-xs font-medium rounded border",
                                                        getDifficultyColor(problem.difficulty)
                                                    )}>
                                                        {problem.difficulty}
                                                    </span>
                                                    <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Load More Button */}
                    {hasMore && filteredProblems.length > 0 && difficultyFilter === 'All' && !searchQuery && (
                        <div className="flex justify-center mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={loadMoreProblems}
                                disabled={loadingMore}
                                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    `Load More Problems`
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
