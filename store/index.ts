import { configureStore } from '@reduxjs/toolkit';
import generateSettingReducer from "@/store/generate-slice";
import chatMessageReducer from "@/store/chat-message-slice";
import systemStatusReducer from "@/store/system-status-slice";


const store = configureStore({
    reducer: {
        generateSettingReducer: generateSettingReducer,
        chatMessageReducer: chatMessageReducer,
        systemStatusReducer: systemStatusReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
