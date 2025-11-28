import React, { useState } from 'react';
import Layout from '../components/Layout';
import Timer from '../components/Timer';

export default function Communication() {
    const [isRecording, setIsRecording] = useState(false);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-400">Communication Practice</h1>
                    <Timer />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-2">Behavioral Question</h2>
                    <p className="text-gray-400 mb-4">
                        Tell me about a time when you had to debug a critical production issue.
                        How did you approach it, and what was the outcome?
                    </p>
                    <div className="text-sm text-gray-500">
                        <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result)
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col items-center justify-center min-h-64">
                    <div className="mb-6">
                        {isRecording ? (
                            <div className="w-24 h-24 bg-red-600 rounded-full animate-pulse flex items-center justify-center">
                                <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                                <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`px-8 py-3 rounded-md font-semibold transition-colors ${isRecording
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-2">Your Response</h3>
                    <p className="text-gray-500 italic">Record your answer to see the transcription here...</p>
                </div>
            </div>
        </Layout>
    );
}
