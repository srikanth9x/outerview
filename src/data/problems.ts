export interface TestCase {
    input: string;
    expectedOutput: string;
    description: string;
}

export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: Array<{ input: string; output: string; explanation?: string }>;
    starterCode: {
        javascript: string;
        python: string;
        cpp: string;
    };
    testCases: TestCase[];
    hints?: string[];
}

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
        starterCode: {
            javascript: `function twoSum(nums, target) {
  // Your code here
  
}

// Test
console.log(JSON.stringify(twoSum([2,7,11,15], 9)));`,
            python: `def two_sum(nums, target):
    # Your code here
    pass

# Test
import json
print(json.dumps(two_sum([2,7,11,15], 9)))`,
            cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}

int main() {
    vector<int> nums = {2,7,11,15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`
        },
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
    },
    {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'Easy',
        description: 'Write a function that reverses a string. The input string is given as an array of characters.',
        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]'
            },
            {
                input: 's = ["H","a","n","n","a","h"]',
                output: '["h","a","n","n","a","H"]'
            }
        ],
        starterCode: {
            javascript: `function reverseString(s) {
  // Your code here
  
}

// Test
const test = ["h","e","l","l","o"];
reverseString(test);
console.log(JSON.stringify(test));`,
            python: `def reverse_string(s):
    # Your code here
    pass

# Test
import json
test = ["h","e","l","l","o"]
reverse_string(test)
print(json.dumps(test))`,
            cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void reverseString(vector<char>& s) {
    // Your code here
    
}

int main() {
    vector<char> test = {'h','e','l','l','o'};
    reverseString(test);
    cout << "[";
    for(int i = 0; i < test.size(); i++) {
        cout << "\\"" << test[i] << "\\"";
        if(i < test.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`
        },
        testCases: [
            {
                input: 'reverseString(["h","e","l","l","o"])',
                expectedOutput: '["o","l","l","e","h"]',
                description: 'Basic reversal'
            },
            {
                input: 'reverseString(["H","a","n","n","a","h"])',
                expectedOutput: '["h","a","n","n","a","H"]',
                description: 'Palindrome-like input'
            }
        ]
    },
    {
        id: 'fizzbuzz',
        title: 'FizzBuzz',
        difficulty: 'Easy',
        description: 'Given an integer `n`, return a string array `answer` where: `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5, `answer[i] == "Fizz"` if `i` is divisible by 3, `answer[i] == "Buzz"` if `i` is divisible by 5, `answer[i] == i` (as a string) if none of the above conditions are true.',
        examples: [
            {
                input: 'n = 3',
                output: '["1","2","Fizz"]'
            },
            {
                input: 'n = 5',
                output: '["1","2","Fizz","4","Buzz"]'
            },
            {
                input: 'n = 15',
                output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
            }
        ],
        starterCode: {
            javascript: `function fizzBuzz(n) {
  // Your code here
  
}

// Test
console.log(JSON.stringify(fizzBuzz(15)));`,
            python: `def fizz_buzz(n):
    # Your code here
    pass

# Test
import json
print(json.dumps(fizz_buzz(15)))`,
            cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> fizzBuzz(int n) {
    // Your code here
    
}

int main() {
    vector<string> result = fizzBuzz(15);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "\\"" << result[i] << "\\"";
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`
        },
        testCases: [
            {
                input: 'fizzBuzz(3)',
                expectedOutput: '["1","2","Fizz"]',
                description: 'Small input'
            },
            {
                input: 'fizzBuzz(5)',
                expectedOutput: '["1","2","Fizz","4","Buzz"]',
                description: 'Include Buzz'
            },
            {
                input: 'fizzBuzz(15)',
                expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
                description: 'Include FizzBuzz'
            }
        ]
    },
    {
        id: 'palindrome-number',
        title: 'Palindrome Number',
        difficulty: 'Easy',
        description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.',
        examples: [
            {
                input: 'x = 121',
                output: 'true',
                explanation: '121 reads as 121 from left to right and from right to left.'
            },
            {
                input: 'x = -121',
                output: 'false',
                explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.'
            },
            {
                input: 'x = 10',
                output: 'false'
            }
        ],
        starterCode: {
            javascript: `function isPalindrome(x) {
  // Your code here
  
}

// Test
console.log(isPalindrome(121));`,
            python: `def is_palindrome(x):
    # Your code here
    pass

# Test
print(is_palindrome(121))`,
            cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Your code here
    
}

int main() {
    cout << (isPalindrome(121) ? "true" : "false") << endl;
    return 0;
}`
        },
        testCases: [
            {
                input: 'isPalindrome(121)',
                expectedOutput: 'true',
                description: 'Positive palindrome'
            },
            {
                input: 'isPalindrome(-121)',
                expectedOutput: 'false',
                description: 'Negative number'
            },
            {
                input: 'isPalindrome(10)',
                expectedOutput: 'false',
                description: 'Non-palindrome'
            }
        ]
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Medium',
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
        examples: [
            {
                input: 's = "()"',
                output: 'true'
            },
            {
                input: 's = "()[]{}"',
                output: 'true'
            },
            {
                input: 's = "(]"',
                output: 'false'
            }
        ],
        starterCode: {
            javascript: `function isValid(s) {
  // Your code here
  
}

// Test
console.log(isValid("()[]{}"));`,
            python: `def is_valid(s):
    # Your code here
    pass

# Test
print(is_valid("()[]{}"))`,
            cpp: `#include <iostream>
#include <string>
using namespace std;

bool isValid(string s) {
    // Your code here
    
}

int main() {
    cout << (isValid("()[]{}") ? "true" : "false") << endl;
    return 0;
}`
        },
        testCases: [
            {
                input: 'isValid("()")',
                expectedOutput: 'true',
                description: 'Simple valid case'
            },
            {
                input: 'isValid("()[]{}")',
                expectedOutput: 'true',
                description: 'Multiple types'
            },
            {
                input: 'isValid("(]")',
                expectedOutput: 'false',
                description: 'Invalid pairing'
            },
            {
                input: 'isValid("([)]")',
                expectedOutput: 'false',
                description: 'Wrong order'
            }
        ],
        hints: ['Use a stack data structure', 'Push opening brackets, pop and match closing brackets']
    }
];

export function getRandomProblem(): Problem {
    return problems[Math.floor(Math.random() * problems.length)];
}

export function getProblemById(id: string): Problem | undefined {
    return problems.find(p => p.id === id);
}
