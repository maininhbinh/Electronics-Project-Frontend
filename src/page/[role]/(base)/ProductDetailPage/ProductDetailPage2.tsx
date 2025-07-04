import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import NcImage from "../shared/NcImage/NcImage";
import ModalPhotos from "./ModalPhotos";
import ReviewItem from "../components/ReviewItem";
import NcInputNumber from "../components/NcInputNumber";
import BagIcon from "../components/BagIcon";
import Policy from "./Policy";
import toast from "react-hot-toast";
import SectionSliderProductCard from "../components/SectionSliderProductCard";
import ModalViewAllReviews from "./ModalViewAllReviews";
import NotifyAddTocart from "../components/NotifyAddTocart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Controller } from 'swiper/modules';
import 'swiper/css';
import SwiperCore from 'swiper';
import '../../../../styles/base/ant.scss'
import { useGetProductQuery } from '../../(manager)/products/ProductsEndpoints';
import { useNavigate, useParams } from 'react-router-dom';
import { VND } from "@/utils/formatVietNamCurrency";
import { useAddToCartMutation } from '@/services/CartEndPoinst'
import { IAddCart } from "@/common/types/cart.interface";
import { Button, Card, Col, Flex, List, Modal, Rate, Row, Skeleton, Typography } from "antd";
import Joi from 'joi';
interface CommentFormValues {
  content: string;
  rate: number;
}

const commentSchema = Joi.object({
  content: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Nội dung không được để trống',
    'string.min': 'Nôi dung tối thiểu 5 ký tự',
    'string.max': 'Nội dung tối đa 5 ký tự',
  }),
  rate: Joi.number().min(1).max(5).required().messages({
    'number.empty': 'Vui lòng đánh giá sản phẩm',
    'number.min': 'Vui lòng đánh giá sản phẩm',
    'number.max': 'Vui lòng đánh giá sản phẩm',
    'any.required': 'Vui lòng đánh giá sản phẩm'
  }),
});
import { IAttribute, IDetail, IProduct, IProductItem } from "@/common/types/product.interface";
import Textarea from "../shared/Textarea/Textarea";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useGetCommentsQuery, usePostCommentMutation } from "@/services/CommentEndPoints";
import { popupError } from "../../shared/Toast";
import { formatDate } from "@/utils/convertCreatedLaravel";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useGetVouchersQuery } from "../../(manager)/voucher/VoucherEndpoint";
import SectionSliderProductCardSimilar from "./SectionSliderProductCartSimilar";
import InputDetailCart from "../components/InputDetailCart";
import { setLoading, setOpenModalLogin, setOpenModalSignup } from "@/app/webSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
export interface ProductDetailPage2Props {
  className?: string;
}

type GroupedVariants = {
  name: string;
  attribute: string[];
};

type variantActive = {
  [key: string]: string
}

