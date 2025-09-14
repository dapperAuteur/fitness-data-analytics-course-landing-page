import logger, { LogContext } from "@/logging/logger"; // Adjust path to your logger if needed

interface SubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pageSource?: string;
  referrer?: string;
}

/**
 * Sends submission data to the Pabbly webhook.
 * This is a "fire-and-forget" function; it logs errors but does not throw them,
 * ensuring that a webhook failure doesn't break the main application flow.
 *
 * @param {SubmissionData} data - The data to send to the webhook.
 */
export async function sendToPabbly(data: SubmissionData): Promise<void> {
  const webhookUrl = process.env.PABBLY_ORDER_WEBHOOK;

  if (!webhookUrl) {
    logger.error(LogContext.PABBLY, "Pabbly webhook URL is not configured. Skipping webhook call.");
    return;
  }

  logger.info(LogContext.PABBLY, "Sending data to Pabbly webhook...", {
    metadata: {
      email: data.email,
      pageSource: data.pageSource,
      referrer: data.referrer,
    }
  });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Log the error but don't throw, to avoid breaking the user-facing flow.
      // Pabbly isn't triggering for the deployed version. Why?
      const errorBody = await response.text();
      logger.error(LogContext.PABBLY, "Failed to send data to Pabbly webhook.", {
        metadata: {
          statusCode: response.status,
          response: errorBody,
        }
      });
    } else {
      logger.info(LogContext.PABBLY, "Successfully sent data to Pabbly webhook.", {
        metadata: {
          email: data.email,
        }
      });
    }
  } catch (error: any) {
    logger.error(LogContext.PABBLY, "An unexpected error occurred while calling the Pabbly webhook.", {
      metadata: {
        errorMessage: error.message,
        stack: error.stack,
      }
    });
  }
}