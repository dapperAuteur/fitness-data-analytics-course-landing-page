// File: lib/services/waitlistService.ts

import dbConnect from '@/lib/db/dbConnect';
import WaitlistSubmission from '@/models/WaitlistSubmission';
import logger from '@/logging/logger';
import { sendToPabbly } from '@/lib/pabbly';
// import { sendToKeap } from '@/lib/keap';

// --- Service-specific logic for reCAPTCHA ---
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    logger.error("RECAPTCHA_SECRET_KEY is not set.");
    return false;
  }
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  try {
    const response = await fetch(verificationUrl, { method: 'POST' });
    const data = await response.json();
    logger.info("reCAPTCHA verification response", { data });
    return data.success && data.score >= 0.5;
  } catch (error) {
    logger.error("Error verifying reCAPTCHA", { error });
    return false;
  }
}

interface WaitlistPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | '';
    pageSourceState?: string;
    referrer?: string;
    token: string;
}

/**
 * Handles the business logic for a new waitlist submission.
 * @param payload The data from the incoming request.
 * @returns An object indicating success status, a message, and a status code.
 */
export async function handleWaitlistSubmission(payload: WaitlistPayload) {
  const { firstName, lastName, email, phone, pageSourceState: pageSource, referrer, token } = payload;
  console.log('pageSource :>> ', pageSource);

  if (!token || !(await verifyRecaptcha(token))) {
    logger.error("reCAPTCHA verification failed. Rejecting submission.");
    return { success: false, message: "Human verification failed. Please try again.", status: 403 };
  }

  await dbConnect();

  const existingSubmission = await WaitlistSubmission.findOne({ email });
  if (existingSubmission) {
    return { success: false, message: 'This email address has already been submitted.', status: 409 };
  }

  const newSubmission = new WaitlistSubmission({ firstName, lastName, email, phone, pageSource, referrer });
  await newSubmission.save();
  logger.info('New waitlist submission saved successfully to database', { email });

  // Fire off both webhook calls from the server
  sendToPabbly({ firstName, lastName, email, phone, pageSource, referrer });
  // sendToKeap({ firstName, lastName, email, phone });
  
  return { success: true, message: 'Successfully joined the waitlist!', status: 201 };
}
