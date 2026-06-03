import { useEffect, useState, useCallback } from "react";
import { sessionManager } from "@/services/sessionManager";

export function useSessionTimeout(onLogout: () => void) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    sessionManager.start();
    const unsub = sessionManager.subscribe((event, remaining) => {
      if (event === "warning") {
        setShowWarning(true);
        setRemainingMs(remaining ?? 0);
      } else if (event === "tick") {
        setRemainingMs(remaining ?? 0);
      } else if (event === "logout") {
        setShowWarning(false);
        onLogout();
      }
    });
    return () => {
      unsub();
      sessionManager.stop();
    };
  }, [onLogout]);

  const extendSession = useCallback(() => {
    sessionManager.extendSession();
    setShowWarning(false);
  }, []);

  const touch = useCallback(() => {
    sessionManager.resetActivity();
  }, []);

  return { showWarning, remainingMs, extendSession, touch };
}
