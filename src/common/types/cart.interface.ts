export interface ICart {
  id?: number | string
  name: string
  slug: string
  thumbnail: string
  quantity: 1
  user_id?: number | string
  product_item_id: number | string
  price: string
  price_sale: string
  image: string | null
  variants: Ivariant[]
  in_stock?: boolean
  maxQuantity?: number | string
}

export interface Ivariant {
  id: number | string
  name: string
}

export interface IAddCart {
  quantity: number
  product_item_id: string | number
  token?: string | null
}
