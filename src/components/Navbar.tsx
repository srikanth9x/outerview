'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { BorderBeam } from '@/components/ui/border-beam';

const navItems = [
    { name: 'Practice', path: '/practice' },
    { name: 'Coding', path: '/coding' },
    { name: 'Communication', path: '/communication' },
];

export default function Navbar() {
    const pathname = usePathname();

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

                <div className="h-4 w-[1px] bg-white/10 relative z-10" />

                <div className="flex items-center gap-4 relative z-10">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                        Get Started
                    </Link>
                </div>
            </motion.nav>
        </div>
    );
}
