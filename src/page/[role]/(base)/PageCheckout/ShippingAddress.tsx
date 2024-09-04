import Label from '../components/Label/Label'
import { FC, useEffect, useState } from 'react'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import ButtonSecondary from '../shared/Button/ButtonSecondary'
import Input from '../shared/Input/Input'
import Radio from '../shared/Radio/Radio'
import { useGetProvincesQuery, useLazyGetDistrictsQuery, useLazyGetWardsQuery } from '@/utils/addressRTKQuery'

import { Button, Descriptions, Modal, Result } from 'antd'
import axios from 'axios'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ICart } from '@/common/types/cart.interface'
import { popupError, popupSuccess } from '../../shared/Toast'
import { Link, useNavigate } from 'react-router-dom'
import { DescriptionsProps } from 'antd/lib'
import { VND } from '@/utils/formatVietNamCurrency'
import { useGetCartsQuery } from '@/services/CartEndPoinst'
import { getTotalPriceCart } from '@/utils/handleCart'
import { useAddOrderMutation } from '@/services/OrderEndPoints'
import { Form, Select, SelectProps, FormInstance } from 'antd'

import { IOrder } from '@/common/types/Order.interface'
import { EditOutlined } from '@ant-design/icons'

interface Props {
  isActive: boolean
  onCloseActive: () => void
  onOpenActive: () => void
  onFinish: (payload: IOrder) => void
  form: FormInstance
}

const ShippingAddress: FC<Props> = ({ isActive, onCloseActive, onOpenActive, onFinish, form }) => {
  const [optionsWard, setOptionWard] = useState<SelectProps['options']>([])
  const [optionsDistrict, setOptionDistrict] = useState<SelectProps['options']>([])
  const { data: provinces, isLoading : isLoadingProvinces, isError } = useGetProvincesQuery({})
  const [getWard, { data: dataWards, isLoading: wardLoading }] = useLazyGetWardsQuery()
  const [getDistrict, { data: dataDistricts, isLoading: districtLoading }] = useLazyGetDistrictsQuery()

  const options: SelectProps['options'] = []

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
  
  provinces?.data.forEach((item: { id: number; name: string }) => {
    options.push({
      value: `${item.name}-${item.id}`,
      label: item.name
    })
  })

  const onChangeCity = async (value: string) => {
    form.resetFields(['receiver_district', 'receiver_ward']);
    setOptionWard([])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const provinceId = splitStr[1]
     
      await getDistrict(provinceId)
    } else {
      setOptionDistrict([])
    }
  }
  const onChangeDistrict = async (value : any) => {
    form.resetFields(['receiver_ward'])
    if (value) {
      const splitStr = value.split(/-(\d+)/)
      const districtId = splitStr[1]
     
      await getWard(districtId)
    } else {
      setOptionWard([])
    }
  }

  return (
    <div className='border border-slate-200 dark:border-slate-700 rounded-xl '>
      <div className='p-6 flex flex-col sm:flex-row items-start'>
        <span className='hidden sm:block'>
          <svg
            className='w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M7.14008 6.75L5.34009 8.55L7.14008 10.35'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M16.8601 6.75L18.6601 8.55L16.8601 10.35'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>

        <div className='sm:ml-8'>
          <h3 className=' text-slate-700 dark:text-slate-300 flex '>
            <span className='uppercase'>Địa chỉ giao hàng</span>
            <svg
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='2.5'
              stroke='currentColor'
              className='w-5 h-5 ml-3 text-slate-900 dark:text-slate-100'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
            </svg>
          </h3>
        </div>
        <ButtonSecondary
          sizeClass='py-2 px-4 '
          fontSize='text-sm font-medium'
          className='bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg'
          onClick={onOpenActive}
          type={'button'}
        >
          Thay đổi
        </ButtonSecondary>
      </div>

      <div
        className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7  ${
          isActive ? 'block' : 'hidden'
        }`}
      >
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3'>
          <div>
            <Label className="text-sm">Thành phố</Label>
            <div className='app__select--input '>
              <Form.Item name='receiver_city' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                <Select
                  loading={isLoadingProvinces}
                  placeholder='Lựa chọn thành phố'
                  options={options}
                  onChange={(value) => onChangeCity(value)}
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <Label className="text-sm">Quận / huyện</Label>
            <div className="app__select--input">
              <Form.Item name='receiver_district' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
                <Select
                  loading={districtLoading}
                  onChange={(value) => onChangeDistrict(value)}
                  placeholder='Lựa chọn quận huyện'
                  options={optionsDistrict}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>
          
          <div className='w-1/3'>
            <Label className="text-sm">Xã / phường</Label>
            <div className='app__select--input'>
              <Form.Item name='receiver_ward' rules={[{ required: true, message: 'Vui lòng Nhập trường này' }]}>
                <Select
                  loading={wardLoading}
                  placeholder='Lựa chọn Xã phường'
                  options={optionsWard}
                />
              </Form.Item>
            </div>
          </div>
          <div className='flex-1'>
            <Label className="text-sm">Địa chỉ chi tiết</Label>
            <Form.Item name='receiver_address' rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}>
              <Input className='mt-1.5' type='text' placeholder='Nhập địa chỉ chi tiết'/>
            </Form.Item>
          </div>
        </div>

        <div className='sm:flex space-y-4 sm:space-y-0 sm:space-x-3'>
          <div className='w-full'>
          <Label className="text-sm">Ghi chú</Label>
            <Form.Item name='note'>
              <Input  placeholder='...' className='mt-1.5' type='text'/>
            </Form.Item>
      
          </div>
        </div>

        {/* ============ */}
        <div className='flex flex-col sm:flex-row pt-6'>
          <ButtonPrimary  type="button" className='sm:!px-7 shadow-none' onClick={onCloseActive}>
            Lưu và chuyển đến thanh toán
          </ButtonPrimary>
          <ButtonSecondary type="button" className='mt-3 sm:mt-0 sm:ml-3' onClick={onCloseActive}>
            Hủy
          </ButtonSecondary>
        </div>
      </div>
    </div>
  )
}

export default ShippingAddress
