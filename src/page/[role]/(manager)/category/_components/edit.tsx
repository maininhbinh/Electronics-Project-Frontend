
import { useNavigate, useParams } from 'react-router-dom'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Flex, Form, Input, Modal, Button, Switch, Select, Drawer, Row, Col } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ButtonEdit from '../../shared/ButtonEdit/ButtonEdit';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import { useCreateCategoryMutation, useGetCategoriesQuery, useGetCategoryQuery } from '../CategoryEndpoints';
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
import DetailUpdate from './detail/DetailUpdate';
import { updateCategory } from '@/services/categoryService';

interface Detail {
  id: string,
  name: string,
  attributes: {
    id: string,
    name: string
  }[]
}

export default function EditCategory() {
  const params = useParams();
  const {data: listDetail, isLoading} = useGetDetailsQuery({})
  const [createCategory, { isLoading: isLoadingCreateCategory }] = useCreateCategoryMutation();
  const {refetch, data : dataItem, isLoading : isLoadingGetCategory, isError : isErrorGetCategory} = useGetCategoryQuery(params.id)
  
  const dispatch = useAppDispatch();

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState<File>();
  const [DisplayPic, setDisplayPic] = useState<string>();
  const [useDetails, setUseDetails] = useState([]);

  const [details, setDetails] = useState<Detail[]>([]);

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
    

    const checkErrorAttributes = details.find(item=>item.attributes.length == 0) ? true : false

    if(checkErrorAttributes){
      popupError('Vui lòng điền thông số kĩ thuật')
      return
    }

    if(dataItem){
      const {details: useData} = dataItem.data
      const name = form.getFieldValue('name');
      const active = form.getFieldValue('is_active');

      const detailDeletes = [
        ...useData.filter((itemDataItem: Detail)=>{
          return details.findIndex(itemDetails=>{
            return itemDataItem.id == itemDetails.id
          }) < 0 ? true : false
        }).map((item)=>item.id)
      ]

      const attributes = {
        delete: [
          ...useData.map((itemUseData: Detail) => {
            const check = details.findIndex(itemDetails=>itemDetails.id == itemUseData.id)
            return check >= 0 ? itemUseData.attributes.filter(itemC=>!details[check].attributes.some(itemB => itemC.id === itemB.id)).map(item=>item.id) : []
          }).flat()
        ],
        add: [
          ...details.map(item=>{
            const detail = useData.findIndex((itemUseDetail:Detail) => item.id === itemUseDetail.id)
    
            return {
              id: item.id,
              attributes: item.attributes.filter(item => {
                return detail == -1 ? false : !useData[detail].attributes.some(itemB => item.id === itemB.id);
              }).map(item=>item.name)
            };
          }).filter(item=>item.attributes.length > 0)
        ]
      }

      const newDetails = details.filter(item=>!useData.some(itemC=>itemC.id === item.id))

      const formData = new FormData();

      formData.append('name', name);
      formData.append('is_active', active);
      if (imageUrl) {
        formData.append('image', imageUrl);
      }    
      formData.append('newDetails', JSON.stringify(newDetails))
      formData.append('attributes', JSON.stringify(attributes))
      formData.append('detailDeletes', JSON.stringify(detailDeletes))

      const payload : {id: string | undefined, formData: FormData} = {
        id: params.id,
        formData
      }
      console.log(attributes);
      
      
      try {
        dispatch(setLoading(true))
        await updateCategory(payload);
        dispatch(setLoading(false))
        popupSuccess('Add category success')
        refetch()
        navigate('..')

      } catch (error) {
        dispatch(setLoading(false))
        popupError('Add category error');
      }
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

  useEffect(()=>{
    if(dataItem){
      const {name, is_active, details, image} = dataItem.data
      const useForm = {
        name,
        is_active
      }

      form.setFieldsValue(useForm);
      setDetails(details)
      setDisplayPic(image)

      details.forEach((item)=>{
        form.setFieldValue(`input-${item.id}`, item.name)
        item.attributes.forEach(item=>form.setFieldValue(`attr-value-${item.id}`, item.name))
      })

    }
  }, [dataItem])

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
              <h2 className='font-bold text-[24px]'>Chỉnh sửa danh mục</h2>
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
                          <DetailUpdate
                            keyValue={detail.id}
                            detail={details}
                            setDetail={setDetails}
                            handleRemoveDetail={handleRemoveDetail}
                            form={form}
                            detailModel={detail}
                            useDetails={useDetails}
                            setUseDetails={setUseDetails}
                            data={dataItem}
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
      </Form>
    </>
  )
}



