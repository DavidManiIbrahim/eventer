import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const useSocket = (userId, onNotification) => {
  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL);

    // Register user ID for personal notifications
    socket.emit("registerUser", userId);

    // Listen for personal notifications
    socket.on(`notify_${userId}`, (data) => {
      console.log("📩 New notification received:", data);
      onNotification(data);
    });

    return () => socket.disconnect();
  }, [userId]);
};
