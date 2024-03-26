import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialGenerateSettingState} from "@/store/generate-slice";
import { v4 as uuidv4 } from 'uuid';
import {Conversation, MessageRole} from "@/components/chat";


export const initialChatMessageState: Conversation = {
    ID: uuidv4(),
    Title: "New Chat",
    Messages: [{role: MessageRole.System, content: initialGenerateSettingState.SystemRole}],
};

const chatMessageSlice = createSlice({
    name: 'chatMessage',
    initialState: initialChatMessageState,
    reducers: {
        setCurrentConversation: (state, action: PayloadAction<Conversation>) => {
            state.ID = action.payload.ID;
            state.Title = action.payload.Title;
            state.Messages = action.payload.Messages;
        },
    },
});

export const { setCurrentConversation } = chatMessageSlice.actions;

export default chatMessageSlice.reducer
