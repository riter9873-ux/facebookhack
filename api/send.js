export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "Unknown";
  const ua = req.headers["user-agent"] || "Unknown";

  const message = `New Visit:\nIP: ${ip}\nUser-Agent: ${ua}\nTime: ${new Date().toLocaleString("en-GB")}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
}
