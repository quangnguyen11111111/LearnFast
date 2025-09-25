import { createSlice } from "@reduxjs/toolkit";
interface toggleProps{
    actionUserPage:boolean
}
const initialState: toggleProps = {
 actionUserPage: false
};
const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers:{
        toggle:(state)=>{
            state.actionUserPage= !state.actionUserPage
        }
    }
})
export const { toggle } = toggleSlice.actions;
export default toggleSlice.reducer;