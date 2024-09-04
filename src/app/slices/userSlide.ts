import { profileService } from "@/services/UserService";
import { Dispatch } from "@reduxjs/toolkit";
import { loadAuthState, logout } from "./authSlide";
import { setLoading, setOpenModalLogin } from "../webSlice";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";
import { popupError } from "@/page/[role]/shared/Toast";

export const getUser = (payload: string) => async (dispatch: Dispatch) => {
    try{
        const {data} = await profileService(payload);
        
        if(data.success === true){
            dispatch(loadAuthState(data));
        }

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;

        if(axiosError?.response?.status === 401){
            dispatch(logout())
            dispatch(setOpenModalLogin(true));
            popupError('Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại!');
        }
        
    }
}

export const checkAdmin = (payload: string) => async (dispatch: Dispatch) => {
    try{
        const {data} = await profileService(payload);
        
        if(data.success === true){
            dispatch(loadAuthState(data));
        }
        console.log(data.user.role_id);
        
        
        return data.user.role_id

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;

        if(axiosError?.response?.status === 401){
            dispatch(logout())
            dispatch(setOpenModalLogin(true));
            popupError('Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại!');
        }
        
    }
}