import { NextResponse } from "next/server";

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Maximum 3 submissions per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter timestamps within the current window
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
};

// Clean up stale rate-limit entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((timestamps, ip) => {
      const active = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW);
      if (active.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, active);
      }
    });
  }, 5 * 60 * 1000);
}

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before sending another message." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, tgUsername, subject, message, botCheck } = body;

    // 2. Honeypot check (hidden field submitted only by automated bots)
    if (botCheck) {
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    // 3. Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All required fields must be filled out." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Sanitize string lengths to prevent payload flooding
    const safeName = String(name).slice(0, 100).trim();
    const safeEmail = String(email).slice(0, 100).trim();
    const safeTg = tgUsername ? String(tgUsername).replace(/^@/, "").slice(0, 50).trim() : "N/A";
    const safeSubject = String(subject).slice(0, 150).trim();
    const safeMessage = String(message).slice(0, 2000).trim();

    // 4. Secure Environment Variables (Hidden on Server)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables are missing.");
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 500 }
      );
    }

    const text = `📬 *New Portfolio Message*\n\n` +
      `👤 *Name:* ${safeName}\n` +
      `📧 *Email:* ${safeEmail}\n` +
      `📱 *Telegram:* @${safeTg}\n` +
      `📌 *Subject:* ${safeSubject}\n\n` +
      `💬 *Message:*\n${safeMessage}`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!tgResponse.ok) {
      const errText = await tgResponse.text();
      console.error("Telegram API error:", errText);
      return NextResponse.json(
        { error: "Failed to forward message to Telegram." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
