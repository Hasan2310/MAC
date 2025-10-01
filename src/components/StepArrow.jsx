import React from "react";
import ArrowOptionCard from "./ArrowOptionCard";

const StepArrow = ({ openArrowModal, arrowWood, arrowCarbon }) => {
  const woodJumlah = arrowWood?.jumlah ?? 0;

  return (
    <div className="">
      <div className="text-lg font-semibold mb-4">Pilih Jenis Arrow</div>

      <div className="grid grid-cols-2 gap-4">
        {/* Arrow Wood */}
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

        {/* Arrow Carbon (Category) */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Arrow Carbon</div>

          {/* Carbon - Vanes */}
          <ArrowOptionCard
            option="Carbon Vanes"
            arrow={{
              jumlah: arrowCarbon?.vanes?.jumlah ?? 0,
              selected: arrowCarbon?.vanes?.selected ?? false,
              imgFilled: arrowCarbon?.vanes?.imgFilled || "/carbon1.png",
              imgEmpty: arrowCarbon?.vanes?.imgEmpty || "/carbon.png",
            }}
            onClick={() => openArrowModal("Arrow Carbon - Vanes")}
          />

          {/* Carbon - Torba */}
          <ArrowOptionCard
            option="Carbon Torba"
            arrow={{
              jumlah: arrowCarbon?.torba?.jumlah ?? 0,
              selected: arrowCarbon?.torba?.selected ?? false,
              imgFilled: arrowCarbon?.torba?.imgFilled || "/carbon1.png",
              imgEmpty: arrowCarbon?.torba?.imgEmpty || "/carbon.png",
            }}
            onClick={() => openArrowModal("Arrow Carbon - Torba")}
          />

          {/* Carbon - Sam Wood (optional extra) */}
          <ArrowOptionCard
            option="Carbon Sam Wood"
            arrow={{
              jumlah: arrowCarbon?.samWood?.jumlah ?? 0,
              selected: arrowCarbon?.samWood?.selected ?? false,
              imgFilled: arrowCarbon?.samWood?.imgFilled || "/carbon1.png",
              imgEmpty: arrowCarbon?.samWood?.imgEmpty || "/carbon.png",
            }}
            onClick={() => openArrowModal("Arrow Carbon - Sam Wood")}
          />
        </div>
      </div>
    </div>
  );
};

export default StepArrow;
