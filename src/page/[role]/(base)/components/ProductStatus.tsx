import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Product } from "../../../../data/data";
import React, { FC } from "react";
import IconDiscount from "./IconDiscount";



const ProductStatus = ({productVariantDetail} : any) => {
  
  return (
    <>
    <div className={`bg-white py-2  px-2 nc-shadow-lg rounded-full flex items-center justify-center absolute top-[13px] left-[15px] `}>
      <IconDiscount className="w-3.5 h-3.5" />
     
      {productVariantDetail &&  <span className="ml-1 leading-none">{ 
        Math.round(((productVariantDetail?.price - productVariantDetail?.price_sale) / productVariantDetail?.price ) * 100)
      } % </span>}
    </div>

    <div className={`bg-[#6CD894] text-white py-2  px-2 nc-shadow-lg rounded-full flex items-center justify-center absolute top-[13px] right-[15px] `}>
      <SparklesIcon className="w-3.5 h-3.5" />
    
    </div>
    </>
  );
};

export default ProductStatus;
