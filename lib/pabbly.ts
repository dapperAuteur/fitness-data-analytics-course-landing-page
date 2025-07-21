import logger from "@/logging/logger"; // Adjust path to your logger if needed

interface SubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
    logger.error("Pabbly webhook URL is not configured. Skipping webhook call.");
    return;
  }

  logger.info("Sending data to Pabbly webhook...", { email: data.email });

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
      logger.error("Failed to send data to Pabbly webhook.", {
        statusCode: response.status,
        response: errorBody,
      });
    } else {
      logger.info("Successfully sent data to Pabbly webhook.", {
        email: data.email,
      });
    }
  } catch (error: any) {
    logger.error("An unexpected error occurred while calling the Pabbly webhook.", {
      errorMessage: error.message,
      stack: error.stack,
    });
  }
}