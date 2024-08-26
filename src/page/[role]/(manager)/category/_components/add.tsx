
import { useNavigate } from 'react-router-dom'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Flex, Form, Input, Modal, Button, Switch, Select, Drawer, Row, Col } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ButtonEdit from '../../shared/ButtonEdit/ButtonEdit';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../CategoryEndpoints';
import { ICategory } from '@/common/types/category.interface';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PermMediaRoundedIcon from '@mui/icons-material/PermMediaRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LexicalEditor from '@/components/TextEditor/LexicalEditor';
import getRandomNumber from '@/utils/randomNumber';
import Detail from './detail/Detail';
import { useGetDetailsQuery } from '@/app/endPoint/DetailEndPoint';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setLoading, setOpenModalLogin } from "@/app/webSlice";

interface Detail {
  id: string,
  name: string,
  attributes: {
    id: string,
    name: string
  }[]
}

export default function AddCategory() {
  const {data: listDetail, isLoading} = useGetDetailsQuery({})
  const [createCategory, { isLoading: isLoadingCreateCategory }] = useCreateCategoryMutation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState<File>();
  const [DisplayPic, setDisplayPic] = useState<string>();
  const [useDetails, setUseDetails] = useState([]);

  const [details, setDetails] = useState<Detail[]>([
    {
      id: `${Date.now()}${getRandomNumber()}`,
      name: '',
      attributes: []
    }
  ]);

  const handleRemoveDetail = (name) => {
    if (details.length > 1) {
      setDetails([
        ...details.filter((item, index) => item.id != name)
      ])
    }
  }

  const handleSetDetail = () => {
    setDetails([
      ...details,
      {
        id: Date.now() + '',
        name: '',
        attributes: []
      }
    ])
  }

  const handleSubmit = async (values) => {

    const name = form.getFieldValue('name');
    const active = form.getFieldValue('is_active');
    const parent_id = form.getFieldValue('parent_id');
    const detail = details.map((item) => {
      return {
        ...item,
        attributes: item.attributes.filter((field) => field.name)
      }
    });
    
    const formData = new FormData();

    formData.append('name', name);
    formData.append('is_active', active);
    formData.append('parent_id', parent_id);
    formData.append('detail', JSON.stringify(detail));
    if (imageUrl) {
      formData.append('image', imageUrl);
    }    

    try {
      dispatch(setLoading(true))
      await createCategory(formData).unwrap();
      dispatch(setLoading(false))
      popupSuccess('Add category success')
      navigate('..')

    } catch (error) {
      dispatch(setLoading(false))
      popupError('Add category error');
    }


  }

  const selectedImg = (e) => {

    const types = [
      'jpeg',
      'png',
      'jpg',
      'gif',
      'webp'
    ]

    const fileSelected = e.target.files[0];

    const size = fileSelected.size;
    const type = types.includes(fileSelected.type.replace('image/', ''));

    if (size <= 1048576 && type) {
      setImageUrl(fileSelected);
      setDisplayPic(URL.createObjectURL(fileSelected));
    } else {
      e.target.value = ''
    }


  }

  useEffect(()=>{
    if(listDetail && listDetail.data.length > 0){
      setUseDetails(listDetail.data)
    }
  }, [listDetail])

  return (
    <>
      <Form
        form={form}
        name='category'
        layout='vertical'
        className='w-full p-6'
        onFinish={handleSubmit}
        initialValues={{
          parent_id: '',
          is_active: true
        }}
      >
        <Flex className='mb-5' align='center' justify='space-between'>
          <Flex justify='center' align='center' gap={20}>
            <div>
              <Flex className='p-3 rounded-xl bg-[#fff] cursor-pointer' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1.6875rem', }}
                onClick={()=>{
                  navigate('..')
                }}
              >
                <ArrowBackRoundedIcon/>
              </Flex>
            </div>
            <Flex vertical>
              <h2 className='font-bold text-[24px]'>Thêm danh mục</h2>
              <span className='text-gray-500'>Quay lại trang danh sách danh mục</span>
            </Flex>
          </Flex>
        </Flex>
        <Flex vertical gap={30}>
          <Row gutter={[24, 32]} align={'stretch'}>
            <Col span={19}>
            {/* General */}
            <div className=' p-[1.75rem] rounded-xl h-full bg-[#ffff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', }}>
              <Flex  justify='space-between' className='mb-5'>
                <h2 className='font-bold text-[20px]'>Thông tin chung</h2>
                <Flex gap={10}>
                  <Button className='p-3' type='dashed'
                  onClick={()=>{
                    form.resetFields()
                  }}
                  >
                    Cài đặt lại
                  </Button>
                  <Button className='p-3' type='primary' htmlType='submit'>
                    Thêm
                  </Button>
                </Flex>
              </Flex>
              <Flex vertical  gap={10} className='rounded-xl p-[1.75rem] border-[1px]'>
                <Flex vertical gap={10}>
                  <h3 className='font-bold text-[16px]'>Tên danh mục</h3>
                  <Form.Item
                    name='name'
                    className='w-full flex flex-col'
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                      { max: 70, message: 'Tên không vượt quá 70 ký tự' },
                      {
                        whitespace: true,
                        message: 'Tên sản phẩm không được để trống!'
                      }
                    ]}
                  >
                    <Input size='large' placeholder='Nhập tên sản phẩm' />
                  </Form.Item>
                </Flex>
                <Flex vertical gap={10}>
                  <Flex justify='space-between' align='center'>
                    <h2 className='font-bold text-[16px]'>Thông tin sản phẩm</h2>
                    <div>
                      <Button className=' border-dashed ' onClick={handleSetDetail} >Thêm</Button>
                    </div>
                  </Flex>
                  {
                    <Flex vertical gap={20}>
                      {details.map((detail, i) => (
                        <Flex vertical gap={10} key={i}>
                          <Detail
                            keyValue={detail.id}
                            detail={details}
                            setDetail={setDetails}
                            handleRemoveDetail={handleRemoveDetail}
                            form={form}
                            detailModel={detail}
                            useDetails={useDetails}
                            setUseDetails={setUseDetails}
                          />
                        </Flex>
                      ))}
                    </Flex>
                  }
                </Flex>
              </Flex>
            </div>
            {/* General */}
            </Col>
            <Col span={5} className='w-full'>
              <Flex vertical gap={30}>
                <Form.Item
                  name="upload"
                  className='p-10 sm:rounded-xl border-[#F1F1F4] m-0 bg-[#ffff]'
                  rules={[{ required: true, message: 'Please upload a file!' }]}
                  style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}
                >
                  <Flex vertical gap={20}>
                      <h2 className='font-bold text-[20px]'>Ảnh đại diện</h2>
                      <div style={{ height: '10.5vw', boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} className='border-none rounded-xl relative ' >
                          {
                          DisplayPic
                          ?
                          <div style={{ height: '100%', maxWidth: '100%',  overflow: 'hidden'}} className='relative group border-none rounded-xl'>
                              <img src={DisplayPic} alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
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

                          <div className='w-[30px] h-[30px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' style={{boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} onClick={()=>{
                              if(fileInputRef.current){
                                  fileInputRef.current.click();
                              }
                          }}>
                              <EditRoundedIcon style={{fontSize: 20}} />
                              <input ref={fileInputRef} type="file" accept="image/*" name="image" id="image" className='opacity-0'
                                  style={{display: 'none'}}
                                  onChange={selectedImg}
                              />
                          </div>
                          
                      </div>
                      <Flex style={{ width: '100%' }} className='text-gray-800' vertical justify='center' align='center'>
                          <span style={{ fontSize: '11px' }}>
                              Kích thước tối đa: 50MB
                          </span>
                          <span style={{ fontSize: '11px' }}>
                              JPG, PNG, GIF, SVG
                          </span>
                      </Flex>
                  </Flex>
                </Form.Item>
                <div className='sm:rounded-lg overflow-hidden flex-1 p-2 bg-[#ffff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}>
                  <div className='p-2'>
                    <h2 className='font-bold'>cài đặt</h2>
                  </div>
                  <hr />
                  <div className='flex justify-between items-center p-2'>

                  <h2>Kích hoạt</h2>
                  <Form.Item 
                  className='m-0' 
                  label=''
                  name='is_active' 
                  valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  </div>
                </div>
              </Flex>
            </Col>
          </Row>
        </Flex>
        {/* <Form.Item>
          <Flex justify='space-between' className='pb-4' align='center'>
            <h2 className=' font-bold text-[24px]'>Tạo danh mục mới</h2>
            <Button loading={isLoadingCreateCategory} disabled={isLoadingCategories} type="primary" htmlType="submit" className=" w-[100px] p-5">

            </Button>
          </Flex>
        </Form.Item>
        <Flex gap={100}>
          <Flex className='flex-[2] ' vertical gap={10}>
            <Flex vertical>
              <Form.Item
                name="upload"
                className='border-[1px] p-[50px] rounded-md border-[#F1F1F4]'
                rules={[{ required: true, message: 'Please upload a file!' }]}
                style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}
              >
                <div>
                  <h2 className='font-bold mb-2 text-[16px]'>Ảnh nhỏ</h2>
                  <div style={{ flex: 5, height: '200px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
                    {
                      imageUrl && DisplayPic
                        ?
                        <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                          <img src={DisplayPic} alt="" className='object-cover h-[100%] object-center' style={{ width: '100%' }} />
                          <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                          <button style={{ zIndex: 999, fontSize: "20px", color: 'white' }}
                            onClick={() => setDisplayPic('')}
                          >
                            <DeleteOutlined className=" duration-1000 opacity-0 group-hover:opacity-100 absolute top-10 right-10" />
                          </button>
                        </div>
                        :
                        <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ maxWidth: '100%', height: "100%", borderRadius: '12px' }}>
                          <Flex vertical gap={10} style={{ width: '100%' }}>
                            <Flex vertical align='center' justify='center'>
                              <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                            </Flex>
                          </Flex>
                          <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                            <span style={{ fontSize: '11px' }}>
                              Kích thước tối đa: 50MB
                            </span>
                            <span style={{ fontSize: '11px' }}>
                              JPG, PNG, GIF, SVG
                            </span>
                          </Flex>
                          <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                            onChange={selectedImg}
                          />
                        </Flex>
                    }
                  </div>
                </div>
              </Form.Item>
            </Flex>
            <div className='border border-1 rounded-md overflow-hidden flex-1 ' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>
              <div className='p-2'>
                <h2>Cài đặt</h2>
              </div>
              <hr />
              <div className='flex justify-between items-center p-2'>

                <h2>Kích hoạt</h2>
                <Form.Item
                  className='m-0'
                  label=''
                  name='is_active'
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

              </div>
            </div>
          </Flex>
          <Flex vertical className='flex-[6]'>
            <div className='  border-[1px] p-[50px] rounded-md' style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}>
              <h2 className='mb-5 font-bold text-[16px]'>Tổng quan</h2>
              <Flex vertical gap={20}>
                <Flex gap={30}>
                  <Form.Item
                    name='name'
                    label='Tên'
                    className='w-full'
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên danh mục!' },
                      { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                      {
                        whitespace: true,
                        message: 'Tên danh mục không được để trống!'
                      }
                    ]}
                  >
                    <Input size='large' placeholder='Nhập tên danh mục' />
                  </Form.Item>
                  <Form.Item
                    name='parent_id'
                    label='parent_id'
                  >
                    {dataCategories && <Select
                      style={{ width: '200px', height: 40 }}
                      onChange={(v) => {
                        console.log(v);
                      }}
                      options={[
                        { value: '', label: 'none' },
                        ...dataCategories
                      ]}
                    />}

                  </Form.Item>
                </Flex>
                <div>
                </div>
              </Flex>
            </div>
          </Flex>
        </Flex>
        <Flex vertical gap={20}>
          <h2 className='font-bold text-[24px] mt-5'>Thông tin chi tiết</h2>

          {details.map((name, i) => (
            <ButtonEdit key={name.id} keyValue={name.id} detail={details} setDetail={setDetails} handleRemoveDetail={handleRemoveDetail} validateNoDuplicate={validateNoDuplicate} validateOption={validateOption} />
          ))}
          <div>
            <Button className=' border-dashed' onClick={handleSetDetail}>Thêm thông tin chi tiết</Button>
          </div>
        </Flex> */}
      </Form>
    </>
  )
}
