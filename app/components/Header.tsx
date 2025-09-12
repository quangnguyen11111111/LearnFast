import { Link } from "react-router";
import logo from "../assets/logo.png"
import { Bars3Icon } from "@heroicons/react/24/outline";
interface HeaderProps {
  display: "sticky" | "static";
  shadow: boolean;
}
export default function Header({display,shadow}: HeaderProps) {
  return (
<header className={`bg-background text-black ${display} ${shadow?'shadow':''} top-0 z-10`}>
  <div className="w-full 2xl:w-[80rem] mx-auto max-md:pr-5">
   <div className="container w-full mx-auto item-center flex justify-between items-center ">
    <Link to={'/'} className=" flex items-center">
      <img src={logo} alt="logo" className="size-24"/>
      <p className="text-3xl font-bold">Study</p>
    </Link>
    <div className="flex justify-center items-center gap-10 flex-1 max-md:hidden">
      <Link to="/" className=" hover:text-gray-300 text-lg font-semibold">Trang chủ</Link>
      <Link to="/about" className=" hover:text-gray-300 text-lg">Khóa học</Link>
      <Link to="/contact" className=" hover:text-gray-300 text-lg ">Học nhanh</Link>
    </div>
    <Bars3Icon className="w-8 h-8 text-black md:hidden"/>
    <Link to={'/login'} className="bg-blue-600 p-3 shadow cursor-pointer text-center rounded-[10px] hover:bg-blue-700 text-white font-bold select-none">Đăng nhập</Link>
   </div>
  </div>
</header>
  );
}
