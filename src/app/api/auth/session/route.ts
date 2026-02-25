import { NextResponse } from 'next/server';

// In-memory store for simple rate limiting and session tracking
// In production, use Redis or a database.
const ipTracker = new Map<string, { sessionsStarted: number; lastAccess: number }>();

const MAX_SESSIONS_PER_HOUR = 10;
const SESSION_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
    try {
        // Attempt to get client IP from headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'unknown');

        // For local dev where IP might not be passed
        if (clientIp === 'unknown' || clientIp === '::1' || clientIp === '127.0.0.1') {
            clientIp = 'local_dev';
        }

        const now = Date.now();
        const record = ipTracker.get(clientIp);

        if (record) {
            // Check if cooldown has passed, reset if yes
            if (now - record.lastAccess > SESSION_COOLDOWN_MS) {
                ipTracker.set(clientIp, { sessionsStarted: 1, lastAccess: now });
            } else {
                if (record.sessionsStarted >= MAX_SESSIONS_PER_HOUR && clientIp !== 'local_dev') {
                    return NextResponse.json(
                        { error: 'High traffic detected. Please try again later.' },
                        { status: 429 } // Too Many Requests
                    );
                }

                // Allowed, increment count
                ipTracker.set(clientIp, {
                    sessionsStarted: record.sessionsStarted + 1,
                    lastAccess: now
                });
            }
        } else {
            // First time
            ipTracker.set(clientIp, { sessionsStarted: 1, lastAccess: now });
        }

        // Generate a simple temporal token for the frontend to signify it's cleared
        const token = Buffer.from(`${clientIp}-${now}`).toString('base64');

        return NextResponse.json({
            authorized: true,
            token: token
        }, { status: 200 });

    } catch (error) {
        console.error('Session API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error while verifying session.' },
            { status: 500 }
        );
    }
}
