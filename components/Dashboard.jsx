import React from 'react';

export default function Dashboard({ stats = {} }) {
    const defaultStats = {
        totalSessions: stats.totalSessions || 0,
        completedTasks: stats.completedTasks || 0,
        avgScore: stats.avgScore || 0,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <div className="text-blue-100 text-sm uppercase tracking-wide">Total Sessions</div>
                <div className="text-4xl font-bold text-white mt-2">{defaultStats.totalSessions}</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg">
                <div className="text-green-100 text-sm uppercase tracking-wide">Completed Tasks</div>
                <div className="text-4xl font-bold text-white mt-2">{defaultStats.completedTasks}</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg">
                <div className="text-purple-100 text-sm uppercase tracking-wide">Avg Score</div>
                <div className="text-4xl font-bold text-white mt-2">{defaultStats.avgScore}%</div>
            </div>
        </div>
    );
}
