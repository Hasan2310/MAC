import React, { useState, useRef } from "react";
import logo from "/logo.png";
import './App.css'

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // ✅ Semua state field lengkap
  const [busur, setBusur] = useState("");
  const [jumlahRusak, setJumlahRusak] = useState(0);
  const [kerusakanBusur, setKerusakanBusur] = useState("");
  const [busurRaw, setBusurRaw] = useState("");
  const [jenisArrow, setJenisArrow] = useState([]); // array karena bisa pilih lebih dari satu
  const [infoKerusakanArrow, setInfoKerusakanArrow] = useState("");
  const [faceTarget, setFaceTarget] = useState("");
  const [sponsTarget, setSponsTarget] = useState("");

  const touchStartX = useRef(0);

  // Swipe gesture
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setOffsetX(0);
  };
  const handleTouchMove = (e) => setOffsetX(e.touches[0].clientX - touchStartX.current);
  const handleTouchEnd = () => {
    if (offsetX < -50 && currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else if (offsetX > 50 && currentStep > 0) setCurrentStep(s => s - 1);
    setOffsetX(0);
  };

  // Submit ke Google Sheets
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      busur,
      jumlahRusak,
      kerusakanBusur,
      jenisArrow,
      infoKerusakanArrow,
      faceTarget,
      sponsTarget,
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzBBbKAiTRIJX4DXI81GFwDgtwncR3VX_F6B0hwvtT0PDHBZTF8akI-q_M9R0z6yNNUxQ/exec", {
        method: "POST",
        mode: "no-cors",       // 🚨 ini kunci
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Data berhasil dikirim!");


      // Reset form
      setBusur(""); setJumlahRusak(0); setKerusakanBusur("");
      setJenisArrow(""); setInfoKerusakanArrow("");
      setFaceTarget(""); setSponsTarget("");
      setCurrentStep(0);

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Gagal mengirim data!");
    }
  };

      const handleCheckboxChange = (value) => {
  if (jenisArrow.includes(value)) {
    setJenisArrow(jenisArrow.filter(v => v !== value)); // hapus kalau sudah ada
  } else {
    setJenisArrow([...jenisArrow, value]); // tambah kalau belum ada
  }
};

  // Step form
  const steps = [
    // STEP 1: Busur
    <div key="1">
      <label className="block font-semibold">Busur</label>
      <input 
  type="number"
  value={busurRaw}
  onChange={e => setBusurRaw(e.target.value)}
  onBlur={() => {
    let val = Number(busurRaw);
    if (isNaN(val)) val = "";
    else if (val < 15) val = 15;
    else if (val > 30) val = 30;
    setBusur(val);
    setBusurRaw(val); // update tampilan
  }}
  placeholder="Berat Tarikan: 15-30"
  className="w-full border-b border-gray-600 focus:outline-none"
/>

      <div className="flex mt-4 justify-between items-center">
<label className="font-semibold">Jumlah Rusak</label>
<div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden mt-1">
  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    -
  </button>

  <input
    type="number"
    value={jumlahRusak}
    onChange={e => {
      const val = Number(e.target.value);
      setJumlahRusak(isNaN(val) || val < 0 ? 0 : val);
    }}
    onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
    onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
    className="w-12 text-center border-none focus:outline-none"
  />

  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => p + 1)}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    +
  </button>
</div>

      </div>

      <label className="block mt-6 font-semibold">Info Kerusakan Busur</label>
      <input type="text" value={kerusakanBusur} onChange={e => setKerusakanBusur(e.target.value)}
        placeholder="Contoh: String longgar"
        className="w-full border-b border-gray-600 focus:outline-none" />
    </div>,

    // STEP 2: Arrow
    <div key="2">
