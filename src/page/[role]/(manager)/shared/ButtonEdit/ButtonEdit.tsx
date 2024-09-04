import React, { Children, useEffect, useRef, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Flex, Form, Input, Select } from 'antd';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useGetDetailsQuery } from '../../details/_component/DetailsEndpoints';
import { SelectProps } from 'antd';
import { useGetAttributesQuery } from '../../attribute/_components/attribute/AttributeEndpoints';


interface ButtonEditProps {
    keyValue: string;
    handleRemoveDetail: (name: any) => void;
    detail: Array<object>;
    setDetail: React.Dispatch<React.SetStateAction<any>>
    validateNoDuplicate: (any) => void;
    validateOption: (any) => void
}

export default function ButtonEdit({ keyValue, detail, setDetail, handleRemoveDetail, validateNoDuplicate, validateOption }: ButtonEditProps) {
    const [edit, setEdit] = useState(true);
    const [value, setValue] = useState('');
    const inputRef = useRef<null>(null);
    const [inputField, setinputField] = useState<number>(1);
    const [error, setError] = useState({});
    const [no, setNo] = useState(false);
    const { data: listDetails } = useGetDetailsQuery({});
    const { data: listAtribute } = useGetAttributesQuery({})

    const optionsDetail: SelectProps['options'] = [];
    const optionsAttribute: SelectProps['options'] = [];


    const uniqueItemAttribute = Array.from(
        new Map(listAtribute?.map((item: any) => [item.name, item])).values()
    );
    const uniqueItems = Array.from(
        new Map(listDetails?.map((item: any) => [item.name, item])).values()
    );

    uniqueItems?.map((item: any) => {
        optionsDetail.push({
            value: item.name,
            label: item.name,
        });
    })

    uniqueItemAttribute?.map((item: any) => {
        optionsAttribute.push({
            value: item.name,
            label: item.name,
        });
    })
    const handelChangeParent = (value) => {
        setValue(value)
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    name: value
                };
            }
            return field;
        });
        setDetail(newFields)
    }

    const handelRemoveOption = (id) => {
        if (inputField > 1) {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: field.attribute.filter((item, i) => item.id != id)
                    };
                }
                return field;
            });
            setDetail(newFields)
            setinputField(inputField - 1)
        }
    }

    const handelAddField = (value, index, id) => {
        if (index == inputField) {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: [
                            ...field.attribute,
                            {
                                id: Date.now() + '',
                                value: ''
                            }
                        ]
                    };
                }
                return field;
            });
            setinputField(inputField + 1)
            setDetail(newFields)
        } else {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: field.attribute.map((attr) => {
                            if (attr.id == id) {
                                return {
                                    ...attr,
                                    value: value
                                }
                            }
                            return attr
                        })
                    };
                }
                return field;
            });

            setDetail(newFields)
        }
    }
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedItemAttributes, setSelectedItemsAttributes] = useState<string[]>([]);
    const handleChange = (value: string[]) => {
        if (value[0] && !no) {
            setEdit(false)
        }
        setSelectedItems(value);
        handelChangeParent(value[0])
    };

    const handleChangeAttributes = (value: string[], index: number, id: string) => {
        console.log(value[0], index, id)
        setSelectedItemsAttributes(value);
        handelAddField(value[0], index, id)

    };

    return (
        <Flex vertical gap={20} className='border border-1 rounded-md overflow-hidden relative p-8 px-10' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>

            <CloseRoundedIcon className=' absolute right-1 top-1 cursor-pointer' onClick={() => { handleRemoveDetail(keyValue) }} />

            <div>
                <>
                    <div className={`relative inline pr-5 ${edit ? 'hidden' : ''}`} >
                        <EditOutlined onClick={() => {
                            setEdit(true);
                            setTimeout(() => {
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }, 0);
                        }} className=' absolute top-0 right-0 hover:cursor-pointer' />
                        <h2 className=' font-bold  inline-block'>{value}</h2>
                    </div>
                    <Form.Item
                        name={`input-${keyValue}`}
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trông',
                            },
                            {
                                validator: validateNoDuplicate(`input-`, setNo)
                            }
                        ]}
                        className={`m-0 ${!edit ? 'hidden' : ''}`}
                    >
                        {/* <Input placeholder="Nhập vào" ref={inputRef} onBlur={(e) => { e.target.value && !no && setEdit(false) }} onPressEnter={(e) => { e.target.value && !no && setEdit(false) }} onChange={(e) => handelChangeParent(e.target.value)} /> */}

                        <Select
                            ref={inputRef}
                            value={selectedItems}
                            onChange={handleChange}
                            maxCount={1}
                            maxTagCount={1}
                            mode="tags"
                            placeholder="Nhập vào"
                            options={optionsDetail}
                        />
                    </Form.Item>
                </>

            </div>
            <hr />
            <Flex className='' wrap gap={30}>
                {detail.find((item, i) => item.id == keyValue).attribute.map((value, index) => (
                    <Flex className='relative' key={index} justify='center' align='center' gap={10}>
                        <Form.Item
                            name={`attr-value-${value.id}`}
                            className='m-0'
                            validateStatus={error[value.id] ? 'error' : ''}
                            help={<p className=' absolute'>{error[value.id]}</p>}
                            rules={[
                                {
                                    required: true,
                                    validator: (_, name) => {
                                        if (index == 0 && !name) {
                                            setError((prevErrors) => ({
                                                ...prevErrors,
                                                [value.id]: 'Không được để trống',
                                            }));
                                            return Promise.reject();
                                        }

                                        if (index + 1 < inputField && !name) {


                                            setError((prevErrors) => ({
                                                ...prevErrors,
                                                [value.id]: 'Không được để trống',
                                            }));
                                            return Promise.reject();
                                        }

                                        setError((prevErrors) => {
                                            const newErrors = { ...prevErrors };
                                            delete newErrors[value.id];
                                            return newErrors;
                                        });
                                        return Promise.resolve();
                                    }
                                },
                                {
                                    validator: validateOption('attr-value-', setError, value.id)
                                }
                            ]}
                        >
                            <Input placeholder='Nhập' onChange={(e) => handelAddField(e.target.value, index + 1, value.id)} />

                            {/* 
                            <Select
                                onKeyDown={() => console.log('123')}
                                className='!w-[150px]'
                                value={selectedItemAttributes}
                                onChange={(v) => handleChangeAttributes(v, index, value.id)}
                                maxCount={1}
                                maxTagCount={1}
                                mode="tags"
                                placeholder="Nhập vào"
                                options={optionsAttribute}
                            /> */}
                        </Form.Item>
                        {
                            index < inputField - 1
                                ?
                                (
                                    <DeleteForeverRoundedIcon className='z-10 cursor-pointer' onClick={(e) => { handelRemoveOption(value.id) }} style={{ color: 'red' }} />
                                )
                                :
                                ''
                        }
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}
