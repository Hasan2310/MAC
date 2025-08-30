// /api/sendReport.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyp1nYXFWqnJJgUKogA67FkNB00I0teqojuXOUGDYajw523m2M6-RpQ9eV8AsGzeY7V0g/exec", // ganti dengan ID GAS kamu
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
