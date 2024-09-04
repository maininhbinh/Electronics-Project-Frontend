import { VND } from "@/utils/formatVietNamCurrency";
import { Badge, Button, Card, Col, Flex, Row, Table, Tag } from "antd";
import { TableProps } from "antd";
import {
    HourglassOutlined,
    DownloadOutlined
  } from '@ant-design/icons';
import { exportToWord } from "@/utils/exportBillOrder";
import { useChangeStatusOrderMutation, useGetOrderQuery } from "@/services/OrderEndPoints";
import { useParams } from "react-router-dom";
import { formatTimestamp } from "@/utils/formatDate";
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import HandleAnimationIcon from "@/page/[role]/components/icon/OrderIcon/Handle";
import PrepareSuccessAnimationIcon from "@/page/[role]/components/icon/OrderIcon/PrepareSuccess";
import DeliverAnimationIcon from "@/page/[role]/components/icon/OrderIcon/DeliverSuccess";
import PrepareAnimationIcon from "@/page/[role]/components/icon/OrderIcon/Prepare";
import DoneOrderAnimationIcon from "@/page/[role]/components/icon/OrderIcon/DoneOrder";
import OrderCancelAnimationIcon from "@/page/[role]/components/icon/OrderIcon/OrderCancel";
import DeliveringAnimationIcon from "@/page/[role]/components/icon/OrderIcon/Delivering";
import PickupAnimationIcon from "@/page/[role]/components/icon/OrderIcon/PickUp";
export default function EditOrder(){
  const orderIcon = [
    <HandleAnimationIcon width={60} height={60} />,
    <PrepareAnimationIcon width={60} height={60}/>,
    <PrepareSuccessAnimationIcon width={60} height={60}/>,
    <PickupAnimationIcon  width={60} height={60} />,
    <DeliveringAnimationIcon  width={60} height={60}  />,
    <DeliverAnimationIcon width={60} height={60}  />,
    <DoneOrderAnimationIcon width={60} height={60}  />,
    <OrderCancelAnimationIcon width={60} height={60}  />,
  ]
  const [changeStatus, {isLoading : isLoadingChangeStatus}] = useChangeStatusOrderMutation();
  const params = useParams();
  const {data, refetch} = useGetOrderQuery(params.id);
  const dataItem = data?.order_detail;
  const dataOrderStatus = data?.order_status;
  

  const dataOrderDetail = data?.order_detail.order_details?.map((item: any, index: number) => ({
    ...item,
    key: item.id
  }))

  const getDateHistoreOrder = (status : string) => {
    
    for (const item of dataItem?.histories) {
       if(item.status_name === status){
        return formatTimestamp(item.created_at);
       }
       
    }
    return false;
  }

    const handleExportBill = async  () => {
        await exportToWord([
            {
              key: '1',
              item: 'Product A',
              quantity: 2,
              price: 50,
            },
            {
              key: '2',
              item: 'Product B',
              quantity: 1,
              price: 30,
            },
          ])
    }
    const columns: TableProps<any>['columns'] = [
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          key: 'name',
         
        },
        {
          title: 'Image',
          width: 160,
          render: (data) => (
            <div className=' rounded-md w-[40px] h-[40px] overflow-hidden ' style={{boxShadow: 'rgba(1, 1, 1, 0.06) 1rem 1.25rem 1.6875rem 1rem'}}>
              <img src={data.image ? data.image : data.thumbnail} alt="" width={110} className=' object-cover object-center'/>
            </div>
          )
        },
        {
          title: 'Biến thể',
          align: 'center',
          width: 160,
          render: (text) =>{
            return  <a>
            {text?.varians[0]?.name}
            {text?.varians[1] && ` | ${text?.varians[1].name}`}
          </a>
          }
        },

        {
            title: 'Số lượng',
            align: 'center',
            dataIndex: 'quantity',
          key: 'quantity',
            width: 160,
            render: (text) => (
              <a>
                {text}
              </a>
            )
          },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            width: 160,
            render: (text) => (
              <a>
                {VND(text)}
              </a>
            )
          },
        {
          title: 'Tổng tiền',
          align: 'center',
          width: 160,
          render: (data) => <>{VND(data.quantity * Number(data.price))}</>
        },
       
      ]
      const changeStatusOrder = async (status : number) => {
       
        const payload = {
          id : params.id,
          status: status
        }
        try {
          await changeStatus(payload).unwrap();
          popupSuccess('Cập nhật trạng thái đơn hàng thành công')
        } catch (error) {
          popupError('Cập nhật trạng thái đơn hàng thất bại');
        }
      }

    const handleDisableButton = (statusCurrent: number) => {
      if(dataItem?.order_status?.id === 8 || (statusCurrent === 8 && dataItem?.order_status?.id === 7)) return true;
      if(dataItem?.order_status?.id === 3 && statusCurrent === 7) return false;
      if(statusCurrent === 8 && dataItem?.order_status?.id === 1) return false;
       if(dataItem?.order_status?.id + 1 === statusCurrent) return false;
       return true;
    }
    return (
    <>
      <div className="w-full flex justify-end mb-4">
        <Button onClick={() => handleExportBill()} className="bg-black" type="primary" shape="round" icon={<DownloadOutlined />} size={'small'}>
          Xuất hóa đơn
        </Button>
      </div>
      <Row gutter={[24,32]}>
      <Col span={24}>
          <Card title="Giao hàng" bordered={false}>
            <Flex justify="space-around" align="center" gap={10}>
                {dataOrderStatus?.map((item: any, key: number) => (
                  <div className="relative flex space-x-3 flex-col items-center justify-center gap-5 h-full">
                    <div className="h-[50px] w-[50px] rounded-full bg-green-300 flex items-center justify-center ring-8 ring-white">
                      {orderIcon[key]}
                    </div>
                    <div className="text-sm text-gray-500 w-[130px] text-center"> {item?.name}</div>
                    <Button onClick={() => changeStatusOrder(item.id)} disabled={Boolean(getDateHistoreOrder(item.name)) || handleDisableButton(item.id)} type="primary">{Boolean(getDateHistoreOrder(item.name)) && 'Đã'} Xác nhận</Button>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <span> {getDateHistoreOrder(item.name)}</span>
                    </div>
                  </div>
                ))}
            </Flex>    
          </Card>
        </Col>
        <Col span={24}>
          <Card className='h-full' title="Thông tin đơn hàng" bordered={false}  extra={<> <Badge color="green" text={dataItem?.order_status?.status} /></>}>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Tên: </b>
                  <span className="">{dataItem?.receiver_name}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Email: </b>
                  <span className="">{dataItem?.receiver_email}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Số điện thoại: </b>
                  <span className="">{dataItem?.receiver_phone}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Địa chỉ: </b>
                  <span className="">{dataItem?.receiver_address}-{dataItem?.receiver_ward}-{dataItem?.receiver_district}-{dataItem?.receiver_pronvinces}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Mã đơn hàng : </b>
                  <span className="">{dataItem?.code}</span>
              </div>

              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Ngày giờ tạo : </b>
                  <span className="">{formatTimestamp(dataItem?.created_at)}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Trạng thái : </b>
                  <span className="">     <Tag color="#87d068">{dataItem?.order_status?.status}</Tag></span>
              </div>
          </Card>
        </Col>

        <Col className="mb-5 rounded-xl" span={24} 
        >
          <Card>
          <div className='lable font-bold text-[17px] text-[#344767] my-5'>Danh sách sản phẩm đặt hàng</div>
          <Table
            pagination={false}
            columns={columns}
            dataSource={dataOrderDetail}
            loading={false}
          />
          </Card>
        </Col>
        <Col span={24}>
          <Card className='h-full' title="Thanh toán" bordered={false} extra={<> <Tag color="#f50">{dataItem?.payment_status}</Tag></>}>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Tổng tiền sản phẩm : </b>
                  <span className="">{VND(dataItem?.total_price)}</span>
              </div>

              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Giảm giá : </b>
                  <span className="">{VND(Number(dataItem?.total_price) - Number(dataItem?.discount_price))}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Kiểu thanh toán : </b>
                  <span className="">{dataItem?.payment_methods}</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="">Phí vận chuyển : </b>
                  <span className="">0đ</span>
              </div>
              <div className="flex justify-between border-solid border-b-[1px] border-b-[#eee] py-4">
                  <b className="text-[19px]">Tổng cộng : </b>
                  <b className="text-[19px] text-red-500">{ VND(Number(dataItem?.discount_price))}</b>
              </div>
          </Card>
        </Col>
        
      </Row>
    </>
)
}