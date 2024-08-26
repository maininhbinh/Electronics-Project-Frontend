import { Menu, Flex } from "antd";
import logo from "../../../../assets/images/manager/logo.png";
import UseSidenav from "../../../../feature/UseSidenav";
import { Typography } from 'antd';
import Tables from "./icon/Tables";
import Billing from "./icon/Billing";
import Rtl from "./icon/Rtl";
import profile from "./icon/Profile";
import Dashboard from "./icon/Dashboard";
import { useAppSelector } from "../../../../app/hooks";
import { useEffect, useState } from "react";
import { FaProductHunt } from "react-icons/fa";
import type { MenuProps } from 'antd';
import { FaAlignLeft } from "react-icons/fa";
import { FaPeopleCarry } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { FaSign } from "react-icons/fa";
import { FaBahai } from "react-icons/fa";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";
function Sidenav() {
  const { Text } = Typography;

  const { bgIcon, darkColor, inActiveColor } = useAppSelector(state => state.web)
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);

  const useSidenav = UseSidenav({
    components: [


      {
        label: (
          <>
            <div>
              <Flex justify="center" align="center">
                <div
                  className={`icon `}
                >
                  {<Dashboard color={darkColor} />}
                </div>
                <span className={`label font-bold text-[#344767]`}>Bảng điều khiển</span>
              </Flex>
            </div>
          </>
        ),
        link: '/admin/dashboard'
      },
      //dashboard

      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                <FaBahai />
              </span>
              <span className={`label font-bold text-[#344767]`}>Tiếp thị</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  <FaMoneyBillAlt />
                  <span className="label font-bold text-gray-400">Mã giảm giá</span>
                </Flex>
              </>
            ),
            link: '/admin/voucher'
          }
        ]
      },

      {
        label: (
          <>
            <Flex align="center" justify="center" >
              <span
                className={`icon `}
              >
                <FaShoppingBasket />
              </span>
              <span className={`label font-bold text-[#344767]`}>Bán hàng</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  <FaProductHunt />
                  <span className="label font-bold text-gray-400">Sản phẩm</span>
                </Flex>
              </>
            ),
            link: '/admin/products'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  <FaAlignLeft />
                  <span className="label font-bold text-gray-400">Danh mục</span>
                </Flex>
              </>
            ),
            link: '/admin/categories'
          },
          // {
          //   label: (
          //     <>
          //      <Flex align="center" gap={10} justify="center" className="children-menu">
          //         {<Tables color={darkColor} />}
          //         <span className="label font-bold text-gray-400">Màu sắc</span>
          //       </Flex>
          //     </>
          //   ),
          //   link: '/admin/color'
          // },
          // {
          //   label: (
          //     <>
          //       <Flex align="center" gap={10} justify="center" className="children-menu">
          //         {<Tables color={darkColor} />}
          //         <span className="label font-bold text-gray-400">Thuộc tính sản phẩm</span>
          //       </Flex>
          //     </>
          //   ),
          //   link: '/admin/attributes-product'
          // },
          // {
          //   label: (
          //     <>
          //       <Flex align="center" gap={10} justify="center" className="children-menu">
          //         {<Tables color={darkColor} />}
          //         <span className="label font-bold text-gray-400">Thuộc tính</span>
          //       </Flex>
          //     </>
          //   ),
          //   link: '/admin/attributes'
          // },
          // {
          //   label: (
          //     <>
          //       <Flex align="center" gap={10} justify="center" className="children-menu">
          //         {<Tables color={darkColor} />}
          //         <span className="label font-bold text-gray-400">Chi tiết</span>
          //       </Flex>
          //     </>
          //   ),
          //   link: '/admin/details'
          // },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  <FaPeopleCarry />
                  <span className="label font-bold text-gray-400">Thương hiệu</span>
                </Flex>
              </>
            ),
            link: '/admin/brand'
          },

        ]
      },

      // {
      //   label: (
      //     <>
      //       <Flex align="center" justify="center" >
      //         <span
      //           className={`icon `}
      //         >
      //           {<Tables color={darkColor} />}
      //         </span>
      //         <span className={`label font-bold text-[#344767]`}>Bài viết</span>
      //       </Flex>
      //     </>
      //   ),
      //   children: [
      //     {
      //       label: (
      //         <>
      //           <Flex align="center" gap={10} justify="center" className="children-menu">
      //             {<Tables color={darkColor} />}
      //             <span className="label font-bold text-gray-400">Danh mục bài viết</span>
      //           </Flex>
      //         </>
      //       ),
      //       link: '/admin/post-categories'
      //     },
      //     {
      //       label: (
      //         <>
      //           <Flex align="center" gap={10} justify="center" className="children-menu">
      //             {<Tables color={darkColor} />}
      //             <span className="label font-bold text-gray-400">Bài viết</span>
      //           </Flex>
      //         </>
      //       ),
      //       link: '/admin/posts'
      //     },

      //   ]
      // },

      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                <FaIdBadge />
              </span>
              <span className={`label font-bold text-[#344767]`}>Người dùng</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  <FaUserCog />
                  <span className="label font-bold text-gray-400">Người dùng</span>
                </Flex>
              </>
            ),
            link: '/admin/users'
          },
          // {
          //   label: (
          //     <>
          //       <Flex align="center" gap={10} justify="center" className="children-menu">
          //         {<Tables color={darkColor} />}
          //         <span className="label font-bold text-gray-400">Quyền hạn</span>
          //       </Flex>
          //     </>
          //   ),
          //   link: '/admin/privilege'
          // },
        ]
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                <FaSign />
              </span>
              <span className="label font-bold text-[#344767]">Banner</span>
            </Flex>
          </>
        ),
        link: '/admin/banner'
      },

      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label font-bold text-[#344767]">Đơn hàng</span>
            </Flex>
          </>
        ),
        link: '/admin/order'
      },


      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                <Billing color={darkColor} />
              </span>
              <span className="label font-bold text-[#344767]">thanh toán</span>
            </Flex>
          </>
        ),
        link: '/admin/billing'
      },
      {
        label: (
          <Flex align="center" justify="center">
            <span
              className={`icon `}
            >
              <Rtl color={darkColor} />
            </span>
            <span className="label font-bold text-[#344767]">RTL</span>
          </Flex>
        ),
        link: '/admin/rtl'
      },
      {
        label: (
          <>
            <Text style={{ fontSize: '16px', fontWeight: '700' }} className={`text-[${bgIcon}]`}>
              Trang tài khoản
            </Text>
          </>
        ),
        type: 'group',
      },
      {
        label: (
          <Flex align="center" justify="center">
            <span
              className={`icon  `}
            >
              {profile}
            </span>
            <span className="label font-bold text-[#344767]">Hồ sơ</span>
          </Flex>
        ),
        link: '/admin/profile'
      }
    ]
  })

  interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
  }

  const items = useSidenav.getMenu();

  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };

  const levelKeys = getLevelKeys(items as LevelKeysProps[]);


  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  useEffect(() => {
    const defaultActiveString = useSidenav.getKeyActive().map(num => num.toString());
    setStateOpenKeys(defaultActiveString);
  }, []);

  return (
    <>
      <Flex gap={10} className="brand" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="" />
        <span className=" text-center">Bảng điều khiển</span>
      </Flex>
      <hr />
      <Menu theme="light" mode="inline" triggerSubMenuAction='click' openKeys={stateOpenKeys} defaultSelectedKeys={stateOpenKeys} items={items} onOpenChange={onOpenChange} />
    </>
  );
}

export default Sidenav;
