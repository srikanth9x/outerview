"use client";
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import Timer from '@/components/Timer';
import { getGroqFeedback, generateProblem } from '@/lib/groq';
import { Play, Lightbulb, Loader2, Sparkles, RotateCw, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { getRandomProblem, Problem, LanguageKey } from '@/data/problems';
import { validateCode, ValidationResult } from '@/lib/testRunner';
import { saveSession } from '@/lib/sessionStore';

const languageConfig: Record<LanguageKey, { label: string; pistonLang: string }> = {
    javascript: { label: 'JavaScript', pistonLang: 'javascript' },
    typescript: { label: 'TypeScript', pistonLang: 'typescript' },
    python: { label: 'Python', pistonLang: 'python' },
    java: { label: 'Java', pistonLang: 'java' },
    cpp: { label: 'C++', pistonLang: 'cpp' },
    c: { label: 'C', pistonLang: 'c' },
    csharp: { label: 'C#', pistonLang: 'csharp' },
    go: { label: 'Go', pistonLang: 'go' },
    rust: { label: 'Rust', pistonLang: 'rust' },
    ruby: { label: 'Ruby', pistonLang: 'ruby' },
    php: { label: 'PHP', pistonLang: 'php' },
    swift: { label: 'Swift', pistonLang: 'swift' },
    kotlin: { label: 'Kotlin', pistonLang: 'kotlin' },
};

export default function Coding() {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('javascript');
    const [code, setCode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isGettingFeedback, setIsGettingFeedback] = useState(false);
    const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
    const [consoleExpanded, setConsoleExpanded] = useState(true);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [difficultyLevel, setDifficultyLevel] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');

    useEffect(() => {
        loadNewProblem();
    }, []);

    useEffect(() => {
        if (problem) {
            setCode(problem.starterCode[selectedLanguage] || '// No starter code available for this language');
        }
    }, [selectedLanguage, problem]);

    const loadNewProblem = () => {
        const newProblem = getRandomProblem(difficultyLevel);
        setProblem(newProblem);
        setCode(newProblem.starterCode[selectedLanguage]);
        setValidationResult(null);
        setFeedback('');
        setStartTime(Date.now());
    };

    const handleGenerateAIProblem = async () => {
        setIsGeneratingProblem(true);
        try {
            const newProblem = await generateProblem(difficultyLevel);
            if (newProblem) {
                // Ensure starterCode has all keys or fallback
                const completeStarterCode = { ...newProblem.starterCode };
                // Simple fill for missing languages if needed, or just let it be empty
                setProblem({ ...newProblem, id: `ai-${Date.now()}` });
                setCode(newProblem.starterCode[selectedLanguage] || '');
                setValidationResult(null);
                setFeedback('');
                setStartTime(Date.now());
            } else {
                alert("Failed to generate problem. Try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Error generating problem");
        } finally {
            setIsGeneratingProblem(false);
        }
    };

    // Reload problem when difficulty changes (optional, but good for UX)
    useEffect(() => {
        loadNewProblem();
    }, [difficultyLevel]);


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
                timeSpent,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsRunning(false);
        }
    };

    const handleGetFeedback = async () => {
        if (!problem) return;
        setIsGettingFeedback(true);
        setFeedback('');
        try {
            const context = `Problem: ${problem.title}\n\nDescription: ${problem.description}\n\nDifficulty: ${problem.difficulty}\n\nLanguage: ${languageConfig[selectedLanguage].label}`;
            const result = await getGroqFeedback(code, context);
            setFeedback(result);
        } catch (e) {
            setFeedback('Error getting feedback.');
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
        <div className="h-[calc(100vh-9rem)] flex flex-col border border-gray-700 rounded-xl overflow-hidden bg-gray-900/30 backdrop-blur-sm">
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white max-w-[200px] truncate" title={problem.title}>{problem.title}</h1>

                    {/* Difficulty Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDifficultyLevel('Easy')}
                            className={clsx(
                                "px-3 py-1 rounded text-xs font-bold border-2 transition-all",
                                difficultyLevel === 'Easy'
                                    ? "bg-green-500 text-black border-green-600 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                    : "bg-green-900/20 text-green-500 border-green-900/50 hover:bg-green-900/40"
                            )}
                        >
                            EASY
                        </button>
                        <button
                            onClick={() => setDifficultyLevel('Medium')}
                            className={clsx(
                                "px-3 py-1 rounded text-xs font-bold border-2 transition-all",
                                difficultyLevel === 'Medium'
                                    ? "bg-yellow-500 text-black border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                                    : "bg-yellow-900/20 text-yellow-500 border-yellow-900/50 hover:bg-yellow-900/40"
                            )}
                        >
                            MEDIUM
                        </button>
                        <button
                            onClick={() => setDifficultyLevel('Hard')}
                            className={clsx(
                                "px-3 py-1 rounded text-xs font-bold border-2 transition-all",
                                difficultyLevel === 'Hard'
                                    ? "bg-red-500 text-black border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                                    : "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40"
                            )}
                        >
                            HARD
                        </button>
                    </div>

                    {/* Language Selector */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as LanguageKey)}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white font-medium hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.entries(languageConfig).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                        ))}
                    </select>
                </div>

                {/* Centered Timer */}
                {/* Timer */}
                <div>
                    <Timer />
                </div>

                <div className="flex items-center gap-3">
                    {/* AI Generate Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerateAIProblem}
                        disabled={isGeneratingProblem}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white font-medium transition-colors disabled:opacity-50"
                        title="Generate a new problem with AI"
                    >
                        {isGeneratingProblem ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                        AI Problem
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadNewProblem}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white font-medium transition-colors"
                        title="Load a random existing problem"
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
                {/* Left Panel */}
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
                                    <div className="text-gray-300 leading-relaxed">{problem.description}</div>
                                    <div className="space-y-4">
                                        <h3 className="text-white font-semibold">Examples:</h3>
                                        {problem.examples.map((ex, i) => (
                                            <div key={i} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                                <div className="text-xs text-gray-500 mb-2">Example {i + 1}:</div>
                                                <div className="font-mono text-sm space-y-1">
                                                    <div><span className="text-gray-400">Input:</span> <span className="text-blue-400">{ex.input}</span></div>
                                                    <div><span className="text-gray-400">Output:</span> <span className="text-green-400">{ex.output}</span></div>
                                                    {ex.explanation && (
                                                        <div className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-700">
                                                            <strong>Explanation:</strong> {ex.explanation}
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
                                            <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{feedback}</div>
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
                                    {problem.hints.map((hint, i) => (
                                        <div key={i} className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-4">
                                            <div className="text-yellow-400 text-sm font-medium mb-1">Hint {i + 1}</div>
                                            <div className="text-gray-300 text-sm">{hint}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {/* Right Panel */}
                <div className="w-1/2 flex flex-col gap-4 p-4">
                    {/* Code Editor */}
                    <div className={clsx(
                        "transition-all duration-300 border-2 border-black rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm",
                        consoleExpanded ? "h-[60%]" : "flex-1"
                    )}>
                        <CodeEditor code={code} onChange={(val) => setCode(val || "")} />
                    </div>
                    {/* Console Output */}
                    <div className={clsx(
                        "flex flex-col transition-all duration-300 border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm",
                        consoleExpanded ? "h-[40%]" : "h-12"
                    )}>
                        <div
                            className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/30 cursor-pointer hover:bg-gray-800/50"
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
                                        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(validationResult, null, 2)}</pre>
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
