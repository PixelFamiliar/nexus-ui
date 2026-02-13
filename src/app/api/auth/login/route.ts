import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Password required' },
                { status: 400 }
            );
        }

        const passwordHash = process.env.NEXUS_PASSWORD_HASH;

        if (!passwordHash) {
            console.error('NEXUS_PASSWORD_HASH not set in environment');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Verify password against hash
        const isValid = await compare(password, passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Create response with session cookie
        const response = NextResponse.json({ success: true });

        response.cookies.set('nexus_session', 'authenticated', {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
