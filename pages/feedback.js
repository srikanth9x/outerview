import React from 'react';
import Layout from '../components/Layout';

export default function Feedback() {
    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-purple-400">Performance Feedback</h1>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Latest Session Results</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Code Quality</span>
                                <span className="font-semibold text-green-400">85%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Communication</span>
                                <span className="font-semibold text-blue-400">78%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Problem Solving</span>
                                <span className="font-semibold text-purple-400">92%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-green-400">Strengths</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>✓ Strong problem-solving approach</li>
                        <li>✓ Clean and readable code</li>
                        <li>✓ Good time management</li>
                    </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-400">Areas for Improvement</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>→ Consider edge cases earlier in your solution</li>
                        <li>→ Practice explaining your thought process more clearly</li>
                        <li>→ Review time complexity analysis</li>
                    </ul>
                </div>

                <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors font-semibold">
                    Start New Practice Session
                </button>
            </div>
        </Layout>
    );
}
