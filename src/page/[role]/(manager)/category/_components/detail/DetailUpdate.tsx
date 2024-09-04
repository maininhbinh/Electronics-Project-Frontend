import React, { useRef, useState, useCallback, useEffect } from 'react';
import { EditOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputRef, Select, Space, UploadProps } from 'antd';
import { Flex } from 'antd';
import { FormInstance } from 'antd/es/form';
import debounce from 'lodash.debounce'; 
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { GetProp } from 'antd/lib';
import getRandomNumber from '@/utils/randomNumber';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { instanceTest } from '@/api/axios';
import { useGetDetailsQuery } from '@/app/endPoint/DetailEndPoint';


interface Attribute {
    id: string,
    name: string,
}

interface Detail {
    id: string,
    name: string,
    attributes: Attribute[]
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
    }[]
}

interface ButtonEditProps {
    keyValue: string;
    handleRemoveDetail: (name: any) => void;
    detail: Array<Detail>;
    setDetail: React.Dispatch<React.SetStateAction<any>>;
    form: FormInstance;
    detailModel: Detail;
    useDetails: Variants[]
    setUseDetails: React.Dispatch<React.SetStateAction<any>>;
    data: {
        data: Array<Detail>
    }
}

interface Variants {
    id: string,
    name: string
}

