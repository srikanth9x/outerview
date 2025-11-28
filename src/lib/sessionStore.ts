export interface Session {
    id: string;
    problemId: string;
    problemTitle: string;
    difficulty: string;
    timestamp: number;
    passed: boolean;
    passedTests: number;
    totalTests: number;
    timeSpent?: number;
}

const STORAGE_KEY = 'outerview_sessions';

export function saveSession(session: Omit<Session, 'id'>): void {
    const sessions = getSessions();
    const newSession: Session = {
        ...session,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    sessions.unshift(newSession);

    // Keep only last 50 sessions
    if (sessions.length > 50) {
        sessions.splice(50);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function getSessionStats() {
    const sessions = getSessions();

    const totalSessions = sessions.length;
    const passedSessions = sessions.filter(s => s.passed).length;
    const avgScore = totalSessions > 0
        ? Math.round((sessions.reduce((sum, s) => sum + (s.passedTests / s.totalTests * 100), 0) / totalSessions))
        : 0;

    const difficultyBreakdown = {
        Easy: sessions.filter(s => s.difficulty === 'Easy').length,
        Medium: sessions.filter(s => s.difficulty === 'Medium').length,
        Hard: sessions.filter(s => s.difficulty === 'Hard').length
    };

    return {
        totalSessions,
        passedSessions,
        avgScore,
        difficultyBreakdown,
        recentSessions: sessions.slice(0, 5)
    };
}

export function clearSessions(): void {
    localStorage.removeItem(STORAGE_KEY);
}
