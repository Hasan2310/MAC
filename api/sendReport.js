export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const gasRes = await fetch(
        "https://script.google.com/macros/s/AKfycby29d3vX1k1DCNKJ5AIpUbffc7yfDQCrXk2OywwpQLcY-NtDxg0iXy9xoDEhCsPBmXt8w/exec", 
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
