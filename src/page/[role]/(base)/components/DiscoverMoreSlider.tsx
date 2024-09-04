import React, { useEffect, useId } from "react";
import Heading from "./Heading/Heading";
import img1 from "../../../../assets/images/base/collections/1.png";
import img2 from "../../../../assets/images/base/collections/5.png";
import img3 from "../../../../assets/images/base/collections/4.png";
import img4 from "../../../../assets/images/base/collections/3.png";
import CardCategory3, {
  CardCategory3Props,
} from "./CardCategories/CardCategory3";
import Glide from "@glidejs/glide";
import { useGetValueAttributeQuery } from "../../(manager)/attribute/_components/value_attribute/ValueAttributeEndPoints";
import { useGetVouchersQuery } from "../../(manager)/voucher/VoucherEndpoint";
import counpont from "../../../../assets/images/base/disocount-coupon.png"

export const CATS_DISCOVER: CardCategory3Props[] = [
  {
    name: "Explore new arrivals",
    desc: "Shop the latest <br /> from top brands",
    featuredImage: img1,
    color: "bg-yellow-50",
  },
  {
    name: "Digital gift cards",
    desc: "Give the gift <br /> of choice",
    featuredImage: img2,
    color: "bg-red-50",
  },
  {
    name: "Sale collection",
    desc: "Up to <br /> 80% off retail",
    featuredImage: img3,
    color: "bg-blue-50",
  },
  {
    name: "Sale collection",
    desc: "Up to <br /> 80% off retail",
    featuredImage: img4,
    color: "bg-green-50",
  },
];

export interface SectionSliderProductCardProps {
  className?: string
  itemClassName?: string
  heading?: string
  headingFontClassName?: string
  headingClassName?: string
  subHeading?: string
}

const DiscoverMoreSlider = ({
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "Mã Giảm Giá Đặc Biệt!",
}: SectionSliderProductCardProps) => {
  const { data, isLoading } = useGetVouchersQuery({});
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  useEffect(() => {
    // @ts-ignore
    const OPTIONS: Glide.Options = {
      perView: 2.8,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          gap: 28,
          perView: 2.5,
        },
        1279: {
          gap: 20,
          perView: 2.15,
        },
        1023: {
          gap: 20,
          perView: 1.6,
        },
        768: {
          gap: 20,
          perView: 1.2,
        },
        500: {
          gap: 20,
          perView: 1,
        },
      },
    };

    const slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy();
    };
  }, [UNIQUE_CLASS, data]);
  
  return (
    <div className={`nc-DiscoverMoreSlider ${UNIQUE_CLASS} `}>
      <Heading
        className={headingClassName}
        fontClass={headingFontClassName}
        rightDescText={subHeading}
        hasNextPrev
      >
        {heading || `Tiết Kiệm Ngay`}
      </Heading>
      
      <div className="" data-glide-el="track">
        <ul className="glide__slides">
          {
          data && data.data.length > 0
          ?
          data.data.map((item : any, index : any) => (
            <li key={index} className={`glide__slide`}>
              <CardCategory3
                item={item}
              />
            </li>
          ))
          :
          <li className={`glide__slide`}>
            <div className="relative p-4 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="w-24 h-24 object-cover"
                    src={counpont}
                    alt="McDonald's"
                  />
                </div>
                <div className="border-l-4 border-dotted border-black h-24 mx-4"></div>
                <div className="flex-1">
                  <h2 className="text-xl text-gray-600">Rất tiếc không có mã giảm giá nào cho ngày hôm nay</h2>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 border border-gray-300 rounded-md p-2">
                <input
                  id="copyvalue"
                  type="text"
                  readOnly
                  value=""
                  className="w-full h-full border-none outline-none text-sm"
                />
                <button
                  className="ml-2 py-1 px-4 bg-gray-400 text-white border border-transparent rounded-md"
                >
                  COPY
                </button>
              </div>
              <div className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 w-10 h-10 bg-gray-400 rounded-full"></div>
              <div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 w-10 h-10 bg-gray-400 rounded-full"></div>
            </div>
          </li>
          }
        </ul>
      </div>
    </div>
  );
};

export default DiscoverMoreSlider;
