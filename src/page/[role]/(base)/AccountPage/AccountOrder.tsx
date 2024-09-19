import Prices from "../components/Prices";
import { PRODUCTS } from "../../../../data/data";
import ButtonSecondary from "../shared/Button/ButtonSecondary";
import CommonLayout from "./CommonLayout";
import { useGetUserOrderQuery } from "@/services/OrderEndPoints";
import { Link, NavLink, useLocation } from "react-router-dom";
import { formatDate } from "@/utils/convertCreatedLaravel";
import { Segmented, Tabs } from "antd";
import { TabsProps } from "rc-tabs";

const AccountOrder = () => {


  const { data, isLoading } = useGetUserOrderQuery({})


  const renderProductItem = (product: any, index: number) => {
    const { image, thumbnail, name, price, quantity } = product;
    console.log(product.varians)
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image || thumbnail}
            alt={name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <span> {`${product?.varians[0].name}`} &nbsp;</span>
                  {product?.varians[1] && <span>|&nbsp; {`${product?.varians[1].name}`}</span>}
                </div>
              </div>
              <Prices price={price} className="mt-0.5 ml-2" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Qty</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{quantity}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = (order, key) => {
    const { id, code, created_at, order_status, order_details } = order
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0" key={key}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">{code}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{formatDate(created_at)}</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">{order_status}</span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <Link to={`detail/${id}`}>
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >
                Xem chi tiết
              </ButtonSecondary>
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {order_details.map(renderProductItem)}
        </div>
      </div>
    );
  };

  if (!data && isLoading) {
    return
  }

  const order = data.data

  return (
    <div>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="font-bold text-[24px]">Lịch sử đơn hàng</h2>
        {order.map((item, key) => (
          renderOrder(item, key)
        ))}
      </div>
    </div>
  );
};

export default AccountOrder;
