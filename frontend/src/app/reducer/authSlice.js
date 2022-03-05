import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'auth',
    initialState: { address: null, signer: null, token: null },
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setSigner: (state, action) => {
            state.signer = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        }
    }
});
const authReducer = authSlice.reducer;

export const addressSelector = state => state.authReducer.address;
export const signerSelector = state => state.authReducer.signer;
export const tokenSelector = state => state.authReducer.token;

export const { setAddress, setSigner, setToken } = authSlice.actions;
export default authReducer;