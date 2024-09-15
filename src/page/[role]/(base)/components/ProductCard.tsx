import React, { FC, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import NcImage from '../shared/NcImage/NcImage'
import Prices from './Prices'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import ButtonSecondary from '../shared/Button/ButtonSecondary'
import BagIcon from './BagIcon'
import toast from 'react-hot-toast'
import { Transition } from '@headlessui/react'
import ModalQuickView from './ModalQuickView'
import ProductStatus from './ProductStatus'
import { IProduct, IProductItem } from '@/common/types/product.interface'
import { IAddCart, ICart } from '@/common/types/cart.interface'
import { useAddToCartMutation } from '@/services/CartEndPoinst'
import { popupError } from '../../shared/Toast'
export interface ProductCardProps {
  className?: string;
  data: IProduct;
  isLiked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data,
  isLiked,
}) => {
  const {
    id,
    name,
    thumbnail,
    slug,
    products,
    products_sum_product_itemsquantity,
    order_details_sum_quantity,
    is_active
  } = data;
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [variantActive, setVariantActive] = React.useState(0);
  const [showModalQuickView, setShowModalQuickView] = React.useState(false);
  const [image, setImage] = React.useState(thumbnail);
  const blocksRef = useRef([]);
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    const widths = blocksRef.current.map(block => block.offsetWidth);
    const max = Math.max(...widths);
    setMaxWidth(max);
  }, []);

  const prices = products.map((product: IProductItem) => parseFloat(product.price));
  const price_sale = products.map((product: IProductItem) => parseFloat(product.price_sale));
  const maxPrice = Math.max(...prices);
  const maxPriceSale = Math.max(...price_sale)

  const productVariantDetail = {
    price: maxPrice,
    price_sale: maxPriceSale
  }

  const firstVariantGroup: Set<string> = new Set();
  const secondVariantGroup: Set<string> = new Set();



  products.forEach((product: IProductItem) => {
    if (product.variants.length > 0) {
      firstVariantGroup.add(product.variants[0].name);
    }
    if (product.variants.length > 1) {
      secondVariantGroup.add(product.variants[1].name);
    }
  });

  const firstVariantArray: string[] = [...firstVariantGroup];
  const secondVariantArray: string[] = [...secondVariantGroup];



  const notifyAddTocart = async ({ second }: { second?: string | null }) => {
    const cart = products.find((item) => {
      return !second ? item.variants[0].name == firstVariantArray[variantActive] : item.variants[0].name == firstVariantArray[variantActive] && item.variants[1].name == second
    });

    if (cart?.id) {

      try {
        const payload: IAddCart = {
          quantity: 1,
          product_item_id: cart.id,
        }
        await addToCart(payload).unwrap();
        toast.custom(
          (t) => (
            <Transition
              appear
              show={t.visible}
              className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
              enter="transition-all duration-150"
              enterFrom="opacity-0 translate-x-20"
              enterTo="opacity-100 translate-x-0"
              leave="transition-all duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-20"
            >
              <p className="block text-base font-semibold leading-none">
                Đã thêm vào giỏ hàng!
              </p>
              <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
              {renderProductCartOnNotify({ second })}
            </Transition>
          ),
          { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
      } catch (error) {
        popupError('Add to cart error!');
      }

    }

  };

  const renderProductCartOnNotify = ({ second }: { second?: string | null }) => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {firstVariantArray ? firstVariantArray[variantActive] : `Natural`}
                  </span>

                  {
                    second
                      ?
                      <>
                        <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                        <span>{second || "XL"}</span>
                      </>
                      :
                      ''
                  }
                </p>
              </div>
              <Prices price={products.find(item => {
                return second ? item.variants[0].name == firstVariantArray[variantActive] && item.variants[1].name == second : item.variants[0].name == firstVariantArray[variantActive]
              })?.price || 0} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Qty 1</p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVariants = () => {
    if (!firstVariantArray || !firstVariantArray.length) {
      return null;
    }

    return (
      <div className="flex gap-1 flex-wrap">
        {firstVariantArray.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setImage(products.find(item => {
                return item.variants[0].name == firstVariantArray[index]
              })?.image || thumbnail)

              setVariantActive(index)
            }}
            className={`relative border-[1px] overflow-hidden z-10 cursor-pointer nc-shadow-lg text-center text-nowrap py-[0.7rem] px-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center uppercase font-semibold tracking-tight text-sm  ${variantActive === index
              ? "text-red-400 dark:border-slate-300"
              : "text-slate-900 border-gray"
              }
                ${products.find((product: IProductItem) => {

                return product.variants[0].name == item && product.quantity < 1
              }) ? 'text-gray-200 pointer-events-none' : ''
              }
              `}
            title={item}
          >
            <div className='overflow-hidden w-full'>{item}</div>
          </div>
        ))}

      </div>
    );
  };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary
          className="shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => notifyAddTocart({ second: null })}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ml-1">Add to cart</span>
        </ButtonPrimary>
        <Link to={`/product-detail/${slug}`}>
          <ButtonSecondary
            className="ml-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
            fontSize="text-xs"
            sizeClass="py-2 px-4"
          >
            <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
            <span className="ml-1">Quick view</span>
          </ButtonSecondary>
        </Link>
      </div>
    );
  };

  const renderSizeList = () => {
    if (!secondVariantArray || !secondVariantArray.length) {
      return null;
    }

    return (
      <div className="absolute bottom-0 inset-x-1  flex flex-wrap gap-2 justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
        {secondVariantArray.map((second, index) => {
          return (
            <div
              key={index}
              className={`nc-shadow-lg rounded-xl bg-white hover:bg-slate-900 hover:text-white transition-colors cursor-pointer flex items-center justify-center uppercase font-semibold tracking-tight text-sm text-slate-900 text-center text-nowrap py-[0.7rem] px-2
                ${inStockVariant(second) < 1 ? 'pointer-events-none text-gray-200' : ''}`}
              onClick={() => notifyAddTocart({ second })}
            >
              <div className='overflow-hidden w-full'>
                {second}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const inStockVariant = (variant: string) => {
    return variant && products ? products?.find((item) => {
      return item.variants[0].name == firstVariantArray[variantActive] && item.variants[1].name == variant
    })?.quantity : 0
  }

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className} rounded-3xl overflow-hidden`}
        data-nc-id="ProductCard"
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1.6875rem' }}
      >
        <Link to={`/product-detail/${slug}`} className="absolute inset-0"></Link>

        <div className="relative flex-shrink-0  rounded-3xl overflow-hidden z-1 group">
          <Link to={`/product-detail/${slug}`} className="block p-5">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={image}
            />
          </Link>

          <ProductStatus productVariantDetail={productVariantDetail} />

          {secondVariantArray && secondVariantArray.length ? renderSizeList() : renderGroupButtons()}
        </div>

        <div className="space-y-4 px-3 pt-5 pb-2.5">
          {renderVariants()}

          <div>
            <h2
              className={`nc-ProductCard__title text-base font-semibold transition-colors`}
            >
              {name}
            </h2>
          </div>

          <div className="flex justify-between items-center ">
            <Prices price={maxPrice} />
            <Prices price={maxPriceSale} classChildren='text-[12px] text-red-500 line-through' />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ml-1 text-slate-500 dark:text-slate-400">
                {(Math.random() * 1 + 4).toFixed(1)}
                (
                {
                  `${order_details_sum_quantity ? order_details_sum_quantity : 0} Đã mua`
                }
                )
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICKVIEW */}
      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
