interface Term {
      ORIGINAL_DATA: { id: string; source: string; target: string }[]
}
const ListTerm=({ORIGINAL_DATA}:Term)=>{
    return(
        <div className='mt-5'>
        <p className='font-bold text-xl mt-8 mb-5 text-gray-500'>Thuật ngữ trong học phần này</p>
        <div className=' p-3 flex flex-col gap-3 bg-white'>
          {ORIGINAL_DATA &&
            ORIGINAL_DATA.map((item, index) => {
              return (
                <div className='bg-white grid grid-cols-[1fr_auto_1fr] p-4 justify-items-center border-1 border-gray-200 rounded-lg' key={index}>
                  <p className=''>{item.source}</p>
                  <span className='w-[0.5px] bg-gray-300'></span>
                  <p className=''>{item.target}</p>
                </div>
              )
            })}
        </div>
      </div>
    )
}
export default ListTerm