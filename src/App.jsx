import React, { useState, useRef, useEffect } from "react";
import { Range } from "react-range";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo from "/logo.png";
import "./App.css";

const MAX = 25;
const MySwal = withReactContent(Swal);

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Step 1 (busur)
  const [busur, setBusur] = useState("");
  const [busurRaw, setBusurRaw] = useState("");
  const [jumlahBusurRusak, setJumlahBusurRusak] = useState(0);
  const [kerusakanBusur, setKerusakanBusur] = useState("");

  // Step 2 (arrow)
  const [arrowData, setArrowData] = useState({
    "Arrow Vanes": { selected: false, jumlah: 0, info: "", imgEmpty: "/vanes.png", imgFilled: "/vanesa.png" },
    "Arrow Torba": { selected: false, jumlah: 0, info: "", imgEmpty: "/torba.png", imgFilled: "/torba1.png" },
  });

  // Step 3 (target)
  const [faceTarget, setFaceTarget] = useState("");
  const [jumlahTargetRusak, setJumlahTargetRusak] = useState(0);
  const [sponsTarget, setSponsTarget] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const touchStartX = useRef(0);

  // -------------------------
  // Modal content for arrow
  // -------------------------
  const ArrowModalContent = ({ initial = 0, inputId, initialInfo = "", infoId }) => {
    const [val, setVal] = useState(initial);
    const [info, setInfo] = useState(initialInfo);

    return (
      <div className="flex flex-col items-center gap-4 w-full px-4 py-2">
        <div className="flex w-full items-center gap-4">
          <Range
            step={1}
            min={0}
            max={MAX}
            values={[val]}
            onChange={(vals) => setVal(vals[0])}
            renderTrack={({ props, children }) => (
              <div {...props} className="rounded-lg bg-gray-300 h-2 relative w-full">
                <div
                  className="h-2 bg-[#233975] rounded-lg absolute "
                  style={{ width: `${(val / MAX) * 100}%` }}
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
          <input
            id={inputId}
            type="number"
            min={0}
            max={MAX}
            value={val}
            onChange={(e) => {
              let n = parseInt(e.target.value, 10);
              if (isNaN(n)) n = 0;
              if (n < 0) n = 0;
              if (n > MAX) n = MAX;
              setVal(n); // langsung update state
            }}
            className="w-24 text-center border border-gray-300 rounded py-1"
          />

        </div>
        <input
          id={infoId}
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="Contoh: fletching copot"
          className="w-full border-b border-gray-600 focus:outline-none py-1"
        />
      </div>
    );
  };

  // -------------------------
  // Open arrow modal
  // -------------------------
  const openArrowModal = async (option) => {
    const safeId = `arrowInput-${option.replace(/\s+/g, "-")}`;
    const infoId = `arrowInfo-${option.replace(/\s+/g, "-")}`;
    const arrow = arrowData[option];

    await MySwal.fire({
      title: <span className="text-xl font-semibold">Jumlah Rusak & Info - {option}</span>,
      html: <ArrowModalContent initial={arrow.jumlah} inputId={safeId} initialInfo={arrow.info} infoId={infoId} />,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: true,
      willClose: () => {
        const jumlah = val;    // pakai state langsung
        const info = info;     // pakai state langsung

        setArrowData((prev) => ({
          ...prev,
          [option]: { ...prev[option], selected: jumlah > 0, jumlah, info },
        }));
      },
    });
  };

  // -------------------------
  // Slider helper
  // -------------------------
  const renderSlider = (value, setValue) => (
    <div className="flex items-center gap-3 w-full py-3">
      <Range
        step={1}
        min={0}
        max={MAX}
        values={[value]}
        onChange={(vals) => setValue(vals[0])}
        renderTrack={({ props, children }) => (
          <div {...props} className="flex-1 h-2 rounded-lg bg-gray-300 relative">
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
      <input
        type="number"
        min={0}
        max={MAX}
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          setValue(isNaN(val) || val < 0 ? 0 : Math.min(val, MAX));
        }}
        className="w-12 text-center"
      />
    </div>
  );

  // -------------------------
  // Swipe handlers
  // -------------------------
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setOffsetX(0);
  };
  const handleTouchMove = (e) => setOffsetX(e.touches[0].clientX - touchStartX.current);
  const handleTouchEnd = () => {
    if (offsetX < -50 && currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else if (offsetX > 50 && currentStep > 0) setCurrentStep((s) => s - 1);
    setOffsetX(0);
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const arrowArr = Object.keys(arrowData)
      .filter(key => arrowData[key].selected) // cuma arrow yang aktif
      .map(key => ({
        name: key,
        jumlah: arrowData[key].jumlah,
        info: arrowData[key].info
      }));

    // buat string jumlah rusak arrow pakai koma
    const jumlahRusakArrowStr = arrowArr.map(a => a.jumlah).join(",");

    // buat string info arrow pakai titik koma
    const infoArrowStr = arrowArr.map(a => a.info || "-").join("; ");

    const formData = {
      busur,
      jumlahBusurRusak,
      kerusakanBusur,
      arrowData: arrowArr,
      jumlahRusakArrowStr, // string jumlah rusak
      infoArrowStr,        // string info
      faceTarget,
      jumlahTargetRusak,
      sponsTarget,
    };

    try {
      setIsLoading(true);
      const res = await fetch("/api/sendReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      const waLink = `https://wa.me/6285778130637?text=${encodeURIComponent(result.message)}`;
      setIsLoading(false);

      Swal.fire({
        icon: "success",
        title: "Data laporan terkirim",
        text: "Silakan konfirmasi ke WhatsApp",
        confirmButtonText: "Konfirmasi WA",
      }).then((r) => {
        if (r.isConfirmed) window.open(waLink, "_blank");
      });

      // reset semua
      setBusur("");
      setBusurRaw("");
      setJumlahBusurRusak(0);
      setKerusakanBusur("");
      setArrowData({
        "Arrow Vanes": { selected: false, jumlah: 0, info: "", imgEmpty: "/vanes.png", imgFilled: "/vanesa.png" },
        "Arrow Torba": { selected: false, jumlah: 0, info: "", imgEmpty: "/torba.png", imgFilled: "/torba1.png" },
      });
      setFaceTarget("");
      setJumlahTargetRusak(0);
      setSponsTarget("");
      setCurrentStep(0);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim laporan",
        text: "Coba lagi nanti",
      });
    }
  };


  // -------------------------
  // Steps
  // -------------------------
  const steps = [
    // Step 1
    <div key="1">
      <label className="block font-semibold text-lg mb-2">Busur</label>
      <div className="flex items-center relative">
        <input
          type="number"
          value={busurRaw}
          onChange={(e) => setBusurRaw(e.target.value)}
          onBlur={() => {
            if (busurRaw === "") return;
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
        {renderSlider(jumlahBusurRusak, setJumlahBusurRusak)}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">Info Kerusakan Busur</label>
      <input
        type="text"
        value={kerusakanBusur}
        onChange={(e) => setKerusakanBusur(e.target.value)}
        placeholder="Contoh: String longgar"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
    </div>,

    // Step 2
    <div key="2">
      <label className="block font-semibold text-lg mb-2">Jenis Arrow</label>
      <div className="grid grid-cols-2 text-center mt-3 gap-3 w-full">
        {Object.keys(arrowData).map((option) => {
          const arrow = arrowData[option];
          const imgSrc = arrow.jumlah > 0 ? arrow.imgFilled : arrow.imgEmpty;

          return (
            <div key={option} className="flex justify-center">
              <label
                className={`border rounded-lg cursor-pointer transition relative flex flex-col items-center
                px-5 md:py-5 py-12  w-full
                ${arrow.selected ? "text-[#233975] border-[2px] border-[#233975]" : "border-[#D9D9D9] text-black border-1"}`}
                onClick={() => openArrowModal(option)}
              >
                <div className="font-medium mb-2">{option}</div>
                <img
                  src={imgSrc}
                  alt={option}
                  className="w-full h-auto max-h-[120px] object-contain mb-1"
                />
                {arrow.jumlah > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#233975] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {arrow.jumlah}
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>,

    // Step 3
    <div key="3">
      <label className="block font-semibold text-lg mb-2">Face Target</label>
      <select
        value={faceTarget}
        onChange={(e) => setFaceTarget(e.target.value)}
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
        {renderSlider(jumlahTargetRusak, setJumlahTargetRusak)}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">Info Spons Target</label>
      <input
        type="text"
        value={sponsTarget}
        onChange={(e) => setSponsTarget(e.target.value)}
        placeholder="Contoh: bolong di tengah"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
    </div>,
  ];

  // -------------------------
  // Render
  // -------------------------
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
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentStep * 100}%)` }}>
            {steps.map((step, idx) => (
              <div key={idx} className="w-full flex-shrink-0 flex flex-col overflow-y-auto px-4 md:px-6 py-4 md:py-6">
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-4 space-x-3">
          {steps.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentStep(idx)} className="cursor-pointer">
              <img src={currentStep === idx ? "/pageico1.png" : "/pageico.png"} alt={`step ${idx + 1}`} className="w-5 h-5" />
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center pb-10 pt-2 md:pt-4 bg-white">
          <button
            type="submit"
            className="w-[80%] md:w-5/6 bg-[#223B7D] text-white font-semibold text-lg md:text-2xl py-3 rounded-lg shadow-[3px_3px_0_0_#fff,3px_3px_0_2px_#000] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_0_#fff,4px_4px_0_1px_#000] transition-transform"
          >
            {isLoading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
