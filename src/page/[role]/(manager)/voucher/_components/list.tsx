
import { Table, Typography } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';

import ModalCreateVoucher from './add';
import useVoucher from '../utils/brand.hooks';
import { IVoucher } from '@/common/types/voucher.interface copy';
import ConfirmModal from '@/page/[role]/(base)/brand/confirm.modal';
import { useGetVouchersQuery } from '../VoucherEndpoint';
import { VND } from '@/utils/formatVietNamCurrency';



export default function ListVoucher() {
  const {data: dataItem, isLoading } = useGetVouchersQuery({});
  const listVoucers = dataItem?.data.map((item : any, key : number) => {
    return {
      ...item,
      key : key
    }
  })
  const hooks = useVoucher();
  const columns: TableProps<IVoucher>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IVoucher, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: (_: any, item: IVoucher) => {
        return item.code;
      },
    },
    {
      title: 'Tên mã giảm giá',
      render: (_: any, item: IVoucher) => {
        return item.name;
      },
    },
    {
      title: 'Số tiền chiết khấu ',
    
      render: (_: any, item: any) => {
        return item.type == 'percent' ? `${item.value}%` : VND(item.value);
      },
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'tart_date',
      render: (_: any, item: IVoucher) => {
        // print(item.create_at);
        return <>
          <p>{item.start_date}</p>
        </>
          ;
      },
    },

    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (_: any, item: IVoucher) => {
        // print(item.create_at);
        return <>
          <p>{item.end_date}</p>
        </>
          ;
      },
    },


    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Button type="primary" onClick={() => hooks.onEditVoucher(record)}  >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => hooks.onShowDeletePopup(record)}>
            Delete
          </Button>
        </Flex>
      ),
    },
  ];


  return <>
    <div className='flex items-center justify-between mb-10'>
      <h2 className='font-bold text-[24px]'>
        Danh sách mã giảm giá
      </h2>
    </div>

    <Table columns={columns} dataSource={listVoucers} loading={isLoading} />



    <ConfirmModal
      handleCancel={hooks.onHideConfirmPopup}
      handleOk={hooks.handleOkPopup}
      visible={hooks.modalParams.visible}
      title={hooks.modalParams.title}
      content={hooks.modalParams.content}
    />


    <ModalCreateVoucher
      form={hooks.form}
      isEdit={hooks.Index}
      onCancelModalCreate={hooks.onCancelModalDetail}
      onSubmit={hooks.onSubmit}
      visible={hooks.visibleModalVoucherDetail}
    />
  </>
}