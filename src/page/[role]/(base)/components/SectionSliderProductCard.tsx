import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "./Heading/Heading";
import Glide from "@glidejs/glide";
import ProductCard from "./ProductCard";
import { Product } from "../../../../data/data";
import { useFilterProductQuery, useGetProductsQuery } from "../../(manager)/products/ProductsEndpoints";
import { IProduct } from "@/common/types/product.interface";
import { Empty, Skeleton } from "antd";
import { RadioChangeEvent } from "antd/lib";
import NcImage from "../shared/NcImage/NcImage";
import LoadingProduct from "./LoadingProduct";
export interface SectionSliderProductCardProps {
  className?: string
  itemClassName?: string
  heading?: string
  headingFontClassName?: string
  headingClassName?: string
  subHeading?: string
  data?: Product[]
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({
  className = '',
  itemClassName = '',
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "Hôm nay",
}) => {
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const { data: dataItem } = useFilterProductQuery('is_show_home');

  useEffect(() => {
    if (!sliderRef.current) {
      return () => { }
    }

    const OPTIONS: Glide.Options = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4 - 1
        },
        1024: {
          gap: 20,
          perView: 4 - 1
        },
        768: {
          gap: 20,
          perView: 4 - 2
        },
        640: {
          gap: 20,
          perView: 1.5
        },
        500: {
          gap: 20,
          perView: 1.3
        }
      }
    }

    const slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy()
    }
  }, [sliderRef, UNIQUE_CLASS, dataItem])
  return (
    <>
      <div className={`nc-SectionSliderProductCard ${className}`}>
        <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
          <Heading
            className={headingClassName}
            fontClass={headingFontClassName}
            rightDescText={subHeading}
            hasNextPrev
          >
            {heading || `Sản phẩm nổi bật`}
          </Heading>
          {

            <div className="glide__track relative h-full" data-glide-el="track">
              <ul className="glide__slides h-full">
                {
                  !dataItem && !dataItem?.data || dataItem?.data?.length < 1
                    ?
                    <>
                      {[1, 2, 3].map((item) => (
                        <LoadingProduct key={item} className={className} />
                      ))}
                    </>
                    :
                    dataItem?.data.map((item: IProduct) => (
                      <li key={item.id} className={`glide__slide`}>
                        {item && <ProductCard data={item} className="h-full" />}
                      </li>
                    ))
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default SectionSliderProductCard;
