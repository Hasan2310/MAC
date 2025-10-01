import React from "react";
import { Range } from "react-range";

const SliderInput = ({ value, setValue, max = 25 }) => {
  const sisa = max - value;

  return (
    <div className="flex flex-col gap-2 w-full py-3 ps-3">
      <div className="flex items-center gap-3 w-full">
        <Range
          step={1}
          min={0}
          max={max}
          values={[value]}
          onChange={(vals) => setValue(vals[0])}
          renderTrack={({ props, children }) => (
            <div {...props} className="flex-1 h-2 rounded-lg bg-gray-300 relative">
              <div
                className="h-2 bg-[#233975] rounded-lg absolute top-0 left-0"
                style={{ width: `${(value / max) * 100}%` }}
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
          max={max}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            setValue(isNaN(val) || val < 0 ? 0 : Math.min(val, max));
          }}
          className="w-8 text-center"
        />
      </div>

      {/* tampil stok tersisa */}
      <div className="text-sm text-gray-500">
        Siap dipakai {sisa}
      </div>
    </div>
  );
};

export default SliderInput;
