export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const gasRes = await fetch(
        "https://script.google.com/macros/s/AKfycbzDEXVSXC9iaCgzbZGkoE1XNQ0vFn387soOlvfX0fHBTdIjd8jQzeWV9RFBZsQLsOcfcg/exec", // 🔥 ganti dengan URL GAS lo
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );

      const data = await gasRes.json();

      res.setHeader("Access-Control-Allow-Origin", "*"); // biar frontend bebas akses
      res.status(200).json(data);
    } catch (err) {
      console.error("Proxy error:", err);
      res.status(500).json({ error: "Failed to fetch GAS" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
