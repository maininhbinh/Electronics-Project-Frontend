import { Button, Col, Flex, Form, Grid, Input, InputNumber, Row } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'
import { CloudUploadOutlined, DeleteOutlined  } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

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

interface TableVariantProps {
    variant: Array<variant>;
    setVariant: Dispatch<SetStateAction<variant[]>>;
    form: FormInstance
}

const TableVariant: React.FC<TableVariantProps> = ({variant, setVariant, form }) => {
    
    const selectedImgVariant = (e, id: string) => {
    
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
            const newDetail = variant.map((item)=> {
                return {
                    ...item,
                    attribute: item.attribute.map((attr)=>{                    
                        if(attr.id == id){
                            return {
                                ...attr,
                                image: fileSelected,
                                url: URL.createObjectURL(fileSelected)
                            }
                        }
                        return attr
                    })
                };
            })
            setVariant(newDetail);
            
        } else {
            e.target.value = ''
        }
    
    }
    
    const handelRemoveImage = (id: string) => {
      const newDetail = variant.map((item)=> {
          return {
              ...item,
              attribute: item.attribute.map((attr)=>{                    
                  if(attr.id == id){
                      return {
                          ...attr,
                          image: null,
                          url: null
                      }
                  }
                  return attr
              })
          };
      })
      setVariant(newDetail)
    }
    
    return (
        <>
            <Flex gap={20} vertical>
                <Form.List
                    name={'variant'}
                >
                    {() => (
                    <div className="relative overflow-x-auto sm:rounded-xl" style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}}>
                        <table className="w-full h-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-black uppercase bg-[#f6f6f6] dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {
                                    variant.map((item, key)=>(
                                        <th scope="col" className="p-6 text-center " key={key}>
                                            {item.name ? item.name : `Phân loại ${key+1}`}
                                        </th>
                                    ))
                                    }
                                    <th scope="col" className="p-6">
                                        Số lượng
                                    </th>
                                    <th scope="col" className="p-6">
                                        Giá
                                    </th>
                                    <th scope="col" className="p-6">
                                        Giá sale
                                    </th>
                                    <th scope="col" className="p-6">
                                        SKU
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                            {
                                variant[0].attribute.map((parent, index)=>(                        
                                index == 0 || index < variant[0].attribute.length - 1
                                ?
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#f6f6f6] dark:hover:bg-gray-600" key={index}>
                                    <th scope="row" className="p-6 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center min-w-[120px]">
                                        <Flex vertical align='center' justify='center' gap={10} >
                                            {parent.value}
                                            {
                                            parent.url 
                                            ?
                                            <div style={{ height: '50px', width: '50px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
                                                {
                                                    parent.url 
                                                    ?
                                                    <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                                                        <img src={parent.url } alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
                                                        <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                                            <DeleteOutlined onClick={() => handelRemoveImage(parent.id)} className=" duration-1000 opacity-0 group-hover:opacity-100 absolute left-[50%] top-[50%]" style={{transform: 'translate(-50%, -50%)', zIndex: 999, fontSize: "20px", color: 'white'}} />
                                                    </div>
                                                    :
                                                    <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "100%", borderRadius: '12px' }}>
                                                        <Flex vertical gap={10} style={{ width: '100%' }}>
                                                            <Flex vertical align='center' justify='center'>
                                                                <CloudUploadOutlined style={{ fontSize: '10px', color: 'gray' }} className='' />
                                                            </Flex>
                                                        </Flex>
                                                        <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                                                            onChange={(e)=> selectedImgVariant(e, parent.id)}
                                                        />
                                                    </Flex>
                                                }
                                            </div>
                                            :
                                            ''
                                            }
                                        </Flex>
                                    </th>
                                {
                                    variant.length < 2
                                    ?
                                    <>
                                        <td className="p-5">
                                            <Form.Item
                                                name={[parent.id, 'quantity']}
                                                className='my-6' 
                                                rules={[
                                                    { required: true, message: 'Nhập số lượng' },
                                                ]}
                                            >
                                                <InputNumber 
                                                placeholder='Nhập số lượng'
                                                className=' border-gray-300 w-full' min={0}
                                                />
                                            </Form.Item>
                                        </td>
                                        <td className="p-5">
                                            <Form.Item
                                                name={[parent.id, 'price']}
                                                className='my-6' 
                                                rules={[
                                                    { required: true, message: 'Nhập số tiền!' },
                                                ]}
                                            >
                                                <InputNumber 
                                                placeholder='Nhập giá tiền'
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                className=' border-gray-300 w-full' min={0}/>
                                            </Form.Item>
                                        </td>
                                        <td className="p-5">
                                            <Form.Item
                                                name={[parent.id, 'price_sale']}
                                                className='my-6' 
                                                dependencies={[`${parent.id}.price`]}
                                                rules={[
                                                    { required: true, message: 'Nhập giá sale!' },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            
                                                        if (!value || getFieldValue(['variant',parent.id, 'price']) > value) {
                                                            
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Phải nhỏ hơn giá bán'));
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <InputNumber 
                                                placeholder='Nhập giá sale'
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                className='border-gray-300 w-full'
                                                min={0}
                                                />
                                            </Form.Item>
                                        </td>
                                        <td className="p-5">
                                            <Form.Item
                                                name={[parent.id, 'sku']}
                                                className='my-6' 
                                            >
                                                <Input  
                                                onChange={(e)=>{
                                                    const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
                                                    const input = form.getFieldValue('variant');
                                                    input[parent.id].sku = value
                                                    
                                                    form.setFieldValue('variant', input)
                                                }}  
                                                placeholder='Nhập SKU' 
                                                />
                                            </Form.Item>
                                        </td>
                                    </>
                                    :
                                    <>
                                    <th className="p-5 min-w-[120px]">
                                        <Flex vertical className="p-0" style={{width: '100%', height: '100%'}}>

                                            {variant[1].attribute.map((item, key)=>(
                                                key ==  0 || key < variant[1].attribute.length - 1
                                                ?
                                                <Flex flex={1} align='center' justify='center' key={key}>
                                                        {item.value}
                                                </Flex>
                                                :
                                                ''
                                            ))}
                                        </Flex>

                                    </th>
                                    <td className="p-5">
                                        <Flex align='center' justify='center' className='w-full h-full' vertical>
                                            {
                                            variant[1].attribute.map((item, key)=>(
                                            key ==  0 || key < variant[1].attribute.length - 1
                                            ?
                                                <Flex flex={1} align='center' justify='center' key={key}>
                                                    <Form.Item
                                                    name={[parent.id + '-' + item.id, 'quantity']}
                                                    className='my-6'
                                                    rules={[
                                                        { required: true, message: 'Nhập số lượng' },
                                                    ]}
                                                    >
                                                        <InputNumber 
                                                            placeholder='Nhập giá số lượng'
                                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            className='border-gray-300 w-full'
                                                            min={0}
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                            :
                                            ''
                                            ))}
                                        </Flex>
                                    </td>
                                    <td className="p-5">
                                        <Flex align='center' justify='center' className='w-full h-full' vertical>
                                            {variant[1].attribute.map((item, key)=>(
                                                key ==  0 || key < variant[1].attribute.length - 1
                                                ?
                                                <Flex flex={1} align='center' justify='center' key={key}>
                                                    <Form.Item
                                                        name={[parent.id + '-' + item.id, 'price']}
                                                        className='my-6'
                                                        rules={[
                                                        { required: true, message: 'Nhập giá sản phẩm'},
                                                        
                                                        ]}
                                                    >
                                                        <InputNumber 
                                                            placeholder='Nhập giá số lượng'
                                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            className='border-gray-300 w-full'
                                                            min={0}
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                                :
                                                ''
                                            ))}
                                        </Flex>
                                    </td>
                                    <td className="p-5">
                                        <Flex align='center' justify='center' className='w-full h-full' vertical>
                                            {
                                            variant[1].attribute.map((item, key)=>(
                                                key ==  0 || key < variant[1].attribute.length - 1
                                                ?
                                                <Flex flex={1} align='center' justify='center' key={key}>
                                                    <Form.Item
                                                        name={[parent.id + '-' + item.id, 'price_sale']}
                                                        className='my-6' 
                                                        rules={[
                                                        { required: true, message: 'Nhập giá sale' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                
                                                            if (!value || getFieldValue(['variant',parent.id + '-' + item.id, 'price']) > value) {
                                                                
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Phải nhỏ hơn giá bán'));
                                                            },
                                                        }),
                                                        ]}
                                                    >
                                                        <InputNumber 
                                                            placeholder='Nhập giá số lượng'
                                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            className='border-gray-300 w-full'
                                                            min={0}
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                                :
                                                ''
                                                ))}
                                        </Flex>
                                    </td>
                                    <td className="p-5">
                                        <Flex align='center' justify='center' className='w-full h-full' vertical>
                                            {
                                            variant[1].attribute.map((item, key)=>(
                                                key ==  0 || key < variant[1].attribute.length - 1
                                                ?
                                                <Flex flex={1} align='center' justify='center' key={key}>
                                                    <Form.Item
                                                        name={[parent.id + '-' + item.id, 'sku']}
                                                        className='my-6' 
                                                    >
                                                        <Input 
                                                        size='large' 
                                                        placeholder='Nhập SKU' 
                                                        onChange={(e)=>{
                                                            const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
                                                            const input = form.getFieldValue('variant');
                                                            input[parent.id + '-' + item.id].sku = value
                                                            
                                                            form.setFieldValue('variant', input)
                                                        }} 
                                                        />
                                                    </Form.Item>
                                                </Flex>
                                                :
                                                ''
                                            ))
                                            }
                                        </Flex>
                                    </td>
                                    </>
                                }
                                </tr>
                                :
                                ''
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                    )}
                </Form.List>
            </Flex>
        </>
    )
}


export default TableVariant