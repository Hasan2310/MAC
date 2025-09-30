export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbw4ZxyP5dE73yRvzbE9SnypN1ij7nqhF06xQraRBy7bfaAiW6NVdScf-S7FGF-G0HzHkg/exec";

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(GAS_URL);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GAS error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Gagal fetch dari GAS:", err.message);
    return res.status(500).json({ error: "Failed to fetch data from GAS" });
  }
}
