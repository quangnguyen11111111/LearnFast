import { DocumentIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import logo from '~/assets/logo.png'
import ListItem from '~/components/Listitem'
import { getRecentFilesThunk, getSimilarFilesThunk, getTop6FilesThunk } from '~/features/api/file/fileThunk'
import { useAppDispatch, useAppSelector } from '~/store/hook'

const HomeUserPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Lấy thông tin user từ auth state
  const user = useAppSelector((state) => state.auth.user)

  // Lấy dữ liệu files gần đây từ file state
  const {
    filesRecent: recentFiles,
    filesTop6: top6Files,
    filesSimilar: similarFiles,
    loadingRecent,
    loadingTop6,
    loadingSimilar
  } = useAppSelector((state) => state.file)


  // Gọi API lấy danh sách file gần đây khi component mount
  useEffect(() => {
    if (user?.userID) {
      dispatch(getRecentFilesThunk({ userID: user.userID }))
      dispatch(getTop6FilesThunk({ userID: user.userID }))
      dispatch(getSimilarFilesThunk({ userID: user.userID }))
    }
  }, [user?.userID])

  return (
    <div className='md:px-25 px-5'>
      {/* Gần đây */}
      <div className='mt-5'>
        <p className='font-bold text-gray-500 text-lg'>Gần đây</p>
        {/* Loading state */}
        {loadingRecent && <p className='text-gray-400 text-sm py-2'>Đang tải...</p>}

        {/* Empty state */}
        {!loadingRecent && (!recentFiles || recentFiles.length === 0) && (
          <p className='text-gray-400 text-sm py-2'>Chưa có file nào được truy cập gần đây</p>
        )}

        {/* items */}
        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-2'>
          {/* Hiển thị danh sách file từ API */}
          {recentFiles &&
            recentFiles.map((file) => (
              <div
                key={file.fileID}
                className='flex gap-1 items-center hover:bg-blue-50 p-2 rounded-md cursor-pointer'
                onClick={() => navigate(`/learn-lesson?fileId=${file.fileID}`)}
              >
                <div className='p-2 bg-blue-50 rounded-md inline-block'>
                  <DocumentIcon className='size-6 text-blue-500' />
                </div>
                <div>
                  <p className='text-[0.94rem] font-[600] text-gray-700'>{file.fileName}</p>
                  <p className='text-gray-400 text-sm font-[550]'>{`Học phần • ${file.totalWords} thuật ngữ`}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Bộ thẻ phổ biến */}
      <div className='mt-10'>
        <p className='font-bold text-gray-500 text-lg'>Bộ thẻ ghi nhớ phổ biến</p>
        {/* Loading state */}
        {loadingTop6 && <p className='text-gray-400 text-sm py-2'>Đang tải...</p>}

        {/* Empty state */}
        {!loadingTop6 && (!top6Files || top6Files.length === 0) && (
          <p className='text-gray-400 text-sm py-2'>Chưa có file nào được truy cập gần đây</p>
        )}
        {/* items */}
        <div className='grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1'>
          {/* item */}
          {top6Files &&
            top6Files.map((item, index) => {
              return (
                <ListItem key={index} navigatevalue={'/learn-lesson'}>
                  {' '}
                  <div className='flex flex-col gap-5 items-start'>
                    <p className='text-lg font-semibold text-gray-800'>{item.fileName}</p>
                    <p className='text-sm rounded-2xl bg-gray-200 text-gray-600 inline-block px-2 py-1 font-sans font-semibold'>
                      {item.totalWords} thuật ngữ
                    </p>
                  </div>
                  <div className='flex gap-2 items-center mt-5'>
                    <img src={item.ownerAvatar || logo} alt='logo' className='size-8 rounded-full' />
                    <p className='text-sm text-gray-600 inline-block font-sans font-semibold'>{item.ownerName}</p>
                  </div>
                </ListItem>
              )
            })}
        </div>
      </div>
      {/* Bộ thẻ tương tự người dùng hay truy cập*/}
      <div className='mt-10'>
        <p className='font-bold text-gray-500 text-lg'>Bộ thẻ dựa trên nội dung học gần đây</p>
        {/* Loading state */}
        {loadingSimilar && <p className='text-gray-400 text-sm py-2'>Đang tải...</p>}

        {/* Empty state */}
        {!loadingSimilar && (!similarFiles || similarFiles.length === 0) && (
          <p className='text-gray-400 text-sm py-2'>Chưa có file nào được truy cập gần đây</p>
        )}
        {/* items */}
        <div className='grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1'>
          {/* item */}
          {similarFiles &&
            similarFiles.map((item, index) => {
              return (
                <ListItem key={index} navigatevalue={'/learn-lesson'}>
                  {' '}
                  <div className='flex flex-col gap-5 items-start'>
                    <p className='text-lg font-semibold text-gray-800'>{item.fileName}</p>
                    <p className='text-sm rounded-2xl bg-gray-200 text-gray-600 inline-block px-2 py-1 font-sans font-semibold'>
                      {item.totalWords} thuật ngữ
                    </p>
                    
                  </div>
                  <div className='flex gap-2 items-center mt-5'>
                    <img src={item.ownerAvatar || logo} alt='logo' className='size-8 rounded-full' />
                    <p className='text-sm text-gray-600 inline-block font-sans font-semibold'>{item.ownerName}</p>
                  </div>
                </ListItem>
              )
            })}
        </div>
      </div>
      {/* Tác giả hàng đầu */}
      <div className='mt-10'>
        <p className='font-bold text-gray-500 text-lg'>Tác giả hàng đầu</p>
        {/* items */}
        <div className='grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1 '>
          {/* item */}
          <ListItem navigatevalue={'/learn-lesson'}>
            {' '}
            <img src={logo} alt='logo' className='size-10' />
            <div className='mt-7 flex flex-col gap-3'>
              <p className='font-bold text-xl'>Tác giả 10</p>
              <div className='flex gap-1 items-center bg-gray-200 rounded-xl w-fit px-2 py-1'>
                <DocumentIcon className='size-4 text-gray-600 ' />
                <span className='text-xs font-bold text-gray-600'>444 học phần</span>
              </div>
            </div>
          </ListItem>
        </div>
      </div>
    </div>
  )
}
// Tiêu đề trang
export const meta = () => [{ title: 'Trang người dùng - LearnFast' }]
export default HomeUserPage
