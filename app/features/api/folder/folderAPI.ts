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

// Lấy danh sách thư mục của người dùng
export const getUserFoldersApi = (data: GetUserFoldersPayload) => {
  const page = data.page || 1
  const limit = data.limit || 12
  return axiosClient.get(`/api/folders/user?userID=${data.userID}&page=${page}&limit=${limit}`)
}
// Lấy danh sách file trong một thư mục
export const getFolderFilesApi = (data: GetFolderFilesPayload) => {
  const page = data.page || 1
  const limit = data.limit || 12
  const userParam = data.userID ? `&userID=${data.userID}` : ''
  return axiosClient.get(`/api/folders/files?folderID=${data.folderID}${userParam}&page=${page}&limit=${limit}`)
}
// Cập nhật tên thư mục
export const updateFolderNameApi = (data: UpdateFolderNamePayload) => {
  return axiosClient.put('/api/folders/name', data)
}
//  Tạo thư mục mới
export const createFolderApi = (data: CreateFolderPayload) => {
  return axiosClient.post('/api/folders', data)
}

// Xóa thư mục
export interface DeleteFolderPayload {
  folderID: string
  userID: string
}

export const deleteFolderApi = (data: DeleteFolderPayload) => {
  return axiosClient.delete('/api/folders', { data })
}

// Thêm file vào thư mục
export interface AddFileToFolderPayload {
  folderID: string
  userID: string
  fileID: string
}

export const addFileToFolderApi = (data: AddFileToFolderPayload) => {
  return axiosClient.post('/api/folders/files', data)
}

// Xóa file khỏi thư mục
export interface RemoveFileFromFolderPayload {
  folderID: string
  userID: string
  fileID: string
}

export const removeFileFromFolderApi = (data: RemoveFileFromFolderPayload) => {
  return axiosClient.delete('/api/folders/files', { data })
}
