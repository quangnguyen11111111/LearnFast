// hàm thunk để lấy danh sách file người dùng truy cập gần đây
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getRecentFilesApi, getSimilarFilesApi, getTop6FilesApi } from './fileAPI'

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
  openedAt: string // ISO datetime
  ownerName: string
  ownerAvatar?: string
  accessCount?: number
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
export const getTop6FilesThunk = createAsyncThunk<IFileResult, void, { rejectValue: string }>(
  'file/getTop6FilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getTop6FilesApi()) as IFileResult
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
export const getSimilarFilesThunk = createAsyncThunk<IFileResult, {userID:string}, { rejectValue: string }>(
  'file/getSimilarFilesThunk',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await getSimilarFilesApi(data)) as IFileResult
      console.log('kiểm tra res file recently :', res)
        if (res && res.errCode === 0) { 
        const { data: data, message, errCode} = res
        return { data: data, message, errCode }
      }
        return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
    }
)