import instance, {instanceTest} from "@/api/axios";
import { ISignin, ISignup } from "@/common/types/Auth.interface";
import { Iuser } from "@/common/types/user.interface";

export const SigninService = (payload: ISignin) => {
    return instanceTest.post('auth/login', payload)
}

export const SignupService = (payload: ISignup) => {
    return instance.post('auth/signup', payload)
}

export const VerifyToken = (otp : string, email : string) => {
    return instance.post('auth/verifyOTP', {OTP : otp, email : email});
}

export const ResendToken = (email: string) => {
    return instance.post('auth/resend_token', {email});
}


export const LogoutService = (payload: string) => {
    return instanceTest.post('auth/logout', {}, {
        headers: {
            'Authorization': `Bearer ${payload}`
        }
    })
}