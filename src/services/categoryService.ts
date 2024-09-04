import instance, { instanceTest } from '@/api/axios'
import { ICategory } from '@/common/types/category.interface'

export const getListCategory = () => {
  return instance.get(`category`)
}

export const getCategory = (id: string) => {
  return instance.get(`category/${id}`)
}

export const createCategory = (payload : any) => {
  return instanceTest.post(`category`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export const updateCategory = (payload: {id: string | undefined, formData: FormData}) => {
  const { id, formData } = payload
  return instanceTest.post(`category/${id}`, formData)
}

export const changeStatusCategory = (id: string, status: boolean) => {
  return instance.patch(`category/${id}`, { is_delete: status }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export const deleteCategory = (id: string) => {
  return instance.delete(`category/${id}`)
}

export const searchCategory = (q: string) => {
  return instance.get('category', {
    params: {
      name: q
    }
  })
}
