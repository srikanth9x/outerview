"use client";
import React, { useState, useRef, useEffect } from 'react';
import Timer from '@/components/Timer';
import FaceDetection from '@/components/FaceDetection';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { getCommunicationFeedback } from '@/lib/communicationFeedback';
import { Mic, Video, VideoOff, MessageSquare, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const QUESTION = "Tell me about a time when you had to debug a critical production issue. How did you approach it, and what was the outcome?";

export default function Communication() {
    const [isRecording, setIsRecording] = useState(false);
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasRecognition, error } = useSpeechToText();
    const [showCamera, setShowCamera] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [isGettingFeedback, setIsGettingFeedback] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript, feedback]);

    const toggleRecording = () => {
        if (isListening) {
            stopListening();
            setIsRecording(false);
        } else {
            startListening();
            setIsRecording(true);
            setFeedback(''); // Clear previous feedback
        }
    };

    const handleGetFeedback = async () => {
        if (!transcript.trim()) return;

        setIsGettingFeedback(true);
        try {
            const result = await getCommunicationFeedback(QUESTION, transcript);
            setFeedback(result);
        } catch (e) {
            console.error("Error fetching feedback:", e);
            setFeedback("Sorry, I couldn't generate feedback at this time. Please try again.");
        } finally {
            setIsGettingFeedback(false);
        }
    };

    const handleClearTranscript = () => {
        resetTranscript();
        setFeedback('');
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col p-4 gap-4 max-w-[1800px] mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="bg-blue-600 w-2 h-6 rounded-full"></span>
                        Communication Practice
                    </h1>
                </div>
                <Timer />
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column: Camera & Question (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4 h-full min-h-0">
                    {/* Camera Feed - Takes priority */}
                    <div className="relative flex-1 min-h-[300px] bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl group">
                        <AnimatePresence mode="wait">
                            {showCamera ? (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full relative"
                                >
                                    <FaceDetection />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="no-camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-900"
                                >
                                    <VideoOff size={48} className="mb-2 opacity-50" />
                                    <p>Camera Disabled</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Camera Controls Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Live Feed</span>
                            </div>
                            <button
                                onClick={() => setShowCamera(!showCamera)}
                                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
                            >
                                {showCamera ? <Video size={18} /> : <VideoOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Question Card - Compact */}
                    <div className="bg-gray-900/90 backdrop-blur-md p-5 rounded-2xl border border-gray-700/50 shadow-lg shrink-0">
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Current Question</span>
                        </div>
                        <p className="text-lg font-medium text-white leading-snug mb-3">
                            {QUESTION}
                        </p>

                        {/* STAR Method Chips */}
                        <div className="flex gap-2">
                            {['Situation', 'Task', 'Action', 'Result'].map((step, i) => (
                                <div key={step} className="flex-1 bg-gray-800/50 rounded px-2 py-1 text-center border border-gray-700/50">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Step {i + 1}</div>
                                    <div className="text-xs text-gray-300 font-medium">{step}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Transcript & Controls (7 cols) */}
                <div className="lg:col-span-7 flex flex-col h-full min-h-0 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden relative">
                    {/* Transcript Header */}
                    <div className="h-14 px-6 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 shrink-0">
                        <div className="flex items-center gap-2 text-gray-200 font-medium">
                            <MessageSquare size={18} className="text-purple-400" />
                            <span>Transcript</span>
                        </div>
                        {isListening && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium border border-red-500/20 animate-pulse">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                Recording...
                            </div>
                        )}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
                        {/* Empty State */}
                        {!transcript && !feedback && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8">
                                <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 border border-gray-700/50">
                                    <Mic size={32} className="opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to Practice?</h3>
                                <p className="text-center text-sm max-w-xs leading-relaxed opacity-70">
                                    Press the microphone button below and answer the question using the STAR method.
                                </p>
                            </div>
                        )}

                        {/* Transcript Text */}
                        {transcript && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap font-light">
                                    {transcript}
                                </p>
                            </div>
                        )}

                        {/* AI Feedback */}
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800/40 border border-purple-500/20 rounded-xl overflow-hidden"
                            >
                                <div className="bg-purple-900/20 px-4 py-3 border-b border-purple-500/20 flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="text-sm font-semibold text-purple-100">AI Analysis</span>
                                </div>
                                <div className="p-5 prose prose-sm prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-purple-200 prose-li:text-gray-300">
                                    <ReactMarkdown>{feedback}</ReactMarkdown>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3 text-sm">
                                <AlertCircle size={18} />
                                <p>{error}</p>
                            </div>
                        )}

                        <div ref={transcriptEndRef} />
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-center justify-between max-w-2xl mx-auto w-full gap-4">
                            {/* Clear Button */}
                            <div className="w-24">
                                {transcript && (
                                    <button
                                        onClick={handleClearTranscript}
                                        className="text-gray-400 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium w-full justify-center"
                                        title="Clear Transcript"
                                    >
                                        <Trash2 size={16} />
                                        <span>Clear</span>
                                    </button>
                                )}
                            </div>

                            {/* Main Record Button */}
                            <button
                                onClick={toggleRecording}
                                disabled={!hasRecognition}
                                className={`
                                    relative group flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 shadow-xl
                                    ${isListening
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 rotate-3'
                                        : 'bg-white hover:bg-gray-100 text-black shadow-white/10 hover:-translate-y-1'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600
                                `}
                            >
                                {isListening ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 bg-white rounded-sm mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>
                                    </div>
                                ) : (
                                    <Mic size={28} className="relative z-10" />
                                )}
                            </button>

                            {/* Feedback Button */}
                            <div className="w-24">
                                {transcript && !isListening && (
                                    <button
                                        onClick={handleGetFeedback}
                                        disabled={isGettingFeedback}
                                        className={`
                                            flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all w-full
                                            ${isGettingFeedback
                                                ? 'bg-gray-700 text-gray-400 cursor-wait'
                                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
                                            }
                                        `}
                                    >
                                        {isGettingFeedback ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                <span>Analyze</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}