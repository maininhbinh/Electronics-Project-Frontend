
import { Popconfirm, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { Iuser } from '../../../../../common/types/user.interface';
import { useGetUsersQuery } from '../UsersEndpoints';
import HandleLoading from '../../components/util/HandleLoading';
import { useDeleteUserMutation } from '../UsersEndpoints';
import { useState } from 'react';

import useQuerySearch from '../../hooks/useQuerySearch';
import { getColumnSearchProps } from '../../components/util/SortHandle';
import { popupSuccess } from '@/page/[role]/shared/Toast'
export default function ListUser() {


  const { searchText, setSearchText, setSearchedColumn, searchedColumn, searchInput, handleSearch, handleReset } = useQuerySearch();


  const [id, setId] = useState<number | string>();
  const [deleteUser, { isLoading: isDeleting },] = useDeleteUserMutation();

  const confirm = async (id: number | string) => {
    setId(id)
    await deleteUser(id);
    popupSuccess('Delete user success');
  };


  const {
    data,
    isLoading,
    isError
  } = useGetUsersQuery({});

  const dataItem = data?.data?.map((item: Iuser, key: number) => {
    return {
      ...item,
      key: key
    }
  })

  const columns: TableProps<Iuser>['columns'] = [
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
      showSorterTooltip: { target: 'full-header' },
      render: (text) => <a>{text}</a>,
      onFilter: (value: any, record: any) => record.username.indexOf(value as string) === 0,
      sorter: (a: any, b: any) => a.username.length - b.username.length,
      sortDirections: ['descend'],
      ...getColumnSearchProps(
        'username',
        handleSearch,
        handleReset,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps(
        'email',
        handleSearch,
        handleReset,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn,
        searchInput
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="" width={110} />
    },
    {
      title: 'Vai trò',
      key: 'role_id',
      dataIndex: 'role_id',
      render: (_, { role_id }) => (
        <>
          <Tag color={role_id == '1' ? 'geekblue' : 'green'} >
            {role_id == '1' ? 'Admin' : 'Guest'}
          </Tag>
        </>
      ),
      filters: [
        {
          text: 'Admin',
          value: '1',
        },
        {
          text: 'Guest',
          value: '2',
        },
      ],
      onFilter: (value, record) => record.role_id.startsWith(value as string),
      filterSearch: true,
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      dataIndex: 'is_active',
      render: (_, { is_active }) => (
        <>
          <Tag color={is_active == 1 ? 'green' : 'red'} >
            {is_active == 1 ? 'Đang hoạt động' : 'Không hoạt động'}
          </Tag>
        </>
      )

    },
    {
      title: 'Hành động ',
      key: 'action',
      render: (data: Iuser) => (
        <Flex wrap="wrap" gap="small">

          <Link to={String(data?.id)}>   <Button type="primary"  >
            Edit
          </Button> </Link>
          <Popconfirm
            disabled={isDeleting}
            title="Delete the user"
            description={`Are you sure to delete "${data.username}" ?`}
            onConfirm={() => confirm(String(data.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={isDeleting && data.id == id} >Delete</Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];


  return <>

    <HandleLoading isLoading={isLoading} isError={isError}>
    <div className='flex items-center justify-between mb-10'>
      <h2 className='font-bold text-[24px]'>
        Danh sách người dùng
      </h2>
    </div>
      <Table columns={columns} dataSource={dataItem} />

      <Flex wrap="wrap" gap="small">
        <Link to="add">    <Button type="primary" danger>
          Thêm người dùng
        </Button> </Link>


      </Flex>
    </HandleLoading>

  </>
}