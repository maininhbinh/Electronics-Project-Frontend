import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Checkbox, Flex, Form, Input, Modal, Select } from "antd";
import emailIcon from "../../../../assets/images/base/emailIcon.png"
import { ResendToken, SignupService, VerifyToken } from "@/services/AuthService";
import { useAppDispatch } from '@/app/hooks';
import { login } from '@/app/slices/authSlide';
import { popupError, popupSuccess } from '../../shared/Toast';
import { useNavigate } from 'react-router-dom';
import { GetProps } from 'antd/lib';
import { Iuser } from '@/common/types/user.interface';

interface VerifyTokenProps {
  setIsModalVeritifyOpen: Dispatch<SetStateAction<boolean>>,
  email: string,
  // setUser: Dispatch<SetStateAction<Iuser>>
}

export default function Verytify({setIsModalVeritifyOpen, email}: VerifyTokenProps) {
  type OTPProps = GetProps<typeof Input.OTP>;
  
  const [expiredOTP, setExpiredOTP] = useState(5)
  const [isVerifyToken, setIsVerifyToken] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [resetOTP, setResetOTP] = useState(false)

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleConfirmOtp = async () => {
    try {
      setIsVerifyToken(true);
      const response = await VerifyToken(otp, email);
      dispatch(login(response.data));
      popupSuccess(`Hello ${response.data.user.username}`);
      // setUser(response.data.user)
      setIsModalVeritifyOpen(false)
      navigate("../");
    } catch (error) {
      popupError('OTP không đúng');
    }finally{
      setIsVerifyToken(false);
    }

  }

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  const handleResendOTP = async () => {
    setExpiredOTP(5)
    setResetOTP(true)
    const response = await ResendToken(email);
    console.log(response);
    
  }

  useEffect(()=>{
    const timer = setInterval(() => {
      setExpiredOTP((prevCountdown) => {
        if (prevCountdown < 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, [resetOTP])

  return (
    <div>
        <Modal 
          title={
            <Flex gap={10} align='center'>
              <span>Xác thực OTP</span>
              <div className='h-[30px] w-[30px] border-2 border-primary-900 flex justify-center items-center text-[16px] rounded-full'>
                {expiredOTP}
              </div>
            </Flex>
          } 
          onCancel={()=>setIsModalVeritifyOpen(false)}
          open={true} 
          footer={false}
        >
          <Flex gap={5}>
            <p>Vui lòng kiểm tra email của bạn.</p>
            {
              expiredOTP < 1
              ?
              <p className='text-primary-700 cursor-pointer' onClick={handleResendOTP}>gửi lại OTP</p>
              :
              ''
            }
          </Flex>
          <Flex vertical gap={20} align='center'>
            <div className="flex justify-center items-center">
              <img src={emailIcon} alt="" />
            </div>
            <div className="w-full flex justify-center items-center">
            <Input.OTP  length={4} {...sharedProps} />
            </div>

            <Button className='w-[70%] h-[45px] rounded-full' type='primary' disabled={isVerifyToken} onClick={() => handleConfirmOtp()}>
              Xác nhận
            </Button>
          </Flex>
        </Modal>
    </div>
  )
}
