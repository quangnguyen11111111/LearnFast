import { createSlice } from '@reduxjs/toolkit'

// toggleProps: Trạng thái đơn giản dùng để bật/tắt giao diện trang người dùng
interface ToggleProps {
  actionUserPage: boolean
}

// initialState: Giá trị mặc định (chưa mở trang hành động người dùng)
const initialState: ToggleProps = {
  actionUserPage: false
}

// toggleSlice: Slice nhỏ quản lý việc đảo trạng thái actionUserPage
const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    // toggle: Đảo giá trị true/false để điều khiển hiển thị
    toggle: (state) => {
      state.actionUserPage = !state.actionUserPage
    }
  }
})

export const { toggle } = toggleSlice.actions
export default toggleSlice.reducer
