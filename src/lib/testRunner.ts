import { executeCode } from './piston';
import { TestCase } from '@/data/problems';

export interface TestResult {
    passed: boolean;
    description: string;
    expected: string;
    actual: string;
    error?: string;
}

export interface ValidationResult {
    allPassed: boolean;
    passedCount: number;
    totalCount: number;
    results: TestResult[];
}

/**
 * Normalizes output by removing whitespace and converting to lowercase
 */
function normalizeOutput(output: string): string {
    return output.trim().replace(/\s+/g, '').toLowerCase();
}

/**
 * Runs code against test cases and validates output
 */
export async function validateCode(
    code: string,
    testCases: TestCase[],
    language: string = 'javascript'
): Promise<ValidationResult> {
    const results: TestResult[] = [];

    for (const testCase of testCases) {
        try {
            // Execute the code with the test case
            const result = await executeCode(language, code);

            if (result.run.stderr) {
                results.push({
                    passed: false,
                    description: testCase.description,
                    expected: testCase.expectedOutput,
                    actual: '',
                    error: result.run.stderr
                });
                continue;
            }

            const actualOutput = result.run.output;
            const normalizedActual = normalizeOutput(actualOutput);
            const normalizedExpected = normalizeOutput(testCase.expectedOutput);

            const passed = normalizedActual === normalizedExpected;

            results.push({
                passed,
                description: testCase.description,
                expected: testCase.expectedOutput,
                actual: actualOutput.trim(),
                error: passed ? undefined : 'Output does not match expected'
            });
        } catch (error) {
            results.push({
                passed: false,
                description: testCase.description,
                expected: testCase.expectedOutput,
                actual: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    const passedCount = results.filter(r => r.passed).length;

    return {
        allPassed: passedCount === testCases.length,
        passedCount,
        totalCount: testCases.length,
        results
    };
}

/**
 * Generates test code by wrapping user code with test case execution
 */
export function generateTestCode(userCode: string, testInput: string): string {
    // Remove any existing console.log from user code
    const cleanCode = userCode.replace(/console\.log\([^)]*\);?/g, '');

    return `${cleanCode}\n\n// Test execution\nconsole.log(JSON.stringify(${testInput}));`;
}
