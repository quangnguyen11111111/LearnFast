// hàm thunk để lấy danh sách file người dùng truy cập gần đây
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getFileDetailApi,
  getRecentFilesApi,
  getUserFilesApi,
  getSimilarFilesApi,
  getTop6FilesApi,
  getTopUsersApi,
  updateGameProgressApi,
  getBlockGamePointsApi
} from './fileAPI'
import type { summaryItem } from '~/features/cardMatching/types'

export interface Pagination {
  total: number
  page: number
  limit: number
  pageCount: number
}
export interface IOwnerInfo {
  name: string
  avatar: string
  fileName: string
}
export interface IFile {
  fileID: string
  fileName: string
  totalWords: number
  creatorID: string
  openedAt?: string
  createdAt?: string // Format: "THÁNG 12 NĂM 2025"
  ownerName: string
  ownerAvatar?: string
  accessCount?: number
  visibility?: string
}

interface IFilePayload {
  userID: string
  page?: number
  limit?: number
}

interface IFileResult {
  errCode: number
  message: string
  data: IFile[]
  pagination?: Pagination
  canNextPage?: boolean
}
// chi tiết file
export interface FileDetail {
  detailID: string
  fileID: string
  source: string
  target: string
  creatorID: string
  flashcardState: 0 | 1
  quizState: 0 | 1 | 2 | 3
}
export interface IFileDetailResult {
  errCode: number
  message: string
  data: FileDetail[]
  ownerInfo: IOwnerInfo
}
// getRecentFilesThunk: Thunk lấy danh sách file người dùng truy cập gần đây
export const getRecentFilesThunk = createAsyncThunk<IFileResult, IFilePayload, { rejectValue: string }>(
  'file/getRecentFilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getRecentFilesApi(data)) as IFileResult

      if (res && res.errCode === 0) {
        const { data: data, message, errCode, pagination, canNextPage } = res
        return { data: data, message, errCode, pagination, canNextPage }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

// getUserFilesThunk: Thunk lấy tất cả các file mà người dùng đã tạo
export const getUserFilesThunk = createAsyncThunk<IFileResult, IFilePayload, { rejectValue: string }>(
  'file/getUserFilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getUserFilesApi(data)) as IFileResult

      if (res && res.errCode === 0) {
        const { data: data, message, errCode, pagination, canNextPage } = res
        return { data: data, message, errCode, pagination, canNextPage }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

// getTop6FilesThunk: Thunk lấy top 6 file được truy cập nhiều nhất
export const getTop6FilesThunk = createAsyncThunk<IFileResult, { userID: string }, { rejectValue: string }>(
  'file/getTop6FilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getTop6FilesApi(data.userID)) as IFileResult

      if (res && res.errCode === 0) {
        const { data: data, message, errCode, pagination, canNextPage } = res
        return { data: data, message, errCode, pagination, canNextPage }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

//getSimilarFilesThunk: Thunk lấy danh sách file tương tự file người dùng đã truy cập
export const getSimilarFilesThunk = createAsyncThunk<IFileResult, { userID: string }, { rejectValue: string }>(
  'file/getSimilarFilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getSimilarFilesApi(data)) as IFileResult
      if (res && res.errCode === 0) {
        const { data: data, message, errCode } = res
        return { data: data, message, errCode }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

// getFileDetailThunk: Thunk lấy dữ liệu chi tiết file theo fileID và userID ( có thể không truyền userID)
export const getFileDetailThunk = createAsyncThunk<
  IFileDetailResult,
  { fileID: string; userID?: string },
  { rejectValue: string }
>('file/getFileDetailThunk', async (data, { rejectWithValue }) => {
  try {
    const res = (await getFileDetailApi(data.fileID, data.userID)) as IFileDetailResult
    if (res && res.errCode === 0) {
      const { data: data, message, errCode, ownerInfo } = res
      return { data: data, message, errCode, ownerInfo }
    }
    return rejectWithValue(res.message)
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Unknown error')
  }
})

// cập nhật điểm của người dùng trong cardmatching và game block

export const updateGameProgressThunk = createAsyncThunk<
  { errCode: number; message: string },
  { userID: string; fileID: string; point: number; mode: 'pointCardMatching' | 'pointBlockGame' },
  { rejectValue: string }
>('file/updateGameProgressThunk', async (data, { rejectWithValue }) => {
  try {
    const res = (await updateGameProgressApi({
      userID: data.userID,
      fileID: data.fileID,
      point: data.point,
      mode: data.mode
    })) as { errCode: number; message: string }
    if (res && res.errCode === 0) {
      const { message, errCode } = res
      return { message, errCode }
    }
    return rejectWithValue(res.message)
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Unknown error')
  }
})

// lấy top rank người học nhanh nhất trong file
export const getTopUsersThunk = createAsyncThunk<
  summaryItem[],
  { fileID: string; userID: string },
  { rejectValue: string }
>('file/getTopUsersThunk', async (data, { rejectWithValue }) => {
  try {
    const res = (await getTopUsersApi(data.fileID, data.userID)) as any

    if (res && res.errCode === 0) {
      // Dữ liệu nằm trong res.data.topUsers
      return res.data.topUsers || []
    }
    return rejectWithValue(res?.message || 'Lỗi không xác định')
  } catch (e: any) {
    console.error('getTopUsersThunk error:', e)
    return rejectWithValue(e?.message || 'Unknown error')
  }
})

// lấy điểm tốt nhất của người dùng trong block game
export interface IBlockGamePointsResult {
  errCode: number
  message: string
  data: {
    pointBlockGame: number
  } | null
}
export const getBlockGamePointsThunk = createAsyncThunk<
  IBlockGamePointsResult,
  { userID: string; fileID: string },
  { rejectValue: string }
>('file/getBlockGamePointsThunk', async (data, { rejectWithValue }) => {
  try {
    const res = (await getBlockGamePointsApi(data.userID, data.fileID)) as IBlockGamePointsResult
    if (res && res.errCode === 0) {
      return res
    }
    return rejectWithValue(res?.message || 'Lỗi không xác định')
  } catch (e: any) {
    console.error('getBlockGamePointsThunk error:', e)
    return rejectWithValue(e?.message || 'Unknown error')
  }
})
