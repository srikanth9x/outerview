'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { BorderBeam } from '@/components/ui/border-beam';
import { useState } from 'react';

const navItems = [
    { name: 'Coding', path: '/coding' },
    { name: 'Communication', path: '/communication' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoadingProblem, setIsLoadingProblem] = useState(false);

    const handlePracticeClick = async () => {
        setIsLoadingProblem(true);
        try {
            const response = await fetch('https://alfa-leetcode-api.onrender.com/problems?limit=100');
            const data = await response.json();
            if (data.problemsetQuestionList && data.problemsetQuestionList.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.problemsetQuestionList.length);
                const randomSlug = data.problemsetQuestionList[randomIndex].titleSlug;
                router.push(`/coding/${randomSlug}`);
            }
        } catch (error) {
            console.error('Error fetching random problem:', error);
        } finally {
            setIsLoadingProblem(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-nav relative px-8 py-4 rounded-full pointer-events-auto flex items-center gap-8 overflow-hidden"
            >
                <BorderBeam size={250} duration={12} delay={9} />

                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-muted-foreground transition-colors relative z-10">
                    outerview
                </Link>

                <div className="h-4 w-[1px] bg-white/10 relative z-10" />

                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={handlePracticeClick}
                        disabled={isLoadingProblem}
                        className="text-sm font-medium transition-colors hover:text-white text-muted-foreground disabled:opacity-50"
                    >
                        {isLoadingProblem ? 'Loading...' : 'Practice'}
                    </button>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`text-sm font-medium transition-colors hover:text-white ${pathname === item.path ? 'text-white' : 'text-muted-foreground'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </motion.nav>
        </div>
    );
}
