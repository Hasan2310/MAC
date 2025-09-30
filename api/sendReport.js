// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // supaya bisa diakses dari frontend React di domain lain

const GAS_URL = "https://script.google.com/macros/s/AKfycbwDgEzOiyyizArsgB4nzsomp21Grv9Ks50Yix7ECkpSWX7KVzIIEN2sFPLpzSH4USySSg/exec";

app.post("/sendReport", async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
