import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "embiciate_secret_key_super_secure_2026_mdp";
const COOKIE_NAME = "embiciate_session";

export function signSession(adminId: string): string {
  const oneDay = 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + oneDay;
  const data = `${adminId}.${expiresAt}`;
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

export function verifySession(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [adminId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    
    if (isNaN(expiresAt) || expiresAt < Date.now()) {
      return null; // Expired
    }
    
    const data = `${adminId}.${expiresAtStr}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    
    if (signature !== expectedSignature) {
      return null; // Tampered
    }
    
    return adminId;
  } catch (e) {
    return null;
  }
}

export async function getSessionAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;
  return verifySession(cookie.value);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}
