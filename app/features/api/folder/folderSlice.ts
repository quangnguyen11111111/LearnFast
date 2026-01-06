import { createSlice } from '@reduxjs/toolkit'
import {
  getFolderFilesThunk,
  getUserFoldersThunk,
  updateFolderNameThunk,
  createFolderThunk,
  addFileToFolderThunk,
  removeFileFromFolderThunk,
  deleteFolderThunk,
  type IFolder,
  type FolderPagination,
  type IFolderFile
} from './folderThunk'

interface FolderState {
  folders: IFolder[] | null
  loading: boolean
  pagination?: FolderPagination | null
  canNextPage?: boolean

  folderFiles: IFolderFile[] | null
  loadingFolderFiles: boolean
  paginationFolderFiles?: FolderPagination | null
  canNextPageFolderFiles?: boolean
}

const initialState: FolderState = {
  folders: null,
  loading: false,
  pagination: null,
  canNextPage: false,

  folderFiles: null,
  loadingFolderFiles: false,
  paginationFolderFiles: null,
  canNextPageFolderFiles: false
}

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserFoldersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserFoldersThunk.rejected, (state) => {
        state.loading = false
      })
      .addCase(getUserFoldersThunk.fulfilled, (state, action) => {
        state.loading = false
        const incoming = action.payload.data || []
        const currentPage = action.payload.pagination?.page || 1
        // Append when loading next pages to keep full list consistent with library
        state.folders = currentPage > 1 && state.folders ? [...state.folders, ...incoming] : incoming
        state.pagination = action.payload.pagination
        state.canNextPage = action.payload.canNextPage
      })

      // files inside a folder
      .addCase(getFolderFilesThunk.pending, (state) => {
        state.loadingFolderFiles = true
      })
      .addCase(getFolderFilesThunk.rejected, (state) => {
        state.loadingFolderFiles = false
      })
      .addCase(getFolderFilesThunk.fulfilled, (state, action) => {
        state.loadingFolderFiles = false
        const incoming = action.payload.data || []
        const currentPage = action.payload.pagination?.page || 1
        state.folderFiles = currentPage > 1 && state.folderFiles ? [...state.folderFiles, ...incoming] : incoming
        state.paginationFolderFiles = action.payload.pagination
        state.canNextPageFolderFiles = action.payload.canNextPage
      })

      // update folder name
      .addCase(updateFolderNameThunk.fulfilled, (state, action) => {
        const { folderID, folderName } = action.payload.data
        // Cập nhật tên thư mục trong danh sách folders
        if (state.folders) {
          const folderIndex = state.folders.findIndex((f) => f.folderID === folderID)
          if (folderIndex !== -1) {
            state.folders[folderIndex].folderName = folderName
          }
        }
      })

      // create folder
      .addCase(createFolderThunk.fulfilled, (state, action) => {
        const newFolder = action.payload.data
        // Thêm thư mục mới vào đầu danh sách
        if (state.folders) {
          state.folders = [newFolder, ...state.folders]
        } else {
          state.folders = [newFolder]
        }
      })

      // add file to folder
      .addCase(addFileToFolderThunk.fulfilled, (state, action) => {
        const newFiles = action.payload.data
        // Thêm file mới vào đầu danh sách folderFiles
        if (state.folderFiles && newFiles.length > 0) {
          state.folderFiles = [...newFiles, ...state.folderFiles]
        } else if (newFiles.length > 0) {
          state.folderFiles = newFiles
        }
      })

      // remove file from folder
      .addCase(removeFileFromFolderThunk.fulfilled, (state, action) => {
        const { fileID } = action.payload.data
        // Xóa file khỏi danh sách folderFiles
        if (state.folderFiles) {
          state.folderFiles = state.folderFiles.filter((f) => f.fileID !== fileID)
        }
      })

      // delete folder
      .addCase(deleteFolderThunk.fulfilled, (state, action) => {
        const { folderID } = action.payload.data
        // Xóa thư mục khỏi danh sách folders
        if (state.folders) {
          state.folders = state.folders.filter((f) => f.folderID !== folderID)
        }
      })
  }
})

export default folderSlice.reducer
