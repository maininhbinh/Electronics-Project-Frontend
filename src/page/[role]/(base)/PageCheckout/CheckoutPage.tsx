import Label from '../components/Label/Label'
import Prices from '../components/Prices'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import Input from '../shared/Input/Input'
import ShippingAddress from './ShippingAddress'
import { ICart } from '@/common/types/cart.interface'
import { VND } from '@/utils/formatVietNamCurrency'
import { getTotalPriceCart } from '@/utils/handleCart'
import { Button, Form, Result } from 'antd'
import { useDeleteCartMutation, useGetCartCheckoutQuery, useGetCartsQuery } from '@/services/CartEndPoinst'
import { useAppDispatch } from '@/app/hooks'

import { popupError, popupSuccess } from '../../shared/Toast'
import { useNavigate } from 'react-router-dom'
import { IOrder, Payment } from '@/common/types/Order.interface'
import { useAddOrderMutation, useGetPaymentMethodsQuery, useMomoPaymentMutation, useStripePaymentMutation, useVnPaymentMutation } from '@/services/OrderEndPoints'
import { useCheckVoucherMutation } from '../../(manager)/voucher/VoucherEndpoint'
import CartEmptyAnimationIcon from '../components/Icon/Cart/CartEmpty'
import PaymentMethod from './PaymentMethod'
import { useLocalStorage } from '@uidotdev/usehooks'
import ContactInfo from './ContactInfo'
import NcInputNumber from '../components/NcInputNumber'
import { CartsApi } from '@/services/CartEndPoinst'

interface FormValues {
  receiver_name: string,
  receiver_phone: string,
  receiver_email: string,
  receiver_city: string,
  receiver_district: string,
  receiver_ward: string,
  receiver_address: string,
  discount_code: string,
  note: string,
  payment_method: Payment
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [mothodActive, setMethodActive] = useState<Payment>("vnpay");

  const [dataVoucher, setVoucher] = useState<any>({
    apply: false,
    error: '',
    data: {}
  })

  const [deleteCart] = useDeleteCartMutation();
  const [momoPayment, {isLoading: loadingMomo}] = useMomoPaymentMutation();
  const [stripePayment, {isLoading: loadingStripe}] = useStripePaymentMutation();
  const [vnPayment, {isLoading: loadingVnPay}] = useVnPaymentMutation();
  const dataUser = useLocalStorage('user', undefined)
  const user : any = dataUser[0];
  const [checkVoucherData] = useCheckVoucherMutation()
  const [addOrder, { isLoading: isLoadingOrder }] = useAddOrderMutation()
  const { data: carts, refetch } = useGetCartCheckoutQuery({})

  const [discount, setDiscount] = useState<string>('')
  const [tabActive, setTabActive] = useState<'ContactInfo' | 'ShippingAddress' | 'PaymentMethod'>('ContactInfo')

