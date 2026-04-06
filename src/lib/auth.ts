import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionRecord,
  deleteSessionRecord,
  getAdminUserByEmail,
  getSessionByToken,
  updateAdminLastLogin,
} from "@/lib/store";

const SESSION_COOKIE = "nova-thread-admin-session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

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

export async function createSession(adminUserId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  createSessionRecord(adminUserId, token, expiresAt.toISOString());

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
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    deleteSessionRecord(token);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = getSessionByToken(token);

  if (!session || new Date(session.expiresAt) <= new Date()) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    id: session.id,
    displayName: session.displayName,
    email: session.email,
    role: session.role,
    lastLogin: session.lastLogin,
    createdAt: session.createdAt,
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
