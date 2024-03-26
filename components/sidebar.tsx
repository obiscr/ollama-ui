import React, {SetStateAction, useEffect, useState} from "react";
import {
    Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger,
    Listbox,
    ListboxItem, Modal, ModalBody, ModalContent, ModalFooter,
    Slider,
    Textarea, useDisclosure
} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import {
    GenerateSettingInfo,
    initialGenerateSettingState,
    setFrequencyPenalty,
    setGenerateSettingInfo,
    setPresencePenalty,
    setSystemRole,
    setTemperature, setTopP
} from "@/store/generate-slice";
import {ChatMessageIcon, DeleteIcon, DotIcon, SettingIcon} from "@/components/icons";
import {ModalHeader} from "@nextui-org/modal";
import {initialChatMessageState, setCurrentConversation} from "@/store/chat-message-slice";
import {loadConversation, MessageRole, saveConversations} from "@/components/chat";
import { v4 as uuidv4 } from 'uuid';
import {ConversationBase, loadConversations} from "@/components/chat";
import {Key} from "@react-types/shared";

const Sidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    useEffect(() => {
        const settingsData = localStorage.getItem("ollama_generate_settings")
        if (settingsData) {
            const generateSetting: GenerateSettingInfo = JSON.parse(settingsData);
            dispatch(setGenerateSettingInfo(generateSetting))
        }
    },[dispatch])

    const generateSetting = useSelector((state: RootState) => state.generateSettingReducer);
    const currentConversation = useSelector((state: RootState) => state.chatMessageReducer);
    const [selectedKeys, setSelectedKeys] = useState<SetStateAction<any>>(new Set([]));

    const handleSystemRoleChange = (value: string) => {
        dispatch(setSystemRole(value))
    }

    const handleSaveAction = () => {
        const settingData = JSON.stringify(generateSetting)
        localStorage.setItem("ollama_ui_generate_settings", settingData)
    }

    const handleResetAction = () => {
        dispatch(setGenerateSettingInfo(initialGenerateSettingState))
        localStorage.removeItem("ollama_ui_generate_settings")
    }

    const [conversationItems, setConversationItems] = useState<ConversationBase[]>([])
    useEffect(() => {
        const data = loadConversations();
        setConversationItems(data)
    }, [currentConversation.Messages])

    const handleNewChat = () => {
        const messages = [
            {role: MessageRole.System, content: generateSetting.SystemRole ? generateSetting.SystemRole : "You are a helpful language assistant."}
        ]
        const conversation = {
            ID: uuidv4(),
            Title: "New Chat",
            Messages: messages
        }
        dispatch(setCurrentConversation(conversation))
        saveConversations(conversation)
    }

    const handleSelectConversation = (key: Key) => {
        const conversation = loadConversation(key.toString())
        if (conversation.Messages.length === 0) {
            return
        }
        dispatch(setCurrentConversation(conversation))
    }

    const handleClearMessage = () => {
        const conversations = loadConversations()
        conversations.map((item) => {
            localStorage.removeItem(`ollama_ui_message_${item.ID}`);
        })
        localStorage.removeItem("ollama_ui_conversations")
        setConversationItems([])
        dispatch(setCurrentConversation(initialChatMessageState))
    }

    const handleDeleteMessage = (id: string) => {
        const conversations = loadConversations()
        const filterConversations = conversations.filter(conversation => conversation.ID !== id);
        localStorage.setItem("ollama_ui_conversations", JSON.stringify(filterConversations))
        localStorage.removeItem(`ollama_ui_message_${id}`)
        if (currentConversation.ID === id) {
            dispatch(setCurrentConversation(initialChatMessageState))
        }
        setConversationItems(filterConversations)
    }

    return (
        <div
            className="pb-2.5 w-full md:w-1/4 lg:w-1/4 flex-none flex-col gap-5 flex ease-in-out duration-250 from-default-100 to-secondary-100">
            {/*-ml-72 -translate-x-72*/}
            <div
                className="flex w-full flex-nowrap flex-shrink-0 gap-2 border-b-small border-divider pb-2 justify-between items-center">
                <div className="flex flex-nowrap justify-between items-center gap-2">
                    <ChatMessageIcon/>
                    <p className="text-base font-medium">Messages</p>
                </div>
                <div>
                    <Button size="sm" color="primary" onClick={handleNewChat}>New Chat</Button>
                </div>
            </div>
            <div className="flex-grow overflow-auto">
                <Listbox
                    items={conversationItems}
                    aria-label="Dynamic Actions"
                    // onAction={handleSelectConversation}
                    disallowEmptySelection autoFocus
                    className="bg-default-100 rounded-xl" emptyContent="No messages"
                    selectionMode="single"
                    selectedKeys={selectedKeys}
                    onSelectionChange={(keys) => {
                        setSelectedKeys(keys);
                        if (keys !== "all") {
                            const key = keys.values().next().value;
                            handleSelectConversation(key)
                        }
                    }}
                >
                    {(conversationItem) => (
                        <ListboxItem key={conversationItem.ID} endContent={
                            <Dropdown>
                                <DropdownTrigger>
                                    <div>
                                        <DotIcon />
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="delete" onClick={() => {handleDeleteMessage(conversationItem.ID)}} className="text-danger" color="danger">
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        }>
                            {conversationItem.Title}
                        </ListboxItem>
                    )}
                </Listbox>
            </div>
            <div className="flex-shrink-0">
                <Dropdown size="sm">
                    <DropdownTrigger>
                        <Button fullWidth>Advance Settings</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" variant="faded">
                        <DropdownSection title="Model">
                            <DropdownItem key="settings" onPress={onOpen} startContent={<SettingIcon />}>Model Settings</DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Messages">
                            <DropdownItem key="settings" color="danger" onClick={handleClearMessage} startContent={<DeleteIcon />}>Clear Messages</DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Model Settings</ModalHeader>
                            <ModalBody className="flex flex-col gap-5">
                                <Textarea
                                    label="System Role"
                                    value={generateSetting.SystemRole}
                                    onValueChange={handleSystemRoleChange}
                                    placeholder="You are a helpful ai assistant."
                                />
                                <div className="mt-2 flex flex-col gap-4">
                                    <Slider
                                        label="Temperature"
                                        size="sm"
                                        step={0.01}
                                        maxValue={1}
                                        minValue={0}
                                        aria-label="Temperature"
                                        defaultValue={0.5}
                                        className="max-w-md"
                                        value={generateSetting.Temperature}
                                        onChange={(value: any) => {
                                            dispatch(setTemperature(value))
                                        }}
                                    />
                                    <Slider
                                        label="Top P"
                                        size="sm"
                                        step={0.01}
                                        maxValue={1}
                                        minValue={0}
                                        aria-label="Top P"
                                        defaultValue={0.5}
                                        className="max-w-md"
                                        value={generateSetting.TopP}
                                        onChange={(value: any) => {
                                            dispatch(setTopP(value))
                                        }}
                                    />
                                    <Slider
                                        label="Frequency Penalty"
                                        size="sm"
                                        step={0.01}
                                        maxValue={1}
                                        minValue={0}
                                        aria-label="Frequency Penalty"
                                        defaultValue={0}
                                        className="max-w-md"
                                        value={generateSetting.FrequencyPenalty}
                                        onChange={(value: any) => {
                                            dispatch(setFrequencyPenalty(value))
                                        }}
                                    />
                                    <Slider
                                        label="Presence Penalty"
                                        size="sm"
                                        step={0.01}
                                        maxValue={2}
                                        minValue={0}
                                        aria-label="Presence Penalty"
                                        defaultValue={0}
                                        className="max-w-md"
                                        value={generateSetting.PresencePenalty}
                                        onChange={(value: any) => {
                                            dispatch(setPresencePenalty(value))
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} onClick={handleResetAction}>
                                    Reset
                                </Button>
                                <Button color="primary" onPress={onClose} onClick={handleSaveAction}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Sidebar
