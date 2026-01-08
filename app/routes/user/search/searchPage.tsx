import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppDispatch } from '~/store/hook'
import { searchFilesThunk } from '~/features/api/file/fileThunk'
import { BookmarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface SearchItem {
  fileID: string
  fileName: string
  visibility: string
  createdAt: string
  totalWords: number
  creatorID: string
  ownerName: string | null
  ownerAvatar: string | null
}

const SearchPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || searchParams.get('query') || ''
  const pageParam = Number(searchParams.get('page') || '1')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<SearchItem[]>([])
  const [page, setPage] = useState(Math.max(pageParam, 1))
  const [pageCount, setPageCount] = useState(1)
  const [total, setTotal] = useState(0)

  // Derived title text
  const title = useMemo(() => (q ? `Kết quả cho "${q}"` : 'Tất cả kết quả'), [q])

  const fetchData = async () => {
    if (!q.trim()) {
      setItems([])
      setTotal(0)
      setPageCount(1)
      return
    }
    setLoading(true)
    try {
      const res = await dispatch(searchFilesThunk({ query: q, page, limit: 12 })).unwrap()
      console.log('kiểm tra dữ liệu tìm kiếm :', res)

      setItems(res.data || [])
      setTotal(res.pagination?.total || 0)
      setPageCount(res.pagination?.pageCount || 1)
    } catch (e) {
      setItems([])
      setTotal(0)
      setPageCount(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(Math.max(pageParam, 1))
  }, [pageParam])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page])

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(p, 1), pageCount)
    setPage(next)
    const params: any = { page: String(next) }
    if (q) params.q = q
    setSearchParams(params)
  }

  return (
    <div className='container w-full 2xl:w-[80rem] mx-auto px-2 md:px-0 my-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        {total > 0 && <p className='text-gray-500 mt-1'>{total.toLocaleString()} kết quả</p>}
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <span className='text-gray-500'>Đang tìm kiếm...</span>
        </div>
      ) : items.length === 0 ? (
        <div className='flex justify-center items-center h-40'>
          <span className='text-gray-500'>Không có kết quả</span>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {items.map((item) => (
              <div
                key={item.fileID}
                className='bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer'
                onClick={() => navigate(`/learn-lesson?fileId=${item.fileID}`)}
              >
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold line-clamp-1'>{item.fileName}</h3>
                </div>

                <div className='mt-2'>
                  <span className='inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full'>
                    {item.totalWords} thuật ngữ
                  </span>
                </div>

                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={item.ownerAvatar || ''}
                      alt={item.ownerName || 'owner'}
                      className='w-6 h-6 rounded-full object-cover bg-gray-200'
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
                      }}
                    />
                    <span className='text-sm text-gray-600 line-clamp-1'>{item.ownerName || 'Ẩn danh'}</span>
                  </div>
                  <button
                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm'
                    onClick={(ev) => {
                      ev.stopPropagation()
                      navigate(`/learn-lesson?fileId=${item.fileID}`)
                    }}
                  >
                    <BookmarkIcon className='w-4 h-4' />
                    Xem trước
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center justify-between mt-6'>
            <div className='text-sm text-gray-600'>
              Trang {page} / {pageCount} • {total} kết quả
            </div>
            <div className='flex items-center gap-2'>
              <button
                className='inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                <ArrowLeftIcon className='w-4 h-4' /> Trước
              </button>
              <button
                className='inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                onClick={() => goToPage(page + 1)}
                disabled={page >= pageCount}
              >
                Tiếp <ArrowRightIcon className='w-4 h-4' />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const meta = () => [{ title: 'Tìm kiếm - LearnFast' }]
export default SearchPage
