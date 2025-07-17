// File: app/api/waitlist/route.ts

import { NextResponse } from 'next/server';
import logger from '@/logging/logger';
import { handleWaitlistSubmission } from '@/lib/services/waitlistService'; // NEW: Import the service

/**
 * API Route for handling waitlist form submissions.
 * This route acts as a controller. Its only job is to receive the request,
 * pass it to the appropriate service, and return a response.
 * All business logic is handled in the waitlistService.
 */
export async function POST(request: Request) {
  logger.info('Received POST request to /api/waitlist');

  try {
    const body = await request.json();

    // Pass the entire request body to the service layer to handle.
    const result = await handleWaitlistSubmission(body);

    // The service layer returns the appropriate response.
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    return NextResponse.json({ message: result.message }, { status: 201 });

  } catch (error: any) {
    logger.error('Error in /api/waitlist POST handler', {
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
