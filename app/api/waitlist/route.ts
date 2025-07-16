import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import WaitlistSubmission from '../../../models/WaitlistSubmission';
import logger from '../../../logging/logger';

export async function POST(req: Request) {
  logger.info('Received POST request to /api/waitlist');

  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, referrer } = body;

    // Log the received data
    logger.info('Request body', { body });


    await dbConnect();

    // --- Server-side validation ---
    // Note: The Mongoose schema already provides robust validation,
    // but an initial check here can save a database call.
    if (!firstName || !lastName || !email || !phone) {
      const errorMessage = 'Validation failed: Missing required fields.';
      logger.error(errorMessage, body);
      // Use NextResponse for responses
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const newSubmission = new WaitlistSubmission({
      firstName,
      lastName,
      email,
      phone,
      referrer,
    });

    await newSubmission.save();

    logger.info('New waitlist submission saved successfully', { email });
    // Return a success response
    return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 201 });

  } catch (error: any) {
    logger.error('Error in /api/waitlist POST handler', {
      error: error.message,
      stack: error.stack
    });
    // Handle validation errors from Mongoose specifically
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Handle other potential errors (e.g., JSON parsing)
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Return a generic server error response
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  
  }
}