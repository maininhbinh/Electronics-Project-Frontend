import { Button, Flex, Form, Image, Input, Modal, Switch, Upload, message } from 'antd'

import { useNavigate, useParams } from 'react-router-dom'
import { useUpdateBannerMutation, useGetBannerQuery } from '../BannerEndpoints'
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import LoadingUser from '../../user/util/Loading';
import ErrorLoad from '../../components/util/ErrorLoad';

const { Dragger } = Upload

export default function EditBanner() {
   const params = useParams();
   const {isLoading, data, isError } = useGetBannerQuery(params.id);
  
  const [updateBanner, {isLoading : isLoadingUpdateBanner}] = useUpdateBannerMutation();
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleCancel = () => {
    navigate('..')
  }

  const handleSubmit = async () => {
    await form.validateFields()

    const image_title = form.getFieldValue('image_title')
    const is_active = form.getFieldValue('is_active') ? 1 : 0
    const image = form.getFieldValue('img') ? form.getFieldValue('img').file.originFileObj : false;
  
  
    const formData = new FormData()
    formData.append('image_title', image_title)
    formData.append('is_active', String(is_active));
    if(image){
      formData.append('image', image)
    }
   
   
    try {
      const payload = {
        id : params.id,
        data : formData
      }
      await updateBanner(payload).unwrap();
      popupSuccess('Create banner success');
      handleCancel();
    } catch (error) {
      popupError('Create banner success');
    }
  }
  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
  
    onSuccess('Upload successful', file)
 
  }
  if(isLoading){
    return <LoadingUser />
  }
  if(isError){
    return <ErrorLoad />
  }

  return (
    <>
      <Modal
        title='Edit Banner'
        confirmLoading={isLoadingUpdateBanner}
        open={true}
        okText='Đồng ý'
        cancelText='Huỷ'
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form   initialValues={data.data} form={form} name='nest-messages' layout='vertical' style={{ maxWidth: 600 }}>
          <Form.Item
            name='image_title'
            label='Title Banner'
            className='w-full'
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề banner!' },
              { max: 300, message: 'Title không vượt quá 300 ký tự' },
              {
                whitespace: true,
                message: 'Tiều đề không được để trống!'
              }
            ]}
          >
            <Input size='large' placeholder='Nhập tiêu đề banner' />
          </Form.Item>

          <Form.Item
            name='img'
            label='Img Banner'
            className='w-full'
           
          >
            <Dragger listType='picture' customRequest={handleUpload}  >
              <Button>Tải lên</Button>
            </Dragger>
          </Form.Item>

          <Flex justify="flex-start">
              <Image
                width={150}
                src={data.data.image_url}
              />
          </Flex>

          <Form.Item className='m-0' label='Active' name='is_active' valuePropName='checked'>
            <Switch />
          </Form.Item>


        </Form>
      </Modal>
    </>
  )
}