  const [form] = Form.useForm<IOrder>()


  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id)
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }  
 
  const onFinish = async (values: IOrder) => {
    
    const payload = {
      receiver_name: values.receiver_name,
      receiver_phone: values.receiver_phone,
      receiver_email: values.receiver_email,
      receiver_city: values?.receiver_city,
      receiver_district: values?.receiver_district,
      receiver_ward: values?.receiver_ward,
      receiver_address: values?.receiver_address,
      note: values?.note,
      discount_code: dataVoucher.apply ? dataVoucher.code : '',
      payment_method : values?.payment_method
    }

    try{

      const response = await addOrder(payload).unwrap();
      refetch();
      window.location.href = response.url;

    }catch(error){      
      const err = error as Error; 
      
      popupError(err.data.message ?? 'Hệ thống có vấn đề vui lòng thử lại')
      
    }
  }
  
  const renderProduct = (item: ICart, index: number) => {
    const { image, price, thumbnail, slug, name, price_sale, quantity, variants, id, product_item_id } = item

    const product = {
      id: product_item_id,
      price,
      price_sale,
      quantity,
      image,
      variants
    }

    const handleDelete = (id : number) => {
      try {
        deleteCart(id).unwrap();
      } catch (error) {
        popupError('Xóa khỏi giỏ hàng thành công thành công');
      }
    }

    return (
      <div key={index} className='relative flex py-7 first:pt-0 last:pb-0'>
        <div className='relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
          <img src={image || thumbnail} alt={name} className='h-full w-full object-contain object-center' />
          <Link to={`/product-detail/${slug}`} className='absolute inset-0'></Link>
        </div>

        <div className='ml-3 sm:ml-6 flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between '>
              <div className='flex-[1.5] '>
                <h3 className='text-base font-semibold'>
                  <Link to={`/product-detail/${slug}`}>{name}</Link>
                </h3>
                <div className='mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300'>
                  <div className='flex items-center space-x-1.5'>
                    <span>
                      {item.variants[0].name} {item.variants[1] && `| ${item.variants[1].name}`}{' '}
                    </span>
                  </div>
                </div>

                <div className='mt-3 flex justify-between w-full sm:hidden relative'>
                  <select
                    name='qty'
                    id='qty'
                    className='form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 '
                  >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                  </select>
                  <Prices
                    contentClass='py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full'
                    price={parseFloat(price_sale ?? price)}
                  />
                </div>
              </div>

              <div className='hidden flex-1 sm:flex justify-end'>
                <Prices price={parseFloat(price_sale ?? price)} className='mt-0.5' />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumber className="relative z-10" item={product}/>
            </div>

            <span
              onClick={() => handleDelete(Number(item.product_item_id))}
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Remove</span>
            </span>
          </div>

        </div>
      </div>
    )
  }

  const checkVoucher = async () => {
    try {
      const response: any = await checkVoucherData(discount).unwrap()
      if (response.success) {
        const priceVoucher =
          response.type === 'percent'
            ? Number(getTotalPriceCart(carts.data)) * (response.value / 100)
            : Number(getTotalPriceCart(carts.data)) - response.value
        
        setVoucher({
          code : discount,
          apply: true,
          error: '',
          data: response
        })

      } else {
        
        setVoucher({
          apply: false,
          error: response.message,
          data: {}
        })
      }
    } catch (error) {
        const {data} = error
        
        setVoucher({
          apply: false,
          error: data.message,
          data: {}
        })
      popupError('Apply voucher error')
    }
  }

  const canceVouncher = () => {
    setDiscount('')
    setVoucher({
      apply: false,
      error: '',
      data: {}
    })
  }

  if(!carts || !carts.data || carts?.data?.length < 1){
    return (
      <Result
        icon={<CartEmptyAnimationIcon width="200px" height="200px" />}
        title="Giỏ hàng trống"
        extra={
          <Link to="/"><Button type="primary" key="console" className=" bg-black !rounded-[20px]">
            Quay về trang chủ
          </Button> </Link>
        }
      />
    )
  }

  const initialValues: FormValues = {
    receiver_name: user.username ?? '',
    receiver_phone: user.phone ?? '',
    receiver_email: user.email ?? '',
    receiver_city: user.city ?? null,
    receiver_district: user.district ?? null,
    receiver_ward: user.ward ?? null,
    receiver_address: user.address ?? '',
    discount_code: discount,
    note: '',
    payment_method: 'vnpay'
  }

  return (
    <div className='nc-CheckoutPage'>
      <Helmet>
        <title>Checkout || Ciseco Ecommerce Template</title>
      </Helmet>
    <Form
      onFinish={onFinish}
      form={form}
      initialValues={initialValues}
    >
      <main className='container py-16 lg:pb-28 lg:pt-20 '>
        <div className='mb-16'>
          <h2 className='block text-2xl sm:text-3xl lg:text-4xl font-semibold '>Checkout</h2>
          <div className='block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400'>
            <Link to={'/'} className=''>
              Trang chủ
            </Link>
            <span className='text-xs mx-1 sm:mx-1.5'>/</span>
            <Link to={'/cart'} className=''>
              Giỏ hàng
            </Link>
            <span className='text-xs mx-1 sm:mx-1.5'>/</span>
            <span className='underline'>Checkout</span>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <div className='space-y-8'>
              <div id="ContactInfo" className="scroll-mt-24">
                <ContactInfo
                  isActive={tabActive === "ContactInfo"}
                  onOpenActive={() => {
                    setTabActive("ContactInfo");
                    handleScrollToEl("ContactInfo");
                  }}
                  onCloseActive={() => {
                    setTabActive("ShippingAddress");
                    handleScrollToEl("ShippingAddress");
                  }}
                />
              </div>

              <div id='ShippingAddress' className='scroll-mt-24'>
                <ShippingAddress
                  isActive={tabActive === 'ShippingAddress'}
                  onOpenActive={() => {
                    setTabActive('ShippingAddress')
                    handleScrollToEl('ShippingAddress')
                  }}
                  onCloseActive={() => {
                    setTabActive('PaymentMethod')
                    handleScrollToEl('PaymentMethod')
                  }}
                  onFinish={onFinish}
                  form={form}
                />
              </div>

             <div id="PaymentMethod" className="scroll-mt-24">
                <PaymentMethod
                  isActive={tabActive === "PaymentMethod"}
                  onOpenActive={() => {
                    setTabActive("PaymentMethod");
                    handleScrollToEl("PaymentMethod");
                  }}
                  onCloseActive={() => setTabActive("PaymentMethod")}
                  form={form}
                />
              </div>
            </div>
          </div>

          <div className='flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 '></div>

          <div className='w-full lg:w-[36%] '>
            <h3 className='text-lg font-semibold'>Tổng quan đơn hàng</h3>
            <div className='mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 '>
              {carts?.data.map(renderProduct)}
            </div>

            <div className='mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 '>
              <div>
                <Label className='text-sm'>Mã giảm giá</Label>
                <div className='flex mt-1.5 mb-1'>
                  
                  {
                    dataVoucher.apply
                    ?
                    <>
                      <Input
                      sizeClass='h-10 px-4 py-3'
                      value={discount}
                      className='flex-1'
                      onChange={(e) => setDiscount(e.target.value)}
                      disabled
                      />
                      <button
                      type='button'
                      onClick={() => canceVouncher()}
                      className='text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors'
                      >
                        hủy
                      </button>
                      
                    </>
                    :
                    <>
                      <Input
                      value={discount}
                      sizeClass='h-10 px-4 py-3'
                      className='flex-1'
                      onChange={(e) => setDiscount(e.target.value)}
                      />
                      <button
                      type='button'
                      onClick={() => checkVoucher()}
                      className='text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors'
                      >
                        Áp dụng
                      </button>
                    </>
                  }

                  
                </div>

                {Boolean(dataVoucher.error) && <span className='text-red-500'>* {dataVoucher.error}</span>}
              </div>

              {/* {Boolean(dataVoucher.apply) && (
                <div>
                  <div className=' flex justify-between py-2.5'>
                    <span>Tên mã giảm giá</span>
                    <span className='font-semibold text-green-600'>{dataVoucher.data.name}</span>
                  </div>
                  <div className=' flex justify-between py-2.5'>
                    <span>Loại</span>
                    <span className='font-semibold text-red-500 '>
                      {dataVoucher.data.code === 'percent' && 'Giảm giá theo %'}
                      {dataVoucher.data.type === 'number' && 'Giảm giá theo đơn giá'}
                      {dataVoucher.data.type === 'free_ship' && 'Giảm giá theo Free ship'}
                    </span>
                  </div>

                  <div className=' flex justify-between py-2.5'>
                    <span>Giá</span>
                    <span className='font-semibold text-red-500 text-[23px]'>
                      {dataVoucher.data.type === 'percent' ? `${dataVoucher.data.value}%` : VND(dataVoucher.data.value)}
                    </span>
                  </div>
                </div>
              )} */}

              <div className='mt-4 flex justify-between py-2.5'>
                <span>Tạm tính</span>
                <span className='font-semibold text-slate-900 dark:text-slate-200'>
                  {carts && VND(getTotalPriceCart(carts.data))}
                </span>
              </div>
              {
              dataVoucher.apply
              ?
              <div className='flex justify-between py-2.5'>
                <span>Áp dụng khuyến mãi</span>
                <span className='font-semibold text-slate-900 dark:text-slate-200'>{VND(dataVoucher.data.discount)}</span>
              </div>
              :
              ''
              }
              <div className='flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4'>
                <span>Tổng tiền đơn hàng</span>

               {carts && <span> {VND(getTotalPriceCart(carts?.data) - (dataVoucher.apply ? dataVoucher.data.discount : 0))}</span>}
              </div>
            </div>
            <ButtonPrimary loading={isLoadingOrder || loadingMomo || loadingStripe || loadingVnPay} className='mt-8 w-full'>
              Xác nhận
            </ButtonPrimary>
            <div className='mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center'>
              <p className='block relative pl-5'>
                <svg className='w-4 h-4 absolute -left-1 top-0.5' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 8V13'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.9945 16H12.0035'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Tìm hiểu thêm{` `}
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='##'
                  className='text-slate-900 dark:text-slate-200 underline font-medium'
                >
                  Thuế
                </a>
                <span>
                  {` `}và{` `}
                </span>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='##'
                  className='text-slate-900 dark:text-slate-200 underline font-medium'
                >
                  thông tin vận chuyển
                </a>
                {` `} 
              </p>
            </div>
          </div>
        </div>
      </main>
    </Form>
      
      
    </div>
  )
}

export default CheckoutPage