import { ICategory } from './category.interface'

export interface IProduct {
  id: number|string,
  thumbnail: string,
  name: string,
  content: string,
  category_id: number,
  brand_id: number,
  is_active: number,
  is_hot_deal: number,
  is_good_deal: number,
  is_new: number,
  is_show_home: number,
  type_discount: null | 0 | 1,
  discount: number,
  total_review: number,
  avg_stars: number,
  public_id: string,
  slug: string,
  products: IProductItem[]
  details: IDetail[]
  products_avg_price?: string
}
export interface IGallery {
  id?: number | string
  productId: number
  image: string
}

export interface IDetail {
  name: string,
  attributes: IAttribute[]
}

export interface IAttribute{
  name:string
  values: IValue[]
}

export interface IValue{
  name: string
}

export interface IProductItem {
  id?: number | string
  price: string
  price_sale: string
  quantity: number
  sku?: number
  image: string | null
  variants: Ivariant[]
}

export interface Ivariant {
  name: string
  variant_name: string
}

