export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GAS_URL = "https://script.google.com/macros/s/AKfycbwDgEzOiyyizArsgB4nzsomp21Grv9Ks50Yix7ECkpSWX7KVzIIEN2sFPLpzSH4USySSg/exec";

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    // Coba parse hasil JSON GAS
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text }; // fallback kalau response-nya plain text
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Gagal kirim ke GAS:", error.message);
    return res.status(500).json({ error: "Gagal kirim ke GAS" });
  }
}
