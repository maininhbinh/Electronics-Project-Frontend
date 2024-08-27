import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { ISignin, ISignup } from "@/common/types/Auth.interface";
import { LogoutService, SigninService } from "@/services/AuthService";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

interface IInitialState {
    isAuthenticated: boolean
}

const initialState: IInitialState = {
    isAuthenticated: !!localStorage.getItem('access_token')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, {payload}) => {
            localStorage.setItem('user', JSON.stringify(payload?.user));
            localStorage.setItem('access_token', payload?.access_token)
            localStorage.setItem('token_type', payload?.token_type)   
            state.isAuthenticated = true;
        },
        logout: (state) => {            
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
            localStorage.removeItem('token_type')
            state.isAuthenticated = false;
        },
        loadAuthState: (state, {payload}) => {
            localStorage.setItem('user', JSON.stringify(payload?.user));            
            state.isAuthenticated = true;
        },
        setIsAuthenticated: (state) => {
            state.isAuthenticated = !state.isAuthenticated
        }
    }
})

export const Signin = (payload: ISignin) => async (dispatch: Dispatch) => {
    try{
        const {data} = await SigninService(payload)

        if(data && data.success == true){         
            return data
        }

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;

        if(axiosError?.response?.status == 422){
            return axiosError?.response?.data
        }
        
        return {
            success: false,
            result: {
                message: 'Request failed'
            }
        }
    }
}

export const Logout = (payload: string) => async (dispatch: Dispatch) => {
    try{
        const {data} = await LogoutService(payload)
        
        if(data && data.success == true){         

            return data

        }

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;
        console.log(error);
        
        if(axiosError?.response?.status == 422){
            return {
                success: false,
                result: {
                    message: axiosError?.response?.data?.message
                }
            }
        }
        
        return {
            success: false,
            result: {
                message: 'Request failed'
            }
        }
    }
}

export const {login, logout, loadAuthState, setIsAuthenticated} = authSlice.actions;

export default authSlice.reducer;