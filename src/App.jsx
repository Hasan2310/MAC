import React, { useState, useRef } from "react";
import { Range } from 'react-range';
import Swal from "sweetalert2";
import logo from "/logo.png";
import './App.css';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const [busur, setBusur] = useState("");
  const [busurRaw, setBusurRaw] = useState("");
  const [jumlahRusak, setJumlahRusak] = useState([0, 0, 0]);
  const [kerusakanBusur, setKerusakanBusur] = useState("");
  const [jenisArrow, setJenisArrow] = useState([]);
  const [infoKerusakanArrow, setInfoKerusakanArrow] = useState("");
  const [faceTarget, setFaceTarget] = useState("");
  const [sponsTarget, setSponsTarget] = useState("");

  const touchStartX = useRef(0);

  const handleJumlahRusakChange = (stepIdx, value) => {
    setJumlahRusak(prev => {
      const newArr = [...prev];
      newArr[stepIdx] = value;
      return newArr;
    });
  };

  // swipe
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

  const handleCheckboxChange = (value) => {
    if (jenisArrow.includes(value)) setJenisArrow(jenisArrow.filter(v => v !== value));
    else setJenisArrow([...jenisArrow, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validasi per step
    if (currentStep === 0) {
      if (busur === "" || jumlahRusak[0] <= 0 || kerusakanBusur === "") {
        Swal.fire({
          showConfirmButton: false,
          html: `
            <div class="text-center">
              <img src="/seru.png" class="mx-auto mb-3 w-37 h-37" />
              <h2 class="text-md font-semibold mb-2">Mohon lengkapi kolom kosong slide ini</h2>
              <p class="text-xs">Jumlah rusak dan isi info kerusakan harus terisi</p>
            </div>
          `
        });
        return;
      }
    } else if (currentStep === 1) {
      if (jenisArrow.length === 0 || jumlahRusak[1] <= 0 || infoKerusakanArrow === "") {
        Swal.fire({
          showConfirmButton: false,
          html: `
            <div class="text-center">
              <img src="/seru.png" class="mx-auto mb-3 w-37 h-37" />
              <h2 class="text-md font-semibold mb-2">Mohon lengkapi kolom kosong slide ini</h2>
              <p class="text-xs">Jumlah rusak dan isi info kerusakan harus terisi</p>
            </div>
          `
        });
        return;
      }
    } else if (currentStep === 2) {
      if (faceTarget === "" || jumlahRusak[2] <= 0 || sponsTarget === "") {
        Swal.fire({
          showConfirmButton: false,
          html: `
            <div class="text-center">
              <img src="/seru.png" class="mx-auto mb-3 w-37 h-37" />
              <h2 class="text-md font-semibold mb-2">Mohon lengkapi kolom kosong slide ini</h2>
              <p class="text-xs">Jumlah rusak dan isi info kerusakan harus terisi</p>
            </div>
          `
        });
        return;
      }
    }

    // submit ke Google Script
    const formData = {
      busur,
      jumlahRusak, // kirim array [step1, step2, step3]
      kerusakanBusur,
      jenisArrow,
      infoKerusakanArrow,
      faceTarget,
      sponsTarget
    };
    try {
      // kirim data lewat serverless API Vercel
      const res = await fetch("/api/sendReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      // WA link
      const waLink = `https://wa.me/6285778130637?text=${encodeURIComponent(result.message)}`;
      window.open(waLink, "_blank");

      Swal.fire({
        icon: "success",
        title: "Data laporan terkirim",
        text: "Silakan konfirmasi ke WhatsApp",
        confirmButtonText: "Konfirmasi WA"
      }).then((r) => {
        if (r.isConfirmed) {
          window.open(waLink, "_blank");
        }
      });

      // reset form setelah sukses
      setBusur(""); setBusurRaw(""); setJumlahRusak([0, 0, 0]); setKerusakanBusur("");
      setJenisArrow([]); setInfoKerusakanArrow("");
      setFaceTarget(""); setSponsTarget("");
      setCurrentStep(0);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim laporan",
        text: "Coba lagi nanti",
      });
    }
  };

  const MAX = 25;

  const renderSlider = (stepIdx) => {
    const value = jumlahRusak[stepIdx];

    return (
      <div className="flex items-center gap-3 w-full py-3">
        {/* Slider */}
        <Range
          step={1}
          min={0}
          max={MAX}
          values={[value]}
          onChange={(vals) => handleJumlahRusakChange(stepIdx, vals[0])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="flex-1 h-2 rounded-lg bg-gray-300 relative"
            >
              {/* progress biru */}
              <div
                className="h-2 bg-[#233975] rounded-lg absolute top-0 left-0"
                style={{ width: `${(value / MAX) * 100}%` }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-6 h-6 bg-center bg-no-repeat bg-contain cursor-pointer"
              style={{ backgroundImage: "url('/arrow.png')" }}
            />
          )}
        />

        {/* Input number */}
        <input
          type="number"
          min={0}
          max={MAX}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            handleJumlahRusakChange(
              stepIdx,
              isNaN(val) || val < 0 ? 0 : Math.min(val, MAX)
            );
          }}
          className="w-12 text-center"
        />
      </div>
    );
  };

  const steps = [
    <div key="1">
      <label className="block font-semibold text-lg mb-2">Busur</label>
      <div className="flex items-center">
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
          className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
        />
        <span className="text-gray-800 font-semibold ml-3 select-none absolute right-8">Lbs</span>
      </div>

      <div className="mt-6">
        <label className="font-semibold text-lg mb-2">Jumlah Rusak</label>
        {renderSlider(0)}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">Info Kerusakan Busur</label>
      <input
        type="text"
        value={kerusakanBusur}
        onChange={e => setKerusakanBusur(e.target.value)}
        placeholder="Contoh: String longgar"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
    </div>,

    <div key="2">
      <label className="block font-semibold text-lg mb-2">Jenis Arrow</label>
      <div className="grid grid-cols-2 text-center gap-3 mt-3">
        {["Arrow Vanes", "Arrow Torba"].map((option) => (
          <label
            key={option}
            className={`px-4 py-2 border rounded-lg cursor-pointer transition
        ${jenisArrow.includes(option)
                ? "bg-[#D9D9D9] text-[#233975]"
                : "border-[#D9D9D9] text-black border-1"
              }
      `}
          >
            <input
              type="checkbox"
              value={option}
              checked={jenisArrow.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="hidden"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="mt-6">
        <label className="font-semibold text-lg mb-2">Jumlah Rusak</label>
        {renderSlider(1)}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">Info Kerusakan Arrow</label>
      <input
        type="text"
        value={infoKerusakanArrow}
        onChange={e => setInfoKerusakanArrow(e.target.value)}
        placeholder="Contoh: fletching copot"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
    </div>,

    <div key="3">
      <label className="block font-semibold text-lg mb-2">Face Target</label>
      <select
        value={faceTarget}
        onChange={e => setFaceTarget(e.target.value)}
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      >
        <option value="">-- Pilih Target --</option>
        <option value="Target ring 5">Target ring 5</option>
        <option value="Target ring 6">Target ring 6</option>
        <option value="Target puta">Target puta</option>
        <option value="Mega mendung">Mega mendung</option>
      </select>

      <div className="mt-6">
        <label className="font-semibold text-lg mb-2">Jumlah Rusak</label>
        {renderSlider(2)}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">Info Spons Target</label>
      <input
        type="text"
        value={sponsTarget}
        onChange={e => setSponsTarget(e.target.value)}
        placeholder="Contoh: bolong di tengah"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
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
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-50 w-full object-cover" />
        </div>

        <div className="bg-gray-200 text-[#233975] text-center font-semibold text-2xl md:text-3xl py-4 mb-6">
          REPARASI ITEM
        </div>

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
                className="w-5 h-5"
              />
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center pb-10 pt-2 md:pt-4 bg-white">
          <button
            type="submit"
            className="
              w-[80%] md:w-5/6
              bg-[#223B7D] 
              text-white 
              font-semibold 
              text-lg md:text-2xl 
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
