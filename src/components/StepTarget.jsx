import React from "react";
import SliderInput from "./SliderInput";

const StepTarget = ({ faceTarget, setFaceTarget, jumlahTargetRusak, setJumlahTargetRusak, sponsTarget, setSponsTarget }) => (
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
      <option value="Target puta">Target puta</option>
      <option value="Mega mendung">Mega mendung</option>
    </select>

    <div className="mt-6">
      <label className="font-semibold text-lg mb-2">Jumlah Rusak</label>
      <SliderInput value={jumlahTargetRusak} setValue={setJumlahTargetRusak} max={25} />
    </div>

    <label className="block mt-6 font-semibold text-lg mb-2">Info Spons Target</label>
    <input
      type="text"
      value={sponsTarget}
      onChange={(e) => setSponsTarget(e.target.value)}
      placeholder="Contoh: bolong di tengah"
      className="w-full border-b border-gray-600 focus:outline-none py-3 text-md"
    />
  </div>
);

export default StepTarget;
