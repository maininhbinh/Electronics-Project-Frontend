import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "../components/NcInputNumber";
import Prices from "../components/Prices";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import { ICart } from "@/common/types/cart.interface";
import { useDeleteCartMutation, useGetCartsQuery } from "@/services/CartEndPoinst";
import { popupError } from "../../shared/Toast";
import { getTotalPriceCart } from "@/utils/handleCart";
import { Button, Result } from "antd";
import { VND } from "@/utils/formatVietNamCurrency";
import CartEmptyAnimationIcon from "../components/Icon/Cart/CartEmpty";

const CartPage = () => {
  const { data: carts, isLoading } = useGetCartsQuery({});

  const [deleteCart] = useDeleteCartMutation();

  const iconVariants = [
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.35 1.94995L9.69 3.28992"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.07 11.92L17.19 11.26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 22H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>,
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 9V3H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 15V21H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 3L13.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 13.5L3 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ]

  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Hết hàng</span>
      </div>
    );
  };

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Còn hàng</span>
      </div>
    );
  };

  const renderProduct = (item: ICart) => {



    const { image, price, name, slug, thumbnail, quantity, user_id, product_item_id, price_sale, variants, in_stock, maxQuantity } = item;
    const product = {
      id: product_item_id,
      price,
      price_sale,
      quantity,
      image,
      variants,
      in_stock
    }
    const handleDelete = (id: number) => {
      try {
        deleteCart(id).unwrap();
      } catch (error) {
        popupError('Delete cart success');
      }
    }
    return (
      <div
        key={item.id}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className={`relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100`}>
          <img
            src={image ? image : thumbnail}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
          <Link to={`/product-detail/${slug}`} className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link to={`/product-detail/${slug}`}>{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  {variants.map((item, index) => (
                    <div className="flex" key={index}>
                      {index !== variants.length && index > 0 ? (<span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>) : ''}
                      <div className="flex items-center space-x-1.5">
                        <span>{item.name}</span>
                      </div>
                    </div>
                  ))}

                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={parseFloat(price)}
                  />
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber className="relative z-10" defaultValue={quantity} item={product} maxQuantity={maxQuantity} />
              </div>

              <div className="hidden flex-1 sm:flex  flex-col items-end gap-1">
                {
                  price_sale
                    ?
                    <div className="flex flex-col gap-1">
                      <Prices price={parseFloat(price)} classChildren="text-[12px] line-through text-gray-400" />
                      <Prices price={parseFloat(price_sale)} className="mt-0.5" classChildren="text-[18px] text-red-400" />
                    </div>
                    :
                    <div className="flex flex-col gap-1">
                      <Prices price={parseFloat(price)} className="mt-0.5" classChildren="text-[18px] text-red-400" />
                    </div>
                }
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            {!in_stock
              ? renderStatusSoldout()
              : renderStatusInstock()}

            <span
              onClick={() => handleDelete(Number(item.product_item_id))}
              className="cursor-pointer relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Xóa</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CartPage">
      <Helmet>
        <title>Giỏ hàng</title>
      </Helmet>

      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Giỏ hàng
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link to={"/#"} className="">
              Trang chủ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link to={"/#"} className="">
              Danh mục
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Giỏ hàng</span>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />
        {!isLoading && !carts?.data.length &&
          <Result
            icon={<CartEmptyAnimationIcon width="200px" height="200px" />}
            title="Giỏ hàng trống"
            extra={
              <Link to="/"><Button type="primary" key="console" className=" bg-black !rounded-[20px]">
                Quay về trang chủ
              </Button> </Link>
            }
          />
        }
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {isLoading ? <h1> Đang tải</h1> : carts?.data?.map(renderProduct)}
          </div>

          {!isLoading && Boolean(carts?.data.length) && <><div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="sticky top-28">
                <h3 className="text-lg font-semibold ">Tạm tính</h3>
                <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                  <div className="flex justify-between pb-4">
                    <span>Giá</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {carts && VND(getTotalPriceCart(carts.data))}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                    <span>Tổng đơn hàng</span>
                    <span>{carts && VND(getTotalPriceCart(carts.data))}</span>
                  </div>
                </div>
                <ButtonPrimary href="/checkout" className="mt-8 w-full">
                  Thanh toán
                </ButtonPrimary>
                <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <p className="block relative pl-5">
                    <svg
                      className="w-4 h-4 absolute -left-1 top-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8V13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.9945 16H12.0035"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Learn more{` `}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="##"
                      className="text-slate-900 dark:text-slate-200 underline font-medium"
                    >
                      Taxes
                    </a>
                    <span>
                      {` `}and{` `}
                    </span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="##"
                      className="text-slate-900 dark:text-slate-200 underline font-medium"
                    >
                      Shipping
                    </a>
                    {` `} infomation
                  </p>
                </div>
              </div>
            </div></>}

        </div>

      </main>
    </div>
  );
};

export default CartPage;