// File: lib/services/waitlistService.ts
// Enhanced version of your existing service with better error handling

import dbConnect from '@/lib/db/dbConnect';
import WaitlistSubmission from '@/models/WaitlistSubmission';
import logger, { LogContext }  from '@/logging/logger';
import { sendToPabbly } from '@/lib/pabbly';
// import { sendToKeap } from '@/lib/keap';

// Email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
// const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  

// --- Service-specific logic for reCAPTCHA ---
async function verifyRecaptcha(token: string): Promise<boolean> {
  
  if (!secretKey) {
    logger.error(LogContext.SYSTEM, "RECAPTCHA_SECRET_KEY is not set.");
    return false;
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await response.json();
    logger.info(LogContext.SYSTEM, "reCAPTCHA verification response", { 
      metadata: {data,
        score: data.score,
        action: data.action
      },
    });
    
    return data.success && data.score >= 0.5;
  } catch (error) {
    logger.error(LogContext.SYSTEM, "Error verifying reCAPTCHA", {
      metadata: { error }
    });
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
 * Validates the waitlist form data
 */
function validateFormData(payload: WaitlistPayload): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!payload.firstName || typeof payload.firstName !== 'string' || payload.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!payload.lastName || typeof payload.lastName !== 'string' || payload.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!payload.email || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!emailRegex.test(payload.email.trim())) {
    errors.push('Invalid email format');
  }

  // Phone is optional, but if provided, must be valid
  if (payload.phone && payload.phone.trim().length > 0 && !phoneRegex.test(payload.phone.trim())) {
    errors.push('Invalid phone number format');
  }

  if (!payload.token || typeof payload.token !== 'string') {
    errors.push('reCAPTCHA token is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Handles the business logic for a new waitlist submission.
 * @param payload The data from the incoming request.
 * @returns An object indicating success status, a message, and a status code.
 */
export async function handleWaitlistSubmission(payload: WaitlistPayload) {
  const { firstName, lastName, email, phone, pageSourceState: pageSource, referrer, token } = payload;
  logger.info(LogContext.SYSTEM, 'Processing waitlist submission', {
    metadata: {
      email: email, 
      pageSource: pageSource
    }
  });

  // Validate input data
  const validation = validateFormData(payload);
  if (!validation.isValid) {
    logger.warning(LogContext.SYSTEM, 'Waitlist submission validation failed', { metadata:
      {
        errors: validation.errors
      } });
    return { 
      success: false, 
      message: `Validation failed: ${validation.errors.join(', ')}`, 
      status: 400 
    };
  }
  
  // Verify reCAPTCHA
  if (!token || !(await verifyRecaptcha(token))) {
    logger.error(LogContext.SYSTEM, "reCAPTCHA verification failed. Rejecting submission.", { metadata: {
      email
    } });
    return {
      success: false,
      message: "Human verification failed. Please try again.",
      status: 403
    };
  }

  try {
    // Connect to database
    await dbConnect();
    logger.info(LogContext.SYSTEM, 'Database connection established');

    // Check for existing submission
    const existingSubmission = await WaitlistSubmission.findOne({ email: email.toLowerCase() });
    if (existingSubmission) {
      logger.warning(LogContext.SYSTEM, 'Duplicate email submission attempted', { metadata: {
        email
      } });
      return {
        success: false,
        message: 'This email address has already been submitted.',
        status: 409 };
    }

    // Save new submission
    const newSubmission = new WaitlistSubmission({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email.toLowerCase().trim(), 
      phone: phone?.trim() || '', 
      pageSource, 
      referrer 
    });
    
    await newSubmission.save();
    logger.info(LogContext.SYSTEM, 'New waitlist submission saved successfully to database', {
      metadata: {
        email
      }
    });

    // Fire off webhook calls (don't wait for them to complete)
    try {
      sendToPabbly({ firstName, lastName, email, phone, pageSource, referrer });
      logger.info(LogContext.SYSTEM, 'Pabbly webhook triggered', {
      metadata: {
        email
      }
    });
    } catch (webhookError) {
      logger.error(LogContext.SYSTEM, 'Pabbly webhook failed', {
        metadata: {
          error: webhookError,
          email
        }
      });
      // Don't fail the submission if webhook fails
    }

    // Uncomment when ready
    // try {
    //   sendToKeap({ firstName, lastName, email, phone });
    //   logger.info(LogContext.SYSTEM, 'Keap webhook triggered', { metadata: {
    //     email
    //   }
    // });
    // } catch (webhookError) {
    //   logger.error(LogContext.SYSTEM, 'Keap webhook failed', { metadata: {
    //     error: webhookError, email
    //   }
    // });
    // }
    
    return { success: true, message: 'Successfully joined the waitlist!', status: 201 };

  } catch (error) {
    logger.error(LogContext.SYSTEM, 'Database error during waitlist submission', { 
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        email
      }
    });
    return { 
      success: false, 
      message: 'Failed to save your submission. Please try again.', 
      status: 500 
    };
  }
}