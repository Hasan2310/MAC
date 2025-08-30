import React, { useState, useRef } from "react";
import logo from "/logo.png";
import Swal from "sweetalert2";
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

    // ambil hanya jumlah rusak sesuai step aktif
    const jumlahRusakAktif = jumlahRusak[currentStep];

    // bikin pesan WA
    const waMessage = `Data Reparasi Item (Step ${currentStep + 1}):\nBusur: ${busur}\nJenis Arrow: ${jenisArrow.join(", ")}\nFace Target: ${faceTarget}\nJumlah Rusak: ${jumlahRusakAktif}\nKerusakan Busur: ${kerusakanBusur}\nInfo Arrow: ${infoKerusakanArrow}\nSpons Target: ${sponsTarget}`;
    const waLink = `https://wa.me/6285778130637?text=${encodeURIComponent(waMessage)}`;

    Swal.fire({
      icon: "success",
      title: "Data laporan terkirim",
      text: "Silakan konfirmasi ke WhatsApp",
      confirmButtonText: "Konfirmasi WA"
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(waLink, "_blank");
      }
    });

    // submit ke Google Script (hanya satu jumlahRusakAktif)
    const formData = {
      busur,
      jumlahRusak: jumlahRusakAktif,
      kerusakanBusur,
      jenisArrow,
      infoKerusakanArrow,
      faceTarget,
      sponsTarget
    };
    try {
      await fetch("https://script.google.com/macros/s/AKfycbz7grIcUOm8dryntJv0rJPP0qBbWvIEnGuptUM4mQZzB2hVsQtHLLyIqNNhUwUVW1krDg/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      // reset form
      setBusur(""); setBusurRaw(""); setJumlahRusak([0, 0, 0]); setKerusakanBusur("");
      setJenisArrow([]); setInfoKerusakanArrow("");
      setFaceTarget(""); setSponsTarget("");
      setCurrentStep(0);

    } catch (error) {
      console.error(error);
    }
  };

  const renderSlider = (stepIdx) => (
    <div className="flex items-center gap-3 w-full py-3">
      <input
        type="range"
        min={0}
        max={25}
        value={jumlahRusak[stepIdx]}
        onChange={e => handleJumlahRusakChange(stepIdx, Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #233975 ${(jumlahRusak[stepIdx] / 26) * 100}%, #d1d5db ${(jumlahRusak[stepIdx] / 25) * 100}%)`
        }}
        className="flex-1 appearance-none h-2 rounded-lg cursor-pointer 
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
    [&::-webkit-slider-thumb]:bg-[url('/arrow.png')]
    [&::-webkit-slider-thumb]:bg-contain
    [&::-webkit-slider-thumb]:bg-no-repeat
    [&::-webkit-slider-thumb]:bg-center
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
    [&::-moz-range-thumb]:bg-[url('/arrow.png')]
    [&::-moz-range-thumb]:bg-contain
    [&::-moz-range-thumb]:bg-no-repeat
    [&::-moz-range-thumb]:bg-center
  "
      />
      <input
        type="number"
        min={0}
        max={25}
        value={jumlahRusak[stepIdx]}
        onChange={e => {
          const val = Number(e.target.value);
          handleJumlahRusakChange(stepIdx, isNaN(val) || val < 0 ? 0 : Math.min(val, 25));
        }}
        className="w-12 text-center"
      />
    </div>
  );

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
      <div className="flex justify-between mt-3">
        <label className="inline-flex items-center text-md">
          <input type="checkbox" value="Arrow Vanes" checked={jenisArrow.includes("Arrow Vanes")}
            onChange={() => handleCheckboxChange("Arrow Vanes")}
            className="mr-2 w-5 h-5" /> Arrow Vanes
        </label>
        <label className="inline-flex items-center text-md">
          <input type="checkbox" value="Arrow Torba" checked={jenisArrow.includes("Arrow Torba")}
            onChange={() => handleCheckboxChange("Arrow Torba")}
            className="mr-2 w-5 h-5" /> Arrow Torba
        </label>
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
