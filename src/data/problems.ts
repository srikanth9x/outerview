export interface TestCase {
    input: string;
    expectedOutput: string;
    description: string;
}

export type LanguageKey = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp' | 'go' | 'rust' | 'ruby' | 'php' | 'swift' | 'kotlin';

export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: Array<{ input: string; output: string; explanation?: string }>;
    starterCode: Record<LanguageKey, string>;
    testCases: TestCase[];
    hints?: string[];
}

// Helper function to generate starter code for a simple problem
const generateStarterCode = (problemId: string): Record<LanguageKey, string> => {
    if (problemId === 'two-sum') {
        return {
            javascript: `function twoSum(nums, target) {
  // Your code here
  
}

// Test
console.log(JSON.stringify(twoSum([2,7,11,15], 9)));`,
            typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
  return [];
}

// Test
console.log(JSON.stringify(twoSum([2,7,11,15], 9)));`,
            python: `def two_sum(nums, target):
    # Your code here
    pass

# Test
import json
print(json.dumps(two_sum([2,7,11,15], 9)))`,
            java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.twoSum(new int[]{2,7,11,15}, 9);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}

int main() {
    vector<int> nums = {2,7,11,15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    return result;
}

int main() {
    int nums[] = {2,7,11,15};
    int returnSize;
    int* result = twoSum(nums, 4, 9, &returnSize);
    printf("[%d,%d]\\n", result[0], result[1]);
    free(result);
    return 0;
}`,
            csharp: `using System;

class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
    
    static void Main() {
        Solution sol = new Solution();
        int[] result = sol.TwoSum(new int[]{2,7,11,15}, 9);
        Console.WriteLine($"[{result[0]},{result[1]}]");
    }
}`,
            go: `package main
import "fmt"

func twoSum(nums []int, target int) []int {
    // Your code here
    return []int{}
}

func main() {
    result := twoSum([]int{2,7,11,15}, 9)
    fmt.Printf("[%d,%d]\\n", result[0], result[1])
}`,
            rust: `fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    // Your code here
    vec![]
}

fn main() {
    let result = two_sum(vec![2,7,11,15], 9);
    println!("[{},{}]", result[0], result[1]);
}`,
            ruby: `def two_sum(nums, target)
    # Your code here
    []
end

# Test
require 'json'
puts two_sum([2,7,11,15], 9).to_json`,
            php: `<?php
function twoSum($nums, $target) {
    // Your code here
    return [];
}

// Test
$result = twoSum([2,7,11,15], 9);
echo json_encode($result);
?>`,
            swift: `func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
    // Your code here
    return []
}

// Test
let result = twoSum([2,7,11,15], 9)
print("[\\(result[0]),\\(result[1])]")`,
            kotlin: `fun twoSum(nums: IntArray, target: Int): IntArray {
    // Your code here
    return intArrayOf()
}

fun main() {
    val result = twoSum(intArrayOf(2,7,11,15), 9)
    println("[" + result[0] + "," + result[1] + "]")
}`
        };
    }

    // Default simple template
    return {
        javascript: `// Your code here\nconsole.log("Hello World");`,
        typescript: `// Your code here\nconsole.log("Hello World");`,
        python: `# Your code here\nprint("Hello World")`,
        java: `class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}`,
        csharp: `using System;\n\nclass Solution {\n    static void Main() {\n        Console.WriteLine("Hello World");\n    }\n}`,
        go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}`,
        rust: `fn main() {\n    println!("Hello World");\n}`,
        ruby: `# Your code here\nputs "Hello World"`,
        php: `<?php\necho "Hello World";\n?>`,
        swift: `// Your code here\nprint("Hello World")`,
        kotlin: `fun main() {\n    println("Hello World")\n}`
    };
};

export const problems: Problem[] = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        examples: [
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            },
            {
                input: 'nums = [3,2,4], target = 6',
                output: '[1,2]'
            }
        ],
        starterCode: generateStarterCode('two-sum'),
        testCases: [
            {
                input: 'twoSum([2,7,11,15], 9)',
                expectedOutput: '[0,1]',
                description: 'Basic case'
            },
            {
                input: 'twoSum([3,2,4], 6)',
                expectedOutput: '[1,2]',
                description: 'Different indices'
            },
            {
                input: 'twoSum([3,3], 6)',
                expectedOutput: '[0,1]',
                description: 'Duplicate numbers'
            }
        ],
        hints: ['Use a hash map to store numbers you\'ve seen', 'For each number, check if target - number exists in the map']
    }
];

export function getRandomProblem(difficulty?: 'Easy' | 'Medium' | 'Hard'): Problem {
    let filtered = problems;
    if (difficulty) {
        filtered = problems.filter(p => p.difficulty === difficulty);
    }
    if (filtered.length === 0) return problems[Math.floor(Math.random() * problems.length)];
    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getProblemById(id: string): Problem | undefined {
    return problems.find(p => p.id === id);
}
