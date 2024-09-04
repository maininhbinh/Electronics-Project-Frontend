import instance from '@/api/axios'

export const searchProduct = (q: string) => {
  return instance.get('filter/search', {
    params: {
      name: q
    }
  })
}
