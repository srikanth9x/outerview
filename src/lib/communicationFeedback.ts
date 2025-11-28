"use server";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = apiKey ? new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
}) : null;

export const getCommunicationFeedback = async (question: string, answer: string) => {
    try {
        if (!groq) {
            // Return rule-based feedback instead of error
            return generateRuleBasedFeedback(question, answer);
        }

        const prompt = `You are an experienced technical interviewer evaluating a candidate's answer to a behavioral question.

Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate this answer based on the following criteria:
1. **STAR Method**: Does it follow Situation, Task, Action, Result structure?
2. **Clarity**: Is the answer clear and well-articulated?
3. **Relevance**: Does it directly address the question?
4. **Specificity**: Are there concrete examples and details?
5. **Communication**: Is it concise yet comprehensive?

Provide constructive feedback in the following format:
- **Strengths**: What the candidate did well
- **Areas for Improvement**: Specific suggestions
- **STAR Structure**: Rate each component (Situation, Task, Action, Result) as Present/Partial/Missing
- **Overall Score**: X/10 with brief justification

Keep feedback encouraging but honest.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer specializing in behavioral interviews. Provide constructive, actionable feedback."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || generateRuleBasedFeedback(question, answer);
    } catch (error) {
        console.error("Error getting communication feedback:", error);
        // Return rule-based feedback instead of error message
        return generateRuleBasedFeedback(question, answer);
    }
};

function generateRuleBasedFeedback(question: string, answer: string): string {
    const wordCount = answer.trim().split(/\s+/).length;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Check for STAR components
    const hasSituation = /situation|context|background|when|where/i.test(answer);
    const hasTask = /task|goal|objective|needed to|had to|responsible/i.test(answer);
    const hasAction = /action|did|implemented|created|developed|decided|approached/i.test(answer);
    const hasResult = /result|outcome|achieved|accomplished|learned|impact/i.test(answer);

    const starScore = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;

    let feedback = "## Feedback on Your Answer\n\n";

    // Strengths
    feedback += "### ✅ Strengths\n\n";
    const strengths = [];

    if (wordCount >= 100) {
        strengths.push("Your answer is detailed and comprehensive");
    }
    if (starScore >= 3) {
        strengths.push("Good use of the STAR method structure");
    }
    if (sentences.length >= 5) {
        strengths.push("Well-organized with clear sentence structure");
    }
    if (hasResult) {
        strengths.push("You included the outcome/result of your actions");
    }

    if (strengths.length === 0) {
        strengths.push("You provided a response to the question");
    }

    feedback += strengths.map(s => `- ${s}`).join("\n") + "\n\n";

    // Areas for Improvement
    feedback += "### 📈 Areas for Improvement\n\n";
    const improvements = [];

    if (wordCount < 75) {
        improvements.push("Add more detail to your answer (aim for 100-150 words)");
    }
    if (!hasSituation) {
        improvements.push("**Situation**: Describe the context and background more clearly");
    }
    if (!hasTask) {
        improvements.push("**Task**: Explain what you needed to accomplish");
    }
    if (!hasAction) {
        improvements.push("**Action**: Detail the specific steps you took");
    }
    if (!hasResult) {
        improvements.push("**Result**: Share the outcome and what you learned");
    }
    if (sentences.length < 4) {
        improvements.push("Break your answer into more structured sentences");
    }

    if (improvements.length === 0) {
        improvements.push("Continue practicing to refine your delivery");
    }

    feedback += improvements.map(i => `- ${i}`).join("\n") + "\n\n";

    // STAR Structure
    feedback += "### 🎯 STAR Structure Analysis\n\n";
    feedback += `- **Situation**: ${hasSituation ? '✓ Present' : '✗ Missing'}\n`;
    feedback += `- **Task**: ${hasTask ? '✓ Present' : '✗ Missing'}\n`;
    feedback += `- **Action**: ${hasAction ? '✓ Present' : '✗ Missing'}\n`;
    feedback += `- **Result**: ${hasResult ? '✓ Present' : '✗ Missing'}\n\n`;

    // Overall Score
    const score = Math.min(10, Math.round(
        (wordCount / 15) + // 0-10 points for length
        (starScore * 2.5) + // 0-10 points for STAR
        (sentences.length * 0.5) // 0-5 points for structure
    ));

    feedback += `### 📊 Overall Score: ${score}/10\n\n`;

    if (score >= 8) {
        feedback += "Excellent answer! You demonstrated strong communication skills and followed the STAR method well.";
    } else if (score >= 6) {
        feedback += "Good answer with room for improvement. Focus on adding more specific details and ensuring all STAR components are present.";
    } else if (score >= 4) {
        feedback += "Your answer needs more development. Make sure to include all STAR components and provide specific examples.";
    } else {
        feedback += "Your answer needs significant improvement. Focus on the STAR method: describe the Situation, Task, Action, and Result with specific details.";
    }

    feedback += "\n\n---\n\n*Note: This is automated rule-based feedback. For AI-powered analysis, please add a valid Groq API key.*";

    return feedback;
}
