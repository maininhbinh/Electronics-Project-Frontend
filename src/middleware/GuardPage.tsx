import { popupError } from "@/page/[role]/shared/Toast";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Navigate } from "react-router-dom";

export default function GuardPage({children} : any){
  
    const [user] = useLocalStorage('user', undefined);
    if(!user){
        popupError('Vui lòng đăng nhập trước!')
        return <Navigate to="/" />;
    }
    return <> {children}</>

}