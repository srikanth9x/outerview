"use client";
import React, { useState } from 'react';
import Timer from '@/components/Timer';
import FaceDetection from '@/components/FaceDetection';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Mic, MicOff, Video, VideoOff, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Communication() {
    const [isRecording, setIsRecording] = useState(false);
    const { isListening, transcript, startListening, stopListening, hasRecognition } = useSpeechToText();
    const [showCamera, setShowCamera] = useState(true);

    const toggleRecording = () => {
        if (isListening) {
            stopListening();
            setIsRecording(false);
        } else {
            startListening();
            setIsRecording(true);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col py-6 px-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between shrink-0"
            >
                <h1 className="text-3xl font-bold text-white">
                    Communication Practice
                </h1>
                <Timer />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left Column: Question & Camera */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6 h-full overflow-auto"
                >
                    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shrink-0 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
                        <h2 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
                            <MessageSquare size={20} className="text-gray-400" /> Behavioral Question
                        </h2>
                        <p className="text-gray-200 mb-4 text-lg font-medium leading-relaxed">
                            "Tell me about a time when you had to debug a critical production issue.
                            How did you approach it, and what was the outcome?"
                        </p>
                        <div className="text-sm text-gray-400 bg-black/30 p-3 rounded border border-gray-700/50">
                            <strong className="text-white">STAR Method Tip:</strong> Structure your answer:
                            <span className="text-gray-300"> Situation → Task → Action → Result</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-xl border border-gray-700 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group">
                        <AnimatePresence mode="wait">
                            {showCamera ? (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <FaceDetection />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="no-camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-gray-500 flex flex-col items-center"
                                >
                                    <VideoOff size={48} className="mb-2 opacity-50" />
                                    <p>Camera is disabled</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowCamera(!showCamera)}
                            className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-gray-300 transition-colors backdrop-blur-sm z-10"
                            title={showCamera ? "Disable Camera" : "Enable Camera"}
                        >
                            {showCamera ? <Video size={20} /> : <VideoOff size={20} />}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Right Column: Recording & Transcript */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-6 h-full"
                >
                    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 flex flex-col items-center justify-center shrink-0 shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="mb-6 relative z-10">
                            <AnimatePresence mode="wait">
                                {isListening ? (
                                    <motion.div
                                        key="listening"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="relative"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                                        />
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] relative z-10">
                                            <Mic size={32} className="text-black" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
                                            <MicOff size={32} className="text-gray-400" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleRecording}
                            disabled={!hasRecognition}
                            className={`relative z-10 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${isListening
                                ? 'bg-white hover:bg-gray-200 text-black shadow-white/30'
                                : 'bg-gray-800 hover:bg-gray-700 text-white shadow-gray-800/30 border border-gray-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isListening ? 'Stop Recording' : 'Start Recording'}
                        </motion.button>

                        {!hasRecognition && (
                            <p className="text-gray-400 text-sm mt-4">Speech recognition not supported in this browser.</p>
                        )}
                    </div>

                    <div className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 flex flex-col shadow-lg">
                        <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                            <span>Live Transcript</span>
                            {isListening && (
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                            )}
                        </h3>
                        <div className="flex-1 bg-black/30 rounded-lg border border-gray-700/50 p-4 overflow-auto custom-scrollbar">
                            {transcript ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-200 whitespace-pre-wrap leading-relaxed"
                                >
                                    {transcript}
                                </motion.p>
                            ) : (
                                <p className="text-gray-500 italic flex items-center gap-2">
                                    <Mic size={16} /> Start recording to see your answer transcribed here...
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
// remove the get started and login button for now 
// and also on the practive button open it at a random coding/problem page 