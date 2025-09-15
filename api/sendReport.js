// /api/sendReport.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxkhxyw3DSWWPfFi08ddt2UGSx9ovBpRTAF1taIfYNmsbvc9e_RA7x_Trl_tmNOKMO7Ng/exec", // ganti dengan ID GAS kamu
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
