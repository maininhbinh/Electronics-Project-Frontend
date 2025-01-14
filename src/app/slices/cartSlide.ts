
import { createSlice, Dispatch, ThunkDispatch, ThunkAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'react-router-dom'
import { addCartService, deleteCartService, GetAllCartService, updateCartService } from '@/services/CartService'
import { IAddCart } from '@/common/types/cart.interface'
interface ICart {
  id: number
  user_id: number
  quantity: number
  created_at: string
  updated_at: string
  product_attr_id: number
}
interface IInitialState {
  carts: ICart[]
}

const initialState: IInitialState = {
  carts: []
}

const cartSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    
  }
})

export const GetAllCart = (payload: string) => async (dispatch: Dispatch) => {
  try {
    const { data } = await GetAllCartService(payload)

    if (data && data.success == true) {
      return data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Request failed'
    }
  }
}

export const AddToCart = (payload: IAddCart) => async (dispatch: Dispatch) => {
  try {
    const { data } = await addCartService(payload)

    if (data && data.success == true) {
      return data
    }

  } catch (error) {
    return {
      success: false,
      message: 'Không thể thêm vào giỏ hàng'
    }
  }
}

export const UpdateCart = (payload: { id: number; quantity: number; token: string }) => async (dispatch: Dispatch) => {
  try {
    const { data } = await updateCartService(payload)

    if (data && data.success == true) {
      return data
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>

    if (axiosError?.response?.status == 422) {
      return axiosError?.response?.data
    }

    return {
      success: false,
      result: {
        message: 'Request failed'
      }
    }
  }
}

export const DeleteCart = (payload: { id: number; token: string }) => async (dispatch: Dispatch) => {
  try {
    const { data } = await deleteCartService(payload)

    if (data && data.success == true) {
      return data
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>

    if (axiosError?.response?.status == 422) {
      return axiosError?.response?.data
    }

    return {
      success: false,
      result: {
        message: 'Request failed'
      }
    }
  }
}

export default cartSlice.reducer
