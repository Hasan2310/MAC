export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbz-L4rMpMaxOOVIFyIQHIRyFDW0SrQAq1Lq24EH2c-fY9kDZXPij-0h9lr8UZxBjFxc/exec";

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(GAS_URL);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (jsonErr) {
      console.error("Invalid JSON from GAS:", text);
      return res.status(502).json({ error: "Invalid JSON returned from GAS" });
    }
  } catch (err) {
    console.error("Gagal fetch dari GAS:", err.message);
    return res.status(500).json({ error: "Failed to fetch data from GAS" });
  }
}
