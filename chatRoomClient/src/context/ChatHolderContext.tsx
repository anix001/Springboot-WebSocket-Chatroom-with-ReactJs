import { createContext, useContext, useState } from "react";

interface IChatHolderProps{
    privateChats: Map<any, any>
    setPrivateChats: React.Dispatch<React.SetStateAction<Map<any, any>>>
    chatRooms: Map<any, any>
    setChatRooms: React.Dispatch<React.SetStateAction<Map<any, any>>>
    messageType: string
    setMessageType: React.Dispatch<React.SetStateAction<string>>
}

const ChatHolderContext = createContext({} as IChatHolderProps);

export const ChatHolderInfo = ()=>{
    return useContext(ChatHolderContext);
}

export const ChatHolderProvider = ({children}:any)=>{
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [chatRooms, setChatRooms] = useState(new Map());
    const [messageType, setMessageType] = useState('public');

    return(
        <ChatHolderContext.Provider value={{privateChats, setPrivateChats, messageType, setMessageType, chatRooms, setChatRooms}}>
            {children}
        </ChatHolderContext.Provider>
    )
}