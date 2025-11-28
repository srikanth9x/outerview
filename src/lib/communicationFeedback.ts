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
            return "Groq API key is missing. Please add it to your environment variables.";
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

        return completion.choices[0]?.message?.content || "No feedback generated.";
    } catch (error) {
        console.error("Error getting communication feedback:", error);
        return "Error generating feedback. Please check your API key and try again.";
    }
};
