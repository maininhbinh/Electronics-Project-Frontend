import { Popover, Transition } from "@headlessui/react";
import Prices from "../Prices";
import { Product, PRODUCTS } from "../../../../../data/data";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import { ICart } from "@/common/types/cart.interface";
import { getTotalIconCart , getTotalPriceCart, deleteCart} from "@/utils/handleCart";
import { VND } from "@/utils/formatVietNamCurrency";
import { useDeleteCartMutation, useGetCartsQuery } from "@/services/CartEndPoinst";
import { useLocalStorage } from "@uidotdev/usehooks";
import { setOpenModalLogin } from "@/app/webSlice";
import { useAppDispatch } from "@/app/hooks";
import { isValidJSON } from "@/utils/isJson";
export default function CartDropdown() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState(() => {
    try {
        // Get from local storage by key
        const item = localStorage.getItem('user');
        // Parse stored JSON or return initialValue if it's not valid JSON
        return item && isValidJSON(item) ? JSON.parse(item) : '';
    } catch (error) {
        console.error(error);
        return '';
    }
  });
  const {data: carts} =  useGetCartsQuery(undefined, {skip: !user}) 
  
 
  const [deleteCart] = useDeleteCartMutation();
  const renderProduct = (item: ICart, index: number, close: () => void) => {

    const { image, price, name, slug, thumbnail, quantity, user_id, product_item_id, price_sale, variants} = item;
    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image || thumbnail}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={close}
            className="absolute inset-0"
            to={"/product-detail"}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">
                  <Link onClick={close} to={"/product-detail"}>
                    {name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{ item.variants[0].name} {item.variants[1] && `| ${item.variants[1].name}`} </span>
                  
                </p>
              </div>
              <Prices price={parseFloat(price)} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty ${quantity}`}</p>

            <div className="flex">
              <button
                onClick={() => deleteCart(item.product_item_id) }
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">{carts ? getTotalIconCart(carts?.data) : 0}</span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Link className="block md:hidden absolute inset-0" to={"/cart"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">Giỏ hàng</h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {carts?.data?.map(
                        (item : any, index : any) => renderProduct(item , index, close)
                      )}
                    </div>
                  </div>
                  


                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    {user ? <><p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      {Boolean(carts?.data?.length) ?  
                      <>
                      
                      <span>
                        <span>Tổng phụ</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                        Vận chuyển và thuế được tính khi thanh toán.
                        </span>
                      </span>
                      <span className="">{carts && VND(getTotalPriceCart(carts?.data)) } </span>
                      </> : <span>Cart is empty</span>}
                     
            
                    </p>
                    {Boolean(carts?.data?.length) &&      <div className="flex space-x-2 mt-5">
                      <ButtonSecondary
                        href="/cart"
                        className="flex-1 border border-slate-200 dark:border-slate-700"
                        onClick={close}
                      >
                        Xem giỏ hàng
                      </ButtonSecondary>
                      <ButtonPrimary
                        href="/checkout"
                        onClick={close}
                        className="flex-1"
                      >
                        Thanh toán
                      </ButtonPrimary>
                    </div> }

               
                    
                    </> :  <span onClick={() => dispatch(setOpenModalLogin(true))}> Vui lòng đăng nhập để mua hàng</span> }
                  
                  </div>




                </div>
              </div>
            </Popover.Panel>


            
          </Transition>
        </>
      )}
    </Popover>
  );
}