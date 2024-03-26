import ollama from "ollama";
import store from "@/store";
import axiosInstance from "@/request/axiosInstance";
import {addDangerStatus, addSecondaryStatus, closeStatus, updateStatus} from "@/store/system-status-slice";
import {v4 as uuidv4} from 'uuid';
import {Options} from "ollama/dist/browser";
import {Conversation} from "@/components/chat";
import {setCurrentConversation} from "@/store/chat-message-slice";

export async function AskGPT(model: string, chatMessage: Conversation, options: Partial<Options>, requestCallback: (conversation: Conversation) => void) {
    try {
        const response = await ollama.chat(
            {
                model: model,
                messages: chatMessage.Messages,
                stream: true,
                options: options
            })
        let responseContent = "";
        for await (const part of response) {
            if (part.message.content) {
                responseContent += part.message.content
                const lastMessage = chatMessage.Messages[chatMessage.Messages.length - 1];
                const updatedLastMessage = {
                    ...lastMessage,
                    content: responseContent
                };
                chatMessage.Messages = chatMessage.Messages.slice(0, -1).concat(updatedLastMessage);
                store.dispatch(setCurrentConversation(chatMessage))
            }
        }
        requestCallback(chatMessage);
    } catch (e: any) {
        if (e.code === 'ECONNABORTED') {
            store.dispatch(addDangerStatus({Message: `Request timeout, please restart your ollama service.`}))
            return
        }
        store.dispatch(addDangerStatus({Message: `Request failed, cause:${e.message}. Please try again later.`}))
    }
}

export async function ChangeModel(oldModel: string ,newModel: string) {
    try {
        const updateMessageId = uuidv4();
        store.dispatch(addSecondaryStatus({ID: updateMessageId, Message: `Unload model ${oldModel}...`}))
        const oldResponse = await axiosInstance.post('/api/chat', {
            model: oldModel,
            keep_alive: 0
        })
        if (oldResponse.status !== 200 && oldResponse.status !== 204) {
            store.dispatch(updateStatus({ID: updateMessageId, Message: `Unload model ${oldModel} failed, please try again later.`, Color: "danger"}))
            return
        } else {
            store.dispatch(updateStatus({ID: updateMessageId, Message: `Unload model ${oldModel} successful.`, Color: "secondary"}))
        }
        store.dispatch(updateStatus({ID: updateMessageId, Message: `Load model ${newModel}...`, Color: "secondary"}))
        const newResponse = await axiosInstance.post('/api/chat', {
            model: newModel,
            keep_alive: -1
        })
        if (newResponse.status !== 200 && newResponse.status !== 204) {
            store.dispatch(updateStatus({ID: updateMessageId, Message: `Load model ${newModel} failed, please try again later.`, Color: "danger"}))
            return
        } else {
            store.dispatch(updateStatus({ID: updateMessageId, Message: `Load model ${newModel} successful.`, Color: "success"}))
        }
        setTimeout(() => {
            store.dispatch(closeStatus(updateMessageId))
        },5000)
    } catch (e: any) {
        if (e.code === 'ECONNABORTED') {
            store.dispatch(addDangerStatus({Message: `Request timeout, please restart your ollama service.`}))
            return
        }
        store.dispatch(addDangerStatus({Message: `Switch model failed, cause:${e.message}. Please try again later.`}))
    }
}

export async function LoadLocalModel() {
    try {
        return await axiosInstance.get('/api/tags')
    } catch (e: any) {
        store.dispatch(addDangerStatus({Message: `Load local model failed, cause:${e.message}. Please try again later.`}))
    }
}

