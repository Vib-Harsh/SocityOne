export interface ErrorLogEntry {
  timestamp: string;
  message: string;
  stack?: string;
  url?: string;
}

const STORAGE_KEY = "society-error-logs";
const MAX_LOGS = 150;
const MAX_CONSOLE_ERRORS = 20;

// Preserve original console.error to avoid recursive loops when we log inside interceptor
const originalConsoleError = console.error;
const consoleErrorBuffer: string[] = [];

// Intercept console.error to record rolling log of recent errors
console.error = function (...args: unknown[]) {
  const message = args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack}`;
      } else if (typeof arg === "object") {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");

  const timestamp = new Date().toISOString();
  consoleErrorBuffer.push(`[${timestamp}] ${message}`);
  if (consoleErrorBuffer.length > MAX_CONSOLE_ERRORS) {
    consoleErrorBuffer.shift();
  }

  // Call standard browser developer console error
  originalConsoleError.apply(console, args);
};

/**
 * Check if the user is authenticated.
 * Verifies common authorization token keys in localStorage/cookies, or Redux devTools.
 */
export const isUserAuthenticated = (): boolean => {
  const tokenKeys = ["society-token", "token", "access_token", "auth_token", "jwt"];
  const hasTokenInStorage = tokenKeys.some((key) => {
    try {
      return !!localStorage.getItem(key);
    } catch {
      return false;
    }
  });

  const hasTokenInCookies =
    typeof document !== "undefined" &&
    (document.cookie.includes("token=") ||
      document.cookie.includes("jwt=") ||
      document.cookie.includes("session="));

  return hasTokenInStorage || hasTokenInCookies;
};

/**
 * Extracts and decodes numeric user ID from jwt token in localStorage if present.
 */
export const getUserId = (): number | null => {
  const tokenKeys = ["society-token", "token", "access_token", "auth_token", "jwt"];
  for (const key of tokenKeys) {
    try {
      const token = localStorage.getItem(key);
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const userId = payload.id || payload.userId || payload.sub || payload.user_id;
          if (userId && !isNaN(Number(userId))) {
            return Number(userId);
          }
        }
      }
    } catch {
      // Ignore decoding errors
    }
  }
  return null;
};

/**
 * Core frontend logging utility. Handles localStorage logging and report creation.
 */
export const clientLogger = {
  /**
   * Retrieves current list of stored logs from localStorage.
   */
  getStoredLogs(): ErrorLogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clears all stored error logs in localStorage.
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      originalConsoleError("Failed to clear localStorage logs:", e);
    }
  },

  /**
   * Logs a new client error entry inside localStorage circular buffer.
   * Capped strictly at 150 entries.
   * ONLY runs if the user is authenticated.
   */
  logError(error: Error, messageOverride?: string): void {
    // Only write logs if the user is authenticated
    if (!isUserAuthenticated()) {
      return;
    }

    const timestamp = new Date().toISOString();
    const message = messageOverride || error.message || "Unknown error";
    const stack = error.stack || "";
    const url = typeof window !== "undefined" ? window.location.href : "";

    const newEntry: ErrorLogEntry = {
      timestamp,
      message,
      stack,
      url,
    };

    try {
      const logs = this.getStoredLogs();
      logs.unshift(newEntry); // Prepend new log

      // Enforce the 150 circular buffer limit
      if (logs.length > MAX_LOGS) {
        logs.splice(MAX_LOGS);

        // TODO: Send 150 logs to backend with user_id
        // When the limit is reached, this hook will be triggered to synchronize with the backend service.
        // const userId = getUserId();
        // syncLogsWithBackend(logs, userId);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      originalConsoleError("Failed to write client log to localStorage:", e);
    }
  },

  /**
   * Retrieves the in-memory array of intercepted console errors.
   */
  getCapturedConsoleErrors(): string[] {
    return [...consoleErrorBuffer];
  },

  /**
   * Prepares the payload format for the "Report and Reload" submission.
   * Combines captured console errors, the custom user comment, current time, and numeric user ID.
   */
  prepareReportPayload(userMessage: string): {
    console: string;
    message: string;
    date_time: string;
    user_id: number | null;
  } {
    return {
      console: JSON.stringify(this.getCapturedConsoleErrors()),
      message: userMessage,
      date_time: new Date().toISOString(),
      user_id: getUserId(),
    };
  },
};
