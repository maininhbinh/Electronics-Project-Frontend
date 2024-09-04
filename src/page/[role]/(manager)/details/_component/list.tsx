import { Flex, Popconfirm, TableProps } from "antd";
import { Button } from 'antd';
import { Typography } from 'antd';
import { Table } from 'antd';
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { Link } from "react-router-dom";
import { useDeleteDetailMutation, useGetDetailsQuery } from "./DetailsEndpoints";
import { IDetail } from "@/common/types/product.interface";

export default function ListDetail() {

  const { data, isLoading } = useGetDetailsQuery({});
  const [deleteDetail, { isLoading: isLoadingDeleteDetail }] = useDeleteDetailMutation();
  const confirm = async (id: number | string) => {
    try {
      await deleteDetail(id).unwrap();
      popupSuccess('Delete detail success');
    } catch (error) {
      popupError('Delete detail error');
    }
  };

  const columns: TableProps<IDetail>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IDetail, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên chi tiết',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, item: IDetail) => {
        return item.name;
      },
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={String(record.id)} ><Button type="primary" >
            Sửa
          </Button></Link>
          <Popconfirm
                    disabled={isLoadingDeleteDetail}
                    title="Delete the user"
                    description={`Are you sure to delete "${record.name}" ?`}
                    onConfirm={() => confirm(String(record.id))}
                    okText="Yes"
                    cancelText="No">
                    <Button danger loading={isLoadingDeleteDetail} >Xóa</Button>
                  </Popconfirm>
        </Flex>
      ),
    },
  ];

  const dataItem = data?.map((item : IDetail, key : number) => {
    return {
      ...item,
      key : key
    }
  })


  return <>
    <Typography.Title editable level={2} style={{ margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        Danh sách chi tiết <Flex wrap="wrap" gap="small">
         <Link to="add">  <Button type="primary" danger >
            Thêm chi tiết
          </Button></Link>
         
        </Flex>
      </div>

    </Typography.Title>

    <Table columns={columns} dataSource={dataItem} loading={isLoading} />
  </>
}