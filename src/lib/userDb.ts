import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export interface User {
    id: string;
    email: string;
    name: string;
    password: string; // hashed
    createdAt: number;
}

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    }
}

function getUsers(): User[] {
    try {
        ensureDataDir();
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveUsers(users: User[]) {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export async function createUser(email: string, password: string, name: string): Promise<User | null> {
    try {
        const users = getUsers();

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email,
            name,
            password: hashedPassword,
            createdAt: Date.now()
        };

        users.push(user);
        saveUsers(users);

        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw to let the API route handle it
    }
}

export function getUser(email: string): User | null {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Google's password requirements:
    // - At least 8 characters
    // - Mix of letters, numbers, and symbols recommended

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Optional but recommended
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password should contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
