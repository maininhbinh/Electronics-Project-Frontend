import { Button, Form, Input, Modal, Switch, Upload } from 'antd'

import { popupError, popupSuccess } from '@/page/[role]/shared/Toast'
import { useNavigate } from 'react-router-dom'
import { useCreateBannerMutation } from '../BannerEndpoints'

const { Dragger } = Upload

export default function AddBanner() {
  const [createBanner, { isLoading: isLoadingCreateBanner }] = useCreateBannerMutation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleCancel = () => {
    navigate('..')
  }

  const handleSubmit = async () => {
    await form.validateFields()

    const image_title = form.getFieldValue('title')
    const is_active = form.getFieldValue('status') ? 1 : 0
    const image = form.getFieldValue('img').file.originFileObj
    const url = form.getFieldValue('url')

    const formData = new FormData()
    formData.append('image_title', image_title)
    formData.append('is_active', String(is_active))
    formData.append('image', image)
    formData.append('url', url)
    try {
      // console.log('>>>> ', formData)
      await createBanner(formData).unwrap()

      popupSuccess('Create banner success')
      handleCancel()
    } catch (error) {
      popupError('Create banner success')
    }
  }
  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options

    onSuccess('Upload successful', file)
  }
  return (
    <>
      <Modal
        title='Thêm Banner'
        confirmLoading={isLoadingCreateBanner}
        open={true}
        okText='Đồng ý'
        cancelText='Huỷ'
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} name='nest-messages' layout='vertical' style={{ maxWidth: 600 }}>
          <Form.Item
            name='title'
            label='Tiêu đề banner'
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
            label='ảnh Banner'
            className='w-full'
            rules={[{ required: true, message: 'Vui lòng chọn Ảnh banner!' }]}
          >
            <Dragger listType='picture' customRequest={handleUpload}>
              <Button>Upload</Button>
            </Dragger>
          </Form.Item>

          <Form.Item
            name='url'
            label='Url Banner'
            className='w-full'
            rules={[
              { required: true, message: 'Vui lòng nhập Url banner!' },
              {
                whitespace: true,
                message: 'Url không được để trống!'
              }
            ]}
          >
            <Input size='large' placeholder='Nhập url banner' className='w-full' />
          </Form.Item>

          <Form.Item className='m-0' label='kích hoạt' name='status' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
