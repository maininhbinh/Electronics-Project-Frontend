import  { FC } from "react";
import facebookSvg from "../../../../assets/images/base/Facebook.svg";
import twitterSvg from "../../../../assets/images/base/Twitter.svg";
import googleSvg from "../../../../assets/images/base/Google.svg";
import { Helmet } from "react-helmet-async";
import Input from "../shared/Input/Input";
import { Link } from "react-router-dom";
import ButtonPrimary from "../shared/Button/ButtonPrimary";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  return (
  
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Đăng nhập trang quản trị</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          ĐĂNG NHẬP QUẢN TRỊ
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Địa chỉ email
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Mật khẩu
                <Link to="/forgot-pass" className="text-sm text-green-600">
                Quên mật khẩu?
                </Link>
              </span>
              <Input type="password" className="mt-1" />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" to="/signup">
              Tạo tài khoản
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
