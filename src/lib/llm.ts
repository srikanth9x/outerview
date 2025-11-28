import { HfInference } from "@huggingface/inference";

// Initialize with a default key or allow users to provide their own
const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

export const getLLMFeedback = async (code: string, context?: string) => {
    try {
        const prompt = context
            ? `${context}\n\nCode:\n${code}\n\nProvide feedback on this code:`
            : `Review this code and provide constructive feedback:\n\n${code}`;

        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            inputs: prompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
            },
        });

        return response.generated_text;
    } catch (error) {
        console.error("Error getting LLM feedback:", error);
        throw error;
    }
};
