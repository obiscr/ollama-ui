import {
    Accordion, AccordionItem,
    Button, Select, SelectItem, Spinner,
    Textarea
} from "@nextui-org/react";
import {
    SendIcon,
    SidebarIcon,
} from "@/components/icons";
import React, {useEffect, useRef, useState} from "react";
import UserMessage from "@/components/user-message";
import AiMessage from "@/components/ai-message";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import Sidebar from "@/components/sidebar";

import {AskGPT, LoadLocalModel} from "@/pages/api/request";
import {setModel} from "@/store/generate-slice";
import {ChatMessage, Conversation, MessageRole, saveConversations} from "@/components/chat";
import {setCurrentConversation} from "@/store/chat-message-slice";


const ChatPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const generateSettingReducer = useSelector((state: RootState) => state.generateSettingReducer);
    const currentConversation = useSelector((state: RootState) => state.chatMessageReducer);

    const [prompt, setPrompt] = useState<string>('')
    const [isAsking, setIsAsking] = useState<boolean>(false)
    const [isPromptInvalid, setIsPromptInvalid] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showAccordion, setShowAccordion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const handleMediaChange = (e: any) => {
            setShowAccordion(e.matches);
        };
        mediaQuery.addEventListener('change', handleMediaChange);
        handleMediaChange(mediaQuery);
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    const handlePromptChange = (value: string) => {
        setPrompt(value)
        if (value) {
            setIsPromptInvalid(false)
        }
    }

    const handleSend = async () => {
        if (isAsking) {
            return
        }
        if (!prompt) {
            setIsPromptInvalid(true)
            return
        }
        setIsAsking(true)
        const userMessage: ChatMessage = { role: MessageRole.User, content: prompt };
        const assistantMessage: ChatMessage = { role: MessageRole.Assistant, content: "" };
        const updatedMessages = [...currentConversation.Messages, userMessage, assistantMessage];
        const updatedConversation = {
            ID: currentConversation.ID,
            Title: currentConversation.Title === "New Chat" ? prompt.substring(0, 30) : currentConversation.Title,
            Messages: updatedMessages
        }
        dispatch(setCurrentConversation(updatedConversation))

        // Clear prompt
        setPrompt("")

        // Request AI
        await AskGPT(generateSettingReducer.Model, updatedConversation, {
            temperature: generateSettingReducer.Temperature,
            top_p: generateSettingReducer.TopP,
            frequency_penalty: generateSettingReducer.FrequencyPenalty,
            presence_penalty: generateSettingReducer.PresencePenalty
        }, requestCallback);
        setIsAsking(false)
    }

    const handleKeyDown = async (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSend()
        }
    };

    const handleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const requestCallback = (conversation: Conversation) => {
        saveConversations(conversation)
    }

    const generateSetting = useSelector((state: RootState) => state.generateSettingReducer);
    const [models, setModels] = useState<string[]>(['No models available'])
    const handleSelectedModel = async (select: any) => {
        const selectedValueIterator = select.values();
        const selectedValue = selectedValueIterator.next().value;
        if (!selectedValue || selectedValue === 'No models available') {
            return;
        }
        // await ChangeModel(generateSetting.Model, selectedValue)
        dispatch(setModel(selectedValue))
    }

    useEffect(() => {
        LoadLocalModel().then(response => {
            if (response) {
                const localModel: string[] = []
                response.data.models.map((item: any) => {
                    localModel.push(item.model)
                })
                setModels(localModel)
            }
        })
    }, [])

    return (
        <div className="w-full py-5 px-6 max-w-[1280px] mx-auto">
            <div
                className="flex flex-row gap-5 flex-wrap md:flex-nowrap lg:flex-nowrap md:h-nowrap-content-height lg:h-nowrap-content-height">
                {
                    showSidebar && (
                        showAccordion ? (
                            <div className="w-full">
                                <Accordion variant="splitted" isCompact
                                           style={{paddingLeft: "0", paddingRight: "0"}}>
                                    <AccordionItem key="settings" aria-label="Accordion 1" title="Sidebar">
                                        <Sidebar/>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ) : (
                            <Sidebar/>
                        )
                    )
                }

                <div
                    className={`relative flex flex-col gap-5 h-wrap-content-height md:h-nowrap-content-height lg:h-nowrap-content-height ${showSidebar ? "w-full md:w-3/4 lg:w-3/4 " : "w-full"}`}>
                    <div
                        className="flex w-full items-center gap-2 border-b-small border-divider pb-2  flex-shrink-0">
                        <div className="cursor-pointer" onClick={handleSidebar}>
                            <SidebarIcon/>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-center">
                            <p className="text-base font-medium">{currentConversation.Title}</p>
                            <div className="w-1/2 md:w-2/5 lg:w-1/5">
                                <Select
                                    size="sm" aira-label="Selected a model" aria-labelledby="Selected a model"
                                    value={generateSetting.Model}
                                    onSelectionChange={handleSelectedModel}
                                    placeholder="Select a model"
                                >
                                    {
                                        models.map(item => {
                                            return <SelectItem key={item} aira-label={`Selected a model: ${item}`}>{item}</SelectItem>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    {
                        currentConversation.Messages.length == 1 ?
                            <div className="overflow-y-auto justify-center flex-grow flex flex-col" ref={messagesEndRef}>
                                <div className="flex flex-col gap-4 px-1">
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-large" style={{fontSize: "24px"}}>What
                                            can I
                                            help
                                            you ?</h1>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="overflow-y-auto flex-grow flex flex-col">
                                <div className="flex flex-col gap-4 px-1">
                                    {
                                        currentConversation.Messages.map((item, index) => (
                                            item.role === MessageRole.User ? (
                                                <UserMessage key={index} content={item.content}/>
                                            ) : item.role === MessageRole.Assistant ? (
                                                <AiMessage key={index} content={item.content}/>
                                            ) : (
                                                <span key={index} className="hidden"></span>
                                            )
                                        ))
                                    }
                                </div>
                            </div>
                    }
                    <div className="flex flex-col-reverse flex-shrink-0">
                        <div className="flex w-full flex-col gap-4">
                            <div className="flex flex-col-reverse w-full">
                                <form action="">
                                    <Textarea className="w-full resize-none" value={prompt}
                                              onKeyDown={handleKeyDown}
                                              onValueChange={handlePromptChange} isInvalid={isPromptInvalid}
                                              errorMessage={isPromptInvalid && (showAccordion ? "Please open the settings above and set the Key" : "Please input the prompt")}
                                              endContent={!isAsking ? (
                                                            <Button size="sm" isDisabled={!prompt} color="primary"
                                                                  onClick={handleSend}
                                                                  isIconOnly><SendIcon/></Button>) : (<Spinner />)}
                                              placeholder="You are a helpful ai assistant."
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage;
