import { Outlet } from "react-router-dom";
import ListAttributeV2 from "./_components/listV2";

export default function AttributeManagementV2(){
    return (
        <div>
            <ListAttributeV2 />
            <Outlet />  
        </div>
    )
}