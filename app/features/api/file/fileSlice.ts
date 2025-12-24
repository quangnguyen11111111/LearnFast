import { createSlice } from '@reduxjs/toolkit'
import { getFileDetailThunk, getRecentFilesThunk, getSimilarFilesThunk, getTop6FilesThunk, type FileDetail, type IFile, type Pagination } from './fileThunk'
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
        })
  }
})

export default fileSlice.reducer
