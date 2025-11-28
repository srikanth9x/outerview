import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';

export default function Home() {
    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        Welcome to Outerview
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Practice your technical interview skills
                    </p>
                </div>

                <Dashboard stats={{ totalSessions: 12, completedTasks: 8, avgScore: 85 }} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">Coding Practice</h3>
                        <p className="text-gray-400">Sharpen your coding skills with real interview questions</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
                        <h3 className="text-xl font-semibold text-green-400 mb-2">Communication</h3>
                        <p className="text-gray-400">Practice explaining your thought process clearly</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">Get Feedback</h3>
                        <p className="text-gray-400">Receive AI-powered feedback on your performance</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
