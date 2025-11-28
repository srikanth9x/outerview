"use client";
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, MessageSquare, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center md:text-left"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Welcome to Outerview
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl">
          Master your technical interview skills with AI-powered practice sessions, real-time feedback, and comprehensive analytics.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Dashboard />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item}>
          <Link href="/coding" className="block h-full p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Coding Practice</h3>
              <p className="text-gray-400 mb-4">Solve algorithmic problems with automated test validation and AI feedback.</p>
              <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                Start Practice <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/communication" className="block h-full p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">Communication</h3>
              <p className="text-gray-400 mb-4">Practice behavioral questions with real-time speech analysis and face detection.</p>
              <div className="flex items-center text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                Start Session <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/feedback" className="block h-full p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Get Feedback</h3>
              <p className="text-gray-400 mb-4">View detailed performance analytics and AI-powered insights.</p>
              <div className="flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                View Insights <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
