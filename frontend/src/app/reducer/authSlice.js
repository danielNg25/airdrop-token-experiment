import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'auth',
    initialState: { address: null, signer: null, provider: null, token: null },
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setSigner: (state, action) => {
            state.signer = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setProvider: (state, action) => {
            state.provider = action.payload;
        }
    }
});
const authReducer = authSlice.reducer;

export const addressSelector = state => state.authReducer.address;
export const signerSelector = state => state.authReducer.signer;
export const tokenSelector = state => state.authReducer.token;
export const providerSelector = state => state.authReducer.provider;
export const { setAddress, setSigner, setToken, setProvider } = authSlice.actions;
export default authReducer;