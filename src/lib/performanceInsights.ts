import Groq from "groq-sdk";
import { getSessions, getCommunicationSessions } from './sessionStore';

export interface PerformanceInsights {
    metrics: {
        codeQuality: number;
        communication: number;
        problemSolving: number;
    };
    strengths: string[];
    areasForGrowth: string[];
}

export async function generatePerformanceInsights(): Promise<PerformanceInsights> {
    const codingSessions = getSessions();
    const commSessions = getCommunicationSessions();

    // Calculate base metrics
    const codeQuality = codingSessions.length > 0
        ? Math.round((codingSessions.reduce((sum, s) => sum + (s.passedTests / s.totalTests * 100), 0) / codingSessions.length))
        : 0;

    const communication = commSessions.length > 0
        ? Math.round(commSessions.reduce((sum, s) => sum + s.avgConfidence, 0) / commSessions.length)
        : 0;

    // Problem solving based on difficulty and pass rate
    const problemSolving = codingSessions.length > 0
        ? Math.round(codingSessions.reduce((sum, s) => {
            const baseScore = (s.passedTests / s.totalTests * 100);
            const difficultyMultiplier = s.difficulty === 'Hard' ? 1.2 : s.difficulty === 'Medium' ? 1.1 : 1.0;
            return sum + (baseScore * difficultyMultiplier);
        }, 0) / codingSessions.length)
        : 0;

    // If no sessions, return default insights
    if (codingSessions.length === 0 && commSessions.length === 0) {
        return {
            metrics: {
                codeQuality: 0,
                communication: 0,
                problemSolving: 0
            },
            strengths: [
                "Ready to start your practice journey",
                "Clean slate for improvement",
                "Opportunity to build strong foundations"
            ],
            areasForGrowth: [
                "Complete coding practice sessions",
                "Practice communication skills",
                "Build consistent practice habits"
            ]
        };
    }

    // Prepare session summary for AI
    const sessionSummary = {
        totalCodingSessions: codingSessions.length,
        totalCommunicationSessions: commSessions.length,
        codeAccuracy: codeQuality,
        avgConfidence: communication,
        recentCodingSessions: codingSessions.slice(0, 5).map(s => ({
            difficulty: s.difficulty,
            passed: s.passed,
            passRate: Math.round((s.passedTests / s.totalTests) * 100),
            timeSpent: s.timeSpent
        })),
        recentCommunicationSessions: commSessions.slice(0, 3).map(s => ({
            avgConfidence: s.avgConfidence,
            duration: s.duration
        })),
        difficultyBreakdown: {
            easy: codingSessions.filter(s => s.difficulty === 'Easy').length,
            medium: codingSessions.filter(s => s.difficulty === 'Medium').length,
            hard: codingSessions.filter(s => s.difficulty === 'Hard').length
        }
    };

    try {
        // Try to get Groq client - if unavailable, skip to fallback
        const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.log("No Groq API key found, using rule-based insights");
            throw new Error("No API key");
        }

        const groq = new Groq({
            apiKey,
            dangerouslyAllowBrowser: true
        });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert technical interview coach analyzing a candidate's performance data. Based on their session history, provide personalized insights.

Return a JSON object with exactly this structure:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForGrowth": ["area 1", "area 2", "area 3"]
}

Guidelines:
- Each strength/area should be a concise, actionable statement (max 8 words)
- Be specific based on the data (mention difficulty levels, pass rates, confidence scores)
- Strengths should highlight what they're doing well
- Areas for growth should be constructive and actionable
- If metrics are high (>80%), focus on advanced improvements
- If metrics are low (<50%), focus on fundamentals
- Consider both coding and communication performance`
                },
                {
                    role: "user",
                    content: `Analyze this performance data and provide insights:\n\n${JSON.stringify(sessionSummary, null, 2)}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');

        return {
            metrics: {
                codeQuality,
                communication,
                problemSolving
            },
            strengths: aiResponse.strengths || [
                "Consistent practice habits",
                "Good problem-solving approach",
                "Strong technical foundation"
            ],
            areasForGrowth: aiResponse.areasForGrowth || [
                "Practice more complex problems",
                "Improve communication clarity",
                "Focus on time management"
            ]
        };
    } catch (error) {
        console.log("Using fallback rule-based insights");

        // Fallback to rule-based insights
        const strengths: string[] = [];
        const areasForGrowth: string[] = [];

        // Rule-based strength detection
        if (codeQuality >= 80) strengths.push("Excellent code quality and test coverage");
        else if (codeQuality >= 60) strengths.push("Good problem-solving fundamentals");

        if (communication >= 75) strengths.push("Strong confident communication skills");
        else if (communication >= 50) strengths.push("Developing communication confidence");

        if (codingSessions.filter(s => s.difficulty === 'Hard' && s.passed).length > 0) {
            strengths.push("Successfully tackling hard problems");
        }

        if (strengths.length < 3) {
            strengths.push("Consistent practice and dedication");
        }

        // Rule-based growth areas
        if (codeQuality < 70) areasForGrowth.push("Focus on test case coverage");
        if (communication < 60) areasForGrowth.push("Practice articulating thoughts clearly");
        if (codingSessions.filter(s => s.difficulty === 'Hard').length < 2) {
            areasForGrowth.push("Challenge yourself with harder problems");
        }

        if (areasForGrowth.length < 3) {
            areasForGrowth.push("Review time complexity analysis");
        }

        return {
            metrics: {
                codeQuality,
                communication,
                problemSolving
            },
            strengths: strengths.slice(0, 3),
            areasForGrowth: areasForGrowth.slice(0, 3)
        };
    }
}
