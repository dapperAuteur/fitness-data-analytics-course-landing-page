import { SignJWT, jwtVerify } from "jose";
import { getEbookBaseUrl, getEnv } from "@/lib/env";

const ALG = "HS256";
const EXP = "24h";

export const FOUNDATIONS_SLUG = "foundations-3-page";

interface EbookPayload {
  slug: string;
  leadId: string;
}

function getKey(): Uint8Array {
  return new TextEncoder().encode(getEnv().EBOOK_JWT_SECRET);
}

export async function signEbookToken(payload: EbookPayload): Promise<string> {
  return await new SignJWT({ slug: payload.slug, leadId: payload.leadId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXP)
    .sign(getKey());
}

export async function verifyEbookToken(token: string): Promise<EbookPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: [ALG] });
    if (typeof payload.slug !== "string" || typeof payload.leadId !== "string") return null;
    return { slug: payload.slug, leadId: payload.leadId };
  } catch {
    return null;
  }
}

export async function buildEbookUrl(opts: EbookPayload): Promise<string> {
  const token = await signEbookToken(opts);
  const base = getEbookBaseUrl();
  return `${base}/ebook/${opts.slug}?t=${encodeURIComponent(token)}`;
}
