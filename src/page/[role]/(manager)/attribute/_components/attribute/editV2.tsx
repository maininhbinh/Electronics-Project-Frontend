import  { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import {  Form, Input, Modal, Select } from 'antd';

import { IAttribute } from "../../../../../../common/types/attribute.interface";
import { useGetDetailsQuery } from '../../../details/_component/DetailsEndpoints';



interface UpdateAttributeFormProps {
    initialValues: IAttribute;
    onFormInstanceReady: (instance: FormInstance<IAttribute>) => void;
}

interface UpdateAttributeFormModalProps {
  loadingUpdate : boolean,
  open: boolean;
  onCreate: (values: IAttribute) => void;
  onCancel: () => void;
  initialValues: IAttribute;
}



const UpdateAttributeForm  = ({
    initialValues,
    onFormInstanceReady,
  } : UpdateAttributeFormProps) => {
    const [optionDetails, setOptionDetails] = useState([]);
    const {data : details, isLoading } = useGetDetailsQuery([]);

    const [form] = Form.useForm();
    useEffect(() => {
      onFormInstanceReady(form);
    }, []);

    useEffect(() => {
      if(details){
          var options = details?.map((item : {id : number, name : string}) => {
              return {
                  value : item.id,
                  label : item.name
              }
          });
          setOptionDetails(options);
      }
      
   }, [details])

    return (
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name of attribute!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item  name='detail_id' label='Detail' rules={[{ required: true }]}>
          <Select
              style={{ width: '100%' }}
              options={optionDetails}
          />
        </Form.Item>
       
      </Form>
    );
  };



export default function EditAttributeV2({
    loadingUpdate,
    open,
    onCreate,
    onCancel,
    initialValues,
} : UpdateAttributeFormModalProps){
    const [formInstance, setFormInstance] = useState<FormInstance>();
    return (<>
    
    <Modal
      
      open={open}
      title={`Update attribute "${initialValues.name}"`}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{ autoFocus: true, disabled: loadingUpdate, loading : loadingUpdate}}
      cancelButtonProps={{ disabled: loadingUpdate }}
      onCancel={onCancel}
      destroyOnClose
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          onCreate(values);
        } catch (error) {
          console.log('Failed:', error);
        }
      }}
    >
      <UpdateAttributeForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }}
      />
    </Modal>
    </>)
    
}