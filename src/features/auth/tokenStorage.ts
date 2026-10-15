const TOKEN_KEY = "innocent-writer-auth-token";

let memoryToken: string | null = null;

export const AUTH_SESSION_EXPIRED_EVENT =
  "innocent-writer:auth-session-expired";

export function getAuthToken(): string | null {
  try {
    const stored = window.sessionStorage.getItem(TOKEN_KEY);

    if (stored) {
      memoryToken = stored;
      return stored;
    }
  } catch {
    // Use in-memory storage if browser storage is unavailable.
  }

  return memoryToken;
}

export function setAuthToken(token: string): void {
  memoryToken = token;

  try {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // The current page can still use the in-memory token.
  }
}

export function clearAuthToken(): void {
  memoryToken = null;

  try {
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // In-memory state is still cleared.
  }
}
