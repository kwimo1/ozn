import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminUserByEmail, updateAdminLastLogin } from "@/lib/store";

const SESSION_COOKIE = "nova-thread-admin-session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "nova-thread-demo-session-secret";

type SessionPayload = {
  sub: string;
  email: string;
  displayName: string;
  role: "admin" | "staff";
  exp: number;
  iat: number;
};

function signSessionPayload(encodedPayload: string) {
  return createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signSessionPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodeSession(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;

    if (payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const user = getAdminUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  updateAdminLastLogin(user.id);
  return user;
}

export async function createSession(user: {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "staff";
}) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = encodeSession({
    sub: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    iat: Date.now(),
    exp: expiresAt.getTime(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = decodeSession(token);

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    id: session.sub,
    displayName: session.displayName,
    email: session.email,
    role: session.role,
    lastLogin: null,
    createdAt: "",
  };
}

export async function requireAdminUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export { SESSION_COOKIE };
