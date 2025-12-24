// hàm thunk để lấy danh sách file người dùng truy cập gần đây
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getFileDetailApi, getRecentFilesApi, getSimilarFilesApi, getTop6FilesApi } from './fileAPI'

export interface Pagination {
  total: number
  page: number
  limit: number
  pageCount: number
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
  detailID: string;
  fileID: string;
  source: string;
  target: string;
  creatorID: string;
  flashcardState: 0 | 1  ;
  quizState: 0 | 1 | 2 | 3 ;
}
export interface IFileDetailResult {
  errCode: number
  message: string
  data: FileDetail[]
}
// getRecentFilesThunk: Thunk lấy danh sách file người dùng truy cập gần đây
export const getRecentFilesThunk = createAsyncThunk<IFileResult, IFilePayload, { rejectValue: string }>(
  'file/getRecentFilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getRecentFilesApi(data)) as IFileResult
      console.log('kiểm tra res file recently :', res)

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
      console.log('kiểm tra res file recently :', res)

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
      console.log('kiểm tra res file recently :', res)
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
export const getFileDetailThunk = createAsyncThunk<IFileDetailResult, { fileID: string; userID?: string }, { rejectValue: string }>(
  'file/getFileDetailThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getFileDetailApi(data.fileID, data.userID)) as IFileDetailResult
      console.log('kiểm tra res file detail :', res)
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