export default function DetailUpdate({ keyValue, detail, setDetail, handleRemoveDetail, form, detailModel, useDetails, setUseDetails, data}: ButtonEditProps) {

    const [edit, setEdit] = useState(true);
    const inputRef = useRef<null>(null);
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState<Variants[]>([])    

    const [name, setName] = useState('');
    const [variantOption, setVariantOption] = useState('');
    const inputRefT = useRef<InputRef>(null);

    const onVariantOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantOption(event.target.value);
    };

    const addVariantOptionChange = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        
        
        const checkOptionSame = options ? options.findIndex((item: Variants, index: number): boolean=>{
            return item.name == variantOption
        }) : -1;
        
        if(checkOptionSame >= 0 || variantOption.length > 150 || variantOption.length < 1){
            return false
        }
        const newOptions = [
            ...options ?? [],
           {
            id: Date.now() + getRandomNumber() + '',
            name: variantOption
           }
        ];
        setOptions(newOptions);
        
        setVariantOption('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const validateNoDuplicate = (fieldName: string) => (_, value) => {
        const fields = form.getFieldsValue();
        const inputValues = Object.keys(fields)
            .filter(key => key.startsWith(fieldName))
            .map(key => fields[key]);

        const duplicateValues = inputValues.filter((item) => item === value && item);

        if (duplicateValues.length > 1) {
            return Promise.reject(`không được trùng với các cột khác!`);
        }
        return Promise.resolve();
    };

    const validateOption = (fieldName: string) => (_, value) => {
        const fields = form.getFieldsValue();
        const inputValues = Object.keys(fields)
            .filter(key => key.startsWith(fieldName))
            .map(key => fields[key]);

        const duplicateValues = inputValues.filter((item) => item === value && item);

        if (duplicateValues.length > 1) {
            return Promise.reject(`không được trùng với các cột khác!`);
        }
        return Promise.resolve();
    };

    const handleChangeParentDebounced = useCallback(debounce((parent) => {        
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attributes: [],
                    name: parent
                };
            }
            return field;
        });

        setDetail(newFields);
    }, 500), [detail, keyValue]);

    const handleChangeParent = async (value: string) => {   
        handleChangeParentDebounced(value);
        try{
                    
            const {data} = await instanceTest.post('/attribute/detail/name', {name: value})
            
            setOptions(data.data)            
        }catch(error){
            console.log(error);
        }
    };

    const handleRemoveOption = (id: string, value: string) => {
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attributes: field.attributes.filter((item) => item.id !== id)
                };
            }
            return field;
        });
        setDetail(newFields);
    };

    const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const checkOptionSame = detail.findIndex((item: Variants, index: number): boolean=>{
            return item.name == name
        });
        
        if(checkOptionSame >= 0 || name.length > 150 || name.length <= 0){
            
            return false
        }
        const id = Date.now() + getRandomNumber();
        
        setUseDetails([
            ...useDetails,
            {
                id,
                name: name
            }
        ])
        
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleAdd = useCallback(debounce((value) => {    
        const id = Date.now() + getRandomNumber();
        const detailCheck = detail.findIndex(item=>{
            return item.attributes.findIndex(itemC=>itemC.name === value) >= 0
        })
        
       if(detailCheck < 0){
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attributes: [
                        ...field.attributes,
                        {
                            id,
                            name: value
                        }
                    ]
                };
            }
            return field;
        });
        setDetail(newFields);
        setValue(null);
        form.setFieldValue(`attr-value-${id}`, value)
       }
    }, 300), [detail, keyValue])

    const handleUpdateFieldDebounced = useCallback(debounce((value, index, id) => {                              
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attributes: field.attributes.map((attr) => {
                        if (attr.id === id) {
                            return {
                                ...attr,
                                value: value
                            };
                        }
                        return attr;
                    })
                };
            }
            return field;
        });
        setDetail(newFields);
        
    }, 300), [detail, keyValue]);

    const handleUpdateField = (e, index, id) => {
        handleUpdateFieldDebounced(e, index, id);
    };     

    useEffect(()=>{
        
        if(data && data.data){
            (async()=>{
                try{
                    console.log(detailModel);
                    
                    const {data: dataDetail} = await instanceTest.post('/attribute/detail/name', {name: detailModel.name})
                    setOptions(dataDetail.data)            
                }catch(error){
                    console.log(error);
                }
            })()
        }
        
    }, [data])

    return (
        <Flex vertical gap={10} className='sm:rounded-xl overflow-hidden relative p-5 border-[1px]'>
            <Flex justify='center' align='center' className='p-1 rounded-md border-[1px] absolute right-2 top-2 cursor-pointer'>
                <MinusOutlined className=' ' onClick={() => { handleRemoveDetail(keyValue) }} />
            </Flex>
            <div>
                <Flex vertical gap={10}>
                    <h3 className='font-bold'>Chi tiết sản phẩm</h3>
                    <div className={`relative inline pr-5 ${edit ? 'hidden' : ''}`} >
                        <EditOutlined onClick={() => {
                            setEdit(true);
                            setTimeout(() => {
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }, 0);
                        }} className=' absolute top-0 right-0 hover:cursor-pointer' />
                    </div>
                    <Form.Item
                        name={`input-${keyValue}`}
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                            {
                                validator: validateNoDuplicate(`input-`)
                            },
                        ]}
                        className={`m-0 ${!edit ? 'hidden' : ''} `}
                    >
                        <Select
                            style={{ width: '23%' }}
                            placeholder="Chọn hoặc thêm biến thể sản phẩm"
                            disabled={form.getFieldValue(`input-${keyValue}`) ? true : false}
                            className='m-0 h-[40px]'
                            onChange={(value)=>{
                                form.validateFields([`input-${keyValue}`]).then(() => {
                                    // After validation, get any errors for this field
                                    const errorMessages = form.getFieldError(`input-${keyValue}`);
                                    if (errorMessages.length > 0) {
                                      console.log(errorMessages);
                                    } else {
                                      handleChangeParent(value);
                                    }
                                  }).catch(err => {
                                    // Handle form validation errors
                                    const errorMessages = form.getFieldError(`input-${keyValue}`);
                                    console.log(errorMessages);
                                  });
                            }}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRefT}
                                            value={name}
                                            onChange={(e)=>{ setName(e.target.value);}}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            options={useDetails && useDetails.map((item)=>{
                                const check = detail.findIndex((itemC)=> itemC.name == item.name)
                                return {label: item.name, value: item.name, disabled: check < 0 ? false : true}
                            })}
                        />
                    </Form.Item>
                </Flex>
            </div>
            <hr />
            <Flex vertical gap={10}>
                <h3 className='font-bold'>Thông số kĩ thuật</h3>
                <Flex className='' wrap gap={25}>
                    {detailModel.attributes.map((value, index) => (
                        <div key={value.id} className='w-[23%] relative'>
                            {
                                <>
                                    <Form.Item
                                    name={`attr-value-${value.id}`}
                                    className='m-0 relative w-full'
                                    rules={[
                                        {
                                            required: true,
                                            validator: (_, name) => {
                                                if (index === 0 && !name) {
                                                    return Promise.reject('Không được để trống');
                                                }
                                                return Promise.resolve();
                                            }
                                        },
                                        {
                                            validator: validateOption('attr-value-')
                                        },
                                    ]}
                                    >
                                    
                                        <Select
                                            placeholder="Chọn hoặc thêm"
                                            className='h-[40px]'
                                            disabled={form.getFieldValue(`attr-value-${value.id}`) ? true : false}
                                            onChange={(e) => {
                                                handleUpdateField(e, index + 1, value.id)
                                            }}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <Divider style={{ margin: '8px 0' }} />
                                                    <Space className='w-full'>
                                                        <Input
                                                            placeholder="Please enter item"
                                                            value={variantOption}
                                                            ref={inputRefT}
                                                            onChange={(e)=>{
                                                                onVariantOptionChange(e)
                                                            }}
                                                            onKeyDown={(e) => {
                                                                e.stopPropagation()
                                                            }}
                                                        />
                                                        <Button type="text" icon={<PlusOutlined />} onClick={addVariantOptionChange}>
                                                            Thêm
                                                        </Button>
                                                    </Space>
                                                </>
                                            )}
                                            options={options && options.map((item)=>{
                                                const check = detailModel.attributes.findIndex((atrr)=>atrr.name == item.name);
                                                return {label: item.name, value: item.name, disabled: check < 0 ? false : true}
                                            })}
                                        />
                                    </Form.Item>
                                    <div className='w-[25px] h-[25px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' style={{boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} onClick={(e)=>{
                                        e.stopPropagation()
                                        handleRemoveOption(value.id, value.name)
                                    }}>
                                        <CloseRoundedIcon style={{fontSize: 15}} />
                                        
                                    </div>
                                </>
                            }
                        </div>
                    ))}
                    {
                        <div className='w-[23%]'>
                            <div className='m-0 relative w-full'>
                                <Select
                                    placeholder="Chọn hoặc thêm"
                                    className='h-[40px] w-full'
                                    value={value}
                                    onChange={(e) => {
                                        handleAdd(e)
                                    }}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space className='w-full'>
                                                <Input
                                                    placeholder="Please enter item"
                                                    value={variantOption}
                                                    ref={inputRefT}
                                                    onChange={(e)=>{
                                                        onVariantOptionChange(e)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        e.stopPropagation()
                                                    }}
                                                />
                                                <Button type="text" icon={<PlusOutlined />} onClick={addVariantOptionChange}>
                                                    Thêm
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                    options={options && options.map((item)=>{
                                        const check = detailModel.attributes.findIndex((atrr)=>{
                                            return atrr.name == item.name   
                                        });
                                        return {label: item.name, value: item.name, disabled: check < 0 ? false : true}
                                    })}
                                />
                            </div>
                        </div>
                    }
                </Flex>
            </Flex>
        </Flex>
    );
}

