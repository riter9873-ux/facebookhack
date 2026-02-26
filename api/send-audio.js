export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return res.status(400).json({ success: false, error: "No audio file" });
    }

    console.log("Received audio size:", audio.size); // server log

    const tgForm = new FormData();
    tgForm.append("chat_id", CHAT_ID);
    tgForm.append("audio", audio, "10s_audio.webm");
    tgForm.append("caption", "10s microphone audio");
    tgForm.append("duration", 10); // Telegram-এ duration যোগ করলে ভালো দেখায়

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: "POST",
      body: tgForm,
    });

    const result = await tgRes.json();

    if (!result.ok) {
      console.error("Telegram error:", result);
      return res.status(500).json({ success: false, error: result.description });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
