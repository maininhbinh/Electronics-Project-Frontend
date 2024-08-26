import { Col, DatePicker, FormInstance, Modal, Row, Select, Slider, Space, Switch } from 'antd'
import { Button, Form, Input, InputNumber } from 'antd'
import moment from 'moment';
import { useNavigate } from 'react-router-dom'
import { BaseDatePicker } from './baseDateFomat';
import { useEffect, useState } from 'react';

interface Props {
  form: FormInstance<any>;
  visible: boolean,
  isEdit: any,
  onCancelModalCreate: () => void,
  onSubmit: (values: any) => void;
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
}
/* eslint-enable no-template-curly-in-string */


export default function ModalCreateVoucher({
  form,
  visible,
  onCancelModalCreate,
  onSubmit,
  isEdit
}: Props) {
  const [active, setActive] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('number');

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  useEffect(() => {

    setSelectedType(isEdit ? form.getFieldValue('type') : 'number')
    if (isEdit) {
      form.setFieldValue('is_activate', form.getFieldValue('is_activate') == '1' ? true : false)
    } else {
      form.setFieldValue('is_activate', true)
    }
  }, [isEdit, form])
  return (
    <>
      <Modal
        title={isEdit ? 'Sửa mã giảm giá' : "Thêm mã giảm giá"}
        open={visible}
        onCancel={onCancelModalCreate}
        footer={null}
      >
        <Form
          form={form}
          name='nest-messages'
          onFinish={onSubmit}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          autoComplete="off"
          layout="vertical"
          initialValues={{ type: 'number', status: 'private', is_activate: active }}
        >
          {/* <Form.Item
            name={'code'}
            label='Code'

          > */}
          {/* <Input placeholder='Nhập mã Voucher' disabled />
          </Form.Item> */}

          <Form.Item
            name={'name'}
            label='Tên mã giảm giá'
            rules={[
              { required: true, message: 'Please enter the voucher name' },
              { max: 120, message: 'Voucher name must be at most 120 characters' },
            ]}
          >
            <Input placeholder='Nhập tên' />
          </Form.Item>

          <Form.Item
            name={'type'}
            label='Type voucher'
          >
            <Select
              defaultValue="number"

              onChange={handleTypeChange}
              options={[
                { value: 'number', label: 'giá' },
                { value: 'percent', label: 'Phần trăm' },

              ]}
            />
          </Form.Item>




          {selectedType === 'number' ? (
            <Form.Item
              name={'value'}
              label='Số tiền'
              rules={[{ required: true, type: 'number', message: 'Vui lòng nhập số tiền giảm giá' }]}
            >
              <InputNumber placeholder='Nhập số tiền giảm giá' style={{ width: '100%' }} />
            </Form.Item>
          ) : (
            <Form.Item
              name="value"
              label="Phần trăm"
            >
              <Slider min={0} max={100} />
            </Form.Item>
          )}









          <Row>
            <BaseDatePicker
              span={9}
              name="start_date"
              dateFormat="YYYY-MM-DD"
              placeholder={'Chọn thời gian bắt đầu'}
              hiddenInitValue={true}
              spanFormItem={24}
              required
              labelKey="Chọn thời gian kết thúc"
              label=""
              disableDate={(date: any) => {
                return date && date < moment().add(-1, 'days');
              }}
            />
            <Col
              span={2}
              style={{
                marginLeft: 53,
                marginTop: 10,
                fontSize: 16
              }}
            >
              <span>Đến</span>
            </Col>
            <BaseDatePicker
              span={9}
              name="end_date"
              dateFormat="YYYY-MM-DD"
              placeholder={'Chọn thời gian kết thúc'}
              hiddenInitValue={true}
              spanFormItem={24}
              required
              labelKey="Chọn thời gian kết thúc"
              label=""
              disableDate={(date: any) => {
                if (
                  !form.getFieldValue('start_date') ||
                  form.getFieldValue('start_date') === undefined
                )
                  return true;
                return (
                  date <
                  moment(
                    form.getFieldValue('start_date')?.format()
                  )?.add(-150, 'days')
                );
              }}
            />

          </Row>


          <Form.Item
            name={'quantity'}
            label='Số lượng'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập giới hạn sử dụng' }]}
          >
            <InputNumber placeholder='Nhập giới hạn sử dụng' style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name={'discount_max'}
            label='Giá tối đa sau khi áp dụng'
            rules={[{ required: true, type: 'number', message: 'Vui lòng nhập giá tối đa' }]}
          >
            <InputNumber placeholder='Enter ...' style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name={'status'}
            label='Status'
          >
            <Select
              defaultValue="private"


              options={[
                { value: 'private', label: 'Private' },
                { value: 'public', label: 'Public' },

              ]}
            />
          </Form.Item>

          <Form.Item
            name={'is_activate'}
            label='Active'
          >
            <Switch />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Button type='text' style={{ marginRight: '10px' }} onClick={onCancelModalCreate}>
              Hủy
            </Button>
            <Button type='primary' htmlType='submit'>
              {isEdit ? 'Sửa' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
