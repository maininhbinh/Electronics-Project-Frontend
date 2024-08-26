import { Col, Flex, Row, Button, Form, Input, Drawer, Select, UploadProps, GetProp, Modal, Dropdown, InputNumber } from 'antd'
import { useNavigate } from 'react-router-dom'
import React, {  useEffect, useRef, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Variant from './Variant/variant';
import getRandomNumber from '@/utils/randomNumber';
import TableVariant from './Variant/TableVariant'
import Option from './Option/Option'
import { useCreateProductMutation, useGetProductQuery } from '../ProductsEndpoints';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import LexicalEditor from '@/components/TextEditor/LexicalEditor';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { setLoading, setOpenModalLogin } from "@/app/webSlice";
import { useAppDispatch } from '@/app/hooks';



interface gallery{
  image: File | string
  displayPic: string
}

interface attribute{
  id: string,
  value: string,
  image: File|null,
  url: string|null
}
interface variant{
  id: string,
  name: string,
  attribute: attribute[]
}

interface detailsAtrr{
  id: string | number,
  idDetail: string
  values: Array<string>
}

interface Attribute {
  id: string|number;
  values: string[];
}

interface ResultItem {
  id: string|number;
  attributes: Attribute[];
}

interface Category {
  id: string,
  image: string,
  is_active: number,
  name: string,
  details: Detail[],
  variants: {
    id: string,
    category_id: string,
    name: string
  }[]
}

interface Detail {
  id: string,
  name: string,
  attributes: {
    detail_id: string,
    id: string,
    name: string
  }[]
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


function AddProduct() {
  const [addProduct, {isLoading : isLoadingAddProduct}] = useCreateProductMutation();
  const dispatch = useAppDispatch()
  
  const [imageUrl, setImageUrl] = useState<Blob>();
  const [form] = Form.useForm();
  const [formApply] = Form.useForm();
  const [gallery, setGallery] = useState<Array<gallery>>([]);
  const fileInputRef = useRef<any>(null);
  const numberFile = useRef<number>(0);
  const navigate = useNavigate()

  const [category, setCategory] = useState<Category | null>(null);
  const [detailsAttr, setDetailsAttr] = useState<detailsAtrr[]>([]);


  const [variant, setVariant] = useState<Array<variant>>([{
    id: `${Date.now()}${getRandomNumber()}`,
    name: '',
    attribute: [
      { 
        id: `${Date.now()}${getRandomNumber()}`,
        image: null,
        url: null,
        value: ''
      },
    ]
  }]);  
  

  const onFinish = async () => {    
    const name = form.getFieldValue('name');
    const content = form.getFieldValue('content');
    const category_id = form.getFieldValue('category_id');
    const brand_id = form.getFieldValue('brand_id');
    const product_item = form.getFieldValue('variant');
    const is_active = form.getFieldValue('is_active') ? 1 : 0;
    const is_hot_deal = form.getFieldValue('is_hot_deal') ? 1 : 0;
    const is_good_deal = form.getFieldValue('is_good_deal') ? 1 : 0;
    const is_new = form.getFieldValue('is_new') ? 1 : 0;
    const is_show_home = form.getFieldValue('is_show_home') ? 1 : 0;    
    
    const newProductItem = [];    

    for(const key in product_item){      
      const id = key.split('-');
      const image = variant[0].attribute.find(item => item.id === id[0])?.image;
      const newVariant = variant.map((item, key)=>({
        variant: item.name,
        attribute: item.attribute.find(item => item.id == id[key] && item.value)?.value 
      }));

      newProductItem.push({
        id: id[0],
        image,
        variants: newVariant,
        ...product_item[key]
      });
    }       
    
    const details = detailsAttr.reduce((acc, item) => {
      // Tìm đối tượng idDetail hiện có trong acc hoặc tạo mới nếu không tồn tại
        let detail = acc.find(d => d.id === item.idDetail);
        if (!detail) {
          detail = { id: item.idDetail, attributes: [] };
          acc.push(detail);
        }
    
        // Thêm thuộc tính vào detail
        detail.attributes.push({
            id: item.id,
            values: item.values
        });
    
        return acc;
    }, [] as ResultItem[]);    
  

    const formdata = new FormData();

    formdata.append('thumbnail', imageUrl ? imageUrl : '');
    formdata.append('gallery', gallery ? JSON.stringify(gallery) : '');
    formdata.append('name', name);
    formdata.append('content', content);
    formdata.append('category_id', category_id);
    formdata.append('brand_id', brand_id);
    formdata.append('is_active', String(is_active));
    formdata.append('is_hot_deal', String(is_hot_deal));
    formdata.append('is_good_deal', String(is_good_deal));
    formdata.append('is_new', String(is_new));
    formdata.append('is_show_home', String(is_show_home));
    formdata.append('product_details', JSON.stringify(details));
    formdata.append('product_items', JSON.stringify(newProductItem));    
    
        
    try {
      dispatch(setLoading(true))
      await addProduct(formdata).unwrap();
      popupSuccess('Add product success');
      dispatch(setLoading(false))
      // navigate('..');
    } catch (error) {
      dispatch(setLoading(false))
      popupError('Add product error');
    }
    
  }

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  

  

  const handleSetDetail = () => {
    form.resetFields(['variant']);
    setVariant([
        ...variant,
      {
        id: Date.now() + '',
        name: '',
        attribute: [
          {
            id: Date.now() + '',
            value: '',
            image: null,
            url: null
          }
        ]
      }
    ])
  }  
  
  const handleRemoveDetail = (name: string) => {  
    form.resetFields(['variant']);
    const updatedVariant = variant.filter((item)=>item.id != name)  
    if(variant.length > 1){
      setVariant(updatedVariant)
    }
  }

  const selectGallery = async (e) => {
    if(gallery.length > 6) return;
    
    const types = [
      'jpeg',
      'png',
      'jpg',
      'gif',
    ]

    const fileSelected = e.target.files;  
    

    for(const key in fileSelected){
      if(numberFile.current == 5) break;
      if(typeof fileSelected[key] == 'number') break;
      
      const file = await fileSelected[key] ;
      if (!(file instanceof File)) continue;

      const size = file.size;
      const type = types.includes(file.type.replace('image/', ''));

      const newFile = await getBase64(fileSelected[key]) ;
        
      if (size <= 1048576 && type) {
        numberFile.current++;
        setGallery((pveImages)=>[
          ...pveImages,
          {
            image: newFile,
            displayPic:  URL.createObjectURL(file)
          }
        ]);        
      }
    }
    e.target.value = null;
      
  }  

  const submitApply = () => {    
    const variantApply = formApply.getFieldsValue()
    const price = variantApply.price
    const priceSale = variantApply.price_sale
    const quantity = variantApply.quantity
    const sku = variantApply.sku
    
    let idVariant: string[] = variant[0].attribute.length > 1 
      ? variant[0].attribute.slice(0, -1).map(item => item.id)
      : variant[0].attribute.map(item => item.id);

    // Nếu có nhiều hơn một biến thể
    if (variant.length > 1) {
      idVariant = idVariant.flatMap(item => {
        // Nếu biến thể thứ hai có nhiều hơn một thuộc tính
        if (variant[1].attribute.length > 1) {
          return variant[1].attribute.slice(0, -1).map(item2 => `${item}-${item2.id}`);
        } else {
          // Nếu chỉ có một thuộc tính
          return variant[1].attribute.map(item2 => `${item}-${item2.id}`);
        }
      });
    }    

    const mergeVariant = {
      ...idVariant.reduce((acc, key) => {
        acc[key] = { quantity: quantity, price: price, price_sale: priceSale, sku: sku };
        return acc;
      }, {} as Record<string, { quantity: number; price: number; price_sale: number; sku: string }>),
    }

    form.setFieldValue('variant', mergeVariant)
    
  }

  const menu = (
    <div style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1.6875rem', width: 1000 }} className=' rounded-xl p-10'>
      <Form 
      form={formApply}
      onFinish={submitApply}
      >
        <Row gutter={[20, 20]}>
          <Col span={5}>
            <Flex vertical gap={10}>
              <label htmlFor="" className='font-bold'>Số lượng</label>
              <Form.Item
              className='m-0'
                name="quantity"
                rules={[{ required: true, message: 'Nhập số lượng' }]}
              >
                <InputNumber
                  className='w-full'
                  placeholder='nhập số lượng'
                  min={0}
                />
              </Form.Item>
            </Flex>
          </Col>
          <Col span={5}>
            <Flex
            gap={10}
            vertical
            >
              <label htmlFor="" className='font-bold'>Giá</label>
              <Form.Item
                className='m-0'
                name="price"
                rules={[
                  { required: true, message: 'Nhập giá' },
                 
                ]}
              >
                <InputNumber
                  placeholder='Nhập giá'
                  className='w-full'
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Flex>
          </Col>
          <Col span={5}>
            <Flex
            gap={10}
            vertical
            >
              <label htmlFor="" className='font-bold'>Giá sale</label>
              <Form.Item
                className='m-0'
                name="price_sale"
                rules={[
                  { required: true, message: 'Nhập giá sale' },
                  {
                    validator: (_, value)=> {
                      const price = formApply.getFieldValue('price');
                      if(value > price){
                        return Promise.reject('Không được lớn hơn giá thường')
                      }
                      
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <InputNumber
                  placeholder='Nhập giá sale'
                  className='w-full'
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Flex>
          </Col>
          <Col span={5}>
            <Flex
            gap={10}
            vertical
            >
              <label htmlFor="" className='font-bold'>SKU</label>
              <Form.Item
                className='m-0'
                name="sku"
              >
                <Input 
                placeholder="SKU" 
                onChange={(e)=>{
                  const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
                  formApply.setFieldValue('sku', value)
                }} 
                />
              </Form.Item>
            </Flex>
          </Col>
          <Col span={4}>
            <Flex
            gap={10}
            vertical
            className='h-full w-full'
            >
              <label htmlFor="" className='font-bold'>Hành động</label>
              <Form.Item
                className='w-full m-0'
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  className='h-[40px] w-full'
                >
                  Áp dụng
                </Button>
              </Form.Item>
            </Flex>
          </Col>
        </Row>
      </Form>
    </div>
  );

  const handleDeleteGallery = (id: number) => {
    numberFile.current--
    setGallery([
      ...gallery.filter((item, key) => key != id)
    ])
  }  

  return (
    <>
      <Form
        layout='vertical'
        form={form}
        name='nest-messages'
        onFinish={onFinish}
        className='p-10 relative'
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
              <h2 className='font-bold text-[24px]'>Thêm sản phẩm</h2>
              <span className='text-gray-500'>Quay lại trang danh sách sản phẩm</span>
            </Flex>
          </Flex>
          
        </Flex>
        <Flex vertical gap={30}>
          <Row gutter={[24, 32]} align={'stretch'}>
            <Col span={19}>
              <Flex vertical className='' gap={30}>

                {/* General */}
                <div className=' p-[1.75rem] rounded-xl h-full bg-[#ffff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', }}>
                  <Flex className='mb-5 ' justify='space-between'>
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
                  <Flex vertical  gap={5} className='rounded-xl p-[1.75rem] border-[1px]'>
                    <Flex vertical gap={10}>
                      <h3 className='font-bold text-[16px]'>Tên sản phẩm</h3>
                      <Form.Item
                        name='name'
                        className='w-full flex flex-col'
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                          { max: 70, message: 'Tên không vượt quá 70 ký tự' },
                          { min: 10, message: 'Tên không nhập nhỏ hơn 10 ký tự' },
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
                      <h3 className='font-bold text-[16px]'>Mô tả sản phẩm</h3>
                      <Form.Item
                        name={'content'}
                        rules={[
                          {
                            required: true,
                            message: 'Không được bỏ trống trường này'
                          }
                        ]}
                      >
                        <LexicalEditor form={form}/>
                      </Form.Item>

                    </Flex>
                  </Flex>
                </div>
                {/* General */}

                {/* Gallery */}
                <Form.Item
                  name="gallery"
                  className='p-10 sm:rounded-xl border-[#F1F1F4] m-0 bg-[#ffff]'
                  style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', }}
                >
                  <Flex vertical>
                    <h2 className='font-bold text-[20px] mb-5'>Danh sách ảnh <span className='text-[12px]'>({gallery.length}/5)</span></h2>
                    <div style={{ flex: 5, overflow: 'hidden'}} className='border-none rounded-xl relative bg-[#f8fafd] cursor-pointer' 
                    >
                        <Flex className='border-dashed border-2 p-5 relative border-blue-300' vertical gap={10} justify='center' align='center' style={{ width: '100%', minHeight: "20vw", borderRadius: '12px' }}
                          
                        >
                            {
                              gallery.length < 1
                              ?
                              (
                                <>
                                  <Flex vertical gap={10} style={{ width: '100%' }}>
                                    <Flex vertical align='center' justify='center'>
                                        <PermMediaOutlinedIcon style={{ fontSize: '100px' }} className='text-gray-500' />
                                    </Flex>
                                  </Flex>
                                  <Flex style={{ width: '100%' }} vertical justify='center' align='center' gap={10}>
                                      <h3 className='font-bold'>
                                        Kéo và thả tập tin của bạn vào đây
                                      </h3>
                                      <span style={{ fontSize: '11px' }}>
                                        Hoặc
                                      </span>
                                      <Button
                                        onClick={(e)=>{
                                          e.stopPropagation();
                                          if(fileInputRef.current){
                                            fileInputRef.current.click()
                                          }
                                        }}
                                        className='z-[3]'
                                      >
                                        Duyệt tập tin
                                      </Button>
                                  </Flex>
                                </>
                              )
                              :
                              ''
                            }
                            <input 
                              type="file" 
                              accept="image/*" 
                              name="image" 
                              id="image" 
                              multiple 
                              className='opacity-0 absolute inset-0'
                              style={{}}
                              onChange={selectGallery}
                              ref={fileInputRef}
                            />
                            <Flex justify='center' align='center' gap={20} wrap className='w-full h-[100%]'>
                              {gallery.map((item, index)=>(
                                <div style={{ height: '7vw', boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} className='border-none rounded-xl relative w-[13%] bg-[#fff]' key={index}>
                                  <div style={{ height: '100%', maxWidth: '100%',  overflow: 'hidden'}} className='relative group border-none rounded-xl'>
                                      <img src={item.displayPic} alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
                                  </div>
          
                                  <div 
                                    className='w-[30px] h-[30px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' 
                                    style={{boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} 
                                    onClick={()=>{
                                      handleDeleteGallery(index)
                                    }}
                                  >
                                    <CloseRoundedIcon style={{fontSize: 20}} />
                                  </div>
                                </div>
                              ))}
                            </Flex>
                        </Flex>
                    </div>
                  </Flex>
                </Form.Item>
                {/* Gallery */}

                {/* Detail */}
                <Flex vertical className='sm:rounded-xl p-10 bg-[#ffff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}>
                  <h2 className={`mb-5 font-bold text-[20px]`}>Thông tin chi tiết sản phẩm</h2>
                  <Flex vertical gap={20} className='p-5 border-[1px] rounded-xl'>

                    {category && category?.details.map((item)=>(
                        <Flex key={item.id} vertical gap={20} className='rounded-xl'>
                          <h2 className=' font-bold text-[16px]'>{item.name}</h2>
                          <hr />
                          <Flex align='center' wrap gap={20}>
                              {item.attributes.map((attr)=>(
                                <Flex vertical gap={5} key={attr.id} className='w-[23%]'>
                                  <h2 className='font-bold text-[14 px]'>{attr.name}</h2>
                                  <Form.Item 
                                    className='m-0' 
                                    name={`attr-${attr.id}`} 
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Trường này không được bỏ trống'
                                      }
                                    ]}
                                  >
                                    <Select
                                      className='custom-seclect'
                                      mode='tags'
                                      onChange={(e)=>{
                                        const existingAttrIndex = detailsAttr.findIndex(item => item.id === attr.id);
                                        if(existingAttrIndex > -1){
                                          const newDetailAttr = detailsAttr.map((item, index) => {
                                            if (index === existingAttrIndex) {
                                              return {
                                                ...item,
                                                values: e
                                              };
                                            }
                                            return item;
                                          });
                                          setDetailsAttr(newDetailAttr)
                                        }else {
                                          // Nếu mục không tồn tại, thêm mới vào mảng
                                          const newDetailAttr = [
                                            ...detailsAttr,
                                            {
                                              id: attr.id,
                                              idDetail: item.id,
                                              values: e
                                            }
                                          ];
                                          setDetailsAttr(newDetailAttr);
                                        }

                                      }}
                                      style={{ width: '100%'}} 
                                    />
                                  </Form.Item> 
                                </Flex>
                              ))}
                          </Flex>
                        </Flex>
                    ))}
                  </Flex>

                </Flex>
                {/* Detail */}

                {/* Variant */}
                <div className='p-10 rounded-xl bg-[#fff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}>
                  <h2 className='font-bold text-[20px] mb-5'>Thông tin bán hàng</h2>
                  {
                    category
                    ?
                    <Flex vertical gap={20}>
                      {variant.map((detail, i) => (
                        <Flex vertical gap={10} key={i}>
                          <Variant 
                            key={detail.id} 
                            show={i} 
                            keyValue={detail.id} 
                            detail={variant} 
                            setDetail={setVariant} 
                            handleRemoveDetail={handleRemoveDetail} 
                            form={form} 
                            variantModel={detail} 
                            category={category}
                            setCategory={setCategory}
                          />
                        </Flex>
                      ))}
                      {
                        variant.length == 1
                        ?
                          <div>
                            <Button className=' border-dashed' onClick={handleSetDetail}>Thêm biến thể 2</Button>
                          </div>
                        :
                        ''
                      }
                    </Flex>
                    :
                    ''
                  }
                </div>

                <Flex vertical className='bg-[#fff] p-10 rounded-xl' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}>
                  <Flex className='mb-5' align='center' justify='space-between'>
                    <h2 className='font-bold text-[20px]'>Danh sách phân loại hàng</h2>

                    <Dropdown
                    dropdownRender={()=>menu}
                    placement='topRight' 
                    arrow 
                    trigger={['click']}
                    >
                      <Button className='border-dashed'>
                        Áp dụng dữ liệu
                      </Button>
                    </Dropdown>
                  </Flex>
                  {
                    category
                    ?
                    <TableVariant variant={variant} setVariant={setVariant} form={form} />
                    :
                    ''
                  }
                </Flex>
                {/* Variant */}
              </Flex>
            </Col>
            <Col span={5} className='w-full'>
              <Option setImageUrl={setImageUrl} setCategory={setCategory}/>
            </Col>
          </Row>
        </Flex>
      </Form> 
     
    </>
  )
}
export default React.memo(AddProduct)