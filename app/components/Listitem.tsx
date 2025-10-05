import type React from 'react'
interface IListItemProps{
    children:React.ReactNode;
}
const ListItem=({children}:IListItemProps)=>{
    return(
        <div className='mt-3 border-1 border-gray-200 rounded-xl p-4 shadow relative after:h-1 after:w-0 hover:after:w-full after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 '>
            {children}
          </div>
    )
}
export default ListItem