import React, { useState } from 'react';
import Layout from '../components/Layout';
import Editor from '../components/Editor';
import Timer from '../components/Timer';

export default function Coding() {
    const [code, setCode] = useState('// Start coding here...\n');

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-400">Coding Practice</h1>
                    <Timer />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-2">Problem: Two Sum</h2>
                    <p className="text-gray-400 mb-4">
                        Given an array of integers nums and an integer target, return indices of the two numbers
                        such that they add up to target.
                    </p>
                    <div className="text-sm text-gray-500">
                        <strong>Example:</strong> Input: nums = [2,7,11,15], target = 9 → Output: [0,1]
                    </div>
                </div>

                <div className="h-96">
                    <Editor code={code} onChange={setCode} />
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md transition-colors font-semibold">
                        Run Code
                    </button>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-semibold">
                        Submit
                    </button>
                </div>
            </div>
        </Layout>
    );
}