const ProductDetailPage2: FC<ProductDetailPage2Props> = ({
  className = "",
}) => {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [user] = useLocalStorage('user', null);
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CommentFormValues>({
    resolver: joiResolver(commentSchema),
  })
  const rateCurrent = watch('rate');

  const [postComment] = usePostCommentMutation();
  const { slug } = useParams()
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const { data, isLoading, refetch } = useGetProductQuery(slug, {
    skip: !slug,
  });

  const productId = data?.data?.id;
  const { data: listComments } = useGetCommentsQuery(productId, { skip: !productId, });

  const dataProduct = data?.data;

  const [variantActives, setVariantActives] = React.useState<Array<variantActive>>([])
  const [qualitySelected, setQualitySelected] = React.useState(1);
  const [activeThumb, setActiveThumb] = React.useState<SwiperCore | null>();
  const [thumb, setThumb] = useState('');
  const swiperRef = useRef(null);
  const [openDetail, setOpenDetail] = useState(false)
  const [openContent, setOpenContent] = useState(false)

  const [addToCart, { isLoading: LoadingCart }] = useAddToCartMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const dispatch = useAppDispatch()

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  const groupVariant = (product) => {

    const groupedVariants: { [key: string]: Set<string> } = {};
    
    product.products.forEach((product: IProductItem) => {
      product.variants.forEach(variant => {
        const { variant_name, name } = variant;
        if (!groupedVariants[variant_name]) {
          groupedVariants[variant_name] = new Set();
        }
        groupedVariants[variant_name].add(name);
      });
    });

    const result = Object.keys(groupedVariants).map(variant_name => {
      return {
        name: variant_name,
        attribute: Array.from(groupedVariants[variant_name])
      }
    });

    return result
  }

  useEffect(() => {
    if (data && data.data) {
      const newVariantActives = groupVariant(data.data).map(item => ({
        [item.name]: ''
      }));
      
      setVariantActives(newVariantActives)
      setThumb(data.data.thumbnail)
    }
  }, [data])

  useEffect(() => {
    if (data && data.data && variantActives.length != 0) {

      const listVariants = data.data.products;
      let valueSecondVariant: null | string = null;

      const keys = Object.keys(variantActives[0]); // Get all the keys
      const keyFromFirst = keys[0]; // Assume the key you get from the database
      const valueFirstVariant = variantActives[0][keyFromFirst];
      if (variantActives[1]) {
        const keys = Object.keys(variantActives[1]); // Get all the keys
        const keyFromSecond = keys[0]; // Assume the key you get from the database
        valueSecondVariant = variantActives[1][keyFromSecond];
      }
      // console.log(valueFirstVariant, valueSecondVariant)
      listVariants.map((item: any) => {

        if (item.variants[0] && item.variants[1] && (item.variants[0].name == valueFirstVariant && item.variants[1].name == valueSecondVariant) || (item.variants[0].name == valueSecondVariant && item.variants[1].name == valueFirstVariant)) {
          console.log(item.quantity)

          setMaxQuantity(item.quantity)
        } else if (!item.variants[1] && item.variants[0].name == valueFirstVariant) {
          setMaxQuantity(item.quantity)
        }
      })


      const { products } = data.data

      const product = findProductVariant()(products, variantActives)

      setThumb(product?.image || data.data.thumbnail)

    }
    setQualitySelected(1)
  }, [variantActives])

  const notifyAddTocart = async () => {
    const { products, thumbnail, name } = data.data
    const selectVariant = variantActives.findIndex(item => {
      const name = Object.keys(item)[0];

      return !item[name]
    })

    if (selectVariant >= 0) {
      popupError('Vui lòng chọn loại sản phẩm')
      return
    }

    const product = findProductVariant()(products, variantActives)
    const { image, id } = product

    const payload: IAddCart = {
      quantity: qualitySelected,
      product_item_id: id,
    }
    try {
      await addToCart(payload).unwrap();
      toast.custom(
        (t) => (
          <NotifyAddTocart
            productImage={image || thumbnail}
            qualitySelected={qualitySelected}
            show={t.visible}
            product={product}
            name={name}
          />
        ),
        { position: "top-right", id: "nc-product-notify", duration: 3000 }
      );
    } catch (error) {
      popupError('Đơn hàng vượt quá số lượng cho phép')
    }

  };

  const onSubmit = async (data: CommentFormValues) => {
    try {
      const payload = {
        product_id: dataProduct.id,
        content: data.content,
        rating: data.rate

      }
      await postComment(payload).unwrap();
      reset();
      setValue('rate', 0)
    } catch (error) {
      popupError('* Lỗi bình luận sản phẩm')
    }
  };

  const findVariantOutStock = (variant, value) => {

    const { products } = data.data
    const variantActive = variantActives.flatMap(item => Object.values(item));
    const variantCheck = variantActive.findIndex(item => item)

    if (variantCheck < 0) {
      return false
    }

    if (variantActives[variantCheck] && variantActive.filter(item => item).length < 2) {
      const keyActive = Object.keys(variantActives[variantCheck])[0];
      if (keyActive == variant) {
        return false
      }
    }

    const findVariantCance = variantActive.findIndex(item => !item);

    const checkOutStock = products.map((item: IProductItem) => JSON.stringify(item.variants.map(item => item.name)));

    if (findVariantCance >= 0) {
      variantActive[findVariantCance] = value
      const variantEncode = JSON.stringify(variantActive)

      return !checkOutStock.includes(variantEncode) || products.find((item: IProductItem) => JSON.stringify(item.variants.map(item => item.name)) == JSON.stringify(variantActive))?.quantity < 1;
    }

    const findVariantIndex = variantActives.findIndex(item => {
      const key = Object.keys(item)[0];
      return variant == key
    })

    variantActive[findVariantIndex] = value

    return !checkOutStock.includes(JSON.stringify(variantActive)) || products.find((item: IProductItem) => JSON.stringify(item.variants.map(item => item.name)) == JSON.stringify(variantActive))?.quantity < 1;

  }

  const checkQuantity = (variant) => {
    const { products } = data.data

    const checkOutStock = products.find((item: IProductItem) => item.variants.find(item => item.name == variant) && item.quantity >= 1);

    return !checkOutStock
  }

  const renderVariants = (variant: GroupedVariants, key: number) => {
    if (!variant || !variant || !variant.attribute.length) {
      return null;
    }

    if (!data || isLoading) {
      return null
    }

    return (
      <div>
        <div className="flex justify-between font-medium text-lg">
          <label htmlFor="">
            <span className="">
              {variant.name}
            </span>
          </label>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {variant.attribute.map((item, index) => {
            
            const isActive = item === variantActives[key][variant.name];
            // const sizeOutStock = isActive ? !findProductVariant()(products, variantActives).quantity : false
            const outStock = checkQuantity(item)
            const hasProduct = findVariantOutStock(variant.name, item)
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-2xl flex items-center justify-center p-2 min-w-[25%]
                text-sm sm:text-base uppercase font-semibold select-none overflow-hidden border-[1px] z-0 ${outStock || hasProduct
                    ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed"
                    : "cursor-pointer"
                  } ${isActive
                    ? "border-red-500 hover:bg-gray"
                    : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
                onClick={() => {
                  if (outStock || hasProduct) {
                    return
                  }
                  if (variantActives[key][variant.name] && variantActives[key][variant.name] == item) {
                    setVariantActives(
                      variantActives.map(i => {
                        const name = Object.keys(i)[0]

                        if (name == variant.name) {
                          return {
                            [variant.name]: ''
                          }
                        }
                        return i
                      })
                    );
                  } else {
                    setVariantActives(
                      variantActives.map(i => {
                        const name = Object.keys(i)[0]

                        if (name == variant.name) {
                          return {
                            [variant.name]: item
                          }
                        }
                        return i
                      })
                    );
                  }

                  if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.slideTo(0);
                  }
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const findProductVariant = () => {

    // Chuyển đổi targetArray thành định dạng dễ so sánh
    function transformTargetArray(targetArray) {
      return targetArray.map(item => {
        const key = Object.keys(item)[0];
        return { variant_name: key, name: item[key] };
      });
    }

    // So sánh hai đối tượng
    function objectsEqual(obj1, obj2) {
      return obj1.variant_name === obj2.variant_name && obj1.name === obj2.name;
    }

    // So sánh hai mảng
    function arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => objectsEqual(item, arr2[index]));
    }

    // Tìm mảng trùng khớp trong arrayList
    function findMatchingArray(arrayList, targetArray) {
      const transformedTargetArray = transformTargetArray(targetArray);
      return arrayList.find(arr => arraysEqual(arr.variants, transformedTargetArray));
    }

    return findMatchingArray
  }

  const renderSectionSidebar = () => {

    if (!data || isLoading) {
      return null
    }

    const { products } = data.data

    if (!variantActives || variantActives.length == 0) {
      return false
    }

    const product = findProductVariant()(products, variantActives);

    const prices_between = products.map((product: IProductItem) => parseFloat(product.price));
    const price_sale_between = products.map((product: IProductItem) => parseFloat(product.price_sale));
    const betweenPrice = Math.round(prices_between.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / prices_between.length);
    const betweenPriceSale = Math.round(price_sale_between.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / price_sale_between.length);

    const price = product ? product.price : betweenPrice;
    const price_sale = product ? product.price_sale : betweenPriceSale

    return (
      <div className="listingSectionSidebar__wrap border-gray-100" style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>
        <div className="space-y-7 lg:space-y-8">
          {/* PRICE */}
          <div className="">
            {/* ---------- 1 HEADING ----------  */}
            <div className="flex items-center justify-between space-x-5">
              {
                price_sale
                  ?
                  <div>
                    <div className="flex text-md font-semibold justify-end text-red-500 line-through">
                      {VND(parseFloat(price))}
                    </div>
                    <div className="flex text-2xl font-semibold">
                      {VND(parseFloat(price_sale))}
                    </div>
                  </div>
                  :
                  <div>
                    <div className="flex text-2xl font-semibold">
                      {VND(parseFloat(price))}
                    </div>
                  </div>
              }

              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >

                <span className="ml-1.5 flex">

                  <span className="text-slate-700 dark:text-slate-400 underline">
                    {listComments?.length} đánh giá
                  </span>
                </span>
              </a>
            </div>



            {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
            {
              data.data
                ?
                <div className="mt-6 space-y-7 lg:space-y-8">
                  {
                    groupVariant(data.data).map((item, key) => (
                      <div key={key} className="">{renderVariants(item, key)}</div>
                    ))
                  }
                </div>
                :
                ''
            }
          </div>
          {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
          <div className="flex space-x-3.5">
            <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
              {/* <NcInputNumber
                
              /> */}
              <InputDetailCart defaultValue={qualitySelected}
                onChange={setQualitySelected}
                maxQuantity={maxQuantity} />
            </div>
            <ButtonPrimary
              className="flex-1 flex-shrink-0"
              onClick={()=>{
                if(isAuthenticated){
                  notifyAddTocart()
                }else{
                  dispatch(setOpenModalLogin(true))
                }
    
              }}
            >
              <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
              <span className="ml-3">Thêm vào giỏ</span>
            </ButtonPrimary>
          </div>

          {/* SUM */}
          <div className="hidden sm:flex flex-col space-y-4 ">
            <div className="space-y-2.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex">
                  <span>{`${VND(parseFloat(price_sale ? price_sale : price))}  `}</span>
                  <span className="mx-2">x</span>
                  <span>{`${qualitySelected} `}</span>
                </span>

                <span>{`${VND(((price_sale ? price_sale : price) * qualitySelected))}`}</span>
              </div>
              {/* <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Thuế giá trị gia tăng</span>
                <span>0</span>
              </div> */}
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700"></div>
            <div className="flex justify-between font-semibold text-[24px]">
              <span>Tổng tiền</span>
              <span>{`${VND(((price_sale ? price_sale : price) * qualitySelected))}`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection1 = () => {
    return (
      <div >

        {/*  */}
        <div className="block lg:hidden">{renderSectionSidebar()}</div>

        {/*  */}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
        {/*  */}
        {/* <AccordionInfo panelClassName="p-4 pt-3.5 text-slate-600 text-base dark:text-slate-300 leading-7" /> */}
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div id="reviews" className="scroll-mt-[150px]">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">

          <span className="ml-1.5">  {listComments?.length} đánh giá</span>
        </h2>


        <div className="w-full py-5">

          {user ? <form onSubmit={handleSubmit(onSubmit)} className="nc-SingleCommentForm mt-5">
            <div className="mb-5">
              <Rate value={rateCurrent} onChange={(value) => setValue('rate', value)} className="mr-5" />
              {errors.rate && (
                <span style={{ color: 'red' }}>{errors.rate.message}</span>
              )}
            </div>
            <Textarea {...register('content')} />
            {errors.content && (
              <span style={{ color: 'red' }}>{errors.content.message}</span>
            )}
            <div className="mt-5 space-x-3">
              <ButtonPrimary>Gửi</ButtonPrimary>

            </div>
          </form> : ''}
        </div>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            {listComments?.map((item: any, key: any) => {
              
              return (
                <ReviewItem
                  key={key}
                  data={{
                    comment: item.content,
                    date: formatDate(item.created_at),
                    name: item.user_name,
                    starPoint: item.rating,
                    avatar: item.avatar
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const Gallery = () => {
    return (
      <div className="lg:space-y-3 space-y-2">
        <div className="relative border-[1px] rounded-[0.75rem]">
          <div
            className="col-span-2 md:col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer h-[250px] md:h-[450px]"
          >
            <Swiper
              ref={swiperRef}
              loop={true}
              modules={[Navigation, Thumbs, Controller]}
              slidesPerView={1}
              thumbs={{ swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null }}
              navigation={true}
              grabCursor={true}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              className="product-images-slider"
            >
              {
                [thumb, ...data.data.galleries.map(item => item.image)].map((item, key) => (
                  <SwiperSlide key={key}>
                    <NcImage
                      containerClassName="flex items-center justify-center h-full"
                      className=" rounded-md sm:rounded-xl h-full "
                      src={item}
                    />
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>

          {/*  */}

          <div
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-white text-slate-500 cursor-pointer hover:bg-slate-200 z-10"
            onClick={() => handleOpenModal(0)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Hiện tất cả ảnh
            </span>
          </div>
        </div>
        <div className="">
          <Swiper
            onSwiper={setActiveThumb}
            modules={[Navigation, Thumbs, Controller]}
            watchSlidesProgress
            spaceBetween={10}
            breakpoints={{
              1420: {
                slidesPerView: 11,
                spaceBetween: 10
              },
              320: {
                slidesPerView: 7,
                spaceBetween: 10
              },
              640: {
                slidesPerView: 8,
                spaceBetween: 10
              },
              770: {
                slidesPerView: 10,
                spaceBetween: 10
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 10
              }
            }}
            className="product-images-slider product-slide-thumbs"
          >
            {
              [thumb, ...data.data.galleries.map(item => item.image)].map((item, index) => (
                <SwiperSlide key={index}>
                  <NcImage
                    containerClassName="flex items-center justify-center border-[1px] rounded-md sm:rounded-xl p-1 cursor-pointer "
                    className=" rounded-sm sm:rounded-md h-[50px] object-cover w-[50px] "
                    src={item}
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={[thumb, ...data.data.galleries.map(item => item.image)]}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ProductDetailPage2__modalPhotos"
        />
      </div>
    )
  }
  
  if (!data || isLoading || !data?.data) {
    
    return (
      <div
        className={`ListingDetailPage nc-ProductDetailPage2 mb-9 ${className}`}
        data-nc-id="ProductDetailPage2"
      >
        {/* SINGLE HEADER */}
        <>
          <header className="container mt-8 sm:mt-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                <Skeleton.Input active size={'large'} style={{ width: 400 }} />
              </h2>
            </div>
          </header>
        </>

        {/* MAIn */}
        <main className="container relative z-10 mt-9 sm:mt-11 flex">
          {/* CONTENT */}
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-10 lg:pr-14 lg:space-y-14">

            <div className="lg:space-y-3 space-y-2">
              <div className="relative border-2 rounded-[0.75rem]">
                <div
                  className="thumbnail_product col-span-2 md:col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer h-[250px] md:h-[400px]"
                >
                  <Skeleton.Image
                    style={{ width: '100%', height: '100%' }} // Skeleton.Image chiếm toàn bộ chiều rộng và chiều cao của Card
                    active
                  />
                </div>

                {/*  */}
              </div>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="flex-grow">
            <div className="hidden lg:block sticky top-28">
              <div className="listingSectionSidebar__wrap lg:shadow-lg">
                <div className="space-y-7 lg:space-y-8">
                  {/* PRICE */}
                  <div className="">
                    {/* ---------- 1 HEADING ----------  */}


                    {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                    <div className="mt-6 space-y-7 lg:space-y-8">
                      <Skeleton active />
                    </div>
                  </div>

                  {/* SUM */}
                  <div className="hidden sm:flex flex-col space-y-4 ">

                    <div className="border-b border-slate-200 dark:border-slate-700"></div>
                    <div className="flex justify-between font-semibold text-[24px]">
                      <span><Skeleton.Input active size={'default'} /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="container pt-14 space-y-14">
          <Skeleton active />
        </div>
      </div>
    )
  }

  const { category, name } = data.data

  return (
    <div
      className={`ListingDetailPage nc-ProductDetailPage2 ${className} overflow-hidden`}
      data-nc-id="ProductDetailPage2"
    >
      {/* SINGLE HEADER */}
      <>
        <header className="container mt-8 sm:mt-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              {name}
            </h2>
          </div>
        </header>
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-9 sm:mt-11 flex ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-10 lg:pr-14 lg:space-y-14">

          {Gallery()}

          {renderSection1()}


        </div>

        {/* SIDEBAR */}
        <div className="flex-grow">
          <div className="hidden lg:block sticky top-28">
            {
              renderSectionSidebar()
            }
          </div>
        </div>
      </main>

      {/* OTHER SECTION */}
      <div className="container pt-14 space-y-14">
        <hr className="border-slate-200 dark:border-slate-700" />

        <Row gutter={[32, 24]}>
          <Col className="gutter-row " span={16}>
            <div className="py-5 rounded-xl relative max-h-[700px] p-4 overflow-hidden border-[1px] border-gray-100 min-h-[500px]" style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>
              <div dangerouslySetInnerHTML={{ __html: data.data.content }} />
              <div style={{ background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .91) 50%, #fff 55%)' }} className=" absolute bottom-0 left-0 p-2 flex justify-center items-center w-full">
                <Button onClick={() => setOpenContent(true)}>
                  Xem thêm
                </Button>
              </div>
            </div>
            <Modal
              footer={''}
              open={openContent}
              onCancel={() => setOpenContent(false)}
              width={1240}
            >
              <div className="rounded-md relative min-h-[32rem] p-4 overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: data.data.content }} />

              </div>
            </Modal>
          </Col>
          <Col className="gutter-row " span={8}>
            <div className="">
              <List
                header={<div className="text-[20px] font-bold">Thông số kĩ thuật</div>}
                footer={<div><Button onClick={() => setOpenDetail(true)} className="w-full">Xem cấu hình chi tiết</Button></div>}
                bordered
                dataSource={category.details.flatMap((item: IDetail) => item.attributes).slice(0, 10)}
                renderItem={(item: IAttribute) => (
                  <List.Item className=" flex justify-between">

                    <div className="w-[30%]">{item.name}</div>
                    <div className="w-[50%]">
                      <ul>
                        {item.values.map((item, key) => (
                          <li key={key}>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </List.Item>
                )}
                className="rounded-xl border-gray-100 border-[1px]"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}
              />
              <Modal
                title={
                  <div >
                    <div className="text-[24px] font-bold mb-2">Thông số kĩ thuật</div>
                    <hr className="border-slate-200 dark:border-slate-700" />
                  </div>
                }
                footer={''}
                open={openDetail}
                onCancel={() => setOpenDetail(false)}
              >
                {category.details.map((item: IDetail, key: number) => (
                  <div key={key} className=" mt-4">
                    <h2 className="font-bold mb-1">{item.name}</h2>
                    <List
                      bordered
                      dataSource={item.attributes}
                      renderItem={(item) => (
                        <List.Item className=" flex justify-between">
                          <div className="w-[30%]">{item.name}</div>
                          <div className="w-[50%]">
                            <ul>
                              {item.values.map((item, key) => (
                                <li key={key}>
                                  {item.name}
                                </li>
                              ))}
                            </ul>
                          </div>

                        </List.Item>
                      )}
                      className="lg:shadow-lg"
                    />
                  </div>
                ))}
              </Modal>
            </div>
          </Col>
        </Row>
      </div>

      {/* OTHER SECTION */}
      <div className="container pb-24 lg:pb-28 pt-14 space-y-14">
        <hr className="border-slate-200 dark:border-slate-700" />

        {renderReviews()}

        <hr className="border-slate-200 dark:border-slate-700" />

        <SectionSliderProductCardSimilar
          heading="SẢN PHẨM TƯƠNG TỰ"
          subHeading=""
          headingFontClassName="text-2xl font-semibold"
          headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
          idProduct={productId}
        />
      </div>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  );
};

export default ProductDetailPage2;