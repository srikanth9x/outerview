import React from 'react';

export default function Editor({ code, onChange }) {
    return (
        <div className="w-full h-full">
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="// Write your code here..."
            />
        </div>
    );
}
