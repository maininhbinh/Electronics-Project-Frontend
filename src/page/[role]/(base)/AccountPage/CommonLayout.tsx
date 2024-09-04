import { Col, Menu, Row } from "antd";
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Avatar from "../shared/Avatar/Avatar";
import { avatarImgs } from "../../../../contains/fakeData";
import { useGetUserQuery } from "../../(manager)/user/UsersEndpoints";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = () => {
  const items = [
    {
      link: '/account',
      label: <div>Thông tin cá nhân</div>,
      icon: <AppstoreOutlined />,
    },
    {
      link: '/account/my-order',
      label: <div>Đơn hàng</div>,
      icon: <SettingOutlined />,
    },
  ].map(item => ({
    key: item.link,
    label: <Link to={item.link}>{item.label}</Link>,
    icon: item.icon
  }));

  const user = JSON.parse(String(localStorage.getItem('user')));
  const {data : dataItem, isLoading : dataLoading } = useGetUserQuery(user?.id);

  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const handleClick = e => {
    setCurrent(location.pathname);
  };

  return (
    <div className="nc-CommonLayoutProps container mt-14 mb-14 sm:mt-20">
      <Row gutter={[32, 24]}>
        <Col span={5}>
          <div className="shadow-lg p-3 rounded-xl">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar imgUrl={dataItem?.data.image || avatarImgs[10]} sizeClass="w-12 h-12" />
              <div className="flex-grow truncate break-all">
                <h4 className="font-semibold">{dataItem?.data.username}</h4>
                <p className="text-xs mt-0.5 ">{dataItem?.data.email}</p>
              </div>
            </div>
            <hr/>
            <Menu
              onClick={handleClick}
              selectedKeys={[current]}
              defaultSelectedKeys={['/account']}
              mode="inline"
              items={items}
              className="border-none mt-5"
              style={{ borderInlineEnd: 0 }}
            />
          </div>
        </Col>
        <Col span={19}>
          <div className="shadow-lg rounded-xl">
            <div className="p-5 mx-auto">
              <Outlet/>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CommonLayout;