import  { FC } from "react";


import Input from "../../(base)/shared/Input/Input";
import ButtonPrimary from "../../(base)/shared/Button/ButtonPrimary";

export interface PageLoginProps {
  className?: string;
}



const Login: FC<PageLoginProps> = ({ className = "" }) => {

  return (
  
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
     
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng nhập quản trị
        </h2>
        <div className="max-w-md mx-auto space-y-6">
    
         
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email
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
              </span>
              <Input type="password" className="mt-1" />
            </label>
            <ButtonPrimary type="submit">Đăng nhập</ButtonPrimary>
          </form>

          {/* ==== */}
        
        </div>
      </div>
    </div>
  );
};

export default Login;
