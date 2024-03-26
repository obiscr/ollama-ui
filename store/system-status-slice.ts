import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

export type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger"

export interface SystemStatusInfo {
    ID?: string,
    Message: string,
    Color?: ColorType,  // default | primary | secondary | success | warning | danger
}

export interface SystemStatusArray {
    SystemStatus: SystemStatusInfo[]
}

export const initialSystemStatusArrayState: SystemStatusArray = {
    SystemStatus: []
};

const systemStatusSlice = createSlice({
    name: 'systemStatusArrayMessage',
    initialState: initialSystemStatusArrayState,
    reducers: {
        setSystemStatus: (state, action: PayloadAction<SystemStatusArray>) => {
            state.SystemStatus = action.payload.SystemStatus;
        },
        addSuccessStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "success",
            };
            state.SystemStatus.push(newStatus);
        },
        addDefaultStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "default",
            };
            state.SystemStatus.push(newStatus);
        },
        addSecondaryStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "secondary",
            };
            state.SystemStatus.push(newStatus);
        },
        addWarningStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "warning",
            };
            state.SystemStatus.push(newStatus);
        },
        addDangerStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "danger",
            };
            state.SystemStatus.push(newStatus);
        },
        addPrimaryStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const newStatus: SystemStatusInfo = {
                ID: action.payload.ID ?? uuidv4(),
                Message: action.payload.Message,
                Color: "primary",
            };
            state.SystemStatus.push(newStatus);
        },
        clearStatus: (state) => {
            state.SystemStatus = [];
        },
        closeStatus: (state, action: PayloadAction<string>) => {
            const idToClose = action.payload;
            state.SystemStatus = state.SystemStatus.filter(status => status.ID !== idToClose);
        },
        updateStatus: (state, action: PayloadAction<SystemStatusInfo>) => {
            const idToClose = action.payload.ID;
            state.SystemStatus = state.SystemStatus.filter(status => status.ID === idToClose);
            state.SystemStatus[0].Message = action.payload.Message
            state.SystemStatus[0].Color = action.payload.Color
        },
    },
});

export const { setSystemStatus, addSuccessStatus, addDangerStatus, addDefaultStatus, addSecondaryStatus, addWarningStatus, addPrimaryStatus, clearStatus, closeStatus, updateStatus } = systemStatusSlice.actions;

export default systemStatusSlice.reducer
