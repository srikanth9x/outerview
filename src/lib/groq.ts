"use server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const getGroqFeedback = async (code: string, context?: string) => {
    try {
        const prompt = context
            ? `${context}\n\nCode:\n${code}\n\nProvide constructive feedback on this code solution. Focus on correctness, efficiency, and code style.`
            : `Review this code and provide constructive feedback:\n\n${code}`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful senior software engineer conducting a technical interview. Provide concise, constructive feedback."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || "No feedback generated.";
    } catch (error) {
        console.error("Error getting Groq feedback:", error);
        // Return a user-friendly error string instead of throwing, to avoid exposing server errors directly
        return "Error generating feedback. Please check your API key and try again.";
    }
};
