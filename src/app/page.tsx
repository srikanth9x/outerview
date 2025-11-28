"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, MessageSquare, Activity, ArrowRight } from 'lucide-react';
import Container from '@/components/Container';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { NoiseBackground } from '@/components/ui/noise-background';

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

  const words = [
    {
      text: "Master",
      className: "text-muted-foreground",
    },
    {
      text: "the",
      className: "text-muted-foreground",
    },
    {
      text: "Technical",
      className: "text-muted-foreground",
    },
    {
      text: "Interview.",
      className: "text-white",
    },
  ];

  return (
    <Container className='shadow-lg shadow-white '>
      <div className="space-y-20 py-10">
        {/* Hero Section with Ripple Effect */}
        <div className="relative min-h-[500px] flex flex-col items-center justify-center rounded-3xl overflow-hidden border border-white/5 bg-black/50">
          <BackgroundRippleEffect />
          <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center space-y-6"
            >
              <TypewriterEffectSmooth words={words} />

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Elevate your coding and communication skills with AI-powered practice sessions.
                Sleek, focused, and effective.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                <NoiseBackground
                  containerClassName="rounded-full p-1"
                  gradientColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                  noiseIntensity={0.1}
                >
                  <Link href="/coding" className="block px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                    Start Coding
                  </Link>
                </NoiseBackground>

                <NoiseBackground
                  containerClassName="rounded-full p-1"
                  gradientColors={["#10b981", "#3b82f6", "#8b5cf6"]}
                  noiseIntensity={0.1}
                >
                  <Link href="/communication" className="block px-8 py-3 bg-black text-white border border-white/20 font-medium rounded-full hover:bg-white/10 transition-colors">
                    Practice Talk
                  </Link>
                </NoiseBackground>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={item} className="md:col-span-2">
            <CardSpotlight className="h-full p-8 border-white/5 bg-black/40">
              <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <Activity size={24} />
                    <h3 className="text-2xl font-semibold tracking-tight">Your Dashboard</h3>
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Track your progress, view detailed analytics, and identify areas for improvement with our comprehensive dashboard.
                  </p>
                </div>
                <Link href="/dashboard" className="group flex items-center gap-2 text-white font-medium hover:text-muted-foreground transition-colors">
                  Go to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardSpotlight>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/coding" className="block h-full">
              <CardSpotlight className="h-full p-8 border-white/5 bg-black/40 group">
                <div className="relative z-20">
                  <div className="mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                    <Code size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Coding Practice</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Solve algorithmic problems with automated test validation and AI feedback.
                  </p>
                  <div className="flex items-center text-white text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                    Start Practice <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </CardSpotlight>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/communication" className="block h-full">
              <CardSpotlight className="h-full p-8 border-white/5 bg-black/40 group">
                <div className="relative z-20">
                  <div className="mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Communication</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Practice behavioral questions with real-time speech analysis and face detection.
                  </p>
                  <div className="flex items-center text-white text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                    Start Session <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </CardSpotlight>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
}
