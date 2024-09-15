import { FC, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionSliderCollections from '../components/SectionSliderLargeProduct'
import SectionPromo1 from '../components/SectionPromo1'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../../../../data/data'
import TabFilters from '../components/TabFilters'
import Pagination from '../shared/Pagination/Pagination'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { IProduct } from '@/common/types/product.interface'
import { lab } from 'chroma-js'
import { useGetPageQuery } from '../../(manager)/category/CategoryEndpoints'

export interface PageCollectionProps {
  className?: string;
}

export interface filter {
  price: price,
  variants: variant[]
}

export interface price {
  maxPrice: string,
  minPrice: string
}
export interface variant {
  id: string,
  name: string,
  slug: string
  attributes: attribute[]
}

interface attribute {
  id: string,
  value: string,
  slug: string
}

const PageCollection: FC<PageCollectionProps> = ({ className = "" }) => {
  const {slug} = useParams();
  const location = useLocation();
  const param = location.search;
  const {data: products, isLoading, refetch} = useGetPageQuery({slug: slug, param: param})

  if(!products || isLoading){
    return ''
  }

  const filter: filter = products.filter

  return (
    <div
      className={`nc-PageCollection ${className}`}
      data-nc-id="PageCollection"
    >
      <Helmet>
        <title>Collection || Ciseco Ecommerce Template</title>
      </Helmet>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* TABS FILTER */}
            <TabFilters filter={filter}/>

            {/* LOOP ITEMS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {products.data.map((item: IProduct) => (
                <ProductCard data={item} key={item.id} />
              ))}
            </div>

            {/* PAGINATION */}
            {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
              <Pagination />
              <ButtonPrimary loading>Show me more</ButtonPrimary>
            </div> */}
          </main>
        </div>

        {/* === SECTION 5 === */}
        {/* <hr className="border-slate-200 dark:border-slate-700" />

        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" /> */}

        {/* SUBCRIBES */}
        {/* <SectionPromo1 /> */}
      </div>
    </div>
  );
};

export default PageCollection;
