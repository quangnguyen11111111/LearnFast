import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getFolderFilesApi,
  getUserFoldersApi,
  updateFolderNameApi,
  createFolderApi,
  type GetFolderFilesPayload,
  type GetUserFoldersPayload,
  type UpdateFolderNamePayload,
  type CreateFolderPayload
} from './folderAPI'

export interface FolderPagination {
  total: number
  page: number
  limit: number
  pageCount: number
}

export interface IFolder {
  folderID: string
  folderName: string
  userID: string
  totalTerms?: number
}

export interface IFolderFile {
  fileID: string
  fileName: string
  description?: string
  totalWords: number
}

interface IFolderResult {
  errCode: number
  message: string
  data: IFolder[]
  pagination?: FolderPagination | null
  canNextPage?: boolean
}

interface IFolderFilesResult {
  errCode: number
  message: string
  data: IFolderFile[]
  pagination?: FolderPagination | null
  canNextPage?: boolean
}

export const getUserFoldersThunk = createAsyncThunk<IFolderResult, GetUserFoldersPayload, { rejectValue: string }>(
  'folder/getUserFoldersThunk',
  async (payload, { rejectWithValue }) => {
    try {
      const res = (await getUserFoldersApi(payload)) as IFolderResult
      if (res && res.errCode === 0) {
        const { data, message, errCode, pagination, canNextPage } = res
        return { data, message, errCode, pagination, canNextPage }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

export const getFolderFilesThunk = createAsyncThunk<IFolderFilesResult, GetFolderFilesPayload, { rejectValue: string }>(
  'folder/getFolderFilesThunk',
  async (payload, { rejectWithValue }) => {
    try {
      const res = (await getFolderFilesApi(payload)) as IFolderFilesResult
      if (res && res.errCode === 0) {
        const { data, message, errCode, pagination, canNextPage } = res
        return { data, message, errCode, pagination, canNextPage }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

interface UpdateFolderNameResult {
  errCode: number
  message: string
  data: {
    folderID: string
    folderName: string
  }
}

export const updateFolderNameThunk = createAsyncThunk<
  UpdateFolderNameResult,
  UpdateFolderNamePayload,
  { rejectValue: string }
>('folder/updateFolderNameThunk', async (payload, { rejectWithValue }) => {
  try {
    const res = (await updateFolderNameApi(payload)) as UpdateFolderNameResult
    if (res && res.errCode === 0) {
      return res
    }
    return rejectWithValue(res.message)
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Unknown error')
  }
})

interface CreateFolderResult {
  errCode: number
  message: string
  data: IFolder
}

export const createFolderThunk = createAsyncThunk<CreateFolderResult, CreateFolderPayload, { rejectValue: string }>(
  'folder/createFolderThunk',
  async (payload, { rejectWithValue }) => {
    try {
      const res = (await createFolderApi(payload)) as CreateFolderResult
      if (res && res.errCode === 0) {
        return res
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)
