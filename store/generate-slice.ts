import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import exp from "node:constants";

export interface GenerateSettingInfo {
    SystemRole: string,
    SystemRoleInvalid: boolean,
    Model: string,
    Temperature: number,
    TopP: number,
    FrequencyPenalty: number,
    PresencePenalty: number,
}

export const initialGenerateSettingState: GenerateSettingInfo = {
    SystemRole: "You are a helpful ai assistant.",
    SystemRoleInvalid: false,
    Model: "llama2:7b",
    Temperature: 0.5,
    TopP: 0.5,
    FrequencyPenalty: 0,
    PresencePenalty: 0,
};

const generateSettingSlice = createSlice({
    name: 'generateSetting',
    initialState: initialGenerateSettingState,
    reducers: {
        setGenerateSettingInfo: (state, action: PayloadAction<GenerateSettingInfo>) => {
            state.SystemRole = action.payload.SystemRole;
            state.SystemRoleInvalid = action.payload.SystemRoleInvalid;
            state.Model = action.payload.Model;
            state.Temperature = action.payload.Temperature;
            state.TopP = action.payload.TopP;
            state.FrequencyPenalty = action.payload.FrequencyPenalty;
            state.PresencePenalty = action.payload.PresencePenalty;
        },
        setSystemRole: (state, action: PayloadAction<string>) => {
            state.SystemRole = action.payload;
        },
        setSystemRoleInvalid: (state, action: PayloadAction<boolean>) => {
            state.SystemRoleInvalid = action.payload;
        },
        setModel: (state, action: PayloadAction<string>) => {
            state.Model = action.payload;
        },
        setTemperature: (state, action: PayloadAction<number>) => {
            state.Temperature = action.payload;
        },
        setTopP: (state, action: PayloadAction<number>) => {
            state.TopP = action.payload;
        },
        setFrequencyPenalty: (state, action: PayloadAction<number>) => {
            state.FrequencyPenalty = action.payload;
        },
        setPresencePenalty: (state, action: PayloadAction<number>) => {
            state.PresencePenalty = action.payload;
        },
    },
});

export const { setGenerateSettingInfo,setSystemRole, setSystemRoleInvalid, setModel, setTemperature, setTopP, setFrequencyPenalty ,setPresencePenalty } = generateSettingSlice.actions;
export default generateSettingSlice.reducer;
