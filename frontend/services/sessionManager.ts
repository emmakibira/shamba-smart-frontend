type SessionListener = (event: "warning" | "logout" | "tick", remainingMs?: number) => void;

const DEFAULT_TIMEOUT_MS =
  Number(process.env.EXPO_PUBLIC_SESSION_TIMEOUT_MS) || 30 * 60 * 1000;
const WARNING_BEFORE_MS =
  Number(process.env.EXPO_PUBLIC_SESSION_WARNING_MS) || 5 * 60 * 1000;

class SessionManager {
  private lastActivity = Date.now();
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<SessionListener>();
  private warned = false;

  start(): void {
    this.resetActivity();
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), 1000);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.warned = false;
  }

  resetActivity(): void {
    this.lastActivity = Date.now();
    this.warned = false;
  }

  extendSession(): void {
    this.resetActivity();
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: SessionListener extends (...args: infer P) => void ? P[0] : never, remainingMs?: number) {
    this.listeners.forEach((l) => l(event, remainingMs));
  }

  private tick(): void {
    const elapsed = Date.now() - this.lastActivity;
    const remaining = DEFAULT_TIMEOUT_MS - elapsed;

    if (remaining <= 0) {
      this.emit("logout", 0);
      return;
    }

    if (remaining <= WARNING_BEFORE_MS && !this.warned) {
      this.warned = true;
      this.emit("warning", remaining);
    }

    if (this.warned) {
      this.emit("tick", remaining);
    }
  }

  getRemainingMs(): number {
    return Math.max(0, DEFAULT_TIMEOUT_MS - (Date.now() - this.lastActivity));
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
