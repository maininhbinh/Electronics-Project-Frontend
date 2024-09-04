import { VND } from "@/utils/formatVietNamCurrency";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price: number;
  contentClass?: string;
  classChildren?: string
}

const Prices: FC<PricesProps> = ({
  className = "",
  price,
  contentClass = "text-sm font-medium",
  classChildren='text-[16px]'
}) => {  
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center rounded-lg ${contentClass}`}
      >
        <span className={`!leading-none ${classChildren}`}>
          {VND(price)}
        </span>
      </div>
    </div>
  );
};

export default Prices;