// export default function EditCategory() {
//   const [deleteDetail, {isLoading : isLoadingDeleteDetail}] = useDeleteDetailMutation();
//   const [isShowInputAddDetail, setIsShowInputAddDetail] = useState<any>({
//      detailId : 0,
//      attributeId : 0
//   })
//   const [addDetail, setAddDetail] = useState<number>(0);
//   const params = useParams();
//   const {refetch, data : dataItem, isLoading : isLoadingGetCategory, isError : isErrorGetCategory} = useGetCategoryQuery(params.id)
//   const {data :listCategory, isLoading : isLoadingCategories} = useGetCategoriesQuery({});
//   const [updateCategory, {isLoading : loadingUpdateCategory}] = useUpdateCategoryMutation();

//   const navigate = useNavigate()
//   const [form] = Form.useForm()
//   const dataCategories = listCategory ? listCategory.data.map((item : ICategory) => {
//     return {
//       label : item.name,
//       value : item.id
//     }
//   }) : [];
  
 
//   const [imageUrl, setImageUrl] = useState<File>();
//   const [DisplayPic, setDisplayPic] = useState<string>();

  
//   const [details, setDetails] = useState<Array <object>>([]);

//   useEffect(() => {
    
//     if(dataItem) {
//         setDisplayPic(dataItem.data.image)
//         const setData = dataItem.data;
        
//         setDetails(() => {
//           return setData.details.map((item : any) => {
//               return {
//                  detailId : item.id,
//                  id : getRandomNumber(),
//                  name : item.name,
//                  attribute : item.attributes.map((item1 : any) => {
//                   return {
//                     attributeId : item1.id,
//                     id : getRandomNumber(),
//                     value : item1.name
//                   }
//                })
//               }
//           })
//         })
//     }
//   },[dataItem]);

//   const validateNoDuplicate = (fieldName, setNo, setError) => (_, value) => {    
//     const fields = form.getFieldsValue();
//     const inputValues = Object.keys(fields)
//       .filter(key => key.startsWith(fieldName))
//       .map(key => fields[key]);
    
//     const duplicateValues = inputValues.filter((item) => item === value && item);
    
//     if (duplicateValues.length > 1) {
//       setNo(true)
//       return Promise.reject(`không được trùng với các cột khác!`);
//     }
//     setNo(false)
//     return Promise.resolve();
//   };

//   const validateOption = (fieldName, setError, field) => (_, value) => {    
//     const fields = form.getFieldsValue();
//     const inputValues = Object.keys(fields)
//       .filter(key => key.startsWith(fieldName))
//       .map(key => fields[key]);
    
//     const duplicateValues = inputValues.filter((item) => item === value && item);

    
//     if (duplicateValues.length > 1) {
//       setError((prevErrors) => ({
//         ...prevErrors,
//         [field]: 'không được trùng',
//     }));

//       return Promise.reject(`không được trùng với các cột khác!`);
//     }
//     return Promise.resolve();
//   };

//   const handleCancel = () => {
//     navigate('..')
//   }

//   const handleRemoveDetail = async (name : any, detailId : number) => {  
   
 

