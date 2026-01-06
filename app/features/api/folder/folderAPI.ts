import axiosClient from '../../../services/axiosClient'

export interface GetUserFoldersPayload {
  userID: string
  page?: number
  limit?: number
}

export interface GetFolderFilesPayload {
  folderID: string
  userID?: string
  page?: number
  limit?: number
}

export interface UpdateFolderNamePayload {
  folderID: string
  userID: string
  folderName: string
}

export interface CreateFolderPayload {
  folderName: string
  userID: string
}

export const getUserFoldersApi = (data: GetUserFoldersPayload) => {
  const page = data.page || 1
  const limit = data.limit || 12
  return axiosClient.get(`/api/folders/user?userID=${data.userID}&page=${page}&limit=${limit}`)
}

export const getFolderFilesApi = (data: GetFolderFilesPayload) => {
  const page = data.page || 1
  const limit = data.limit || 12
  const userParam = data.userID ? `&userID=${data.userID}` : ''
  return axiosClient.get(`/api/folders/files?folderID=${data.folderID}${userParam}&page=${page}&limit=${limit}`)
}

export const updateFolderNameApi = (data: UpdateFolderNamePayload) => {
  return axiosClient.put('/api/folders/name', data)
}

export const createFolderApi = (data: CreateFolderPayload) => {
  return axiosClient.post('/api/folders', data)
}
