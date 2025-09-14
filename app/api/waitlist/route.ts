// app/api/waitlist/route.ts
import { NextResponse, NextRequest } from 'next/server';
import logger, { LogContext } from '@/logging/logger'; // Import LogContext too
import { handleWaitlistSubmission } from '@/lib/services/waitlistService';

/**
 * API Route for handling waitlist form submissions.
 */
export async function POST(request: NextRequest) {
  try {
    logger.info(LogContext.SYSTEM, 'Received POST request to /api/waitlist');

    // Parse the request body
    let body: any;
    try {
      body = await request.json();
      logger.info(LogContext.SYSTEM, 'Request body parsed successfully', {
        metadata: {
          hasFirstName: !!body?.firstName,
          hasLastName: !!body?.lastName,
          hasEmail: !!body?.email,
          hasToken: !!body?.token
        }
      });
    } catch (parseError) {
      logger.error(LogContext.SYSTEM, 'Failed to parse request body as JSON', {
        metadata: {
          error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          contentType: request.headers.get('content-type')
        }
      });
      
      return NextResponse.json(
        { message: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }

    // Validate that we have some data
    if (!body || typeof body !== 'object') {
      logger.warning(LogContext.SYSTEM, 'Request body is empty or not an object', {
        metadata: { bodyType: typeof body }
      });
      
      return NextResponse.json(
        { message: 'Request body must be a JSON object' }, 
        { status: 400 }
      );
    }

    // Call your existing service
    logger.info(LogContext.SYSTEM, 'Calling waitlist service');
    const result = await handleWaitlistSubmission(body);

    logger.info(LogContext.SYSTEM, 'Waitlist service completed', {
      metadata: {
        success: result.success,
        status: result.status
      }
    });

    // Return the response from your service
    return NextResponse.json({ message: result.message }, { status: result.status });

  } catch (error: any) {
    logger.error(LogContext.SYSTEM, 'Error in /api/waitlist POST handler', {
      metadata: {
        error: error.message,
        stack: error.stack,
      }
    });

    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}