//     if(!detailId){
//       if(details.length > 1){
//         setDetails([
//           ...details.filter((item, index)=>item.id != name)
//         ])
//       }
//     }else {
//       try {
//         await deleteDetail(String(detailId)).unwrap();
//         if(details.length > 1){
//           setDetails([
//             ...details.filter((item, index)=>item.id != name)
//           ])
//         }
//         refetch();
//         popupSuccess('Delete detail success');
//       } catch (error) {
//         popupError('Delete detail error');
//       }
//     }
   
//   }

//   const handleSetDetail = () => {
//     const detailId = getRandomNumber();
//     const attributeId = getRandomNumber()

//     setIsShowInputAddDetail({
//       detailId: detailId,
//       attributeId : attributeId
//     })

//     setDetails([
//         ...details,
//       {
//         id: detailId,
//         name: '',
//         attribute: [
//           {
//             id: attributeId,

//             value: ''
//           }
//         ]
//       }
//     ])
//   }

//   const handleSubmit = async (values) => {
   
    
//     const name = form.getFieldValue('name');
//     const active = form.getFieldValue('active') ? 1 : 0;
//     const parent_id = form.getFieldValue('parent_id');    
 

//     const formData = new FormData();
    
   
//     formData.append('name', name);
//     formData.append('is_active', active as any);
//     formData.append('parent_id', parent_id);
   
//     if(imageUrl){      
//       formData.append('image', imageUrl);
//     }
   
//     try {
//       const payload = {
//         id : params.id,
//         payload : formData
//       }
//       await updateCategory(payload).unwrap();
//       popupSuccess('Update category success');
//       navigate('..')
//     } catch (error) {
//       popupError('Update category error');
//     }

 
   

  
//   }

//   const selectedImg = (e) => {
    
//     const types = [
//       'jpeg',
//       'png',
//       'jpg',
//       'gif',
//     ]

//     const fileSelected = e.target.files[0];    

//     const size = fileSelected.size;
//     const type = types.includes(fileSelected.type.replace('image/', ''));

//     if (size <= 1048576 && type) {
//         setImageUrl(fileSelected);
//         setDisplayPic(URL.createObjectURL(fileSelected));
//     } else {
//         e.target.value = ''
//     }

//   }
//   if(isErrorGetCategory){
//     return <ErrorLoad />
//   }
//   return (
//     <>
//     <Drawer width={'70%'} loading={isLoadingGetCategory || isLoadingCategories} title="Tạo danh mục mới" onClose={() => handleCancel()} open={true}>
//     {dataItem &&  <Form 
//           form={form} 
//           name='category' 
//           layout='vertical' 
//           className='w-full p-6' 
//           onFinish={handleSubmit}
//           initialValues={{
//             parent_id: dataItem?.data?.parent_id ? dataItem?.data?.parent_id : '',
//             is_active: dataItem?.data?.is_active == 1 ? true : false,
//             name : dataItem?.data?.name
//           }}
//         >
//           <Form.Item>
//             <Flex justify='space-between' className='pb-4' align='center'>
//               <h2 className=' font-bold text-[24px]'>Cập nhật danh mục "{dataItem?.data?.name}"</h2>
//               <Button loading={loadingUpdateCategory} disabled={loadingUpdateCategory} type="primary" htmlType="submit" className=" w-[100px] p-5">
//                 cập nhật
//               </Button>
//             </Flex>
//           </Form.Item>
//           <Flex gap={100}>
//             <Flex className='flex-[2] ' vertical gap={10}>
//               <Flex vertical>
//                 <Form.Item
//                   name="upload"
//                   className='border-[1px] p-[50px] rounded-md border-[#F1F1F4]'
    
