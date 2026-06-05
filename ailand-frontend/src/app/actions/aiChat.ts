"use server"

import { cookies } from "next/headers";

export async function sendChatMessage(payload: any) {
  try {
    const store = cookies();
    const cookieStore = store instanceof Promise ? await store : store;
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("http://localhost:8005/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("AI Chat Server Action Error:", error);
    throw new Error(error.message || "Failed to reach AI Assistant");
  }
}
