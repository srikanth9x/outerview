import axios from "axios";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

export const executeCode = async (language: string, code: string) => {
    try {
        const response = await axios.post(PISTON_API_URL, {
            language: language,
            version: "*",
            files: [
                {
                    content: code,
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error("Error executing code:", error);
        throw error;
    }
};
