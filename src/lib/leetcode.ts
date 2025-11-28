import axios from 'axios';
import { Problem, LanguageKey } from '@/data/problems';

const API_BASE_URL = 'https://alfa-leetcode-api.onrender.com';

interface LeetCodeProblem {
    questionFrontendId: string;
    questionTitle: string;
    questionTitleSlug: string;
    difficulty: string;
    content: string;
    exampleTestcases: string;
    codeSnippets: Array<{
        lang: string;
        langSlug: string;
        code: string;
    }>;
    topicTags: Array<{
        name: string;
        slug: string;
    }>;
}

const mapDifficulty = (diff: string): 'Easy' | 'Medium' | 'Hard' => {
    switch (diff) {
        case 'Easy': return 'Easy';
        case 'Medium': return 'Medium';
        case 'Hard': return 'Hard';
        default: return 'Medium';
    }
};

const mapLanguage = (slug: string): LanguageKey | null => {
    const mapping: Record<string, LanguageKey> = {
        'javascript': 'javascript',
        'typescript': 'typescript',
        'python3': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'csharp': 'csharp',
        'golang': 'go',
        'rust': 'rust',
        'ruby': 'ruby',
        'php': 'php',
        'swift': 'swift',
        'kotlin': 'kotlin',
    };
    return mapping[slug] || null;
};

export const fetchDailyProblem = async (): Promise<Problem | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/daily`);
        const dailyData = response.data;

        // The API returns 'titleSlug' or 'questionTitleSlug' depending on the endpoint version/update
        // Based on our curl test, it returns 'questionLink' and likely 'titleSlug' inside the question object if nested,
        // or directly. Let's handle the direct response we saw.
        // The curl output showed: {"questionLink":..., "date":..., "questionId":..., ...}
        // It didn't explicitly show titleSlug in the truncated output, but usually it's there.
        // However, we saw "questionTitleSlug" in the interface I defined, but the error said "Unexpected daily problem format".
        // Let's try to use the 'questionTitleSlug' if present, or 'titleSlug'.

        const slug = dailyData.titleSlug || dailyData.questionTitleSlug;

        if (!slug) {
            console.error("Unexpected daily problem format", dailyData);
            return null;
        }

        // Fetch full details using the slug
        const problemResponse = await axios.get<LeetCodeProblem>(`${API_BASE_URL}/select?titleSlug=${slug}`);
        const data = problemResponse.data;

        const starterCode: Record<string, string> = {};
        data.codeSnippets?.forEach(snippet => {
            const langKey = mapLanguage(snippet.langSlug);
            if (langKey) {
                starterCode[langKey] = snippet.code;
            }
        });

        const description = data.content.replace(/<[^>]*>?/gm, '');

        return {
            id: data.questionFrontendId,
            title: data.questionTitle,
            difficulty: mapDifficulty(data.difficulty),
            description: description,
            examples: [],
            starterCode: starterCode as Record<LanguageKey, string>,
            testCases: data.exampleTestcases?.split('\n').map((input, i) => ({
                input,
                expectedOutput: 'Run to see output',
                description: `Test Case ${i + 1}`
            })) || [],
            hints: []
        };

    } catch (error) {
        console.error('Error fetching LeetCode problem:', error);
        return null;
    }
};

export const fetchProblemBySlug = async (slug: string): Promise<Problem | null> => {
    try {
        const response = await axios.get<LeetCodeProblem>(`${API_BASE_URL}/select?titleSlug=${slug}`);
        const data = response.data;

        const starterCode: Record<string, string> = {};
        data.codeSnippets?.forEach(snippet => {
            const langKey = mapLanguage(snippet.langSlug);
            if (langKey) {
                starterCode[langKey] = snippet.code;
            }
        });

        const description = data.content.replace(/<[^>]*>?/gm, '');

        return {
            id: data.questionFrontendId,
            title: data.questionTitle,
            difficulty: mapDifficulty(data.difficulty),
            description: description,
            examples: [],
            starterCode: starterCode as Record<LanguageKey, string>,
            testCases: data.exampleTestcases?.split('\n').map((input, i) => ({
                input,
                expectedOutput: 'Run to see output',
                description: `Test Case ${i + 1}`
            })) || [],
            hints: []
        };
    } catch (error) {
        console.error('Error fetching LeetCode problem:', error);
        return null;
    }
}


export interface ProblemSummary {
    questionFrontendId: string;
    title: string;
    titleSlug: string;
    difficulty: string;
    isPaidOnly: boolean;
}

interface ProblemListResponse {
    totalQuestions: number;
    count: number;
    problemsetQuestionList: ProblemSummary[];
}

export const fetchProblemList = async (limit: number = 50, skip: number = 0): Promise<ProblemSummary[]> => {
    try {
        const response = await axios.get<ProblemListResponse>(`${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`);
        return response.data.problemsetQuestionList;
    } catch (error) {
        console.error('Error fetching problem list:', error);
        return [];
    }
};
