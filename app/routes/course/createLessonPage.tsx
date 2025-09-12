import { useEffect, useState } from "react";
import Button from "~/components/Button";


const CreateLessonPage=() => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <div className="h-full">
    <div className=" sticky top-0 z-100 bg-background">
    <div className="flex items-center justify-between container w-full 2xl:w-[80rem] mx-auto py-5">
      <p className="text-3xl font-bold my-5">Tạo bài học mới</p>
    <div className="">
      <Button variant="secondary" className="px-3 py-2 font-bold" rounded="rounded-2xl ">Tạo</Button>
    <Button variant="primary" className="px-3 py-2 font-bold " rounded="rounded-2xl ">Tạo và ôn luyện</Button>
    </div>
    </div>
    <div className={`border-b border-1 w-full border-gray-400 ${isScrolled?'': "hidden"}`}></div>
    </div>
    <div className="h-[200vh] bg-red-300"></div>
  </div>;
}
export default CreateLessonPage;