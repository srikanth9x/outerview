import React, { useState, useEffect } from 'react';

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-mono text-blue-400">{formatTime(seconds)}</div>
            <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
                onClick={() => { setSeconds(0); setIsRunning(false); }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
                Reset
            </button>
        </div>
    );
}
