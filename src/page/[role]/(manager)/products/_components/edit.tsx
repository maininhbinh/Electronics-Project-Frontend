import { Col, Flex, Row, Button, Form, Input, Drawer, Select, UploadProps, GetProp } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import React, {  useEffect, useRef, useState } from 'react'
import { useEditProductQuery, useUpdateProductMutation } from '../ProductsEndpoints';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import LexicalEditor from '@/components/TextEditor/LexicalEditor';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import VariantUpdate from './Variant/VariantUpdate';
import TableVariantDemo from './Variant/TableVariantDemo';
import { PlusOutlined  } from '@ant-design/icons';
import OptionUpdate from './Option/OptionUpdate';
import { useAppDispatch } from '@/app/hooks';
import { setLoading, setOpenModalLogin } from "@/app/webSlice";
interface gallery{
  id?: string
  image?: File | string
  displayPic: string
}

interface attribute{
  id: string,
  value: string,
}
interface variant{
  id: string,
  name: string,
  attribute: attribute[]
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
    id: string,
    name: string
    values: {
      id: string,
      name: string
    }[]
  }[]
}

interface PayloadGallery {
  add?: (string|File)[]
  delete?: (string|number)[]
}


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

function EditProduct() {
  const {id} = useParams()  

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const {refetch, data: product, isLoading: isLoadingProduct} = useEditProductQuery(id)
  const [updateProduct] = useUpdateProductMutation()
  const [editor, setEditor] = useState<string>('');
  const [payloadGallery, setPayloadGallery] = useState<PayloadGallery>({
    add: [],
    delete: []
  });
  const [payloadDetail, setPayloadDetail] = useState<Array<string>>([])
  

  const [imageUrl, setImageUrl] = useState<Blob>();
  const [form] = Form.useForm();
  const [gallery, setGallery] = useState<Array<gallery>>([]);
  const fileInputRef = useRef<any>(null);
  const numberFile = useRef<number>(0);

  const [category, setCategory] = useState<Category | null>(null);


  const [variant, setVariant] = useState<Array<variant>>([]);  
  

  const onFinish = async () => {    
    if(product && product.data){

      const {products} = product.data
      
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
      
      const details = {
        delete: payloadDetail,
        add: category?.details.flatMap(item=> {
          return item.attributes.map(attr => {
            const value = form.getFieldValue(`attr-${attr.id}-${item.id}`);
          
            if(!value || !value.length){
              return null
            }
            return {
              id: attr.id,
              values: form.getFieldValue(`attr-${attr.id}-${item.id}`)
            }
          })
        }).filter(item => item != null)
      }

      const newProductItem = product_item.map(item=>({
        id: item.id,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        price_sale: item.price_sale,
        variants: variant.map((value)=>{
          return {
            variant: value.name,
            attribute: item[value.name]
          }
        }, {}),
        status: item.status
      }))

      const productDeletes = products.filter(item=>{
        return newProductItem.findIndex(itemC => itemC.id === item.id) == -1 ? true : false
      }).map(item=>item.id)

      const formdata = new FormData();

      if (imageUrl) {
        formdata.append('thumbnail', imageUrl);
      }  

      formdata.append('gallery', JSON.stringify(payloadGallery));
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
      formdata.append('product_deletes', JSON.stringify(productDeletes));    

      try{
        dispatch(setLoading(true))
        await updateProduct({id: id, newProduct: formdata});
        dispatch(setLoading(false))
        popupSuccess('Add category success')
        refetch()
        navigate('..')
      }catch(e){
        popupError('Cập nhật không thành công')
      }
    }
    
  }

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    }
  );

  const handleSetDetail = () => {
    setVariant([
        ...variant,
      {
        id: Date.now() + '',
        name: '',
        attribute: []
      }
    ])
  }
  
  const handleRemoveDetail = (name: string) => {  
    const updatedVariant = variant.filter((item)=>{
      const variants = form.getFieldValue('variant');
      if(item.id == name){
        const newVariant = variants.map((itemc)=>{
          delete itemc[item.name]
          return {
            ...itemc,
          }
        })
        form.setFieldValue('variant', newVariant)
      }
      return item.id != name
    })  
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
        setPayloadGallery({
          ...payloadGallery,
          add: [
            ...payloadGallery.add ?? [],
            newFile
          ]
        })   
           
      }
    }
    e.target.value = null;
      
  }  

  const handleDeleteGallery = (index: number, id: string) => {    
    numberFile.current--
    setGallery([
      ...gallery.filter((item, key) => key != index)
    ])
    
    if(id){
      if(payloadGallery.delete && payloadGallery.delete.indexOf(id) != -1){
        return
      }else{
        setPayloadGallery({
          ...payloadGallery,
          delete: [
            ...payloadGallery.delete ?? [],
            id
          ]
        })
      }
    }
  }  

  const handleAdd = () => {
      // Thêm mục mới với dữ liệu mặc định
      form.setFieldsValue({
          variant: [
              ...form.getFieldValue('variant'),
              {
                image: '',
                quantity: null,
                price: null,
                price_sale: null,
                sku: '',
                status: 'new'
              }
          ]
      });
  };

  useEffect(()=>{
    if(product && !isLoadingProduct){
      const {name, content, category_id, brand_id, category, products, is_active, is_hot_deal, is_good_deal, is_new, is_show_home, galleries} = product.data
      const variantModels: variant[] = product.variants
      const variantSet = products.map((item)=>({
        id: item.id,
        ...item.variants.reduce((acc, item)=>{
          acc[item.variant_name] = item.name
          return acc
        }, {}),
        imageUrl: item.image,
        quantity: item.quantity,
        price: item.price,
        price_sale: item.price_sale,
        status: 'edit'
      }))

      const addForm = {
        name,
        category_id,
        brand_id,
        content,
        variant: variantSet,
        is_active,
        is_hot_deal,
        is_good_deal,
        is_new,
        is_show_home
      }
      setEditor(`${content}`)
      setCategory(category)
      category.details.forEach((item)=>{
        item.attributes.forEach((attr)=>{
          form.setFieldValue(`attr-${attr.id}-${item.id}`, attr.values.map((attr)=>attr.name))
        })
      })
      setGallery([
        ...gallery,
        ...galleries.
        filter((item) => 
          gallery.findIndex(itemCheck => 
            itemCheck.id === item.id
          ) === -1
        ).map((item)=>({
            id: item.id,
            displayPic: item.image
          })
        )
      ]);
      setVariant([
        ...variantModels
      ])
      variantModels.forEach((item: variant)=>{
        form.setFieldValue(`input-${item.id}`, item.name)
        item.attribute.forEach((item)=>{
          form.setFieldValue(`attr-value-${item.id}`, item.value)
        })
      })

      form.setFieldsValue(addForm)
    }
  }, [product])

  return (
    <>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className='p-10 relative'
      >
        <Flex className='mb-5' align='center' gap={20}>
          <Flex className='p-3 rounded-xl bg-[#fff] cursor-pointer' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', }}
            onClick={()=>{
              navigate('..')
            }}
          >
            <ArrowBackRoundedIcon/>
          </Flex>
          <Flex vertical>
            <h2 className='font-bold text-[24px]'>Chỉnh sửa sản phẩm</h2>
            <span className='text-gray-500'>Quay lại trang danh sách sản phẩm</span>
          </Flex>
        </Flex>
        <Flex vertical gap={30}>
          <Row gutter={[24, 32]} align={'stretch'}>
            <Col span={19}>
              <Flex vertical className='' gap={30}>

                {/* General */}
                <div className=' p-[1.75rem] rounded-xl h-full bg-[#ffff]' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', }}>
                  <Flex align='center' justify='space-between'>
                    <h2 className='mb-5 font-bold text-[20px]'>Thông tin chung</h2>
                    <Button htmlType='submit'>Cập nhật</Button>
                  </Flex>

                  <Flex vertical  gap={5} className='rounded-xl p-[1.75rem] border-[1px]'>
                    <Flex vertical gap={10}>
                      <h3 className='font-bold text-[16px]'>Tên sản phẩm</h3>
                      <Form.Item
                        name='name'
                        className='w-full flex flex-col'
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                          { max: 120, message: 'Tên không vượt quá 120 ký tự' },
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
                        {
                        
                        <LexicalEditor form={form} defaultValue={editor} />
                        
                        }
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
                                      handleDeleteGallery(index, item.id ?? '')
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
                                  name={`attr-${attr.id}-${item.id}`} 
                                >
                                  <Select
                                    className='custom-seclect'
                                    mode='tags'
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
                          <VariantUpdate 
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

                        <Button
                            type="dashed"
                            onClick={handleAdd}
                            icon={<PlusOutlined />}
                        >
                            Add
                        </Button>
                  </Flex>
                  {
                    category
                    ?
                    <TableVariantDemo variant={variant} form={form}/>
                    :
                    ''
                  }
                </Flex>
                {/* Variant */}
              </Flex>
            </Col>
            <Col span={5} className='w-full'>
              <OptionUpdate setImageUrl={setImageUrl} setCategory={setCategory} thumbnail={product?.data?.thumbnail} variant={variant} setVariant={setVariant} form={form}/>
            </Col>
          </Row>
        </Flex>
      </Form> 
    </>
  )
}
export default React.memo(EditProduct)