import { VND } from "../../../../utils/formatVietNamCurrency";
import { Badge, Button, Card, Col, Row, Table, Tag } from "antd";
import { TableProps } from "antd";
import {
    DownloadOutlined
  } from '@ant-design/icons';
import { exportToWord } from "../../../../utils/exportBillOrder";
import { useChangeStatusOrderMutation, useGetUserOrderDetailQuery } from "@/services/OrderEndPoints";
import { useParams } from "react-router-dom";
import { formatTimestamp } from "../../../../utils/formatDate";
import { popupError, popupSuccess } from "../../../[role]/shared/Toast";
import HandleAnimationIcon from "../../../[role]/components/icon/OrderIcon/Handle";
import PrepareSuccessAnimationIcon from "../../../[role]/components/icon/OrderIcon/PrepareSuccess";
import DeliverAnimationIcon from "../../../[role]/components/icon/OrderIcon/DeliverSuccess";
import PrepareAnimationIcon from "../../../[role]/components/icon/OrderIcon/Prepare";
import DoneOrderAnimationIcon from "../../../[role]/components/icon/OrderIcon/DoneOrder";
import OrderCancelAnimationIcon from "../../../[role]/components/icon/OrderIcon/OrderCancel";
import DeliveringAnimationIcon from "../../../[role]/components/icon/OrderIcon/Delivering";
import PickupAnimationIcon from "../../../[role]/components/icon/OrderIcon/PickUp";
import Prices from "../components/Prices";
import { formatDate } from "@/utils/convertCreatedLaravel";
import { useVnPaymentMutation } from "@/services/OrderEndPoints";

export default function DetailOrder(){
    
    const orderIcon = [
        <></>,
        <HandleAnimationIcon width={30} height={30} />,
        <PrepareAnimationIcon width={30} height={30}/>,
        <PrepareSuccessAnimationIcon width={30} height={30}/>,
        <PickupAnimationIcon  width={30} height={30} />,
        <DeliveringAnimationIcon  width={30} height={30}  />,
        <DeliverAnimationIcon width={30} height={30}  />,
        <DoneOrderAnimationIcon width={30} height={30}  />,
        <OrderCancelAnimationIcon width={30} height={30}  />,
    ]
    const [changeStatus, {isLoading : isLoadingChangeStatus}] = useChangeStatusOrderMutation();
    const params = useParams();
    const {data, refetch} = useGetUserOrderDetailQuery(params.id);
    const dataItem = data?.order_detail;

    const [vnPayment, {isLoading: loadingVnPay}] = useVnPaymentMutation();
    
    const renderProductItem = (product: any, index: number) => {
    const { image, thumbnail, name, price, quantity } = product;
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
                  {product?.varians[1] &&  <span>|&nbsp; {`${product?.varians[1].name}`}</span>}
                </div>
                </div>
                <Prices price={price} className="mt-0.5 ml-2"/>
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

    const renderOrder = (order) => {        
        const {order_details} = order
        return (
            <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
              {order_details.map(renderProductItem)}
            </div>
        );
    };

    const handelPayment = async (id: string) => {
        try {
            const responseVnPayment : any = await vnPayment(id).unwrap();
            // console.log(responseVnPayment);
            window.location.href = responseVnPayment.url;
            // window.open(responseVnPayment.data.data, "MoMoPayment", "width=600, height=800");
         } catch (error) {
            popupError('Lỗi thanh toán thông qua VNPay')
         }
    }

    if(!data){
        return null
    }
      console.log(dataItem);
      
    return (
        <>
        <Row gutter={16}>
            <div className="flex w-full justify-between mb-10">
                {dataItem.payment_status == 'Chờ thanh toán' && dataItem.payment_methods !== 'COD'
                ?
                <Button onClick={()=>{
                    handelPayment(dataItem.id)
                }}>Thanh toán ngay</Button>
                :
                ''
                }
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                    <span>{dataItem.code}</span>
                    <span className="mx-2">·</span>
                    <span className="text-primary-500">{dataItem.order_status.status}</span>
                    </p>
                </div>
            </div>
            
            <Col span={24}>
                <div className="mb-2">
                    <ul role="list" className="-mb-8 flex ">
                        {data?.order_detail.histories?.map((item: any, key: number) => (
                            <li key={key} className="flex-shrink flex-grow">
                                <div className="relative pb-8">
                                    <div className="relative flex space-x-3 flex-col justify-center items-center">
                                        <div  className="flex items-center justify-center w-[50px] h-full">
                                            <div className={`h-[40px] w-[40px] rounded-full  flex items-center justify-center ring-8 ring-white bg-green-400`}>
                                                {orderIcon[item.status_id]}
                                            </div>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 items-center">
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500 flex justify-center items-center flex-col">
                                                <span> {item.status_name}</span>
                                                <span> {formatTimestamp(item.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>    

                <hr/>
            </Col>

            <Col span={24} className="my-10">
                <div>
                    <h2 className="text-[20px]">Địa chỉ nhận hàng</h2>
                </div>
                <div className="flex flex-col text-gray-400">
                    <div className="">{dataItem?.receiver_name}</div>
                    <div className="">(84+) {dataItem?.receiver_phone}</div>
                    <div className="">{dataItem?.receiver_address}-{dataItem?.receiver_ward}-{dataItem?.receiver_district}-{dataItem?.receiver_pronvinces}</div>
                </div>

            </Col>
           
            <Col className="mb-5" span={24}>
                {renderOrder(dataItem)}
            </Col>

            <Col span={24} className=" border-t-[1px]">
                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">Tổng tiền sản phẩm : </span>
                    <span className=" p-3 w-[240px] flex justify-end">{VND(dataItem?.total_price)}</span>
                </div>

                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">Giảm giá : </span>
                    <span className=" px-3 w-[240px] flex justify-end items-center">{VND(Number(dataItem?.total_price) - Number(dataItem?.discount_price))}</span>
                </div>
                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">Kiểu thanh toán : </span>
                    <span className=" px-3 w-[240px] flex justify-end items-center">{dataItem?.payment_methods}</span>
                </div>
                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">trạng thái thanh toán : </span>
                    <span className=" px-3 w-[240px] flex justify-end items-center">{dataItem?.payment_status}</span>
                </div>
                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">Phí vận chuyển : </span>
                    <span className=" p-3 w-[240px] flex justify-end">0đ</span>
                </div>
                <div className="flex justify-end border-solid border-b-[1px] border-b-[#eee] ">
                    <span className="text-[12px] text-gray-500 border-r-[1px] p-3">Tổng cộng : </span>
                    <b className="text-[19px] text-red-500 p-3 w-[240px] flex justify-end">{ VND(Number(dataItem.total_price))}</b>
                </div>
            </Col>
        </Row>
        </>
    )
}