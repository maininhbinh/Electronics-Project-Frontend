import { Modal, Switch, Upload } from 'antd'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLazyGetDistrictsQuery, useGetProvincesQuery, useLazyGetWardsQuery } from '../../../../../utils/addressRTKQuery'
import { Select } from 'antd'
import type { SelectProps } from 'antd'

import LoadingUser from '../util/Loading'
import ErrorLoad from '../../components/util/ErrorLoad'
import { useEffect, useState } from 'react'
import { Iuser } from '../../../../../common/types/user.interface'
import { useCreateUserMutation } from '../UsersEndpoints'

import { popupSuccess, popupError } from '@/page/[role]/shared/Toast'
//
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { min } from 'lodash'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const validateMessages = {
  required: '${label} là bắt buộc!',
  types: {
    email: '${label} không phải là 1 email hợp lệ!',
    number: '${label} không phải là 1 số hợp lệ!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
}
/* eslint-enable no-template-curly-in-string */

export default function AddUser() {
  const [getWard, { data: dataWards, isLoading: wardLoading }] = useLazyGetWardsQuery()
  const [optionsWard, setOptionWard] = useState<SelectProps['options']>([])
  const [file, setFile] = useState({
    data: {},
    loading: false
  })
  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
    setFile({
      data: file,
      loading: false
    })
    onSuccess('Upload successful', file)

  }

  const [createUser, { isLoading: loadingCreateUser }] = useCreateUserMutation()
  const [form] = Form.useForm()
  const [optionsDistrict, setOptionDistrict] = useState<SelectProps['options']>([])

  const onFinish = async (values: Iuser | any) => {
    console.log(values)
    const formData = new FormData()
    for (const key in values) {
      if (String(key) == 'image') {
        formData.append(key, values[key][0].originFileObj);
        continue;
      }
      if (String(key) == 'district') {
        const splitStr = values.district.split(/-(\d+)/)
        formData.append(key, splitStr[0])
        continue;
      }
      if (String(key) == 'city') {
        const splitStr = values.city.split(/-(\d+)/)
        formData.append(key, splitStr[0])
        continue;
      }
      if (String(key) == 'is_active') {
        if (values[key]) {
          formData.append(key, '1')
        } else {
          formData.append(key, '0')
        }
        continue;
      }
      formData.append(key, values[key])

    }

    try {
      await createUser(formData).unwrap();
      popupSuccess('Add user success');
      handleCancel();
    } catch (error) {
      popupError('Add user error');
    }


  }

  const [getDistrict, { data: dataDistricts, isLoading: districtLoading }] = useLazyGetDistrictsQuery()

  useEffect(() => {
    setOptionDistrict(() => {
      return dataDistricts?.data.map((item: { id: number; name: string }) => {
        return {
          value: `${item.name}-${item.id}`,
          label: item.name
        }
      })
    })
    setOptionWard(() => {
      return dataWards?.data.map((item: { id: number; name: string }) => {
        return {
          value: `${item.name}`,
          label: item.name
        }
      })
    })
  }, [dataDistricts, dataWards])

  const options: SelectProps['options'] = []

  const { data: provinces, isLoading, isError } = useGetProvincesQuery({})

  provinces?.data.forEach((item: { id: number; name: string }) => {
    options.push({
      value: `${item.name}-${item.id}`,
      label: item.name
    })
  })

  const onChangeProvince = async (value: string) => {
    form.resetFields(['district'])
    form.resetFields(['ward'])
    setOptionWard([])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const provinceId = splitStr[1]

      await getDistrict(provinceId)
    } else {
      setOptionDistrict([])
    }
  }

  const onChangeDistrict = async (value: any) => {
    form.resetFields(['ward'])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const districtId = splitStr[1]

      await getWard(districtId)
    } else {
      setOptionWard([])
    }
  }
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }

  if (isLoading) return <LoadingUser />
  if (isError) return <ErrorLoad />
  return (
    <>
      <Modal okButtonProps={{ hidden: true }} title='Add user' open={true} onCancel={handleCancel}>
        <Form

          form={form}
          {...layout}
          name='nest-messages'
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name='username' label='Username' rules={[{ required: true }]}>
            <Input type='text' placeholder='Enter your username' />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
            <Input type='email' placeholder='Enter your email' />
          </Form.Item>

          <Form.Item name='password' label='Password' rules={[{ required: true, min: 8, max: 30 },]}>
            <Input type='password' placeholder='*******' />
          </Form.Item>

          <Form.Item
            name='image'
            label='Image'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true }]}
          >
            <Upload name='image' listType='picture' customRequest={handleUpload}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name='phone' label='Phone' rules={[{ required: true }]}>
            <Input type='text' placeholder='Enter phone number' />
          </Form.Item>




          <Form.Item name='city' label='Pronvinces' rules={[{ required: true }]}>
            <Select
              style={{ width: '100%' }}
              placeholder='Enter name province'
              options={options}
              onChange={(value) => onChangeProvince(value)}
            />
          </Form.Item>

          <Form.Item name='district' label='District' rules={[{ required: true }]}>
            <Select
              loading={districtLoading}
              onChange={(value) => onChangeDistrict(value)}
              style={{ width: '100%' }}
              placeholder='Enter name district'
              options={optionsDistrict}
            />
          </Form.Item>

          <Form.Item name='ward' label='Ward' rules={[{ required: true }]}>
            <Select
              loading={wardLoading}
              style={{ width: '100%' }}
              placeholder='Enter name ward'
              options={optionsWard}
            />
          </Form.Item>


          <Form.Item name='address' label='Address' rules={[{ required: true }]}>
            <Input type='text' placeholder='Enter your address ' />
          </Form.Item>

          <Form.Item name='role_id' label='Role' rules={[{ required: true }]}>
            <Select
              style={{ width: '100%' }}
              options={[
                { value: '1', label: 'Admin' },
                { value: '2', label: 'Guest' }
              ]}
            />
          </Form.Item>
          <Form.Item
            className='m-0'
            label='Active'
            name='is_active'
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className='mt-3' wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button loading={loadingCreateUser || file.loading} disabled={loadingCreateUser} type='primary' htmlType='submit'>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