<label className="block font-semibold">Jenis Arrow</label>
<div className="flex justify-between mt-2">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      value="Arrow Vanes"
      checked={jenisArrow.includes("Arrow Vanes")}
      onChange={() => handleCheckboxChange("Arrow Vanes")}
      className="mr-2"
    />
    Arrow Vanes
  </label>

  <label className="inline-flex items-center mt-1">
    <input
      type="checkbox"
      value="Arrow Torba"
      checked={jenisArrow.includes("Arrow Torba")}
      onChange={() => handleCheckboxChange("Arrow Torba")}
      className="mr-2"
    />
    Arrow Torba
  </label>
</div>

      <div className="flex mt-4 justify-between items-center">
<label className="font-semibold">Jumlah Rusak</label>
<div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden mt-1">
  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    -
  </button>

  <input
    type="number"
    value={jumlahRusak}
    onChange={e => {
      const val = Number(e.target.value);
      setJumlahRusak(isNaN(val) || val < 0 ? 0 : val);
    }}
    onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
    onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
    className="w-12 text-center border-none focus:outline-none"
  />

  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => p + 1)}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    +
  </button>
</div>

      </div>

      <label className="block mt-6 font-semibold">Info Kerusakan Arrow</label>
      <input type="text" value={infoKerusakanArrow} onChange={e => setInfoKerusakanArrow(e.target.value)}
        placeholder="Contoh: fletching copot"
        className="w-full border-b border-gray-600 focus:outline-none" />
    </div>,

    // STEP 3: Face Target
    <div key="3">
      <label className="block font-semibold">Face Target</label>
      <input type="text" value={faceTarget} onChange={e => setFaceTarget(e.target.value)}
        placeholder="Contoh: robek"
        className="w-full border-b border-gray-600 focus:outline-none" />

      <div className="flex mt-4 justify-between items-center">
<label className="font-semibold">Jumlah Rusak</label>
<div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden mt-1">
  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    -
  </button>

  <input
    type="number"
    value={jumlahRusak}
    onChange={e => {
      const val = Number(e.target.value);
      setJumlahRusak(isNaN(val) || val < 0 ? 0 : val);
    }}
    onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
    onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
    className="w-12 text-center border-none focus:outline-none"
  />

  <button 
    type="button" 
    onClick={() => setJumlahRusak(p => p + 1)}
    className="px-3 py-1 font-bold hover:bg-gray-200"
  >
    +
  </button>
</div>

      </div>

      <label className="block mt-6 font-semibold">Info Spons Target</label>
      <input type="text" value={sponsTarget} onChange={e => setSponsTarget(e.target.value)}
        placeholder="Contoh: bolong di tengah"
        className="w-full border-b border-gray-600 focus:outline-none" />
    </div>
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit}
        className="bg-white w-full max-w-md h-[90vh] rounded-xl shadow-lg pt-6 pb-24 overflow-hidden relative flex flex-col"
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex justify-center pb-4">
          <img src={logo} alt="Logo" className="h-20 object-cover" />
        </div>

        <div className="bg-gray-300 text-center font-semibold text-[22px] py-3 mb-6">
          REPARASI ITEM
        </div>

        <div className="flex transition-transform duration-300 flex-1 py-10"
          style={{ transform: `translateX(calc(-${currentStep * 100}% + ${offsetX}px))` }}>
          {steps.map((step, idx) => (
            <div key={idx} className="w-full flex-shrink-0 px-6 overflow-y-auto">{step}</div>
          ))}
        </div>

        <div className="flex justify-center mt-1 space-x-3">
          {steps.map((_, idx) => (
            <span key={idx} onClick={() => setCurrentStep(idx)}
              className={`w-3.5 h-3.5 rounded-full cursor-pointer ${currentStep === idx ? "bg-black" : "bg-gray-400"}`} />
          ))}
        </div>

        <button type="submit"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 
                           bg-[#223B7D] text-white font-semibold text-xl 
                           px-10 py-4 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)] 
                           hover:shadow-none active:translate-y-[2px] transition-transform">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
