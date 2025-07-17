// File: lib/services/waitlistService.ts

import dbConnect from '@/lib/db/dbConnect';
import WaitlistSubmission from '@/models/WaitlistSubmission';
import logger from '@/logging/logger';
import { sendToPabbly } from '@/lib/pabbly';

// --- Service-specific logic for Keap ---
async function sendToKeap(data: { firstName: string; lastName: string; email: string; phone?: string; }) {
  const keapFormId = process.env.NEXT_PUBLIC_KEAP_FORM_ID || 'kq169';
  const keapFormName = process.env.NEXT_PUBLIC_KEAP_FORM_NAME || 'fda-landing-page';
  const keapFormUrl = `https://keap.page/form-submit/${keapFormId}`;

  const formData = new URLSearchParams();
  formData.append('inf_form_xid', keapFormId);
  formData.append('inf_form_name', keapFormName);
  formData.append('infusionsoft_version', '1.70.0.59431');
  formData.append('inf_field_FirstName', data.firstName);
  formData.append('inf_field_LastName', data.lastName);
  formData.append('inf_field_Email', data.email);
  if (data.phone) {
    formData.append('inf_field_Phone1', data.phone);
  }

  logger.info("Sending data to Keap...", { email: data.email });
  try {
    const response = await fetch(keapFormUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });
    if (!response.ok) {
      logger.error("Failed to send data to Keap.", { statusCode: response.status });
    } else {
      logger.info("Successfully sent data to Keap.", { email: data.email });
    }
  } catch (error: any) {
    logger.error("An unexpected error occurred while calling the Keap API.", { errorMessage: error.message });
  }
}

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
    referrer?: string;
    token: string;
}

/**
 * Handles the business logic for a new waitlist submission.
 * @param payload The data from the incoming request.
 * @returns An object indicating success status, a message, and a status code.
 */
export async function handleWaitlistSubmission(payload: WaitlistPayload) {
  const { firstName, lastName, email, phone, referrer, token } = payload;

  if (!token || !(await verifyRecaptcha(token))) {
    logger.error("reCAPTCHA verification failed. Rejecting submission.");
    return { success: false, message: "Human verification failed. Please try again.", status: 403 };
  }

  await dbConnect();

  const existingSubmission = await WaitlistSubmission.findOne({ email });
  if (existingSubmission) {
    return { success: false, message: 'This email address has already been submitted.', status: 409 };
  }

  const newSubmission = new WaitlistSubmission({ firstName, lastName, email, phone, referrer });
  await newSubmission.save();
  logger.info('New waitlist submission saved successfully to database', { email });

  // Fire off both webhook calls from the server
  sendToPabbly({ firstName, lastName, email, phone, referrer });
  sendToKeap({ firstName, lastName, email, phone });
  
  return { success: true, message: 'Successfully joined the waitlist!', status: 201 };
}
