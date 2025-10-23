import { AnimatePresence,motion } from "framer-motion";
interface MultipleChoiseProps{
    indexMulti:number;
    ORIGINAL_DATA:{id:string;source:string;target:string}[];
    option:string[];
    handleNextQuestion:()=>void;
}
const MultipleChoise=({indexMulti,ORIGINAL_DATA,handleNextQuestion,option}:MultipleChoiseProps)=>{
    return(
                  <div className='bg-white rounded-b-2xl shadow-lg relative overflow-hidden py-10'>
            <AnimatePresence mode='wait'>
              {' '}
              {/* 'wait' đảm bảo cái cũ đi ra xong cái mới mới đi vào */}
              <motion.div
                key={indexMulti} // QUAN TRỌNG: Key này báo cho AnimatePresence biết component đã thay đổi
                className='py-5 px-10 max-md:px-3' // Di chuyển padding vào đây
                initial={{ x: '10%', opacity: 0 }} // Trạng thái bắt đầu (bên phải, vô hình)
                animate={{ x: 0, opacity: 1 }} // Trạng thái hoạt động (ở giữa, hiện hình)
                exit={{ x: '-10%', opacity: 0 }} // Trạng thái thoát (sang trái, vô hình)
                transition={{ duration: 0.3, ease: 'linear' }} // Tốc độ và kiểu hiệu ứng
              >
                <p className='mt-10 text-xl'>{ORIGINAL_DATA[indexMulti].source}</p>
                <div className='mt-25'>
                  <p className='font-semibold text-gray-500 text-sm mb-5'>Chọn đáp án đúng</p>
                  <div className='grid grid-cols-2 gap-4'>
                    {option &&
                      option.map((item, index) => {
                        return (
                          <div
                            key={item} // Thêm key cho item trong map
                            className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700 cursor-pointer'
                            onClick={handleNextQuestion} // Sử dụng hàm mới
                          >
                            <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                              {index + 1}
                            </span>
                            <p className='text-gray-500 text-lg'>{item}</p>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className='mt-5 flex justify-center'>
              <span className='text-blue-600 font-semibold text-sm hover:bg-blue-50 px-3 py-2 rounded-2xl'>
                Bạn không biết?
              </span>
            </div>
          </div>
    )
}
export default MultipleChoise;