import { useParams } from 'react-router'

const CoursePage = () => {
    const { folderId } = useParams()
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className=" max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Thư mục</h1>
                <p className="text-gray-700">ID thư mục: {folderId}</p>
            </div>
        </div>
    )
}
export default CoursePage