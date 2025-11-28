import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// useAppDispatch: Hook rút gọn trả về dispatch đã gán kiểu AppDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
// useAppSelector: Hook chọn state với kiểu RootState để có gợi ý đầy đủ
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
