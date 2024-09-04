import React, { useRef, useState, useCallback } from 'react';
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


interface Attribute {
    id: string,
    value: string,
    image: File | null,
    url: string | null
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
        detail_id: string,
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

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function Variant({ keyValue, detail, show, setDetail, handleRemoveDetail, form, variantModel, category, setCategory }: ButtonEditProps) {

    const [edit, setEdit] = useState(true);
    const inputRef = useRef<null>(null);
    const [inputField, setInputField] = useState<number>(1);
    const [options, setOptions] = useState<Variants[]>([])

    const [name, setName] = useState('');
    const [variantOption, setVariantOption] = useState('');
    const inputRefT = useRef<InputRef>(null);
    const inputFileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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
        
        setCategory({
            ...category,
            variants: [
                ...category.variants,
                {
                    id: Date.now() + getRandomNumber(),
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

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

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
            const {data} = await axios.post('http://127.0.0.1:8000/api/option', { name: value })
            setOptions(data.data.variants)

        }catch(error){
            console.log(error);
        }
    };

    const handleRemoveOption = (id: string) => {
        if (inputField > 1) {
            const variants = form.getFieldsValue().variant;

            if(variants){
                const variantKeys = Object.keys(variants)

                const variantKey = variantKeys.filter((item)=>{
                    const idVariant = item.split('-')[show];                
                    return idVariant != id
                });            

                const resetVariant = variantKey.reduce((acc, key) => {
                    acc[key] = variants[key];
                    return acc;
                }, {} as Record<string, any>);    
                form.setFieldValue('variant', resetVariant)
            }
            
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
        }
    };

    const handleAddFieldDebounced = useCallback(debounce((value, index, id) => {        
        if (index === inputField) {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: [
                            ...field.attribute.map((attr) => {
                                if (attr.id === id) {
                                    return {
                                        ...attr,
                                        value: value
                                    };
                                }
                                return attr;
                            }),
                            {
                                id: Date.now() + '',
                                value: ''
                            }
                        ]
                    };
                }
                return field;
            });
            setDetail(newFields);
            setInputField(inputField + 1);
        } else {                        
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
        }
    }, 300), [detail, keyValue, inputField]);

    const handleAddField = (e, index, id) => {
        handleAddFieldDebounced(e, index, id);
    };

    const selectedImg = async (e, id: string) => {
        const types = [
            'jpeg',
            'png',
            'jpg',
            'gif',
        ];

        const fileSelected = e.target.files[0];

        const size = fileSelected.size;
        const type = types.includes(fileSelected.type.replace('image/', ''));

        const newFile = await getBase64(fileSelected);

        if (size <= 1048576 && type) {
            const newDetail = detail.map((item) => {
                return {
                    ...item,
                    attribute: item.attribute.map((attr) => {
                        if (attr.id === id) {
                            return {
                                ...attr,
                                image: newFile,
                                url: URL.createObjectURL(fileSelected)
                            };
                        }
                        return attr;
                    })
                };
            });
            setDetail(newDetail);
        } else {
            e.target.value = '';
        }
    };

    const handleRemoveImage = (id: string) => {
        const newDetail = detail.map((item) => {
            return {
                ...item,
                attribute: item.attribute.map((attr) => {
                    if (attr.id === id) {
                        return {
                            ...attr,
                            image: null,
                            url: null
                        };
                    }
                    return attr;
                })
            };
        });
        setDetail(newDetail);
        
    };                
    
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
                            options={category && category.variants.map((item) => ({ label: item.name, value: item.name }))}
                        />
                    </Form.Item>
                </Flex>
            </div>
            <hr />
            <Flex vertical gap={10}>
                <h3 className='font-bold'>Thuộc tính biến thể</h3>
                <Flex className='' wrap gap={25}>
                    {variantModel.attribute.map((value, index) => (
                        <div key={value.id} className='w-[23%]'>
                            {
                                index < 5
                                ? 
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
                                    getValueFromEvent={(event) => {
                                        // Nếu sự kiện đến từ Input, bỏ qua dữ liệu
                                        if (event.target.tagName === 'INPUT') {
                                          return form.getFieldValue(`attr-value-${value.id}`);
                                        }
                                        return event;
                                    }}
                                >
                                   
                                    <Flex className='relative w-full' align='center' gap={10}>
                                        {
                                            show === 0
                                            ? 
                                            <div 
                                                style={{ 
                                                    height: '50px', 
                                                    width: '50px', 
                                                    overflow: 'hidden', 
                                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', 
                                                    flex: '0 0 50px' // Giữ chiều rộng cố định cho hình ảnh 
                                                }} 
                                                className='border-none rounded-[12px] '
                                            >
                                                {
                                                    value.url
                                                    ? 
                                                    <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'
                                                    >
                                                        <img src={value.url} alt="" className='object-cover h-[100%] object-center' style={{ width: '100%' }} />
                                                        <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                                        <DeleteOutlined onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveImage(value.id)
                                                        }} className=" duration-1000 opacity-0 group-hover:opacity-100 absolute left-[50%] top-[50%]" style={{ transform: 'translate(-50%, -50%)', zIndex: 999, fontSize: "20px", color: 'white' }} />
                                                    </div>
                                                    : 
                                                    <Flex className='border-dashed border-2 relative hover:bg-gray-100 bg-white hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "100%", borderRadius: '12px' }}
                                                    onClick={()=>{
                                                        inputFileRefs.current[value.id]?.click();
                                                    }}
                                                    >
                                                        <Flex vertical gap={10} style={{ width: '100%' }}>
                                                            <Flex vertical align='center' justify='center'>
                                                                <CloudUploadOutlined style={{ fontSize: '10px', color: 'gray' }} className='' />
                                                            </Flex>
                                                        </Flex>
                                                    </Flex>
                                                }
                                            </div>
                                            : 
                                            ''
                                        }

                                        <Select
                                            placeholder="Chọn hoặc thêm"
                                            className='h-[40px]'
                                            onChange={(e) => {
                                                form.setFieldValue(`attr-value-${value.id}`, e)
                                                form.validateFields([`attr-value-${value.id}`])
                                                handleAddField(e, index + 1, value.id)
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
                                            options={options && options.map((item) => ({ label: item.name, value: item.name }))}
                                        />
                                        
                                            
                                        {
                                            index < inputField - 1
                                            ? 
                                            (
                                                <div className='w-[25px] h-[25px] rounded-full bg-[#fff] absolute top-[-10px] right-[-10px] flex items-center justify-center hover:text-blue-500 cursor-pointer overflow-hidden' style={{boxShadow: '0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075)'}} onClick={(e)=>{
                                                    e.stopPropagation()
                                                    handleRemoveOption(value.id)
                                                }}>
                                                    <CloseRoundedIcon style={{fontSize: 15}} />
                                                    
                                                </div>
                                            )
                                            : 
                                            ''
                                        }
                                    </Flex>
                                </Form.Item>
                                : 
                                ''
                            }
                            <input 
                                type="file" 
                                accept="image/*" 
                                name="image" 
                                id="image" 
                                multiple 
                                className='opacity-0' 
                                style={{display: 'none'}}
                                onChange={(e) => selectedImg(e, value.id)}
                                ref={(el) => inputFileRefs.current[value.id] = el}
                            />
                        </div>
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
}

