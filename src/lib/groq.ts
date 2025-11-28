"use server";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = apiKey ? new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Optional: if you really need client-side usage, but better to keep server-side
}) : null;

export const getGroqFeedback = async (code: string, context?: string) => {
    try {
        if (!groq) {
            return "Groq API key is missing. Please add it to your environment variables.";
        }

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

export const generateProblem = async (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    try {
        if (!groq) {
            console.warn("Groq API key missing, skipping AI generation.");
            return null;
        }

        const prompt = `Generate a unique coding problem for a technical interview.
Difficulty: ${difficulty}
Return ONLY a valid JSON object with the following structure:
{
  "id": "generated-id",
  "title": "Problem Title",
  "difficulty": "${difficulty}",
  "description": "Detailed problem description...",
  "examples": [
    { "input": "example input", "output": "example output", "explanation": "optional explanation" }
  ],
  "starterCode": {
    "javascript": "function solution() {\\n\\n}",
    "python": "def solution():\\n    pass",
    "java": "class Solution {\\n    public void solve() {\\n    }\\n}",
    "cpp": "class Solution {\\npublic:\\n    void solve() {\\n    }\\n};"
  },
  "testCases": [
    { "input": "function_call()", "expectedOutput": "expected_result", "description": "test case description" }
  ],
  "hints": ["hint 1", "hint 2"]
}
Ensure the JSON is valid and contains no markdown formatting outside the string values.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a coding interview question generator. You output ONLY valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating problem:", error);
        return null;
    }
};
