import React, { FC } from "react";
import NcImage from "../../shared/NcImage/NcImage";
import HIW1img from "../../../../../assets/images/base/HIW1img.png";
import HIW2img from "../../../../../assets/images/base/HIW2img.png";
import HIW3img from "../../../../../assets/images/base/HIW3img.png";
import HIW4img from "../../../../../assets/images/base/HIW4img.png";
import VectorImg from "../../../../../assets/images/base/VectorHIW.svg";
import Badge from "../../shared/Badge/Badge";

export interface SectionHowItWorkProps {
  className?: string;
  data?: typeof DEMO_DATA[0][];
}

const DEMO_DATA = [
  {
    id: 1,
    img: HIW1img,
    imgDark: HIW1img,
    title: "Lọc và tìm kiếm",
    desc: "Đề xuất thông minh giúp bạn tìm thấy sản phẩm",
  },
  {
    id: 2,
    img: HIW2img,
    imgDark: HIW2img,
    title: "Thêm vào giỏ hàng",
    desc: "Chọn mặt hàng yêu thích và thêm vào giỏ hàng",
  },
  {
    id: 3,
    img: HIW3img,
    imgDark: HIW3img,
    title: "Mua hàng và theo dõi đơn hàng",
    desc: "Đơn vị vận chuyển sẽ xác minh và giao tới cho bạn",
  },
  {
    id: 4,
    img: HIW4img,
    imgDark: HIW4img,
    title: "Trải nghiệm sản phẩm",
    desc: "Nếu bạn cảm thấy hài lòng vui lòng đánh giá 5 sao cho sản phẩm, hoặc không có thể gọi cho cửa hàng để hỗ trợ nhanh chóng",
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-SectionHowItWork ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
        <img
          className="hidden md:block absolute inset-x-0 top-5"
          src={VectorImg}
          alt="vector"
        />
        {data.map((item: typeof DEMO_DATA[number], index: number) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <NcImage
              containerClassName="mb-4 sm:mb-10 max-w-[140px] mx-auto"
              className="rounded-3xl"
              src={item.img}
            />
            <div className="text-center mt-auto space-y-5">
              <Badge
                name={`Bước ${index + 1}`}
                color={
                  !index
                    ? "red"
                    : index === 1
                    ? "indigo"
                    : index === 2
                    ? "yellow"
                    : "purple"
                }
              />
              <h3 className="text-base font-semibold">{item.title}</h3>
              <span className="block text-slate-600 dark:text-slate-400 text-sm leading-6">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHowItWork;
