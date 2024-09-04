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


interface Attribute {
    id: string,
    value: string,
}

interface Variant {
    id: string,
    name: string,
    attribute: Attribute[]
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
    detail: Array<Variant>;
    setDetail: React.Dispatch<React.SetStateAction<any>>;
    show: number;
    form: FormInstance;
    variantModel: Variant;
    category: Category
    setCategory: React.Dispatch<React.SetStateAction<any>>;
}

interface Variants {
    id: string,
    name: string
}

export default function VariantUpdate({ keyValue, detail, show, setDetail, handleRemoveDetail, form, variantModel, category, setCategory }: ButtonEditProps) {

    const [edit, setEdit] = useState(true);
    const inputRef = useRef<null>(null);
    const [value, setValue] = useState(null);
    const [inputField, setInputField] = useState<number>(variantModel.attribute.length);
    const [options, setOptions] = useState<Variants[]>([])

    const [name, setName] = useState('');
    const [variantOption, setVariantOption] = useState('');
    const inputRefT = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const onVariantOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantOption(event.target.value);
    };

    const addVariantOptionChange = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        
        const checkOptionSame = options.findIndex((item: Variants, index: number): boolean=>{
            return item.name == variantOption
        });
        
        if(checkOptionSame >= 0 || variantOption.length > 15 || variantOption.length < 1){
            return false
        }

        setOptions([
            ...options,
           {
            id: Date.now() + getRandomNumber() + '',
            name: variantOption
           }
        ]);

        setVariantOption('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const checkOptionSame = category.variants.findIndex((item: Variants, index: number): boolean=>{
            return item.name == name
        });
        
        if(checkOptionSame >= 0 || name.length > 15 || name.length <= 0){
            
            return false
        }
        const id = Date.now() + getRandomNumber();
        
        setCategory({
            ...category,
            variants: [
                ...category.variants,
                {
                    id,
                    category_id: '',
                    name: name
                }
            ]
        })
        
        setName('');
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
                const variants = form.getFieldValue('variant');
                const newVariant = variants.map((item)=>{
                    delete item[field.name]                    
                    return {
                        ...item,
                    }
                })
                console.log(newVariant);
                
                form.setFieldValue('variant', newVariant)
                return {
                    ...field,
                    attribute: [],
                    name: parent
                };
            }
            return field;
        });
        variantModel.attribute.forEach((item)=>{
            form.setFieldValue(`attr-value-${item.id}`, '')
        })

       
        
        
        setDetail(newFields);
    }, 500), [detail, keyValue]);

    const handleChangeParent = async (value: string) => {   
        handleChangeParentDebounced(value);
        try{
            const {data} = await instanceTest.post('/option', { name: variantModel.name })
            setOptions(data.data.variants)
        }catch(error){
            console.log(error);
            
        }
    };

    const handleRemoveOption = (id: string, value: string) => {
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attribute: field.attribute.filter((item) => item.id !== id)
                };
            }
            return field;
        });
        setDetail(newFields);
        setInputField(inputField - 1);
        const variants = form.getFieldValue('variant');
        const newVariant = variants.map((item)=>{
            if(item[variantModel.name] == value){
                return {
                    ...item,
                    [variantModel.name]: ''
                }
            }

            return item
        })
        form.setFieldValue('variant', newVariant)
        
        
    };

    const handleAdd = useCallback(debounce((value) => {    
        const id = Date.now() + getRandomNumber();
        const detailCheck = detail.findIndex(item=>{
            return item.attribute.findIndex(itemC=>itemC.value === value) >= 0
        })
        
       if(detailCheck < 0){
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attribute: [
                        ...field.attribute,
                        {
                            id,
                            value: value
                        }
                    ]
                };
            }
            return field;
        });
        setDetail(newFields);
        setInputField(inputField + 1);
        setValue(null);
        form.setFieldValue(`attr-value-${id}`, value)
       }
    }, 300), [detail, keyValue, inputField])

    const handleUpdateFieldDebounced = useCallback(debounce((value, index, id) => {                              
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    attribute: field.attribute.map((attr) => {
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
        
    }, 300), [detail, keyValue, inputField]);

    const handleUpdateField = (e, index, id) => {
        handleUpdateFieldDebounced(e, index, id);
    };     
    
    useEffect(()=>{
        (async()=>{
            const {data} = await instanceTest.post('/option', { name: variantModel.name })
            setOptions(data.data.variants)
        })()
    }, [variantModel])
    
    return (
        <Flex vertical gap={10} className='sm:rounded-xl overflow-hidden relative p-5 border-[1px]'>
            <Flex justify='center' align='center' className='p-1 rounded-md border-[1px] absolute right-2 top-2 cursor-pointer'>
                <MinusOutlined className=' ' onClick={() => { handleRemoveDetail(keyValue) }} />
            </Flex>
            <div>
                <Flex vertical gap={10}>
                    <h3 className='font-bold'>Tên biến thể</h3>
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
                            { max: 15, message: 'Tên không vượt quá 15 ký tự' },
                        ]}
                        className={`m-0 ${!edit ? 'hidden' : ''} `}
                    >
                        <Select
                            style={{ width: '23%' }}
                            placeholder="Chọn hoặc thêm biến thể sản phẩm"
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
                                            onChange={onNameChange}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            options={category && category.variants.map((item) => {
                                const check = detail.findIndex(itemC=>itemC.name == item.name);
                                return { 
                                    label: item.name, 
                                    value: item.name,
                                    disabled: check < 0 ? false : true
                                }
                            })}
                        />
                    </Form.Item>
                </Flex>
            </div>
            <hr />
            <Flex vertical gap={10}>
                <h3 className='font-bold'>Thuộc tính biến thể</h3>
                <Flex className='' wrap gap={25}>
                    {variantModel.attribute.map((value, index) => (
                        <div key={value.id} className='w-[23%] relative'>
                            {
                                index < 5
                                ? 
                                (
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

                                                if (index + 1 < inputField && !name) {
                                                    return Promise.reject('Không được để trống');
                                                }
                                                return Promise.resolve();
                                            }
                                        },
                                        {
                                            validator: validateOption('attr-value-')
                                        },
                                        {
                                            max: 15,
                                            message: 'Không được vượt quá 15 kí tự'
                                        }
                                    ]}
                                    >
                                    
                                        <Select
                                            placeholder="Chọn hoặc thêm"
                                            className='h-[40px]'
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
                                                const check = variantModel.attribute.findIndex((atrr)=>atrr.value == item.name);
                                                return {label: item.name, value: item.name, disabled: check < 0 ? false : true}
                                            })}
                                        />
                                    </Form.Item>
                                    <div className='w-[25px] h-[25px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' style={{boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} onClick={(e)=>{
                                        e.stopPropagation()
                                        handleRemoveOption(value.id, value.value)
                                    }}>
                                        <CloseRoundedIcon style={{fontSize: 15}} />
                                        
                                    </div>
                                </>
                                )
                                : 
                                ''
                            }
                        </div>
                    ))}
                    {
                        variantModel.attribute.length < 5
                        ?
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
                                        const check = variantModel.attribute.findIndex((atrr)=>atrr.value == item.name);
                                        return {label: item.name, value: item.name, disabled: check < 0 ? false : true}
                                    })}
                                />
                            </div>
                        </div>
                        :
                        ''
                    }
                </Flex>
            </Flex>
        </Flex>
    );
}

