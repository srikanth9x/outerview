import { NextResponse } from 'next/server';
import { createUser, validatePassword } from '@/lib/userDb';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: 'Password does not meet requirements', details: passwordValidation.errors },
                { status: 400 }
            );
        }

        // Create user
        const user = await createUser(email, password, name);

        if (!user) {
            return NextResponse.json(
                { error: 'Email is already connected to an account' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: 'Account created successfully', user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
