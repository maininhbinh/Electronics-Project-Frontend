import { instanceTest } from "@/api/axios";
import { useAppDispatch } from "@/app/hooks";
import { checkAdmin, getUser } from "@/app/slices/userSlide";
import { popupError } from "@/page/[role]/shared/Toast";
import { profileService } from "@/services/UserService";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function  GuardAdmin({ children }: any) {

    const access_token = localStorage.getItem('access_token') ?? '';
    const [isAdmin, setIsAdmin] = useState<boolean|null>(null); // null initially to indicate loading
    const [user] = useLocalStorage('user', undefined);
  
    useEffect(() => {
      const checkUseAdmin = async () => {
        try {
          const {data} = await instanceTest.get('/user/profile', {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          });

          const role_id = data.user.role_id
          
          // Assuming response.data contains user info with an isAdmin flag
          setIsAdmin(role_id == 1 || role_id == 3 ? true : false);
        } catch (error) {
          setIsAdmin(false); // If there's an error, assume not admin
        }
      };
  
      if (access_token) {
        checkUseAdmin();
      } else {
        setIsAdmin(false);
      }
    }, [access_token]);
  
    if (!user) {
      popupError('Vui lòng đăng nhập trước!');
      return <Navigate to="/" />;
    }
    
    if (isAdmin === null) {
      return ''; // or a spinner while the check is ongoing
    }
  
    return isAdmin ? <> {children} </> : <Navigate to="/" />;

}