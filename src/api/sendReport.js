// /pages/api/sendReport.js

export default async function handler(req, res) {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbx9trvEtmIJw6HWJtyMoTJdPnl5SN35z4p3mlZwFE1BzOKwb227p13KY6sEyBoD34jFSw/exec";

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      cors: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GAS error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Gagal kirim ke GAS:", err.message);
    return res.status(500).json({ error: "Failed to send data to GAS" });
  }
}
