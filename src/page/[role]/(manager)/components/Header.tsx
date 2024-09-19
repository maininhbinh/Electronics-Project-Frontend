import React, { useState, useEffect } from "react";

import {
  Badge,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Space,
  Flex,
} from "antd";

import {
  SearchOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined
} from "@ant-design/icons";
import bell from "./icon/Bell";
import toggler from "./icon/Togge";
import { setMiniSidenav, setNotification } from "../../../../app/webSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


function Header() {

  const { notification } = useAppSelector(state => state.web)
  const [showSidenav, setShowSidenav] = useState(false)
  const dispatch = useAppDispatch()

  const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  }));

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setShowSidenav(true)
      } else {
        setShowSidenav(false)
        dispatch(setMiniSidenav(true))
      }
    };

    handleResize()

    window.addEventListener('resize', handleResize);
  });


  return (
    <>
      <Drawer
        className="settings-drawer"
        mask={true}
        width={1000}
        onClose={() => dispatch(setNotification(false))}
        open={notification}
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
              />
              {item.content}
            </List.Item>
          )}
        />

      </Drawer>
      <Flex gap={10} justify="space-between" align="center">

        <Flex align="center" gap={20}>

          <Flex align="center" gap={10} justify="center" className="rounded-[999px]">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" className=" bg-gray-200 w-[28px] h-[28px]" />
          </Flex>
          {
            showSidenav
            &&
            <Button
              type="link"
              className="sidebar-toggler"
              onClick={() => dispatch(setMiniSidenav(false))}
            >
              {toggler}
            </Button>
          }
        </Flex>

      </Flex>
    </>
  );
}

export default Header;
