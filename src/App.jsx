import React, { useState, useRef } from "react"
import Icon from './assets/Icon'
import logo from "/logo.png"
import './App.css'

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const [busur, setBusur] = useState("");
  const [jumlahRusak, setJumlahRusak] = useState(0);
  const [kerusakanBusur, setKerusakanBusur] = useState("");
  const [busurRaw, setBusurRaw] = useState("");
  const [jenisArrow, setJenisArrow] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { busur, jumlahRusak, kerusakanBusur, jenisArrow, infoKerusakanArrow, faceTarget, sponsTarget };
    try {
      await fetch("https://script.google.com/macros/s/AKfycbzBBbKAiTRIJX4DXI81GFwDgtwncR3VX_F6B0hwvtT0PDHBZTF8akI-q_M9R0z6yNNUxQ/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      alert("✅ Data berhasil dikirim!");
      setBusur(""); setJumlahRusak(0); setKerusakanBusur("");
      setJenisArrow([]); setInfoKerusakanArrow("");
      setFaceTarget(""); setSponsTarget("");
      setCurrentStep(0);
    } catch (error) {
      console.error(error);
      alert("❌ Gagal mengirim data!");
    }
  };

  const handleCheckboxChange = (value) => {
    if (jenisArrow.includes(value)) setJenisArrow(jenisArrow.filter(v => v !== value));
    else setJenisArrow([...jenisArrow, value]);
  };

  const steps = [
    <div key="1">
      <label className="block font-semibold text-xl mb-2">Busur</label>
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
          setBusurRaw(val);
        }}
        placeholder="Berat Tarikan: 15-30"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-lg"
      />

      <div className="flex mt-6 justify-between items-center">
        <label className="font-semibold text-lg">Jumlah Rusak</label>
        <div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden">
          <button type="button" onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">-</button>
          <input
            type="number"
            value={jumlahRusak}
            onChange={e => { const val = Number(e.target.value); setJumlahRusak(isNaN(val) || val < 0 ? 0 : val); }}
            onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
            onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
            className="w-16 text-center border-none focus:outline-none text-lg"
          />
          <button type="button" onClick={() => setJumlahRusak(p => p + 1)}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">+</button>
        </div>
      </div>

      <label className="block mt-6 font-semibold text-xl mb-2">Info Kerusakan Busur</label>
      <input
        type="text"
        value={kerusakanBusur}
        onChange={e => setKerusakanBusur(e.target.value)}
        placeholder="Contoh: String longgar"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-lg"
      />
    </div>,

    <div key="2">
      <label className="block font-semibold text-xl mb-2">Jenis Arrow</label>
      <div className="flex justify-between mt-3">
        <label className="inline-flex items-center text-lg">
          <input type="checkbox" value="Arrow Vanes" checked={jenisArrow.includes("Arrow Vanes")}
            onChange={() => handleCheckboxChange("Arrow Vanes")}
            className="mr-2 w-5 h-5" /> Arrow Vanes
        </label>
        <label className="inline-flex items-center text-lg">
          <input type="checkbox" value="Arrow Torba" checked={jenisArrow.includes("Arrow Torba")}
            onChange={() => handleCheckboxChange("Arrow Torba")}
            className="mr-2 w-5 h-5" /> Arrow Torba
        </label>
      </div>

      <div className="flex mt-6 justify-between items-center">
        <label className="font-semibold text-lg">Jumlah Rusak</label>
        <div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden">
          <button type="button" onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">-</button>
          <input
            type="number"
            value={jumlahRusak}
            onChange={e => { const val = Number(e.target.value); setJumlahRusak(isNaN(val) || val < 0 ? 0 : val); }}
            onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
            onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
            className="w-16 text-center border-none focus:outline-none text-lg"
          />
          <button type="button" onClick={() => setJumlahRusak(p => p + 1)}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">+</button>
        </div>
      </div>

      <label className="block mt-6 font-semibold text-xl mb-2">Info Kerusakan Arrow</label>
      <input type="text" value={infoKerusakanArrow} onChange={e => setInfoKerusakanArrow(e.target.value)}
        placeholder="Contoh: fletching copot"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-lg" />
    </div>,

    <div key="3">
      <label className="block font-semibold text-xl mb-2">Face Target</label>
      <input type="text" value={faceTarget} onChange={e => setFaceTarget(e.target.value)}
        placeholder="Contoh: robek"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-lg" />

      <div className="flex mt-6 justify-between items-center">
        <label className="font-semibold text-lg">Jumlah Rusak</label>
        <div className="inline-flex items-center border border-gray-600 rounded-full overflow-hidden">
          <button type="button" onClick={() => setJumlahRusak(p => Math.max(0, p - 1))}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">-</button>
          <input
            type="number"
            value={jumlahRusak}
            onChange={e => { const val = Number(e.target.value); setJumlahRusak(isNaN(val) || val < 0 ? 0 : val); }}
            onFocus={() => { if (jumlahRusak === 0) setJumlahRusak('') }}
            onBlur={() => { if (jumlahRusak === '') setJumlahRusak(0) }}
            className="w-16 text-center border-none focus:outline-none text-lg"
          />
          <button type="button" onClick={() => setJumlahRusak(p => p + 1)}
            className="px-4 py-2 font-bold hover:bg-gray-200 text-lg">+</button>
        </div>
      </div>

      <label className="block mt-6 font-semibold text-xl mb-2">Info Spons Target</label>
      <input type="text" value={sponsTarget} onChange={e => setSponsTarget(e.target.value)}
        placeholder="Contoh: bolong di tengah"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-lg" />
    </div>
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="bg-white w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-2lg flex flex-col overflow-hidden relative"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-50 w-full object-cover" />
        </div>

        {/* Title */}
        <div className="bg-gray-300 text-center font-semibold text-2xl md:text-3xl py-4 mb-6">
          REPARASI ITEM
        </div>

        {/* Step container */}
        <div className="relative flex-1 w-full overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 flex flex-col overflow-y-auto px-4 md:px-6 py-4 md:py-6"
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mt-2 mb-4 space-x-3">
          {steps.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className="cursor-pointer"
            >
              <img
                src={currentStep === idx ? "/pageico1.png" : "/pageico.png"}
                alt={`step ${idx + 1}`}
                className="w-5 h-5" // ukuran bisa disesuaikan
              />
            </div>
          ))}
        </div>

        {/* Tombol submit tetap di bawah */}
        <div className="w-full flex justify-center pb-10 pt-2 md:pt-4 bg-white">
          <button
            type="submit"
            className="
          w-[80%] md:w-5/6
          bg-[#223B7D] 
          text-white 
          font-semibold 
          text-xl md:text-2xl 
          py-3 
          rounded-lg 
          shadow-[3px_3px_0_0_#fff,3px_3px_0_2px_#000] 
          hover:shadow-none 
          active:translate-x-[2px] active:translate-y-[2px] 
          active:shadow-[4px_4px_0_0_#fff,4px_4px_0_1px_#000] 
          transition-transform
        "
          >
            Kirim
          </button>
        </div>
      </form>
    </div>

  );
};

export default App;
