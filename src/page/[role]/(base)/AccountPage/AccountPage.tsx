import Label from "../components/Label/Label";
import { FC, useEffect, useRef, useState } from "react";
import Input from '../shared/Input/Input'
import { Col, Flex, Form, Grid, Row, Select, Upload } from 'antd'
import { Helmet } from "react-helmet-async";
import type { SelectProps } from 'antd';
import { useNavigate } from "react-router-dom";
import { useGetProvincesQuery, useLazyGetDistrictsQuery, useLazyGetWardsQuery } from "@/utils/addressRTKQuery";
import { popupError, popupSuccess } from "../../shared/Toast";
import { Iuser } from "@/common/types/user.interface";
import { useChangePasswordMutation, useGetUserQuery, useUpdateUserMutation } from "../../(manager)/user/UsersEndpoints";
import PermMediaRoundedIcon from '@mui/icons-material/PermMediaRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ButtonSecondary from "../shared/Button/ButtonSecondary";
import { useAppDispatch } from "@/app/hooks";
import { setLoading } from "@/app/webSlice";

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {

  const user = JSON.parse(String(localStorage.getItem('user')));
  const { data: dataItem, isLoading: dataLoading } = useGetUserQuery(user?.id);
  const dispatch = useAppDispatch()

  const [updateUser, { isLoading: loadingUpdateUser }] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation()
  const [form] = Form.useForm();
  const [formChangePass] = Form.useForm();
  const [DisplayPic, setDisplayPic] = useState<string>();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("")
  const [optionsWard, setOptionWard] = useState<SelectProps['options']>([])
  const [optionsDistrict, setOptionDistrict] = useState<SelectProps['options']>([])
  const [getWard, { data: dataWards, isLoading: wardLoading }] = useLazyGetWardsQuery()

  useEffect(() => {
    if (dataItem?.data) {
      localStorage.removeItem('user')
      localStorage.setItem('user', JSON.stringify(dataItem.data));
      const initialValues = {
        username: dataItem?.data?.username ?? '',
        phone: dataItem?.data?.phone ?? '',
        email: dataItem?.data?.email ?? '',
        city: dataItem?.data?.city ?? null,
        district: dataItem?.data?.district ?? null,
        ward: dataItem?.data?.ward ?? null,
        address: dataItem?.data?.address ?? '',
      }

      setDisplayPic(dataItem?.data?.image)

      form.setFieldsValue(initialValues)
    }
  }, [dataItem])

  const selectedImg = (e: any) => {

    const types = [
      'jpeg',
      'png',
      'jpg',
      'gif',
    ]

    const fileSelected = e.target.files[0];
    const size = fileSelected.size;
    const type = types.includes(fileSelected.type.replace('image/', ''));

    if (size <= 1048576 && type) {
      setImageUrl(fileSelected);
      setDisplayPic(URL.createObjectURL(fileSelected));
    }

  }

  const onFinishPass = async (values: Iuser | any) => {
    const pass = {
      password: values.password,
      new_password: values.new_password,
      confirm_password: values.confirm_password
    }

    try {
      const payload = {
        id: user.id,
        data: pass
      }
      dispatch(setLoading(true))
      await changePassword(payload).unwrap();
      dispatch(setLoading(false))
      popupSuccess('Cập nhật thành công');
      handleCancel();
    } catch (error) {
      popupError('Cập nhật thất bại');
      dispatch(setLoading(false))
    }

  }

  const onFinish = async (values: Iuser | any) => {
    const formData = new FormData()
    if (imageUrl) {
      formData.append('image', imageUrl)
    }
    formData.append('username', values.username)
    formData.append('email', values.email)
    formData.append('city', values.city)
    formData.append('district', values.district)
    formData.append('ward', values.ward)
    formData.append('address', values.address)
    formData.append('phone', values.phone)

    try {
      const payload = {
        id: user.id,
        data: formData
      }
      dispatch(setLoading(true))

      const data = await updateUser(payload).unwrap();
      dispatch(setLoading(false))

      if (data && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
      popupSuccess('Update user success');
      handleCancel();
    } catch (error) {
      popupError('Update user error');
      dispatch(setLoading(false))
    }

  }

  const [getDistrict, { data: dataDistricts, isLoading: districtLoading }] = useLazyGetDistrictsQuery();

  useEffect(() => {
    setOptionDistrict(() => {
      return dataDistricts?.data.map((item: { id: number; name: string }) => {
        return {
          value: `${item.name}-${item.id}`,
          label: item.name
        }
      })
    })
    setOptionWard(() => {
      return dataWards?.data.map((item: { id: number; name: string }) => {
        return {
          value: `${item.name}`,
          label: item.name
        }
      })
    })
  }, [dataDistricts, dataWards])


  const options: SelectProps['options'] = [];

  const {
    data: provinces,
    isLoading,
    isError
  } = useGetProvincesQuery({});

  const initialValuesChangePass = {
    password: '',
    new_password: '',
    confirm_password: '',
  }

  const initialValues = {
    username: dataItem?.data?.username ?? '',
    phone: dataItem?.data?.phone ?? '',
    email: dataItem?.data?.email ?? '',
    city: dataItem?.data?.city ?? null,
    district: dataItem?.data?.district ?? null,
    ward: dataItem?.data?.ward ?? null,
    address: dataItem?.data?.address ?? '',
  }


  provinces?.data.forEach((item: { id: number, name: string }) => {
    options.push({
      value: `${item.name}-${item.id}`,
      label: item.name
    })
  });

  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }

  const onChangeCity = async (value: string) => {
    form.resetFields(['district', 'ward']);
    setOptionWard([])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const provinceId = splitStr[1]

      await getDistrict(provinceId)
    } else {
      setOptionDistrict([])
    }
  }

  const onChangeDistrict = async (value: any) => {
    form.resetFields(['ward'])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const districtId = splitStr[1]

      await getWard(districtId)
    } else {
      setOptionWard([])
    }
  }

  // if(isLoading || dataLoading) return <LoadingUser />
  // if(isError) return <ErrorLoad />
  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Account || Ciseco ecommerce React Template</title>
      </Helmet>
      {/* HEADING */}

      <Row gutter={[32, 32]}>
        <Col span={10}>
          {/* AVATAR */}
          <div className='border border-slate-200 dark:border-slate-700 rounded-xl h-full'>
            <div className='p-6 flex flex-col sm:flex-row items-start'>
              <span className='hidden sm:block'>
                <svg
                  className='w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.14008 6.75L5.34009 8.55L7.14008 10.35'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16.8601 6.75L18.6601 8.55L16.8601 10.35'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>

              <div className='sm:ml-8'>
                <h3 className=' text-slate-700 dark:text-slate-300 flex '>
                  <span className='uppercase'>Ảnh đại diện</span>
                  <svg
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2.5'
                    stroke='currentColor'
                    className='w-5 h-5 ml-3 text-slate-900 dark:text-slate-100'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                  </svg>
                </h3>
              </div>
            </div>
            <div
              className={`border-t border-slate-200 dark:border-slate-700 px-[60px] py-10 `}
            >
              <div style={{ height: '11vw', boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)' }} className='border-none rounded-xl relative' >
                {
                  DisplayPic
                    ?
                    <div style={{ height: '100%', maxWidth: '100%', overflow: 'hidden' }} className='relative group border-none rounded-xl'>
                      <img src={DisplayPic} alt="" className='object-cover h-[100%] object-center' style={{ width: '100%' }} />
                    </div>
                    :
                    <Flex className='relative rounded-xl' vertical gap={10} justify='center' align='center' style={{ maxWidth: '100%', height: "100%", borderRadius: '12px', overflow: 'hidden' }}>
                      <Flex vertical gap={10} style={{ width: '100%' }}>
                        <Flex vertical align='center' justify='center'>
                          <PermMediaRoundedIcon style={{ fontSize: '60px', color: 'rgb(31 41 55 / var(--tw-text-opacity))' }} className='' />
                        </Flex>
                      </Flex>
                    </Flex>
                }

                <div className='w-[30px] h-[30px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' style={{ boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)' }} onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}>
                  <EditRoundedIcon style={{ fontSize: 20 }} />
                  <input ref={fileInputRef} type="file" accept="image/*" name="image" id="image" className='opacity-0'
                    style={{ display: 'none' }}
                    onChange={selectedImg}
                  />
                </div>
              </div>
              <Flex style={{ width: '100%' }} className='text-gray-800 mt-2' vertical justify='center' align='center'>
                <span style={{ fontSize: '11px' }}>
                  Kích thước tối đa: 50MB
                </span>
                <span style={{ fontSize: '11px' }}>
                  JPG, PNG, GIF, SVG
                </span>
              </Flex>
            </div>
          </div>
        </Col>
        <Col span={14}>
          <Form
            className="h-full"
            onFinish={onFinishPass}
            initialValues={initialValuesChangePass}
            form={formChangePass}
          >
            <div className='border border-slate-200 dark:border-slate-700 rounded-xl h-full'>
              <div className='p-6 flex flex-col sm:flex-row items-start'>
                <span className='hidden sm:block'>
                  <svg
                    className='w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M7.14008 6.75L5.34009 8.55L7.14008 10.35'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M16.8601 6.75L18.6601 8.55L16.8601 10.35'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>

                <div className='sm:ml-8'>
                  <h3 className=' text-slate-700 dark:text-slate-300 flex '>
                    <span className='uppercase'>Thay đổi mật khẩu</span>
                    <svg
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='2.5'
                      stroke='currentColor'
                      className='w-5 h-5 ml-3 text-slate-900 dark:text-slate-100'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                  </h3>
                </div>
                <ButtonSecondary
                  sizeClass='py-2 px-4 '
                  fontSize='text-sm font-medium'
                  className='bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg'
                  type={'submit'}
                >
                  Thay đổi
                </ButtonSecondary>
              </div>

              <div
                className={`border-t border-slate-200 dark:border-slate-700 px-10 py-7 `}
              >
                <div className="max-w-lg">
                  <Label className="text-sm">Mật khẩu</Label>
                  <Form.Item
                    name={'password'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền vào trường này'
                      }
                    ]}
                  >
                    <Input className="mt-1.5" type={"password"} placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </div>
                <div className="max-w-lg">
                  <Label className="text-sm">Mật khẩu mới</Label>
                  <Form.Item
                    name={'new_password'}
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(new Error('Mật khẩu phải không được để trống'));
                          }
                          if (value.length < 6) {
                            return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
                          }
                          if (!/[A-Z]/.test(value)) {
                            return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ hoa!'));
                          }
                          if (!/[a-z]/.test(value)) {
                            return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ thường!'));
                          }
                          if (!/[0-9]/.test(value)) {
                            return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một số!'));
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input className="mt-1.5" placeholder="Mật khẩu mới" type={"password"} />
                  </Form.Item>
                </div>
                <div className='max-w-lg'>
                  <Label className="text-sm">Xác nhận mật khẩu</Label>
                  <Form.Item
                    name='confirm_password'
                    dependencies={['new_password']}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền vào trường này'
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('new_password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp nhau!'));
                        },
                      }),
                    ]}
                  >
                    <Input placeholder='Xác nhận mật khẩu' className='mt-1.5' type='password' />
                  </Form.Item>
                </div>
                {/* ============ */}
              </div>
            </div>
          </Form>
        </Col>
        <Col span={24}>
          <Form
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <div className='border border-slate-200 dark:border-slate-700 rounded-xl '>
              <div className='p-6 flex flex-col sm:flex-row items-start'>
                <span className='hidden sm:block'>
                  <svg
                    className='w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M7.14008 6.75L5.34009 8.55L7.14008 10.35'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M16.8601 6.75L18.6601 8.55L16.8601 10.35'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>

                <div className='sm:ml-8'>
                  <h3 className=' text-slate-700 dark:text-slate-300 flex '>
                    <span className='uppercase'>Thống tin chi tiết</span>
                    <svg
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='2.5'
                      stroke='currentColor'
                      className='w-5 h-5 ml-3 text-slate-900 dark:text-slate-100'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                  </h3>
                </div>

                <ButtonSecondary
                  sizeClass='py-2 px-4 '
                  fontSize='text-sm font-medium'
                  className='bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg'
                  type={'submit'}
                >
                  Thay đổi
                </ButtonSecondary>
              </div>

              <div
                className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 `}
              >

                <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>
                  <div className='w-full'>
                    <Label className="text-sm">Email người dùng</Label>
                    <Form.Item name='email'>
                      <Input disabled className='mt-1.5' type='text' />
                    </Form.Item>
                  </div>
                </div>

                <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>
                  <div className='w-full'>
                    <Label className="text-sm">Tên người dùng</Label>
                    <Form.Item name='username'>
                      <Input placeholder='Nhập tên người dùng' className='mt-1.5' type='text' />
                    </Form.Item>
                  </div>
                </div>

                <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>
                  <div className='w-full'>
                    <Label className="text-sm">Số điện thoại</Label>
                    <Form.Item name='phone'>
                      <Input placeholder='Nhập số điện thoại người dùng' className='mt-1.5' type='text' />
                    </Form.Item>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3'>

                  <div>
                    <Label className="text-sm">Thành phố</Label>
                    <div className='app__select--input '>
                      <Form.Item name='city' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                        <Select
                          loading={isLoading}
                          placeholder='Lựa chọn thành phố'
                          options={options}
                          onChange={(value) => onChangeCity(value)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Quận / huyện</Label>
                    <div className="app__select--input">
                      <Form.Item name='district' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                        <Select
                          loading={districtLoading}
                          placeholder='Lựa chọn quận huyện'
                          options={optionsDistrict}
                          onChange={(value) => onChangeDistrict(value)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>

                  <div className='w-1/3'>
                    <Label className="text-sm">Xã / phường</Label>
                    <div className='app__select--input'>
                      <Form.Item name='ward' rules={[{ required: true, message: 'Vui lòng Nhập trường này' }]}>
                        <Select
                          loading={wardLoading}
                          options={optionsWard}
                          placeholder='Lựa chọn Xã phường'
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <Label className="text-sm">Địa chỉ chi tiết</Label>
                    <Form.Item name='address' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                      <Input className='mt-1.5' type='text' placeholder='Nhập địa chỉ chi tiết' />
                    </Form.Item>
                  </div>
                </div>
                {/* ============ */}
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AccountPage;