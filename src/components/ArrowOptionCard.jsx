import React from "react";

const ArrowOptionCard = ({ option, arrow, onClick }) => {
  const imgSrc = arrow.jumlah > 0 ? arrow.imgFilled : arrow.imgEmpty;

  return (
    <div className="flex justify-center">
      <label
        className={`border rounded-lg cursor-pointer transition relative flex flex-col items-center
        px-5 py-5 w-full
        ${arrow.selected ? "text-[#233975] border-[2px] border-[#233975]" : "border-[#D9D9D9] text-black border-1"}`}
        onClick={onClick}
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
};

export default ArrowOptionCard;
