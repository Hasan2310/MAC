import { useState } from 'react'
import './App.css'

const App = () => {
  const [formData, setFormData] = useState({
    busur: "",
    jumlahRusuk: "",
    kerusakanBusur: "",
    sponsTarget: "",
    quiver: "",
    faceTarget: "",
    kerusakanArrow: "",
    infoKerusakan: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = "https://script.google.com/macros/s/AKfycbygj3Y32P0a2sCmHCwW4K2wwiKFW6JZVkkas6ZJHNPuDvXU6D2aUPfTlVVAUoTQAmFiPA/exec"

    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors", // WAJIB kalau langsung ke GAS
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      // ⚠️ response ga bisa dibaca karena no-cors
      alert("✅ Data berhasil dikirim ke Google Sheets!")
    } catch (error) {
      console.error("Error:", error)
      alert("❌ Gagal kirim data")
    }
  }

  return (
    <div>
      <h1 className="text-center">Item MAC yang Rusak</h1>
      <form onSubmit={handleSubmit}>
        <label>Busur</label> <br />
        <input type="text" name="busur" value={formData.busur} onChange={handleChange} /> <br /><br />

        <label>Jumlah rusuk</label> <br />
        <input type="text" name="jumlahRusuk" value={formData.jumlahRusuk} onChange={handleChange} /> <br /><br />

        <label>Info kerusakan busur</label> <br />
        <input type="text" name="kerusakanBusur" value={formData.kerusakanBusur} onChange={handleChange} /> <br /><br />

        <label>Spons target</label> <br />
        <input type="text" name="sponsTarget" value={formData.sponsTarget} onChange={handleChange} /> <br /><br />

        <label>Quiver</label> <br />
        <input type="text" name="quiver" value={formData.quiver} onChange={handleChange} /> <br /><br />

        <label>Face target</label> <br />
        <input type="text" name="faceTarget" value={formData.faceTarget} onChange={handleChange} /> <br /><br />

        <label>Kerusakan arrow</label> <br />
        <input type="text" name="kerusakanArrow" value={formData.kerusakanArrow} onChange={handleChange} /> <br /><br />

        <label>Info kerusakan</label> <br />
        <input type="text" name="infoKerusakan" value={formData.infoKerusakan} onChange={handleChange} /> <br /><br />

        <button type="submit">Kirim</button>
      </form>
    </div>
  )
}

export default App
