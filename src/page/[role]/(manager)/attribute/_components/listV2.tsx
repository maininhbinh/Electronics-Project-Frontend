import { Flex, Popconfirm  } from "antd";
import { Button } from 'antd';
import { Typography } from 'antd';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useDeleteAttributeMutation, useGetAttributesQuery, useUpdateAttributeMutation } from "./attribute/AttributeEndpoints";
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { IAttribute } from "@/common/types/attribute.interface";
import { Link } from "react-router-dom";
import EditAttributeV2 from "./attribute/editV2";
import { useState } from "react";

export default function ListAttributeV2() {

  const { data, isLoading, refetch} = useGetAttributesQuery({});
  const [deleteAttribute, { isLoading: isLoadingDeleteAttribute }] = useDeleteAttributeMutation();
  const [updateAttribute, { isLoading : loadingUpdateAttribute }] = useUpdateAttributeMutation();
  const [formValuesUpdate, setFormValuesUpdate] = useState<IAttribute>({
     name : '',
     detail_id : ""
  });
  const [open, setOpen] = useState(false);


  const confirm = async (id: number | string) => {
    try {
      await deleteAttribute(id).unwrap();
      popupSuccess('Delete attribute success');
    } catch (error) {
      popupError('Delete attribute error');
    }
  };

  const columns: TableProps<IAttribute>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IAttribute, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên thuộc tính',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, item: IAttribute) => {
        return item.name;
      },
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Button onClick={()=>handleUpdatePopup({id: record.id, name : record.name, detail_id : record.detail_id})} type="primary" >
            Sửa
          </Button>
          <Popconfirm
                    disabled={isLoadingDeleteAttribute}
                    title="Delete the user"
                    description={`Are you sure to delete "${record.name}" ?`}
                    onConfirm={() => confirm(String(record.id))}
                    okText="Yes"
                    cancelText="No">
                    <Button danger loading={isLoadingDeleteAttribute} >Xóa</Button>
                  </Popconfirm>
        </Flex>
      ),
    },
  ];

  const dataItem = data?.map((item : IAttribute, key : number) => {
    return {
      ...item,
      key : key
    }
  })
 
  const handleUpdatePopup = (data : IAttribute) => {
    setFormValuesUpdate(data);
    setOpen(true)
  }

  const onUpdate = async (values: IAttribute) => {
    const payload = {
      ...values,
      id : formValuesUpdate.id,
      detail_id: `${values['detail_id']}`
    }
    try {
      await updateAttribute(payload);
      refetch();
      setOpen(false);
      popupSuccess(`Update attribute ${values.name} success`);
    } catch (error) {
      setOpen(false);
      popupError(`Update attribute ${values.name} error`)
    }
  };

  return <>
    <Typography.Title editable level={2} style={{ margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        Danh sách thuộc tính <Flex wrap="wrap" gap="small">
         
         <Link to="add">  <Button type="primary" danger >
            Thêm thuộc tính
          </Button></Link>
         
        </Flex>
      </div>

    </Typography.Title>

    <EditAttributeV2 
         loadingUpdate={loadingUpdateAttribute}
         open={open}
         onCreate={onUpdate}
         onCancel={() => setOpen(false)}
         initialValues={formValuesUpdate}
         
    />

    <Table columns={columns} dataSource={dataItem} loading={isLoading} />
  </>
}