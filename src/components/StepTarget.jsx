import React, { useEffect } from "react";
import SliderInput from "./SliderInput";

const StepTarget = ({
  faceTarget,
  setFaceTarget,
  jumlahTargetRusak,
  setJumlahTargetRusak,
  sponsTarget,
  setSponsTarget,
  targetLimits = { ring5: 0, ring6: 0 },
}) => {
  const currentMax =
    faceTarget === "Target ring 5"
      ? Number(targetLimits.ring5) || 0
      : faceTarget === "Target ring 6"
        ? Number(targetLimits.ring6) || 0
        : 0;

  useEffect(() => {
    if (jumlahTargetRusak > currentMax) {
      setJumlahTargetRusak(currentMax);
    }
  }, [faceTarget, targetLimits, currentMax]);

  return (
    <div>
      <label className="block font-semibold text-lg mb-2">Face Target</label>
      <select
        value={faceTarget}
        onChange={(e) => setFaceTarget(e.target.value)}
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      >
        <option value="">-- Pilih Target --</option>
        <option value="Target ring 5">Target ring 5</option>
        <option value="Target ring 6">Target ring 6</option>
        {/* <option value="Target puta">Target puta</option>
        <option value="Mega mendung">Mega mendung</option> */}
      </select>

      <div className="mt-6">
        <label className="font-semibold text-lg mb-2">Jumlah Rusak</label>
        {currentMax > 0 ? (
          <SliderInput
            value={jumlahTargetRusak || 0}
            setValue={setJumlahTargetRusak}
            max={currentMax}
          />
        ) : faceTarget === "" ? (
          <p className="text-gray-500 italic text-sm">
            Pilih Target untuk input rusak
          </p>
        ) : (
          <p className="text-gray-500 italic text-sm">
            Tidak tersedia di inventori
          </p>
        )}
      </div>

      <label className="block mt-6 font-semibold text-lg mb-2">
        Info Spons Target
      </label>
      <input
        type="text"
        value={sponsTarget}
        onChange={(e) => setSponsTarget(e.target.value)}
        placeholder="Contoh: bolong di tengah"
        className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
      />
    </div>
  );
};

export default StepTarget;
