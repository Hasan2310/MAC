// /api/sendReport.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwZghtdDYfJ44g2PgtQK4Gj3TmjBuXtL8ZTqzRdwmNOyb5bT0OtgBhuGZyEy0QN3MK4PQ/exec", // ganti dengan ID GAS kamu
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    // Ambil response dari GAS
    const data = await response.json();

    // Kirim balik ke frontend
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch GAS" });
  }
}
