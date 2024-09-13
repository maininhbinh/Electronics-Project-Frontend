import { Badge, Button, Divider, Dropdown, Flex, Form, Input, InputNumber, Select, Space, Table, TableColumnsType } from 'antd';
import React, { Children, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined, DownOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined  } from '@ant-design/icons';
import { FormInstance } from 'antd/lib';


interface attribute{
    id: string,
    value: string,
}
interface variant{
    id: string,
    name: string,
    attribute: attribute[]
}

interface TableVariantProps {
    variant: Array<variant>;
    form: FormInstance
}

export default function TableVariantDemo({variant, form}: TableVariantProps) {

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });

    const handelRemoveImage = (name) => {
        form.setFieldsValue({
            variant: {
              [name]: {
                image: null,
                imageUrl: null
              },
            },
          });
    }
    const selectedImgVariant = async (e, name) => {
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
            const imageBase64 = await getBase64(fileSelected)
              form.setFieldsValue({
                variant: {
                  [name]: {
                    image: imageBase64,
                    imageUrl: URL.createObjectURL(fileSelected)
                  },
                },
              });
              
          } else {
            e.target.value = ''
          }
    }

    const columns = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'image',
            key: 'image',
            align: 'center'
        },
        ...variant.map((item) => ({
            title: item.name,
            dataIndex: item.name,
            key: item.name,
            width: '200px'
        })),
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Giá sale',
            dataIndex: 'price_sale',
            key: 'price_sale',
        },
        {
            title: 'Hành động',
            dataIndex: '',
            render: (text, record, index) => (
                <Button onClick={()=>{
                    handleRemove(index)
                }}>Xóa</Button>
            ),
        },
    ];

    const handleRemove = (index) => {
        const fields = form.getFieldValue('variant');
        if(fields.length <= 1){
            return
        }
        fields.splice(index, 1);
        form.setFieldsValue({
            variant: [...fields]
        });
    };

    const getDataSource = (fields) => {
        return fields.map(({ key, name, ...restField }) => ({
            key: name,
            image: (
                <div style={{ height: '50px', width: '50px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
                    {
                        form.getFieldValue(['variant',name, 'imageUrl'])
                        ?
                        <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                            <img src={form.getFieldValue(['variant',name, 'imageUrl']) } alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
                            <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                <DeleteOutlined onClick={() => handelRemoveImage(name)} className=" duration-1000 opacity-0 group-hover:opacity-100 absolute left-[50%] top-[50%]" style={{transform: 'translate(-50%, -50%)', zIndex: 999, fontSize: "20px", color: 'white'}} />
                        </div>
                        :
                        <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "100%", borderRadius: '12px' }}>
                            <Flex vertical gap={10} style={{ width: '100%' }}>
                                <Flex vertical align='center' justify='center'>
                                    <CloudUploadOutlined style={{ fontSize: '10px', color: 'gray' }} className='' />
                                </Flex>
                            </Flex>
                            <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                                onChange={(e)=> selectedImgVariant(e, name)}
                            />
                        </Flex>
                    }
                </div>
            ),
            ...variant.reduce((acc, v) => {
                acc[v.name] = (
                    <Form.Item
                        className='my-6 w-[200px]'
                        name={[name, v.name]}
                        dependencies={[`variant[${name}].${v.name}`]}
                        rules={[
                            {
                                required: true,
                                message: 'Không được bỏ trống'
                            },
                            {
                                validator: (_, value)=>{
                                    const variants = form.getFieldValue('variant');
                                    const areVariantsUnique = (variants) => {
                                        const seen = new Set();
                                        

                                        for (const variantt of variants) {
                                            // Tạo chuỗi đại diện cho color và ram
                                            
                                            const variantKey = variant.filter((item)=>variantt[item.name]).map((item)=>variantt[item.name]);
                                            if(variantKey && variantKey.length < 1) continue
                                            
                                            const variantStringfy = JSON.stringify(variantKey)
                                            
                                            if (seen.has(variantStringfy)) {
                                                return false; // Nếu đã thấy biến thể này thì có trùng lặp
                                            }
                                            seen.add(variantStringfy); // Thêm biến thể vào Set
                                        }
                                        return true; // Nếu không có trùng lặp
                                    };
                                    
                                    const result = areVariantsUnique(variants);
                                    
                                    if(!result){
                                        return Promise.reject('Các biến thể không được trùng')
                                    }
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Select
                            placeholder="Chọn hoặc thêm biến thể sản phẩm"
                            className='m-0 h-[40px]'      
                            options={variant.find(attr => attr.name === v.name)?.attribute.map(item => ({ label: item.value, value: item.value }))}
                        />
                    </Form.Item>
                );
                return acc;
            }, {}),
            quantity: (
                <Form.Item
                    name={[name, 'quantity']}
                    className='my-6'
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                >
                    <InputNumber placeholder='Nhập số lượng' className='border-gray-300 w-full' min={0} />
                </Form.Item>
            ),
            price: (
                <Form.Item
                    name={[name, 'price']}
                    className='my-6'
                    rules={[{ required: true, message: 'Nhập số tiền!' }]}
                >
                    <InputNumber
                        placeholder='Nhập giá tiền'
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        className='border-gray-300 w-full'
                        min={0}
                    />
                </Form.Item>
            ),
            price_sale: (
                <Form.Item
                    name={[name, 'price_sale']}
                    className='my-6'
                    rules={[
                        { required: true, message: 'Nhập giá sale!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const price = parseFloat(getFieldValue(['variant', name, 'price']));
                
                                if (price > value) {
                                    return Promise.resolve();
                                }
                                
                                return Promise.reject(new Error('Phải nhỏ hơn giá bán'));
                            },
                        }),
                    ]}
                >
                    <InputNumber
                        placeholder='Nhập giá sale'
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        className='border-gray-300 w-full'
                        min={0}
                    />
                </Form.Item>
            ),
        }));
    };

    return (
        <>
        <Flex gap={20} vertical>
            <Form.List
                name={'variant'}
            >
                {(fields, { add, remove }) => (
                    <>
                        <Table 
                        dataSource={getDataSource(fields)} 
                        columns={columns} 
                        className="relative overflow-x-auto sm:rounded-xl" 
                        style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}} 
                        pagination={false}
                        />
                    </>
                )}
            </Form.List>
        </Flex>
        </>
    )
}