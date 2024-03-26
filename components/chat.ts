import { v4 as uuidv4 } from 'uuid';

export enum MessageRole {
    System = "system",
    User = "user",
    Assistant = "assistant",
}

export interface ChatMessage {
    role: MessageRole,
    content: string,
}

export interface ConversationBase {
    ID: string,
    Title: string,
}

export interface Conversation extends ConversationBase{
    Messages: ChatMessage[]
}


export function loadConversations(): ConversationBase[] {
    const conversationList = localStorage.getItem("ollama_ui_conversations");
    if (conversationList) {
        const conversations: Conversation[] = JSON.parse(conversationList);
        return conversations.map(({ ID, Title}) => ({ ID, Title }));
    } else {
        return [];
    }
}

export function saveConversations(conversation: Conversation){
    const data = loadConversations()
    const specific = data.filter(d => d.ID === conversation.ID)
    if (!specific || specific.length === 0) {
        data.push({
            ID: conversation.ID,
            Title: conversation.Title,
        })
        localStorage.setItem("ollama_ui_conversations", JSON.stringify(data))
        localStorage.setItem(`ollama_ui_message_${conversation.ID}`, JSON.stringify(conversation))
    } else {
        const oldConversation = specific[0];
        oldConversation.Title = conversation.Title;
        localStorage.setItem("ollama_ui_conversations", JSON.stringify(data))
        localStorage.setItem(`ollama_ui_message_${conversation.ID}`, JSON.stringify(conversation))
    }
}

export function loadConversation(id: string): Conversation {
    const conversationMetadata = localStorage.getItem(`ollama_ui_message_${id}`);
    if (conversationMetadata) {
        return JSON.parse(conversationMetadata)
    } else {
        return {
            ID: uuidv4(),
            Title: 'New Chat',
            Messages: []
        };
    }
}
