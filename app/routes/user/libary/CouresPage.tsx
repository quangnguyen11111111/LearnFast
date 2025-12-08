import { FolderIcon } from "@heroicons/react/24/outline"

interface CourseItem {
  id: string
  title: string
  terms: number
}
const CoursePage = () => {
  const folders = [
    { id: '1', title: 'Thư mục 1', terms: 10 },
    { id: '2', title: 'Thư mục 2', terms: 15 },
    { id: '3', title: 'Thư mục 3', terms: 20 },
    { id: '4', title: 'Thư mục 4', terms: 25 },
    { id: '5', title: 'Thư mục 5', terms: 30 }
  ]
  return <div className="flex flex-col gap-5">
    {
        folders && folders.map((item)=>{
            return(
                <div className="flex flex-col bg-white px-3 py-4 border border-gray-200 rounded-xl hover:shadow-lg" key={item.id}>
                    <p className="text-sm font-semibold text-gray-700">{item.terms} mục</p>
                    <div className="flex gap-3 items-center mt-2">
                        <FolderIcon className='w-6 h-6 text-gray-400'/>
                    <p className="text-lg font-bold">{item.title}</p>
                    </div>
                </div>
            )
        })
    }
  </div>
}
export default CoursePage
