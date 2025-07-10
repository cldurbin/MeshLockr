// lib/logger.ts

export async function logAction({
  user_id,
  action,
  metadata = {},
}: {
  user_id: string;
  action: string;
metadata?: Record<string, unknown>;
}) {
  try {
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, action, metadata }),
    });

    if (!res.ok) {
      console.error("Failed to log action:", res.statusText);
    }
  } catch (err) {
    console.error("Logging error:", err);
  }
}
