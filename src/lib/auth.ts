// Prototype authentication only. Replace with secure authentication before production use.
// Mock client-side authentication for the prototype. Replace with a real
// auth provider/session later. State is kept in localStorage.
import type { AuthState } from "@/types/admin";
import { DEMO_CREDENTIAL } from "@/data/adminConfig";

const AUTH_KEY = "sp_auth";
const isBrowser = () => typeof window !== "undefined";

export function login(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === DEMO_CREDENTIAL.email &&
    password === DEMO_CREDENTIAL.password
  ) {
    if (isBrowser()) {
      const state: AuthState = {
        email: email.trim().toLowerCase(),
        loggedInAt: new Date().toISOString(),
      };
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (isBrowser()) window.localStorage.removeItem(AUTH_KEY);
}

export function getAuth(): AuthState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
