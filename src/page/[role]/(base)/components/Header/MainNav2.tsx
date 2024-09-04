import React, { FC, useEffect, useState } from 'react'
import Logo from '../../shared/Logo/Logo'
import MenuBar from '../../shared/MenuBar/MenuBar'
import LangDropdown from './LangDropdown'
import AvatarDropdown from './AvatarDropdown'
import DropdownCategories from './DropdownCategories'
import CartDropdown from './CartDropdown'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { GetAllCart } from '@/app/slices/cartSlide'
import { useDebounce } from '@uidotdev/usehooks'
import { searchProduct } from '@/services/FilterService'
import { IProduct } from '@/common/types/product.interface'

export interface MainNav2Props {
  className?: string
}

const MainNav2: FC<MainNav2Props> = ({ className = '' }) => {
  const [showSearchForm, setShowSearchForm] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [filterProducts, setFilterProducts] = useState<IProduct[]>([])
  const dispatch = useAppDispatch()
  const [carts, setCarts] = useState([])
  const debouncedValue = useDebounce(searchKey, 500)

  const navigate = useNavigate()
  const handleSearch = (e: any) => {
    setSearchKey(e.target.value)
  }

  useEffect(() => {
    const filterProduct = async () => {
      const res = await searchProduct(searchKey)
      setFilterProducts(res.data)
    }
    if (debouncedValue.trim()) {
      filterProduct()
    }
  }, [debouncedValue])

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg width={22} height={22} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M22 22L20 20' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    )
  }

  const renderSearchForm = () => {
    return (
      <form
        className='flex-1 py-2 text-slate-900 dark:text-slate-100'
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/page-search')
        }}
      >
        <div className='bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 h-full rounded-[999px]'>
          {renderMagnifyingGlassIcon()}
          <input
            type='text'
            placeholder='Type and press enter'
            className='border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base'
            autoFocus
          />
          <button type='button' onClick={() => setShowSearchForm(false)}>
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>
        <input type='submit' hidden value='' />
      </form>
    )
  }

  const searchForm = () => {
    return (
      <>
        <form
          className='py-2 text-slate-900 dark:text-slate-100 hidden md:block mx-2'
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/page-search')
          }}
        >
          <div className='relative bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 rounded-[999px]'>
            {renderMagnifyingGlassIcon()}
            <input
              type='text'
              placeholder='Bạn cần tìm gì?'
              className='border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base'
              autoFocus
              value={searchKey}
              onChange={handleSearch}
            />
            {searchKey.length > 0 && filterProducts.length > 0 && (
              <div
                className='absolute left-0 top-10 z-10 mt-2 w-96 inline-block origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='menu-button'
              >
                {filterProducts.map((item, index) => (
                  <a
                    key={index}
                    href={`/product-detail/${item.slug}`}
                    className='flex items-center gap-2 p-3 hover:bg-slate-100'
                  >
                    <img src={item.thumbnail} alt='thumbnail' width={100} height={100} />
                    <div className='flex flex-col gap-2'>
                      <div className='text-xl font-medium'>{item.name}</div>
                      <div>100000 đ</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          <input type='submit' hidden value='' />
        </form>
      </>
    )
  }

  return (
    <div className='nc-MainNav2Logged relative z-10 bg-white dark:bg-slate-900 '>
      <div className='container'>
        <div className='h-20 flex justify-between'>
          <div className='flex items-center md:hidden flex-1'>
            <MenuBar />
          </div>

          <div className='flex lg:flex-1 items-center space-x-3 sm:space-x-8'>
            <Logo />
            <div className='hidden md:block h-10 border-l border-slate-200 dark:border-slate-700'></div>
            <div className='hidden md:block'>
              <DropdownCategories />
            </div>
          </div>

          <div className='flex-1 flex items-center justify-end '>
            {searchForm()}
            <AvatarDropdown />
            <CartDropdown/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainNav2
