import { IDetail } from "@/common/types/product.interface";
import { useGetDetailQuery, useUpdateDetailMutation } from "./DetailsEndpoints";
import { Form, Input, Modal, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingUser from "../../user/util/Loading";
import ErrorLoad from "../../components/util/ErrorLoad";
import { popupSuccess } from "@/page/[role]/shared/Toast";
import { useGetCategoriesQuery } from "../../category/CategoryEndpoints";
import { FormInstance } from "antd/lib";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

const validateMessages = {
    required: '${label} là bắt buộc!',
}

export default function EditDetail() {
    const param = useParams();

    const { data: dataItem, isLoading: dataLoading, isError: isErrorDataItem } = useGetDetailQuery(param.id)
    const [uploadDetail, { isLoading: isLoadingUploadDetail }] = useUpdateDetailMutation();
    const { data: categories, isLoading } = useGetCategoriesQuery([]);
    const [optionDetails, setOptionDetails] = useState([]);
    const [formInstance, setFormInstance] = useState<FormInstance>();
    const [form] = Form.useForm();
    const [formValuesUpdate, setFormValuesUpdate] = useState({
        name: '',
        category_id: []
    });

    useEffect(() => {
        setFormInstance(form);
    }, []);
    useEffect(() => {
        if (dataItem) {
            console.log(dataItem)
            var dataCatId = dataItem.category?.map((item: any) => {
                return item.id;
            });
            formValuesUpdate.name = dataItem.name;
            formValuesUpdate.category_id = dataCatId
            setFormValuesUpdate(formValuesUpdate);
            form.setFieldsValue(formValuesUpdate)
            setFormInstance(form);
        }
    }, [dataItem])

    useEffect(() => {
        if (categories) {
            var options = categories?.data.map((item: { id: number, name: string }) => {
                return {
                    value: item.id,
                    label: item.name
                }
            });
            setOptionDetails(options);
        }

    }, [categories])

    const onFinish = async (values: IDetail | any) => {
        try {
            const payload = {
                ...values,
                id: param.id,
                category_id: values.category_id.join(',')
            }
            await uploadDetail(payload).unwrap();
            handleCancel();
            popupSuccess('Updated detail')
        } catch (error) {
            popupSuccess('Updated detail error')
        }

    }

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate('..')
    }
    //console.log(formValuesUpdate)
    if (dataLoading) return <LoadingUser />
    if (isErrorDataItem) return <ErrorLoad />
    return (
        <>
            <Modal
                okText="Update"
                okButtonProps={{ autoFocus: true, disabled: isLoadingUploadDetail, loading: isLoadingUploadDetail }}
                onOk={async () => {
                    try {
                        const values = await formInstance?.validateFields();
                        onFinish(values);
                    } catch (error) {
                        console.log('Failed:', error);
                    }
                }}
                title='Edit detail' open={true} onCancel={handleCancel}>
                <Form
                    initialValues={formValuesUpdate}
                    layout="vertical"
                    form={form}
                    {...layout}
                    name='nest-messages'
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name='name' label='Name' rules={[{ required: true }]}>
                        <Input type='text' placeholder='Nhập tên chi tiết' />
                    </Form.Item>
                    <Form.Item name='category_id' label='Category' rules={[{ required: true }]}>
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

