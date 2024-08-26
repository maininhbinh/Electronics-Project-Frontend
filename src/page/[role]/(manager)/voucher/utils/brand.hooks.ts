import { useEffect, useState } from 'react'
import {
  ConfirmModalParams,
  ConfirmModalType,
  DefaultConfirmModalParams,
  PAGINATE_DEFAULT,
  showAlertError,
  showAlertSuccess
} from '../../../../../contains/contants'
import axios from 'axios'
import { Form } from 'antd'
import { IVoucher, IVoucherEdit, IVoucherCreate } from '@/common/types/voucher.interface copy'
import instance from '@/api/axios'
import moment from 'moment'
import dayjs from 'dayjs'
import { useCreateVoucherMutation, useDeleteVoucherMutation, useUpdateVoucherMutation } from '../VoucherEndpoint'

export default function useVoucher() {
  const [createVoucher] = useCreateVoucherMutation()
  const [updateVoucher] = useUpdateVoucherMutation()
  const [deleteVoucer] = useDeleteVoucherMutation()
  const [form] = Form.useForm()
  const [dataList, setDataList] = useState<IVoucher[]>([])
  const [test, setTest] = useState([])
  const [dataTotal, setDataTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [Index, setIndex] = useState<number>()
  const [modalParams, setModalParams] = useState<ConfirmModalParams>(DefaultConfirmModalParams)
  const [dataIndex, setDataIndex] = useState<number>()
  const [visibleModalVoucherDetail, setVisibleModalVoucherDetail] = useState<boolean>(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await instance.get(`voucher`)
      setTest(res.data)
      setDataList(res.data)
      setDataTotal(res.data.total)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  const dateFormat = 'YYYY-MM-DD'
  const onEditVoucher = (values: any) => {
    setIndex(values.id)
    setVisibleModalVoucherDetail(true)
    form.setFieldsValue({
      name: values.name,
      code: values.code,
      value: values.value,
      start_date: dayjs(values.start_date),
      end_date: dayjs(values.end_date),
      quantity: values.quantity,
      discount_max: values.discount_max,
      is_activate: String(values.is_activate),
      status: values.status,
      type: values.type
    })
  }

  const onDelete = async () => {
    try {
      await deleteVoucer(dataIndex).unwrap()
      showAlertSuccess('Xóa thành công')
      setRefresh((prev) => !prev)
      onHideConfirmPopup()
    } catch (error) {
      showAlertError('Xóa không thành công')
    }
  }

  const onShowDeletePopup = (item: IVoucher) => {
    setModalParams({
      visible: true,
      title: 'Xóa Voucher',
      content: 'Bạn có muốn xóa Voucher không ?',
      type: ConfirmModalType.DELETE
    })
    setDataIndex(item.id)
  }

  const onHideConfirmPopup = (): void => {
    setModalParams(DefaultConfirmModalParams)
    setDataIndex(undefined)
  }

  const handleOkPopup = (): void => {
    if (modalParams.type === ConfirmModalType.DELETE) {
      onDelete()
    }
  }

  const onShowModalDetail = () => {
    setVisibleModalVoucherDetail(true)
    setIndex(undefined)
    form.resetFields()
  }

  const onCancelModalDetail = () => {
    setVisibleModalVoucherDetail(false)
    setIndex(undefined)
  }

  const generateVoucherCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      if (Index) {
        try {
          const payload = {
            id: Index,
            data: {
              ...values,
              is_activate: values.is_activate ? '1' : '0',
              start_date: values.start_date.format('YYYY-MM-DD HH:mm:ss'),
              end_date: values.end_date.format('YYYY-MM-DD HH:mm:ss')
            }
          }
          await updateVoucher(payload).unwrap()
          setLoading(false)
          showAlertSuccess('Sửa thành công')
          setRefresh((prev) => !prev)
          form.resetFields()
          onCancelModalDetail()
        } catch (error) {
          showAlertError('Sửa thất bại')
          onCancelModalDetail
          setLoading(false)
          return
        }
      } else {
        const payload = {
          ...values,
          is_activate: values.is_activate ? '1' : '0',
          code: generateVoucherCode(),
          start_date: values.start_date.format('YYYY-MM-DD HH:mm:ss'),
          end_date: values.end_date.format('YYYY-MM-DD HH:mm:ss')
        }

        try {
          await createVoucher(payload).unwrap()
          setLoading(false)
          showAlertSuccess('Thêm mới thành công')
          setRefresh((prev) => !prev)
          form.resetFields()
          onCancelModalDetail()
        } catch (error) {
          showAlertError('Thêm mới thất bại')
          onCancelModalDetail
          setLoading(false)
          return
        }
      }
    } catch (error) {
      showAlertError('Thêm mới thất bại')
      onCancelModalDetail
      setLoading(false)
      throw error
    }
  }

  return {
    form,
    Index,
    dataList,
    loading,
    test,
    onEditVoucher,
    onHideConfirmPopup,
    handleOkPopup,
    modalParams,
    onShowDeletePopup,
    dataTotal,
    onCancelModalDetail,
    visibleModalVoucherDetail,
    onShowModalDetail,
    onSubmit
  }
}
