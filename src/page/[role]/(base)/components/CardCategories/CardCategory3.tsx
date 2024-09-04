import React, { FC } from "react";
import NcImage from "../../shared/NcImage/NcImage";
import { Link } from "react-router-dom";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import { CATS_DISCOVER } from "../DiscoverMoreSlider";
import { Statistic } from 'antd';
import dayjs from 'dayjs';
import SalePercentAnimationIcon from "../Icon/Voucher/SalePercent";
import FreeShipAnimationIcon from "../Icon/Voucher/FreeShip";
import SalePriceAnimationIcon from "../Icon/Voucher/SalePrice";
import { format } from 'date-fns';
import { VND } from "@/utils/formatVietNamCurrency";

const { Countdown } = Statistic;

export interface CardCategory3Props {
  item: any
  className?: string
  itemClassName?: string
  heading?: string
  headingFontClassName?: string
  headingClassName?: string
  subHeading?: string
}

const CardCategory3: FC<CardCategory3Props> = ({
  item,
}) => {
  console.log(item);
  const {code, name,end_date, type, value} = item
  
  const endDateTimestamp = dayjs(end_date).valueOf();
  const copyIt = () => {
    const copyText = document.getElementById('copyvalue');
    copyText.select();
    document.execCommand('copy');
  };

  return (
    <div className="relative p-4 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {type == 'percent' ? <SalePercentAnimationIcon width={'50px'}/> : <SalePriceAnimationIcon width={'50px'}/>}
        </div>
        <div className="border-l-4 border-dotted border-black h-24 mx-4"></div>
        <div className="flex-1">
          <h2 className="text-xl text-gray-600 uppercase">{name}</h2>
          <h1 className="text-4xl text-gray-600 mt-1">{type == 'percent' ? `${value}%`: VND(value)} <span className="text-xl">Khuyến mại</span></h1>
          <p className="text-gray-500 mt-1">Tới hết { format(new Date(end_date), 'dd/MM/yyyy')}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 border border-gray-300 rounded-md p-2">
        <input
          id="copyvalue"
          type="text"
          readOnly
          value={code}
          className="w-full h-full border-none outline-none text-sm"
        />
        <button
          onClick={copyIt}
          className="ml-2 py-1 px-4 bg-red-600 text-white border border-transparent rounded-md"
        >
          COPY
        </button>
      </div>
      <div className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 w-10 h-10 bg-red-600 rounded-full"></div>
      <div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 w-10 h-10 bg-red-600 rounded-full"></div>
    </div>
  );
};

export default CardCategory3;
