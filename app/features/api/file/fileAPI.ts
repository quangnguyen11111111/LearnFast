import axiosClient from '../../../services/axiosClient'

// lấy danh sách file người dùng truy cập gần đây
export const getRecentFilesApi = (data:{
    userID:string,page?:number,limit?:number
}) => axiosClient.get(`/api/files/recently?userID=${data.userID}&page=${data.page||1}&limit=${data.limit||12}`)

// lấy top 6 file được truy cập nhiều nhất
export const getTop6FilesApi = () => axiosClient.get(`/api/files/top`)

// lấy danh sách file tương tự file người dùng đã truy cập
export const getSimilarFilesApi = (data:{
    userID:string
}) => axiosClient.get(`/api/files/similar?userID=${data.userID}`)