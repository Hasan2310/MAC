import React from "react";

const StepArrow = ({ openArrowModal }) => (
  <div>
    <label className="block font-semibold text-lg mb-5">Arrow</label>
    <div className="grid grid-cols-2 gap-4">
      <div
        className="flex flex-col items-center border p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100 py-20"
        onClick={() => openArrowModal("Arrow Wood")}
      >
        <img src="/wood.png" alt="Arrow Wood" className="w-16 h-16 object-contain" />
        <span className="mt-2 font-medium">Arrow Wood</span>
      </div>
      <div
        className="flex flex-col items-center border p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100 py-20"
        onClick={() => openArrowModal("Arrow Carbon")}
      >
        <img src="/carbon.png" alt="Arrow Carbon" className="w-16 h-16 object-contain" />
        <span className="mt-2 font-medium">Arrow Carbon</span>
      </div>
    </div>
  </div>
);

export default StepArrow;
