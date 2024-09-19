import type { TableProps } from 'antd'
import { Button, Flex, Input, Popconfirm, Space, Table, Tag, Typography, message } from 'antd'
import { Link } from 'react-router-dom'

import { IBanner } from '@/common/types/banner.interface'

import { useGetBannersQuery, useDeleteBannerMutation } from '../BannerEndpoints'
import { popupSuccess } from '@/page/[role]/shared/Toast'

export default function ListBanner() {
  const { data: banners, isLoading } = useGetBannersQuery({});
  const [deleteBanner, { isLoading: isLoadingDeleteBanner }] = useDeleteBannerMutation();
  const handlerRemoveBanner = async (value: IBanner) => {

    try {
      await deleteBanner(value.id).unwrap();
      popupSuccess('Delete banner success');

    } catch (error) {
      popupSuccess('Delete banner error');
    }
  }





  const columns: TableProps<IBanner>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'image_title',
      key: 'image_title',
      align: 'center',
      width: 160,
      render: (text) => <a>{text}</a>
    },

    {
      title: 'Ảnh',
      dataIndex: 'image_url',
      key: 'image_url',
      align: 'center',
      width: 100,
      render: (img) => <img src={img || ''} className='mx-auto w-16' alt='' />
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      dataIndex: 'is_active',
      width: 100,
      render: (_, { is_active }) => (
        <>
          <Tag color={is_active == 1 ? 'green' : 'red'} >
            {is_active == 1 ? 'Đang hoạt động' : 'không hoạt động'}
          </Tag>
        </>
      )

    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (record) => (
        <Space size={'middle'}>
          <Link to={'' + record?.id}>
            <Button type='primary'>Edit</Button>
          </Link>
          <Popconfirm

            placement='topRight'
            title='Are you sure delete this banner?'
            onConfirm={() => handlerRemoveBanner(record)}
            onCancel={() => { }}
            okText='Đồng ý'
            cancelText='Hủy bỏ'
          >
            <Button loading={isLoadingDeleteBanner} type='primary' danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const newData = banners?.map((banner: IBanner, index: number) => ({
    ...banner,
    key: index + 1
  }))

  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title editable level={2} style={{ margin: 0 }}>
          Danh sách banner
        </Typography.Title>

      </div>

      <Table

        columns={columns}
        size='middle'
        scroll={{ x: 1000, y: 500 }}
        sticky={{ offsetHeader: 0 }}
        dataSource={newData}
        loading={isLoading}
      />

      <Flex className='mt-3' wrap='wrap' gap='small'>
        <Link to='add'>
          <Button type='primary'>Thêm Banner</Button>
        </Link>
      </Flex>
    </>
  )
}
