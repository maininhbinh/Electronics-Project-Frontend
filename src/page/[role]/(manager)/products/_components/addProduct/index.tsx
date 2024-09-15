import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Flex } from 'antd';
import FormAddProduct from './add'

export default function AddProduct() {
  const navigate = useNavigate()

  return (
    <div>
        <Flex className='p-6' align='center' justify='space-between'>
          <Flex justify='center' align='center' gap={20}>
            <div>
              <Flex className='p-3 rounded-xl bg-[#fff] cursor-pointer' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1.6875rem', }}
                onClick={()=>{
                  navigate('..')
                }}
              >
                <ArrowBackRoundedIcon/>
              </Flex>
            </div>
            <Flex vertical>
              <h2 className='font-bold text-[24px]'>Thêm sản phẩm</h2>
              <span className='text-gray-500'>Quay lại trang danh sách sản phẩm</span>
            </Flex>
          </Flex>
        </Flex>
        <FormAddProduct/>
    </div>
  )
}