//                   style={{boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)'}}
//                 >
//                   <div>
//                   <h2 className='font-bold mb-2 text-[16px]'>Ảnh nhỏ</h2>
//                   <div style={{ flex: 5, height: '200px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
//                     {
//                        DisplayPic
//                       ?
//                       <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
//                           <img src={DisplayPic} alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
//                           <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
//                           <button style={{ zIndex: 999, fontSize: "20px", color: 'white' }}
//                               onClick={() => setDisplayPic('')}
//                           >
//                               <DeleteOutlined className=" duration-1000 opacity-0 group-hover:opacity-100 absolute top-10 right-10" />
//                           </button>
//                       </div>
//                       :
//                       <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ maxWidth: '100%', height: "100%", borderRadius: '12px' }}>
//                           <Flex vertical gap={10} style={{ width: '100%' }}>
//                               <Flex vertical align='center' justify='center'>
//                                   <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
//                               </Flex>
//                           </Flex>
//                           <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
//                               <span style={{ fontSize: '11px' }}>
//                                   Kích thước tối đa: 50MB
//                               </span>
//                               <span style={{ fontSize: '11px' }}>
//                                   JPG, PNG, GIF, SVG
//                               </span>
//                           </Flex>
//                           <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
//                               onChange={selectedImg}
//                           />
//                       </Flex>
//                     }
//                   </div>
//                   </div>
//                 </Form.Item>
//               </Flex>
//               <div className='border border-1 rounded-md overflow-hidden flex-1 ' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>
//                 <div className='p-2'>
//                   <h2>Setting</h2>
//                 </div>
//                 <hr />
//                 <div className='flex justify-between items-center p-2'>
                  
//                       <h2>active</h2>
//                       <Form.Item 
//                         className='m-0' 
//                         label=''
//                         name='is_active' 
//                         valuePropName="checked"
//                       >
//                         <Switch />
//                       </Form.Item>

//                 </div>
//               </div>
//             </Flex>
//             <Flex vertical className='flex-[6]'>
//               <div className='  border-[1px] p-[50px] rounded-md' style={{boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)'}}>
//                 <h2 className='mb-5 font-bold text-[16px]'>Tổng quan</h2>
//                 <Flex vertical  gap={20}>
//                   <Flex gap={30}>
//                     <Form.Item
//                       name='name'
//                       label='Name'
//                       className='w-full'
//                       rules={[
//                         { required: true, message: 'Vui lòng nhập tên danh mục!' },
//                         { max: 120, message: 'Tên không vượt quá 120 ký tự' },
//                         {
//                           whitespace: true,
//                           message: 'Tên danh mục không được để trống!'
//                         }
//                       ]}
//                     >
//                       <Input size='large' placeholder='Nhập tên danh mục' />
//                     </Form.Item>
//                     <Form.Item
//                       name='parent_id'
//                       label='parent_id'
//                     >
//                       <Select
//                         loading={isLoadingCategories}
//                         style={{ width: '200px',height:40 }}
//                         onChange={(v)=>{console.log(v);
//                         }}
//                         options={[
//                           { value: '', label: 'none' },
//                           ...dataCategories
//                         ]}
//                       />
//                     </Form.Item>
//                   </Flex>
//                   <div>
//                   </div>
//                 </Flex>
//               </div>
//             </Flex>
//           </Flex>
//           <Flex vertical gap={20}>
//             <h2 className='font-bold text-[24px] mt-5'>Thông tin chi tiết</h2>

//             {details.map((name, i) => (
//                 <ButtonEditNext refetch={refetch} setIsShowInputAddDetail={setIsShowInputAddDetail} isShowInputAddDetail={isShowInputAddDetail} addDetail={addDetail} setAddDetail={setAddDetail} item={name} key={name.id} keyValue={name.id} detail={details} setDetail={setDetails} handleRemoveDetail={handleRemoveDetail} validateNoDuplicate={validateNoDuplicate} validateOption={validateOption}/>
//             ))}
//             <div>
//             <Button className=' border-dashed' onClick={handleSetDetail}>Thêm thông tin chi tiết</Button>
//             </div>
//           </Flex>
//         </Form>}
//     </Drawer>
     
//     </>
//   )
// }
