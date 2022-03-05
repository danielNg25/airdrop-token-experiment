import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authSlice';
const store = configureStore({
    reducer: {
        authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store