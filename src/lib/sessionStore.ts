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

export interface CommunicationSession {
    id: string;
    question: string;
    transcript: string;
    avgConfidence: number; // 0-100
    duration: number; // seconds
    timestamp: number;
    feedbackScore?: number; // 0-100, optional AI-generated score
}

const CODING_STORAGE_KEY = 'outerview_sessions';
const COMM_STORAGE_KEY = 'outerview_communication_sessions';

// Coding Sessions
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

    localStorage.setItem(CODING_STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(CODING_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Communication Sessions
export function saveCommunicationSession(session: Omit<CommunicationSession, 'id'>): void {
    const sessions = getCommunicationSessions();
    const newSession: CommunicationSession = {
        ...session,
        id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    sessions.unshift(newSession);

    // Keep only last 50 sessions
    if (sessions.length > 50) {
        sessions.splice(50);
    }

    localStorage.setItem(COMM_STORAGE_KEY, JSON.stringify(sessions));
}

export function getCommunicationSessions(): CommunicationSession[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(COMM_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Unified Stats
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

export function getDashboardMetrics() {
    const codingSessions = getSessions();
    const commSessions = getCommunicationSessions();

    // 1. Code Accuracy - average test pass rate
    const codeAccuracy = codingSessions.length > 0
        ? Math.round((codingSessions.reduce((sum, s) => sum + (s.passedTests / s.totalTests * 100), 0) / codingSessions.length))
        : 0;

    // 2. Confidence Level - average confidence from communication sessions
    const confidenceLevel = commSessions.length > 0
        ? Math.round(commSessions.reduce((sum, s) => sum + s.avgConfidence, 0) / commSessions.length)
        : 0;

    // 3. Communication Score - average feedback score
    const sessionsWithFeedback = commSessions.filter(s => s.feedbackScore !== undefined);
    const communicationScore = sessionsWithFeedback.length > 0
        ? Math.round(sessionsWithFeedback.reduce((sum, s) => sum + (s.feedbackScore || 0), 0) / sessionsWithFeedback.length)
        : 0;

    return {
        codeAccuracy,
        confidenceLevel,
        communicationScore,
        totalCodingSessions: codingSessions.length,
        totalCommunicationSessions: commSessions.length,
    };
}

export function clearSessions(): void {
    localStorage.removeItem(CODING_STORAGE_KEY);
    localStorage.removeItem(COMM_STORAGE_KEY);
}
