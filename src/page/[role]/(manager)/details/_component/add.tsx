import { useEffect, useState } from "react";
import { useCreateDetailMutation } from "./DetailsEndpoints";
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { useNavigate } from "react-router-dom";
import ErrorLoad from "../../components/util/ErrorLoad";
import { Form, Input, Modal, Select } from "antd";
import { IDetail } from "@/common/types/product.interface";
import { useGetCategoriesQuery } from "../../category/CategoryEndpoints";
import { FormInstance } from "antd/lib";


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

export default function AddDetail(){
    const [createDetail, { isLoading: isLoadingCreateDetail, isError }] = useCreateDetailMutation();
    const {data : categories, isLoading } = useGetCategoriesQuery([]);
    const [optionDetails, setOptionDetails] = useState([]);
    const [formInstance, setFormInstance] = useState<FormInstance>();
    const [form] = Form.useForm();

    useEffect(() => {
        setFormInstance(form);
    }, []);
    
    useEffect(() => {
        if(categories){
            var options = categories?.data.map((item : {id : number, name : string}) => {
                return {
                    value : item.id,
                    label : item.name
                }
            });
            setOptionDetails(options);
        }
        
     }, [categories])

     const onFinish = async (values: IDetail | any) => {
        const formData = new FormData()

        formData.append('name', values.name);
        formData.append('category_id', values.category_ids)

        try {
            await createDetail(formData).unwrap();
            popupSuccess('Create detail success');
            handleCancel();
        } catch (error) {
            popupError('Create detail error');
        }
    }

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate('..')
    }

    if (isError) return <ErrorLoad />
    return (
        <>
            <Modal okText="Create"
                okButtonProps={{ autoFocus: true, disabled: isLoadingCreateDetail, loading : isLoadingCreateDetail}}
                onOk={async () => {
                    try {
                      const values = await formInstance?.validateFields();
                      onFinish(values);
                    } catch (error) {
                      console.log('Failed:', error);
                    }
                }}
                title='Thêm chi tiết' open={true} onCancel={handleCancel}>
                <Form
                    layout="vertical"
                    form={form}
                    {...layout}
                    name='nest-messages'
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                //validateMessages={validateMessages}
                >
                    <Form.Item name='name' label='Tên' rules={[{ required: true }]}>
                        <Input type='text' placeholder='Nhập tên chi tiết' />
                    </Form.Item>

                    <Form.Item name='category_ids' label='Category' rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            options={optionDetails}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )


}