"use client";
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import Timer from '@/components/Timer';
import { getGroqFeedback } from '@/lib/groq';
import { Play, Lightbulb, Loader2, Sparkles, CheckCircle2, XCircle, RotateCw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { getRandomProblem, Problem } from '@/data/problems';
import { validateCode, generateTestCode, ValidationResult } from '@/lib/testRunner';
import { saveSession } from '@/lib/sessionStore';

type Language = 'javascript' | 'python' | 'cpp';

const languageConfig = {
    javascript: { label: 'JavaScript', pistonLang: 'javascript' },
    python: { label: 'Python', pistonLang: 'python' },
    cpp: { label: 'C++', pistonLang: 'cpp' }
};

export default function Coding() {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
    const [code, setCode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isGettingFeedback, setIsGettingFeedback] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
    const [consoleExpanded, setConsoleExpanded] = useState(true);
    const [startTime, setStartTime] = useState<number>(Date.now());

    useEffect(() => {
        loadNewProblem();
    }, []);

    useEffect(() => {
        if (problem) {
            setCode(problem.starterCode[selectedLanguage]);
        }
    }, [selectedLanguage, problem]);

    const loadNewProblem = () => {
        const newProblem = getRandomProblem();
        setProblem(newProblem);
        setCode(newProblem.starterCode[selectedLanguage]);
        setValidationResult(null);
        setFeedback('');
        setStartTime(Date.now());
    };

    const handleRunTests = async () => {
        if (!problem) return;

        setIsRunning(true);
        setValidationResult(null);
        setConsoleExpanded(true);

        try {
            const pistonLang = languageConfig[selectedLanguage].pistonLang;
            const result = await validateCode(code, problem.testCases, pistonLang);
            setValidationResult(result);

            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            saveSession({
                problemId: problem.id,
                problemTitle: problem.title,
                difficulty: problem.difficulty,
                timestamp: Date.now(),
                passed: result.allPassed,
                passedTests: result.passedCount,
                totalTests: result.totalCount,
                timeSpent
            });

        } catch (error) {
            console.error('Test execution error:', error);
        } finally {
            setIsRunning(false);
        }
    };

    const handleGetFeedback = async () => {
        if (!problem) return;

        setIsGettingFeedback(true);
        setFeedback("");

        try {
            const context = `Problem: ${problem.title}\n\nDescription: ${problem.description}\n\nDifficulty: ${problem.difficulty}\n\nLanguage: ${languageConfig[selectedLanguage].label}`;
            const result = await getGroqFeedback(code, context);
            setFeedback(result);
        } catch (error) {
            setFeedback("Error getting feedback. Make sure GROQ_API_KEY is set in .env");
        } finally {
            setIsGettingFeedback(false);
        }
    };

    if (!problem) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-blue-400" size={48} />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                    <span className={clsx(
                        "px-2 py-1 rounded text-xs font-semibold",
                        problem.difficulty === 'Easy' && "bg-green-900/30 text-green-400 border border-green-700",
                        problem.difficulty === 'Medium' && "bg-yellow-900/30 text-yellow-400 border border-yellow-700",
                        problem.difficulty === 'Hard' && "bg-red-900/30 text-red-400 border border-red-700"
                    )}>
                        {problem.difficulty}
                    </span>

                    {/* Language Selector */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white font-medium hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.entries(languageConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <Timer />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadNewProblem}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white font-medium transition-colors"
                    >
                        <RotateCw size={14} />
                        New Problem
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGetFeedback}
                        disabled={isGettingFeedback}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {isGettingFeedback ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        AI Feedback
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRunTests}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm text-white font-semibold transition-colors disabled:opacity-50"
                    >
                        {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        Run
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Problem Description */}
                <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-900/30">
                    {/* Tabs */}
                    <div className="flex gap-1 px-4 pt-3 border-b border-gray-700/50">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-t transition-colors",
                                activeTab === 'description'
                                    ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            Description
                        </button>
                        {problem.hints && (
                            <button
                                onClick={() => setActiveTab('hints')}
                                className={clsx(
                                    "px-4 py-2 text-sm font-medium rounded-t transition-colors",
                                    activeTab === 'hints'
                                        ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Hints
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div
                                    key="description"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-gray-300 leading-relaxed">
                                        {problem.description}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-white font-semibold">Examples:</h3>
                                        {problem.examples.map((example, idx) => (
                                            <div key={idx} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                                <div className="text-xs text-gray-500 mb-2">Example {idx + 1}:</div>
                                                <div className="font-mono text-sm space-y-1">
                                                    <div>
                                                        <span className="text-gray-400">Input:</span>{' '}
                                                        <span className="text-blue-400">{example.input}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Output:</span>{' '}
                                                        <span className="text-green-400">{example.output}</span>
                                                    </div>
                                                    {example.explanation && (
                                                        <div className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-700">
                                                            <strong>Explanation:</strong> {example.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {feedback && (
                                        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2 text-purple-400 font-semibold">
                                                <Sparkles size={16} /> AI Feedback
                                            </div>
                                            <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                {feedback}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'hints' && problem.hints && (
                                <motion.div
                                    key="hints"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-3"
                                >
                                    <h3 className="text-white font-semibold mb-4">Hints:</h3>
                                    {problem.hints.map((hint, idx) => (
                                        <div key={idx} className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-4">
                                            <div className="text-yellow-400 text-sm font-medium mb-1">Hint {idx + 1}</div>
                                            <div className="text-gray-300 text-sm">{hint}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Panel - Code Editor & Console */}
                <div className="w-1/2 flex flex-col">
                    {/* Code Editor */}
                    <div className={clsx(
                        "transition-all duration-300 border-b border-gray-700",
                        consoleExpanded ? "h-[60%]" : "flex-1"
                    )}>
                        <CodeEditor code={code} onChange={(val) => setCode(val || "")} />
                    </div>

                    {/* Console Output */}
                    <div className={clsx(
                        "bg-gray-900 flex flex-col transition-all duration-300",
                        consoleExpanded ? "h-[40%]" : "h-12"
                    )}>
                        {/* Console Header */}
                        <div
                            className="flex items-center justify-between px-4 py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800/50"
                            onClick={() => setConsoleExpanded(!consoleExpanded)}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <span>Test Results</span>
                                {validationResult && (
                                    <span className={clsx(
                                        "text-xs px-2 py-0.5 rounded",
                                        validationResult.allPassed ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                                    )}>
                                        {validationResult.passedCount}/{validationResult.totalCount} passed
                                    </span>
                                )}
                            </div>
                            {consoleExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </div>

                        {/* Console Content */}
                        <AnimatePresence>
                            {consoleExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 overflow-y-auto p-4"
                                >
                                    {!validationResult && !isRunning && (
                                        <div className="text-gray-500 text-sm">Run your code to see test results...</div>
                                    )}

                                    {isRunning && (
                                        <div className="flex items-center gap-3 text-green-400">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span className="text-sm">Running tests...</span>
                                        </div>
                                    )}

                                    {validationResult && (
                                        <div className="space-y-3">
                                            {validationResult.results.map((result, idx) => (
                                                <div
                                                    key={idx}
                                                    className={clsx(
                                                        "p-3 rounded-lg border text-sm",
                                                        result.passed
                                                            ? "bg-green-900/10 border-green-800/50"
                                                            : "bg-red-900/10 border-red-800/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {result.passed ? (
                                                            <CheckCircle2 size={16} className="text-green-500" />
                                                        ) : (
                                                            <XCircle size={16} className="text-red-500" />
                                                        )}
                                                        <span className="font-medium text-gray-300">{result.description}</span>
                                                    </div>

                                                    {!result.passed && (
                                                        <div className="ml-6 space-y-1 text-xs font-mono">
                                                            <div className="text-gray-400">
                                                                Expected: <span className="text-green-400">{result.expected}</span>
                                                            </div>
                                                            <div className="text-gray-400">
                                                                Got: <span className="text-red-400">{result.actual || 'No output'}</span>
                                                            </div>
                                                            {result.error && <div className="text-red-400 mt-1">{result.error}</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
