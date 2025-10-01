// App.jsx
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import logo from "/logo.png";
import "./App.css";

// Components
import StepBusur from "./components/StepBusur";
import StepArrow from "./components/StepArrow";
import StepTarget from "./components/StepTarget";
import ArrowModalContent from "./components/ArrowModalContent";

const MySwal = withReactContent(Swal);

// ganti URL ini kalau lo pake web app URL lain
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwMSffHlYo-MqIiES0KwA3jqRJGmW3kbSoD481Ulo-0irRGe7Ohl81jmXXkCrrgYT4WZQ/exec";

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Step 1 (busur)
  const [busur, setBusur] = useState("");
  const [busurRaw, setBusurRaw] = useState("");
  const [jumlahBusurRusak, setJumlahBusurRusak] = useState(0);
  const [kerusakanBusur, setKerusakanBusur] = useState("");

  // Step 2 (arrow)
  const [arrowWood, setArrowWood] = useState({ jumlah: 0, info: "", selected: false });
  const [arrowCarbon, setArrowCarbon] = useState({
    vanes: { jumlah: 0, info: "" },
    torba: { jumlah: 0, info: "" },
    selected: false,
  });

  // Step 3 (target)
  const [faceTarget, setFaceTarget] = useState("");
  const [jumlahTargetRusak, setJumlahTargetRusak] = useState(0);
  const [sponsTarget, setSponsTarget] = useState("");

  const [stock, setStock] = useState({
    wood: 0,
    carbonVanes: 0,
    carbonTorba: 0,
    busurMax: 0,
    targetLimits: { ring5: 0, ring6: 0 },
  });

  const [isLoading, setIsLoading] = useState(false);
  const touchStartX = useRef(0);

  // -------------------------
  // GET STOCK from Google Sheet (refresh tiap 5 detik)
  // -------------------------
  useEffect(() => {
    let mounted = true;
    const fetchStock = async () => {
      try {
        const url = `${WEB_APP_URL}?ts=${Date.now()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();

        if (!mounted) return;

        setStock({
          wood: Number(data.wood) || 0,
          carbonVanes: Number(data.carbonVanes) || 0,
          carbonTorba: Number(data.carbonTorba) || 0,
          busurMax: Number(data.busurMax) || 0,
          targetLimits: {
            ring5: Number(data.targetLimits?.ring5) || 0,
            ring6: Number(data.targetLimits?.ring6) || 0,
          },
        });
      } catch (error) {
        console.error("Gagal ambil data stock:", error);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const max = Number(stock.busurMax) || 25;
    if (jumlahBusurRusak > max) setJumlahBusurRusak(max);
  }, [stock.busurMax]);

  useEffect(() => {
    const max =
      faceTarget === "Target ring 5"
        ? Number(stock.targetLimits.ring5) || 0
        : faceTarget === "Target ring 6"
          ? Number(stock.targetLimits.ring6) || 0
          : 0;
    if (jumlahTargetRusak > max) setJumlahTargetRusak(max);
  }, [faceTarget, stock.targetLimits]);

  const openArrowModal = async (type) => {
    if (type === "Arrow Wood") {
      await MySwal.fire({
        title: <span className="text-xl font-semibold text-[#233975] text-left">Arrow Wood</span>,
        html: (
          <div className="text-left">
            <ArrowModalContent
              initial={arrowWood.jumlah}
              inputId="woodJumlah"
              initialInfo={arrowWood.info}
              infoId="woodInfo"
              maxStock={stock.wood}
            />
          </div>
        ),
        showConfirmButton: false,
        allowOutsideClick: true,
        willClose: () => {
          const jumlah = parseInt(document.getElementById("woodJumlah")?.value || "0", 10);
          const info = document.getElementById("woodInfo")?.value || "";

          setArrowWood({
            jumlah: isNaN(jumlah) ? 0 : jumlah,
            info,
            selected: jumlah > 0,
          });
        },
      });
    }

    if (type === "Arrow Carbon") {
      await MySwal.fire({
        title: <span className="text-xl font-semibold text-[#233975] text-left">Arrow Carbon</span>,
        html: (
          <div className="flex flex-col gap-4 text-left">
            <div>
              <p className="font-semibold mb-2 text-[#233975]">Vanes</p>
              <ArrowModalContent
                initial={arrowCarbon.vanes.jumlah}
                inputId="carbonVanesJumlah"
                initialInfo={arrowCarbon.vanes.info}
                infoId="carbonVanesInfo"
                maxStock={stock.carbonVanes}
              />
            </div>
            <div>
              <p className="font-semibold mb-2 text-[#233975]">Torba</p>
              <ArrowModalContent
                initial={arrowCarbon.torba.jumlah}
                inputId="carbonTorbaJumlah"
                initialInfo={arrowCarbon.torba.info}
                infoId="carbonTorbaInfo"
                maxStock={stock.carbonTorba}
              />
            </div>
          </div>
        ),
        width: 600,
        showConfirmButton: false,
        allowOutsideClick: true,
        willClose: () => {
          const jumlah = parseInt(document.getElementById("woodJumlah")?.value || "0", 10);
          const info = document.getElementById("woodInfo")?.value || "";

          setArrowWood({
            jumlah: isNaN(jumlah) ? 0 : jumlah,
            info,
            selected: jumlah > 0,
          });
        },

      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const arrowData = [];

    if (arrowWood.selected) {
      arrowData.push({
        name: "Arrow Wood",
        jumlah: Number(arrowWood.jumlah || 0),
        info: arrowWood.info || "",
      });
    }

    if (arrowCarbon.selected) {
      if (arrowCarbon.vanes.jumlah > 0) {
        arrowData.push({
          name: "Arrow Vanes",
          jumlah: Number(arrowCarbon.vanes.jumlah || 0),
          info: arrowCarbon.vanes.info || "",
        });
      }
      if (arrowCarbon.torba.jumlah > 0) {
        arrowData.push({
          name: "Arrow Torba",
          jumlah: Number(arrowCarbon.torba.jumlah || 0),
          info: arrowCarbon.torba.info || "",
        });
      }
    }

    const formData = {
      busur,
      jumlahBusurRusak,
      kerusakanBusur,
      arrowWood,
      arrowCarbon,
      arrowData,
      faceTarget,
      jumlahTargetRusak,
      sponsTarget,
    };

    const arrowReport = `
Arrow Wood: ${arrowWood.jumlah} (${arrowWood.info || "-"})
Arrow Carbon:
  - Vanes: ${arrowCarbon.vanes.jumlah} (${arrowCarbon.vanes.info || "-"})
  - Torba: ${arrowCarbon.torba.jumlah} (${arrowCarbon.torba.info || "-"})
    `;

    try {
      setIsLoading(true);
      const res = await fetch("/api/sendReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Network response not ok");

      const result = await res.json();
      const waLink = `https://wa.me/6285778130637?text=${encodeURIComponent(result.message + "\n\n" + arrowReport)}`;
      setIsLoading(false);

      Swal.fire({
        icon: "success",
        title: "Data laporan terkirim",
        text: "Silakan konfirmasi ke WhatsApp",
        confirmButtonText: "Konfirmasi WA",
      }).then((r) => {
        if (r.isConfirmed) window.open(waLink, "_blank");
      });

      // reset
      setBusur("");
      setBusurRaw("");
      setJumlahBusurRusak(0);
      setKerusakanBusur("");
      setArrowWood({ jumlah: 0, info: "", selected: false });
      setArrowCarbon({
        vanes: { jumlah: 0, info: "" },
        torba: { jumlah: 0, info: "" },
        selected: false,
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

  const steps = [
    <StepBusur
      key="busur"
      busurRaw={busurRaw}
      setBusurRaw={setBusurRaw}
      busur={busur}
      setBusur={setBusur}
      jumlahBusurRusak={jumlahBusurRusak}
      setJumlahBusurRusak={setJumlahBusurRusak}
      kerusakanBusur={kerusakanBusur}
      setKerusakanBusur={setKerusakanBusur}
      maxBusur={stock.busurMax}
    />,
    <StepArrow
      key="arrow"
      openArrowModal={openArrowModal}
      arrowWood={arrowWood}
      arrowCarbon={arrowCarbon}
    />,
    <StepTarget
      key="target"
      faceTarget={faceTarget}
      setFaceTarget={setFaceTarget}
      jumlahTargetRusak={jumlahTargetRusak}
      setJumlahTargetRusak={setJumlahTargetRusak}
      sponsTarget={sponsTarget}
      setSponsTarget={setSponsTarget}
      targetLimits={stock.targetLimits}
    />,
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
