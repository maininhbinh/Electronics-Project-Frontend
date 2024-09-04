import type { TableProps } from 'antd'
import { Button, Card, Col, Flex, Input, Popconfirm, Row, Segmented, Select, Space, Table, Tag, Typography, message } from 'antd'
import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react'


import { IBanner } from '@/common/types/banner.interface'

import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { VND } from '@/utils/formatVietNamCurrency'
import { useGetOrderToDayQuery } from '@/services/OrderEndPoints'

export default function Overview() {

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { Title, Text } = Typography;  

    const {data : dataItem, isLoading : isLoadingOrders} = useGetOrderToDayQuery({})    
    
    const columns: TableProps<IBanner>['columns'] = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'sku',
            key: 'sku',
            width: 160,
            
        },
        {
            title: 'Khách hàng',
            dataIndex: 'receiver_name',
            key: 'receiver_name',
            width: 160,
        
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'receiver_phone',
            key: 'receiver_phone',
            width: 160,
            
        },
        {
            title: 'Srạng thái đơn hàng',
            dataIndex: 'order_status_name',
            key: 'order_status_name',
            width: 160,
            
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'payment_status_name',
            key: 'payment_status_name',
            width: 160,
            
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 160,
            render: (text) => <>{VND(text)}</>
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (record) => (
            <Space size={'middle'}>
                <Link to={'/admin/order/' + record?.id}>
                <Button type='primary'>Chi tiết</Button>
                </Link>
            </Space>
            )
        }
    ]

    const newData = dataItem?.data?.map((item: any, index: number) => ({
    ...item,
    key: item.id
    }))


    return (
        <Card bordered={false} className="criclebox h-full">
            <Flex vertical gap={20}>
            <Flex justify="space-between" className="flex-col md:flex-row md:align-items-center ">
                <h3 className="font-bold text-[20px] text-gray-500">
                    Đơn hàng hôm nay
                </h3>
            </Flex>
            <Row gutter={[24, 0]}>
                <Table
                style={{border: '2px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', height: '100%', width: '100%'}}
                columns={columns}
                dataSource={newData}
                loading={isLoadingOrders}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    total: columns.length,
                    onChange: (page, pageSize) => {
                      setCurrent(page);
                      setPageSize(pageSize);
                    },
                  }}
                />
            </Row>
            </Flex>
        </Card>
    )
}
