import axiosClient from '../../../services/axiosClient'

// Interface cho việc tạo file mới
export interface CreateFilePayload {
  fileName: string
  creatorID: string
  visibility?: 'public' | 'private'
  sourceLang?: string
  targetLang?: string
  arrFileDetail: Array<{
    source: string
    target: string
  }>
}

export interface CreateFileResponse {
  errCode: number
  message: string
  data?: {
    fileID: string
    fileName: string
    creatorID: string
    visibility: string
    sourceLang: string
    targetLang: string
    totalWords: number
  }
}

// Tạo file mới
export const createFileApi = (data: CreateFilePayload): Promise<CreateFileResponse> =>
  axiosClient.post('/api/files', data)

// Interface cho cập nhật file
export interface UpdateFilePayload {
  fileID: string
  creatorID: string
  fileName?: string
  visibility?: 'public' | 'private'
  arrFileDetail: Array<{
    source: string
    target: string
  }>
}

export interface UpdateFileResponse {
  errCode: number
  message: string
  data?: {
    fileID: string
    fileName: string
    visibility: string
    totalWords: number
    createdAt: string
    detail: Array<{
      detailID: string
      source: string
      target: string
    }>
  }
}

// Cập nhật file
export const updateFileApi = (data: UpdateFilePayload): Promise<UpdateFileResponse> =>
  axiosClient.put('/api/files', data)

// Interface cho xóa file
export interface DeleteFilePayload {
  fileID: string
  creatorID: string
}

export interface DeleteFileResponse {
  errCode: number
  message: string
}

// Xóa file
export const deleteFileApi = (data: DeleteFilePayload): Promise<DeleteFileResponse> =>
  axiosClient.delete('/api/files', { data })

// Interface cho AI generate flashcards
export interface AIGenerateFlashcardsPayload {
  topic: string
  count: number
  sourceLang: string
  targetLang: string
  userID: string
}

export interface AIGenerateFlashcardsResponse {
  errCode: number
  message: string
  data?: Array<{
    index: number
    source: string
    target: string
  }>
}

// Tạo flashcards bằng AI
export const aiGenerateFlashcardsApi = (data: AIGenerateFlashcardsPayload): Promise<AIGenerateFlashcardsResponse> =>
  axiosClient.post('/api/ai/generateFlashcards', data)

// lấy danh sách file người dùng truy cập gần đây
export const getRecentFilesApi = (data: { userID: string; page?: number; limit?: number }) =>
  axiosClient.get(`/api/files/recently?userID=${data.userID}&page=${data.page || 1}&limit=${data.limit || 12}`)

// lấy tất cả các file mà người dùng đã tạo
export const getUserFilesApi = (data: { userID: string; page?: number; limit?: number }) =>
  axiosClient.get(`/api/files/user?userID=${data.userID}&page=${data.page || 1}&limit=${data.limit || 12}`)

// lấy top 6 file được truy cập nhiều nhất
export const getTop6FilesApi = (userID: string) => axiosClient.get(`/api/files/top?userID=${userID}`)

// lấy danh sách file tương tự file người dùng đã truy cập
export const getSimilarFilesApi = (data: { userID: string }) =>
  axiosClient.get(`/api/files/similar?userID=${data.userID}`)

// lấy dữ liệu chi tiết file theo fileID và userID ( có thể không truyền userID)
export const getFileDetailApi = (fileID: string, userID?: string) =>
  axiosClient.get(`/api/files/detail?fileID=${fileID}${userID ? `&userID=${userID}` : ''}`)

// cập nhật điểm của người dùng trong cardmatching và game block
export const updateGameProgressApi = (data: {
  userID: string
  fileID: string
  point: number
  mode: 'pointCardMatching' | 'pointBlockGame'
}) => axiosClient.put('/api/files/updatePoints', data)

// lấy điểm tốt nhất của người dùng trong block game
export const getBlockGamePointsApi = (userID: string, fileID: string) =>
  axiosClient.get(`/api/files/blockGame/points?userID=${userID}&fileID=${fileID}`)

// lấy top rank người học nhanh nhất trong file
export const getTopUsersApi = (fileID: string, userID: string) =>
  axiosClient.get(`/api/files/leaderboard?fileID=${fileID}&userID=${userID}`)

// Tìm kiếm file theo tên có phân trang
export interface SearchFilesParams {
  query: string
  page?: number
  limit?: number
}

export interface SearchFileItem {
  fileID: string
  fileName: string
  visibility: string
  createdAt: string
  totalWords: number
  creatorID: string
  ownerName: string | null
  ownerAvatar: string | null
}

export interface SearchFilesResponse {
  errCode: number
  message: string
  data: SearchFileItem[]
  pagination: {
    total: number
    page: number
    limit: number
    pageCount: number
  }
}

export const searchFilesApi = (params: SearchFilesParams): Promise<SearchFilesResponse> => {
  return axiosClient.get('/api/files/search', {
    params: {
      query: params.query || '',
      page: params.page ?? 1,
      limit: params.limit ?? 12
    }
  })
}

// Interface cho xóa file
export interface DeleteFilePayload {
  fileID: string
  creatorID: string
}

export interface DeleteFileResponse {
  errCode: number
  message: string
}
