export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbx9trvEtmIJw6HWJtyMoTJdPnl5SN35z4p3mlZwFE1BzOKwb227p13KY6sEyBoD34jFSw/exec";

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
