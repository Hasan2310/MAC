import React from "react";
import SliderInput from "./SliderInput";

const StepBusur = ({
  busurRaw,
  setBusurRaw,
  busur,
  setBusur,
  jumlahBusurRusak,
  setJumlahBusurRusak,
  kerusakanBusur,
  setKerusakanBusur,
  busurMax
}) => (
  <div>
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
      <SliderInput
        value={jumlahBusurRusak}
        setValue={setJumlahBusurRusak}
        max={busurMax}
      />
    </div>

    <label className="block mt-6 font-semibold text-lg mb-2">Info Kerusakan Busur</label>
    <input
      type="text"
      value={kerusakanBusur}
      onChange={(e) => setKerusakanBusur(e.target.value)}
      placeholder="Contoh: String longgar"
      className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
    />
  </div>
);

export default StepBusur;
