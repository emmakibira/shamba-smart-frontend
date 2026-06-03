import React, { ReactNode, useCallback } from "react";
import {
  PanResponder,
  View,
  type GestureResponderEvent,
} from "react-native";
import SessionTimeoutModal from "@/components/SessionTimeoutModal";
import { useAuth } from "./AuthContext";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { sessionManager } from "@/services/sessionManager";

export function SessionProvider({ children }: { children: ReactNode }) {
  const { logout, isLoggedIn } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const { showWarning, remainingMs, extendSession } =
    useSessionTimeout(handleLogout);

  const onActivity = useCallback(
    (_e?: GestureResponderEvent) => {
      if (isLoggedIn) sessionManager.resetActivity();
    },
    [isLoggedIn],
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => {
      onActivity();
      return false;
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
      {isLoggedIn && (
        <SessionTimeoutModal
          visible={showWarning}
          remainingMs={remainingMs}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}
