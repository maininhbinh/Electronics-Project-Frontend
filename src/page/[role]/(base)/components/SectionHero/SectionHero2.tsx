import { FC, useEffect, useState } from 'react'
import imageRightPng2 from '../../../../../assets/images/base/hero-right-2.png'
import imageRightPng3 from '../../../../../assets/images/base/hero-right-3.png'
import imageRightPng from '../../../../../assets/images/base/hero-right.png'

import { useGetBannersQuery } from '@/page/[role]/(manager)/banner/BannerEndpoints'
import useBoolean from 'react-use/lib/useBoolean'
import useInterval from 'react-use/lib/useInterval'
import backgroundLineSvg from '../../../../../assets/images/base/Moon.svg'
import ButtonPrimary from '../../shared/Button/ButtonPrimary'
import Next from '../../shared/NextPrev/Next'
import Prev from '../../shared/NextPrev/Prev'
import { Link } from 'react-router-dom'

interface Hero2DataType {
  image: string
  heading: string
  subHeading: string
  btnText: string
  btnLink: string | undefined
}
export interface SectionHero2Props {
  className?: string
}

const DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  },
  {
    image: imageRightPng3,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  },
  {
    image: imageRightPng,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  }
]
let TIME_OUT: NodeJS.Timeout | null = null

const SectionHero2: FC<SectionHero2Props> = ({ className = '' }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0)
  const [isRunning, toggleIsRunning] = useBoolean(true)
  const { data } = useGetBannersQuery({})
  const [bannersList, setBannersList] = useState(DATA)

  useEffect(() => {
    if (data) {
      setBannersList(data?.length > 0 ? data : DATA)
    }
  }, [data])

  useInterval(
    () => {
      handleAutoNext()
    },
    isRunning ? 5500 : null
  )
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= bannersList.length - 1) {
        return 0
      }
      return state + 1
    })
  }

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= bannersList.length - 1) {
        return 0
      }
      return state + 1
    })
    handleAfterClick()
  }

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return bannersList.length - 1
      }
      return state - 1
    })
    handleAfterClick()
  }

  const handleAfterClick = () => {
    toggleIsRunning(false)
    if (TIME_OUT) {
      clearTimeout(TIME_OUT)
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true)
    }, 1000)
  }
  // =================

  const renderItem = (index: number) => {
    const isActive = indexActive === index
    const item : any = bannersList[index]
    if (!isActive) {
      return null
    }

    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden container ${className} rounded-xl shadow-2xl`}
        key={index}
      >
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center'>
          {bannersList.map((_: any, index: number) => {
            const isActive = indexActive === index
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index)
                  handleAfterClick()
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div className={`relative w-20 h-1 shadow-sm rounded-md bg-white`}>
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md ${
                        isActive ? ' ' : ' '
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Prev
          className='absolute left-1 sm:left-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-white bg-black rounded-full border-black '
          btnClassName='w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400'
          svgSize='w-6 h-6'
          onClickPrev={handleClickPrev}
        />
        <Next
          className='absolute right-1 sm:right-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-white bg-black rounded-full border-black '
          btnClassName='w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400'
          svgSize='w-6 h-6'
          onClickNext={handleClickNext}
        />

        {/* BG */}
        <div className='absolute inset-0 bg-[#E3FFE6]'>
          {/* <div className="absolute inset-0 bg-[#F7F0EA]"> */}
          <img
            className={`absolute w-full h-full object-fill`}
            src={item?.image_url ?? backgroundLineSvg}
            alt='hero'
          />
        </div>

        <div className='relative container md:min-h-[30rem]'>
          <Link to={item?.url}></Link>
          {item?.image && (
            <div className='mt-10 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl'>
              <img
                className='w-full h-full object-contain object-right-bottom nc-SectionHero2Item__image'
                src={item?.image}
                alt={item?.heading}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{bannersList.map((banner: any, index: number) => renderItem(index))}</>
}

export default SectionHero2
