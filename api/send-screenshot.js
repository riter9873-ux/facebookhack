export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { image } = req.body;
  if (!image) return res.status(400).json({ success: false });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", new Blob([buffer], { type: 'image/png' }), "screenshot.png");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData
    });

    if (!tgRes.ok) throw new Error("Telegram failed");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
