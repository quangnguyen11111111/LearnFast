import { Link } from "react-router";
import logo from "../assets/logo.png"

export default function Header() {
  return (
<header className="bg-background text-black sticky top-0 shadow">
  <div className="w-full 2xl:w-[80rem] mx-auto">
   <div className="container w-full mx-auto item-center flex justify-between items-center ">
    <div className=" flex items-center ">
      <img src={logo} alt="logo" className="size-24"/>
      <p className="text-3xl font-bold">Study</p>
    </div>
    <div className="flex justify-center gap-10 flex-1">
      <Link to="/" className=" hover:text-gray-300">Trang chủ</Link>
      <Link to="/about" className=" hover:text-gray-300">Khóa học</Link>
      <Link to="/contact" className=" hover:text-gray-300">Học nhanh</Link>
    </div>
    <div className="bg-blue-600 p-3 shadow cursor-pointer text-center rounded-[10px] hover:bg-blue-700 text-white font-bold select-none">Đăng nhập</div>
   </div>
  </div>
</header>
  );
}
