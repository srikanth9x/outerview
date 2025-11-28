"use server";

export async function evaluateAnswer(question: string, answer: string): Promise<number> {
    // Return 0 if answer is too short
    if (!answer || answer.trim().length < 20) {
        return 0;
    }

    try {
        // Use rule-based scoring (no API required)
        const wordCount = answer.trim().split(/\s+/).length;
        const hasSTARKeywords = /situation|task|action|result|challenge|problem|solution|outcome|experience|responsibility|decided|implemented|achieved/i.test(answer);
        const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);

        let score = 0;

        // Length-based scoring (0-40 points)
        // Longer, more detailed answers score higher
        if (wordCount >= 150) score += 40;
        else if (wordCount >= 100) score += 35;
        else if (wordCount >= 75) score += 28;
        else if (wordCount >= 50) score += 20;
        else score += 10;

        // STAR method keywords (0-30 points)
        // Check for behavioral interview structure
        if (hasSTARKeywords) {
            const keywordMatches = answer.match(/situation|task|action|result|challenge|problem|solution|outcome|experience|responsibility|decided|implemented|achieved/gi);
            const uniqueKeywords = new Set(keywordMatches?.map(k => k.toLowerCase()));

            if (uniqueKeywords.size >= 4) score += 30;
            else if (uniqueKeywords.size >= 3) score += 25;
            else if (uniqueKeywords.size >= 2) score += 20;
            else score += 15;
        }

        // Sentence structure and complexity (0-30 points)
        // Well-structured answers have multiple sentences
        if (sentences.length >= 8) score += 30;
        else if (sentences.length >= 6) score += 25;
        else if (sentences.length >= 4) score += 20;
        else if (sentences.length >= 2) score += 15;
        else score += 5;

        const finalScore = Math.min(100, score);

        console.log("Answer evaluation (rule-based):", {
            wordCount,
            sentences: sentences.length,
            hasSTARKeywords,
            score: finalScore
        });

        return finalScore;
    } catch (error) {
        console.error("Error evaluating answer:", error);

        // Minimal fallback
        const wordCount = answer.trim().split(/\s+/).length;
        if (wordCount >= 100) return 70;
        if (wordCount >= 50) return 50;
        return 30;
    }
}
