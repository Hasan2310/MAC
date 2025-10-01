import React, { useState, useEffect } from "react";
import { Range } from "react-range";

const ArrowModalContent = ({
  initial = 0,
  inputId,
  initialInfo = "",
  infoId,
  maxStock = 25,
}) => {
  const [val, setVal] = useState(initial);
  const [info, setInfo] = useState(initialInfo);

  // Update nilai di input DOM tiap val/info berubah
  useEffect(() => {
    const el = document.getElementById(inputId);
    if (el) el.value = val;
    const infoEl = document.getElementById(infoId);
    if (infoEl) infoEl.value = info;
  }, [val, info, inputId, infoId]);

  return (
    <div className="flex flex-col items-start gap-4 w-full px-4 py-2">
      <div className="flex w-full items-center">
        <Range
          step={1}
          min={0}
          max={maxStock}
          values={[val]}
          onChange={(vals) => setVal(vals[0])}
          renderTrack={({ props, children }) => (
            <div {...props} className="rounded-lg bg-gray-300 h-2 relative w-full">
              <div
                className="h-2 bg-[#233975] rounded-lg absolute"
                style={{ width: `${(val / maxStock) * 100}%` }}
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
          max={maxStock}
          defaultValue={initial} // pakai defaultValue supaya uncontrolled input, biar user bebas isi
          onChange={(e) => {
            let n = parseInt(e.target.value, 10);
            if (isNaN(n)) n = 0;
            if (n < 0) n = 0;
            if (n > maxStock) n = maxStock;
            setVal(n);
          }}
          className="w-20 text-center rounded py-1"
        />
      </div>

      <div className="text-sm text-gray-500 text-left -mt-5">
        Sisa inventori: {maxStock - val}
      </div>

      <input
        id={infoId}
        type="text"
        defaultValue={initialInfo} // pakai defaultValue juga supaya user isi sendiri
        onChange={(e) => setInfo(e.target.value)}
        placeholder="Contoh: fletching copot"
        className="w-full border-b border-gray-600 focus:outline-none py-1 -mt-1"
      />
    </div>
  );
};

export default ArrowModalContent;
