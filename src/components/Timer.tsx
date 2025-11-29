"use client";
import React, { useState, useEffect } from 'react';

interface TimerProps {
    onStart?: () => void;
    onEnd?: () => void;
}

export default function Timer({ onStart, onEnd }: TimerProps) {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const handleStartStop = () => {
        if (!isRunning) {
            setIsRunning(true);
            onStart?.();
        } else {
            setIsRunning(false);
            onEnd?.();
        }
    };

    const handleEnd = () => {
        setSeconds(0);
        setIsRunning(false);
        onEnd?.();
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-lg">
            <div className="text-lg font-mono text-blue-400 font-semibold">{formatTime(seconds)}</div>
            <button
                onClick={handleStartStop}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors"
            >
                {isRunning ? 'Pause' : 'Start Interview'}
            </button>
            <button
                onClick={handleEnd}
                className="px-4 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm text-white font-medium transition-colors"
            >
                End
            </button>
        </div>
    );
}
