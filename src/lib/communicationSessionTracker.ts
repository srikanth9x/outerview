// Simple helper to track communication sessions
// This will be integrated into the communication page

import { saveCommunicationSession } from './sessionStore';

let confidenceValues: number[] = [];
let sessionStart: number = Date.now();

export function resetSessionTracking() {
    confidenceValues = [];
    sessionStart = Date.now();
}

export function trackConfidence(value: number) {
    confidenceValues.push(value);
}

export function saveCurrentSession(question: string, transcript: string) {
    const avgConfidence = confidenceValues.length > 0
        ? Math.round(confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length)
        : 0;

    const duration = Math.round((Date.now() - sessionStart) / 1000);

    saveCommunicationSession({
        question,
        transcript,
        avgConfidence,
        duration,
        timestamp: Date.now()
    });

    // Reset for next session
    resetSessionTracking();
}
