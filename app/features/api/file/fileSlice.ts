import { createSlice } from '@reduxjs/toolkit'
import {
  getFileDetailThunk,
  getRecentFilesThunk,
  getSimilarFilesThunk,
  getTop6FilesThunk,
  getTopUsersThunk,
  updateGameProgressThunk,
  type FileDetail,
  type IFile,
  type IOwnerInfo,
  type Pagination
} from './fileThunk'
import type { summaryItem } from '~/features/cardMatching/types'

interface FileState {
  filesRecent: IFile[] | null
  filesTop6: IFile[] | null
  filesSimilar: IFile[] | null
  loadingRecent: boolean
  loadingTop6: boolean
  loadingSimilar: boolean
  paginationRecent?: Pagination | null
  canNextPageRecent?: boolean

  // _______ detail file _______
  fileDetail: FileDetail[] | null
  loadingDetail: boolean
  ownerInfo: IOwnerInfo | null
  topUsers: summaryItem[] | null
  loadingTopUsers: boolean
  loadingUpdateTopUsers: boolean
}

// initialState: Trạng thái khởi tạo của slice
const initialState: FileState = {
  filesRecent: null,
  filesTop6: null,
  filesSimilar: null,
  loadingRecent: false,
  loadingTop6: false,
  loadingSimilar: false,
  paginationRecent: null,
  canNextPageRecent: false,

  // _______ detail file _______
  fileDetail: null,
  loadingDetail: false,
  ownerInfo: null,
  topUsers: null,
  loadingTopUsers: false,
  loadingUpdateTopUsers: false
}

// authSlice: Slice quản lý logic auth + xử lý các thunk ở extraReducers
const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // lịch sử file gần đây
      .addCase(getRecentFilesThunk.pending, (state) => {
        state.loadingRecent = true
      })
      .addCase(getRecentFilesThunk.rejected, (state) => {
        state.loadingRecent = false
      })
      .addCase(getRecentFilesThunk.fulfilled, (state, action) => {
        state.filesRecent = action.payload.data
        state.paginationRecent = action.payload.pagination
        state.canNextPageRecent = action.payload.canNextPage
        state.loadingRecent = false
      })
      // top 6 file được truy cập nhiều nhất
      .addCase(getTop6FilesThunk.pending, (state) => {
        state.loadingTop6 = true
      })
      .addCase(getTop6FilesThunk.rejected, (state) => {
        state.loadingTop6 = false
      })
      .addCase(getTop6FilesThunk.fulfilled, (state, action) => {
        state.filesTop6 = action.payload.data
        state.loadingTop6 = false
      })
      //   file tương tự
      .addCase(getSimilarFilesThunk.pending, (state) => {
        state.loadingSimilar = true
      })
      .addCase(getSimilarFilesThunk.rejected, (state) => {
        state.loadingSimilar = false
      })
      .addCase(getSimilarFilesThunk.fulfilled, (state, action) => {
        state.filesSimilar = action.payload.data
        state.loadingSimilar = false
      })
      // _______ chi tiết file _______
      .addCase(getFileDetailThunk.pending, (state) => {
        state.loadingDetail = true
      })
      .addCase(getFileDetailThunk.rejected, (state) => {
        state.loadingDetail = false
      })
      .addCase(getFileDetailThunk.fulfilled, (state, action) => {
        state.fileDetail = action.payload.data
        state.loadingDetail = false
        state.ownerInfo = action.payload.ownerInfo
      })
      // cập nhật điểm của người dùng trong cardmatching và game block
      .addCase(updateGameProgressThunk.pending, (state) => {
        state.loadingUpdateTopUsers = true
      })
      .addCase(updateGameProgressThunk.rejected, (state) => {
        state.loadingUpdateTopUsers = false
      })
      .addCase(updateGameProgressThunk.fulfilled, (state) => {
        state.loadingUpdateTopUsers = false
      })

      // lấy top rank người học nhanh nhất trong file
      .addCase(getTopUsersThunk.pending, (state) => {
        state.loadingTopUsers = true
      })
      .addCase(getTopUsersThunk.rejected, (state) => {
        state.loadingTopUsers = false
      })
      .addCase(getTopUsersThunk.fulfilled, (state, action) => {
        state.topUsers = action.payload
        state.loadingTopUsers = false
      })
  }
})

export default fileSlice.reducer
