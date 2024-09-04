import { Popover, Transition } from "@headlessui/react";
import { avatarImgs } from "../../../../../contains/fakeData";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../shared/Avatar/Avatar";
import SwitchDarkMode2 from "../../shared/SwitchDarkMode/SwitchDarkMode2";
import { Button, Checkbox, Flex, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login, logout, Logout, Signin } from "@/app/slices/authSlide";
import { ISignin } from "@/common/types/Auth.interface";
import { setLoading, setOpenModalLogin, setOpenModalSignup } from "@/app/webSlice";
import { popupSuccess, popupError } from "@/page/[role]/shared/Toast";
import { useGetCartsQuery } from "@/services/CartEndPoinst";
import { useGetProfileUserQuery, useGetUserQuery } from "@/page/[role]/(manager)/user/UsersEndpoints";
import { SignupService, VerifyToken } from "@/services/AuthService";
import { isValidJSON } from "@/utils/isJson";
import Verytify from "../Verytify";

type FieldType = {
  email?: string;
  password?: string;
};

type FieldTypeSignup = {
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
};

export default function AvatarDropdown() {
  const {isAuthenticated} = useAppSelector(state => state.auth);  
  const {refetch, isSuccess } = useGetCartsQuery({}, {skip: !isAuthenticated});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isModalVeritifyOpen, setIsModalVeritifyOpen] = useState(false);
  const [email, setEmail] = useState<string>('');

  const [form] = Form.useForm()
  const [formSignup] = Form.useForm()
 
  const {openModalLogin, openModalSigup} = useAppSelector(state => state.web);

  const item = localStorage.getItem('user');
  const user = item && isValidJSON(item) ? JSON.parse(item) : '';

  const onSignin = async (value :ISignin) => {
    dispatch(setLoading(true));
    const result = await dispatch(Signin(value));
    dispatch(setLoading(false));

    if(result?.success == false){
      form.setFields([

        {
          name: 'password',
          value: '',
        }
      ])
      popupError("Email hoặc mật khẩu không chính xác");
    }else{
      form.setFields([
        {
          name: 'email',
          value: '',
        },
        {
          name: 'password',
          value: '',
        }
      ])
      dispatch(login(result))
      dispatch(setOpenModalLogin(false))
      popupSuccess("Xin chào " + result.user.username);
      if(isSuccess){
        refetch();
      }
      navigate('/')
    }
  }  

  const onSignup = async(value: FieldTypeSignup) => {

    setEmail(value.email ?? '')
    const payload = {
      username : value.username,
      email : value.email,
      password : value.password,
      password_confirmation : value.password_confirmation
    }

    formSignup.setFields([
      {
        name: 'username',
        value: ''
      },
      {
        name: 'email',
        value: ''
      },
      {
        name: 'password',
        value: ''
      },
      {
        name: 'password_confirmation',
        value: ''
      },
    ])
    
    try {
      dispatch(setLoading(true));
      await SignupService(payload);
      dispatch(setLoading(false));
      dispatch(setOpenModalSignup(false))
      setIsModalVeritifyOpen(true)
    } catch (error) {
      dispatch(setLoading(false));
      popupError('Đăng ký thất bại');
    }
  }

  const onLogout = async () => {
    const access_token = localStorage.getItem('access_token');
    dispatch(logout());
    dispatch(setOpenModalLogin(false))

    if(!access_token){
      popupError('Chưa đăng nhập');
    }else{

      dispatch(setLoading(true));
      await dispatch(Logout(access_token));
      dispatch(setLoading(false));
      popupSuccess("Đăng xuất thành công");
      navigate('/')
    }
    
  }

  

  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <svg
                className=" w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                      
                      {
                        isAuthenticated
                        ?
                        (
                          <>
                            <div className="flex items-center space-x-3">
                              <Avatar imgUrl={user?.image ? user?.image : avatarImgs[10] } sizeClass="w-12 h-12" />
                              <div className="flex-grow truncate break-all">
                                <h4 className="font-semibold">{user.username}</h4>
                                <p className="text-xs mt-0.5 ">{user.email}</p>
                              </div>
                            </div>

                            <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                          </>
                        )
                        :
                        ''
                      }

                    {/* ------------------ 1 --------------------- */}
                    {
                      !isAuthenticated
                      ?
                      <>
                        <button
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => dispatch(setOpenModalLogin(true))}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"Đăng nhập"}</p>
                          </div>
                        </button>

                        <button
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => dispatch(setOpenModalSignup(true))}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div >  <div className="ml-4"> <p className="text-sm font-medium ">{"Đăng kí"}</p>   </div> </div>
                        </button>
                      </>
                      :

                      ''
                    }

                    {
                      isAuthenticated
                      ?
                      (
                        <Link
                          to={"/account"}
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => close()}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"My Account"}</p>
                          </div>
                        </Link>
                      )
                      :
                      ''
                    }

                    {/* ------------------ 2 --------------------- */}
                    {
                      isAuthenticated
                      ?
                      <Link
                      to={"/checkout"}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M8 12.2H15"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 16.2H12.38"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{"Đơn hàng của tôi"}</p>
                        </div>
                      </Link>
                    :
                    ''
                    }

                    {/* ------------------ 2 --------------------- */}
                    {/* <Link
                      to={"/account-savelists"}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Yêu thích"}</p>
                      </div>
                    </Link> */}

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    {/* ------------------ 2 --------------------- */}
                    <div className="flex items-center justify-between p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.0001 7.88989L10.9301 9.74989C10.6901 10.1599 10.8901 10.4999 11.3601 10.4999H12.6301C13.1101 10.4999 13.3001 10.8399 13.0601 11.2499L12.0001 13.1099"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.30011 18.0399V16.8799C6.00011 15.4899 4.11011 12.7799 4.11011 9.89993C4.11011 4.94993 8.66011 1.06993 13.8001 2.18993C16.0601 2.68993 18.0401 4.18993 19.0701 6.25993C21.1601 10.4599 18.9601 14.9199 15.7301 16.8699V18.0299C15.7301 18.3199 15.8401 18.9899 14.7701 18.9899H9.26011C8.16011 18.9999 8.30011 18.5699 8.30011 18.0399Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.5 22C10.79 21.35 13.21 21.35 15.5 22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">{"Chế độ tối"}</p>
                        </div>
                      </div>
                      <SwitchDarkMode2 />
                    </div>

                    {/* ------------------ 2 --------------------- */}
                    <Link
                      to={"/#"}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.97 22C17.4928 22 21.97 17.5228 21.97 12C21.97 6.47715 17.4928 2 11.97 2C6.44715 2 1.97 6.47715 1.97 12C1.97 17.5228 6.44715 22 11.97 22Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 4.92993L8.43999 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.89999 19.07L8.43999 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 19.07L15.51 15.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.05 4.92993L15.51 8.45993"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"Trợ giúp"}</p>
                      </div>
                    </Link>

                    {/* ------------------ 2 --------------------- */}
                    
                    {
                      isAuthenticated
                      ?
                      (
                        <button
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={onLogout}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M15 12H3.62"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"Đăng xuất"}</p>
                          </div>
                        </button>
                      )
                      :
                      ''
                    }
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <Modal open={openModalLogin} onCancel={()=>dispatch(setOpenModalLogin(false))} footer=''>
          <div className="p-10">
            <Flex vertical gap={20}>
                <h1 className="font-mono text-[24px] font-bold">
                  Wecome to
                </h1>
                <Flex justify="space-around">
                  <button className="flex justify-center items-center gap-2 font-bold">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                      </svg>
                    </div>
                    <span>Signin with Google</span>
                  </button>
                  <button className="flex justify-center items-center gap-2 font-bold">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={24} height={24} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="73 0 267 266.9" enableBackground="new 73 0 267 266.9" xmlSpace="preserve">
                        <path id="Blue_1_" fill="#157DC3" d="M321.1,262.3c7.9,0,14.2-6.4,14.2-14.2V18.8c0-7.9-6.4-14.2-14.2-14.2H91.8  C84,4.6,77.6,11,77.6,18.8v229.3c0,7.9,6.4,14.2,14.2,14.2H321.1z"/>
                        <path id="f" fill="#FFFFFF" d="M255.4,262.3v-99.8h33.5l5-38.9h-38.5V98.8c0-11.3,3.1-18.9,19.3-18.9l20.6,0V45  c-3.6-0.5-15.8-1.5-30-1.5c-29.7,0-50,18.1-50,51.4v28.7h-33.6v38.9h33.6v99.8H255.4z"/>
                      </svg>
                    </div>
                    <span>
                      Signin with FB
                    </span>
                  </button>
                </Flex>
                <Flex justify="center" align="center" gap={20}>
                    <div className="border-b-[1px] flex-1"/>
                    <span>
                      Đăng nhập bằng
                    </span>
                    <div className="border-b-[1px] flex-1"/>
                </Flex>
                <Form 
                  form={form}
                  name="basic"
                  onFinish={onSignin}
                >
                  <div>
                    <label htmlFor="email"  className="font-bold block mb-[0.5rem]">Email</label>

                    <Form.Item<FieldType>
                      name="email"
                      rules={[{ required: true, message: 'Email không được để trống', type:'email' }]}
                    >
                      <Input id="email"/>
                    </Form.Item>
                  </div>
                  <div>
                    <label htmlFor="password" className="font-bold block mb-[0.5rem]">Mật khẩu</label>
                    <Form.Item<FieldType>
                      name="password"
                      rules={[
                        { 
                          required: true,
                          validator: (_, value) => {
                            if(!value){
                              return Promise.reject(new Error('Mật khẩu phải không được để trống'));
                            }
                            if (value.length < 6) {
                              return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
                            }
                            if (!/[A-Z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ hoa!'));
                            }
                            if (!/[a-z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ thường!'));
                            }
                            if (!/[0-9]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một số!'));
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                      
                    >
                      <Input.Password className=" py-0 px-2" id="password"/>
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Link to={''}>Quên mật khẩu</Link>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className=" w-full p-5">
                    Đăng nhập
                    </Button>
                  </Form.Item>
                  <div className="flex justify-center">
                    <span>Bạn chưa có tài khoản? <Link onClick={()=>{
                      dispatch(setOpenModalSignin(true))
                      dispatch(setOpenModalLogin(false))
                    }}>Đăng kí ngay</Link></span>
                  </div>
                </Form>
            </Flex>
          </div>
      </Modal>


      <Modal open={openModalSigup} onCancel={()=>dispatch(setOpenModalSignup(false))} footer=''>
          <div className="p-10">
            <Flex vertical gap={20}>
                <h1 className="font-mono text-[24px] font-bold">
                  Đăng kí
                </h1>
                <Flex justify="space-around">
                  <button className="flex justify-center items-center gap-2 font-bold">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                      </svg>
                    </div>
                    <span>Signin with Google</span>
                  </button>
                  <button className="flex justify-center items-center gap-2 font-bold">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={24} height={24} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="73 0 267 266.9" enableBackground="new 73 0 267 266.9" xmlSpace="preserve">
                        <path id="Blue_1_" fill="#157DC3" d="M321.1,262.3c7.9,0,14.2-6.4,14.2-14.2V18.8c0-7.9-6.4-14.2-14.2-14.2H91.8  C84,4.6,77.6,11,77.6,18.8v229.3c0,7.9,6.4,14.2,14.2,14.2H321.1z"/>
                        <path id="f" fill="#FFFFFF" d="M255.4,262.3v-99.8h33.5l5-38.9h-38.5V98.8c0-11.3,3.1-18.9,19.3-18.9l20.6,0V45  c-3.6-0.5-15.8-1.5-30-1.5c-29.7,0-50,18.1-50,51.4v28.7h-33.6v38.9h33.6v99.8H255.4z"/>
                      </svg>
                    </div>
                    <span>
                      Signin with FB
                    </span>
                  </button>
                </Flex>
                <Flex justify="center" align="center" gap={20}>
                    <div className="border-b-[1px] flex-1"/>
                    <span>
                      Đăng nhập bằng
                    </span>
                    <div className="border-b-[1px] flex-1"/>
                </Flex>
                <Form 
                  form={formSignup}
                  name="basic"
                  onFinish={onSignup}
                >
                  <div>
                    <label htmlFor="username"  className="font-bold block mb-[0.5rem]">Tên khách hàng</label>

                    <Form.Item<FieldTypeSignup>
                      name="username"
                      rules={[{ required: true, message: 'Tên khách hàng không được để trống' }]}
                    >
                      <Input id="username"/>
                    </Form.Item>
                  </div>
                  <div>
                    <label htmlFor="email"  className="font-bold block mb-[0.5rem]">Email</label>

                    <Form.Item<FieldTypeSignup>
                      name="email"
                      rules={[{ required: true, message: 'Email không được để trống', type:'email' }]}
                    >
                      <Input id="email"/>
                    </Form.Item>
                  </div>
                  <div>
                    <label htmlFor="password" className="font-bold block mb-[0.5rem]">Mật khẩu</label>
                    <Form.Item<FieldTypeSignup>
                      name="password"
                      rules={[
                        { 
                          required: true,
                          validator: (_, value) => {
                            if(!value){
                              return Promise.reject(new Error('Mật khẩu phải không được để trống'));
                            }
                            if (value.length < 6) {
                              return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
                            }
                            if (!/[A-Z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ hoa!'));
                            }
                            if (!/[a-z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ thường!'));
                            }
                            if (!/[0-9]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một số!'));
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                      
                    >
                      <Input.Password className=" py-0 px-2" id="password"/>
                    </Form.Item>
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="font-bold block mb-[0.5rem]">Nhập lại mật khẩu</label>
                    <Form.Item<FieldTypeSignup>
                      name="password_confirmation"
                      dependencies={['password']}
                      rules={[
                        { 
                          required: true,
                          validator: (_, value) => {
                            if(!value){
                              return Promise.reject(new Error('Mật khẩu phải không được để trống'));
                            }
                            if (value.length < 6) {
                              return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
                            }
                            if (!/[A-Z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ hoa!'));
                            }
                            if (!/[a-z]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ thường!'));
                            }
                            if (!/[0-9]/.test(value)) {
                              return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một số!'));
                            }
                            return Promise.resolve();
                          }
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp nhau!'));
                          },
                        }),
                      ]}
                      
                    >
                      <Input.Password className=" py-0 px-2" id="password_confirmation"/>
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Link to={''}>Quên mật khẩu</Link>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className=" w-full p-5">
                    Đăng nhập
                    </Button>
                  </Form.Item>
                  <div className="flex justify-center">
                    <span>Đã có tài khoản? <Link onClick={()=>{
                      dispatch(setOpenModalSignup(false))
                      dispatch(setOpenModalLogin(true))
                    }}>Đăng kí ngay</Link></span>
                  </div>
                </Form>
            </Flex>
          </div>
      </Modal>

      {
        isModalVeritifyOpen
        ?
        <Verytify setIsModalVeritifyOpen={setIsModalVeritifyOpen} email={email} setUser={setUser}/>
        :
        ''
      }
    </div>
  );
}