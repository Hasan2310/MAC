import React from "react";
import ArrowOptionCard from "./ArrowOptionCard";

const StepArrow = ({ openArrowModal, arrowWood, arrowCarbon }) => {
  const woodJumlah = arrowWood?.jumlah ?? 0;
  const carbonVanesJumlah = arrowCarbon?.vanes?.jumlah ?? 0;
  const carbonTorbaJumlah = arrowCarbon?.torba?.jumlah ?? 0;

  return (
    <div className="">
      <div className="text-lg font-semibold mb-4">Pilih Jenis Arrow</div>

      <div className="grid grid-cols-2 gap-4">
        <ArrowOptionCard
          option="Arrow Wood"
          arrow={{
            jumlah: woodJumlah,
            selected: arrowWood?.selected ?? false,
            imgFilled: arrowWood?.imgFilled || "/wood1.png",
            imgEmpty: arrowWood?.imgEmpty || "/wood.png",
          }}
          onClick={() => openArrowModal("Arrow Wood")}
        />

        <ArrowOptionCard
          option="Arrow Carbon"
          arrow={{
            jumlah: carbonVanesJumlah + carbonTorbaJumlah,
            selected: arrowCarbon?.selected ?? false,
            imgFilled: arrowCarbon?.imgFilled || "/carbon1.png",
            imgEmpty: arrowCarbon?.imgEmpty || "/carbon.png",
          }}
          onClick={() => openArrowModal("Arrow Carbon")}
        />
      </div>
    </div>
  );
};

export default StepArrow;
