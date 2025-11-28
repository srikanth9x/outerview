import axios from 'axios';
import { Problem, LanguageKey } from '@/data/problems';

const API_BASE_URL = 'https://alfa-leetcode-api.onrender.com';

interface LeetCodeProblem {
    questionFrontendId: string;
    questionTitle?: string;
    title?: string;
    questionTitleSlug: string;
    difficulty: string;
    content: string;
    exampleTestcases: string;
    hints?: string[];
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

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
    const entities: Record<string, string> = {
        '&nbsp;': ' ',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&#39;': "'",
        '&apos;': "'",
        '&ldquo;': '"',
        '&rdquo;': '"',
        '&lsquo;': "'",
        '&rsquo;': "'"
    };
    return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
};

// Helper function to parse examples from HTML content
const parseExamples = (htmlContent: string): Array<{ input: string; output: string; explanation?: string }> => {
    const examples: Array<{ input: string; output: string; explanation?: string }> = [];

    // Match example blocks
    const exampleRegex = /<strong[^>]*>Example \d+:<\/strong>([\s\S]*?)(?=<strong[^>]*>Example \d+:<\/strong>|<strong[^>]*>Constraints:<\/strong>|$)/gi;
    const matches = htmlContent.match(exampleRegex);

    if (!matches) return examples;

    matches.forEach(match => {
        // Extract input
        const inputMatch = match.match(/<strong[^>]*>Input:<\/strong>\s*([^<]+)/i);
        // Extract output
        const outputMatch = match.match(/<strong[^>]*>Output:<\/strong>\s*([^<]+)/i);
        // Extract explanation (optional)
        const explanationMatch = match.match(/<strong[^>]*>Explanation:<\/strong>\s*(.+?)(?=<\/p>|$)/i);

        if (inputMatch && outputMatch) {
            const example: { input: string; output: string; explanation?: string } = {
                input: decodeHtmlEntities(inputMatch[1].trim()),
                output: decodeHtmlEntities(outputMatch[1].trim())
            };

            if (explanationMatch) {
                // Remove HTML tags from explanation
                const cleanExplanation = explanationMatch[1].replace(/<[^>]*>/g, '').trim();
                example.explanation = decodeHtmlEntities(cleanExplanation);
            }

            examples.push(example);
        }
    });

    return examples;
};

// Helper function to extract clean description (before examples)
const extractDescription = (htmlContent: string): string => {
    // Get content before the first example
    const beforeExamples = htmlContent.split(/<strong[^>]*>Example \d+:<\/strong>/i)[0];
    // Remove HTML tags
    const cleanText = beforeExamples.replace(/<[^>]*>/g, '');
    return decodeHtmlEntities(cleanText.trim());
};

const parseProblemData = (data: LeetCodeProblem) => {
    const starterCode: Record<string, string> = {};
    data.codeSnippets?.forEach(snippet => {
        const langKey = mapLanguage(snippet.langSlug);
        if (langKey) {
            starterCode[langKey] = snippet.code;
        }
    });

    const description = data.content ? extractDescription(data.content) : 'No description available.';
    const examples = data.content ? parseExamples(data.content) : [];
    const hints = data.hints || [];

    return {
        id: data.questionFrontendId,
        title: data.questionTitle || data.title || 'Untitled',
        difficulty: mapDifficulty(data.difficulty),
        description: description,
        examples: examples,
        starterCode: starterCode as Record<LanguageKey, string>,
        testCases: data.exampleTestcases?.split('\n').map((input, i) => ({
            input,
            expectedOutput: 'Run to see output',
            description: `Test Case ${i + 1}`
        })) || [],
        hints: hints
    };
};

export const fetchDailyProblem = async (): Promise<Problem | null> => {
    try {
        const response = await axios.get<{ question: LeetCodeProblem }>(`${API_BASE_URL}/daily/raw`);
        const data = response.data.question;
        return parseProblemData(data);
    } catch (error) {
        console.error('Error fetching daily LeetCode problem:', error);
        return null;
    }
}

export const fetchProblemBySlug = async (slug: string): Promise<Problem | null> => {
    try {
        const response = await axios.get<{ question: LeetCodeProblem }>(`${API_BASE_URL}/select/raw?titleSlug=${slug}`);
        const data = response.data.question;
        return parseProblemData(data);
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
