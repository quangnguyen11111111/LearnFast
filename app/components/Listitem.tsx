import type React from 'react'
import { useNavigate } from 'react-router';
interface IListItemProps{
    children:React.ReactNode;
    background?:string;
    navigatevalue?:string
}
const ListItem=({children,background,navigatevalue}:IListItemProps)=>{
    const navigate=useNavigate()
    return(
        <div className={`mt-3 border-1 ${background} border-gray-200 rounded-xl p-4 shadow relative after:h-1 after:w-0 hover:after:w-full after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 `}
            onClick={()=>navigate(`${navigatevalue}`)}
        >
            {children}
          </div>
    )
}
export default ListItem