import { Avatar, Group, Modal, TextInput, Tooltip } from "@mantine/core"
import MainIcon from '../assets/icon.png';
import { ChatHolderInfo } from "../context/ChatHolderContext";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Logout from '../assets/logout.png'

interface chatPageProps{
  setTab: React.Dispatch<React.SetStateAction<string>>
  tab:string
  sendMessgeToUser: (event: any) => void
  sendMessageToChatroom: (event: any) => void
  handleInputValue: (event: any) => void
  userData: {
    username: string;
    receivername: string;
    connected: boolean;
    message: string;
  }
  checkNewChatRoomAdded: () => void
}

const ChatPage = ({setTab, tab, sendMessgeToUser, sendMessageToChatroom, handleInputValue, userData, checkNewChatRoomAdded}:chatPageProps) => {
  const {privateChats, chatRooms, setChatRooms, messageType, setMessageType} = ChatHolderInfo();
  console.log("🚀 ~ file: ChatPage.tsx:21 ~ ChatPage ~ chatRooms:", chatRooms)

  const privateChatUserName = privateChats;
  privateChatUserName.delete(userData?.username);
  const chatRoomList = [...chatRooms.keys()];
  const [opened, { open, close }] = useDisclosure(false);
  const [newChatRoom, setNewChatRoom] = useState('');
  console.log("🚀 ~ file: ChatPage.tsx:31 ~ ChatPage ~ newChatRoom:", newChatRoom)

  const addNewChatRoom = (event:any)=>{
    event?.preventDefault();
    close();
    chatRooms?.set(newChatRoom,[]);
    setChatRooms(new Map(chatRooms));
    setTab(newChatRoom);
    checkNewChatRoomAdded();
  }

  const leaveChatRoom = (tab:string)=>{
    chatRooms.delete(tab);
    setTab('general');
  }

  return (
    <div>
    <Modal opened={opened} onClose={close} title="Join New Group">
      <form action="" onSubmit={addNewChatRoom}>
        <TextInput name="newChatRoom" onChange={(event:any)=>setNewChatRoom(event?.target?.value)} required placeholder="Create or join new chatroom"/>
      </form>
      </Modal>
    <div className="chatroom-layout flex bg-gray-100 rounded-3xl p-sm" style={{height:'90vh'}}>
      <div className="icons-section bg-slate-300 rounded-md p-sm" style={{width:'60px'}}>
        <ul>
            <li className="text-white icon"> 
                <img src={MainIcon} alt="icon"/>
            </li>
        </ul>
      </div>
      <div className="channel-section bg-gray-50 rounded-md p-sm" style={{width:'25%'}}>
         <ul>
            <li>
               <div className="flex justify-between items-center">
                 <p className="chatroom-title  text-xl">🖥️ ChatRooms</p>
                 <span className="cursor-pointer" onClick={open}>add</span>
               </div>
                <ul className="pl-xs py-xs">
                {
                  chatRoomList?.map((name:string, key:number)=>
                  <li key={key} className={`mt-xs cursor-pointer ${tab === name ? "active-tab" : 'bg-slate-300'} p-xs flex items-center`} onClick={()=>{setTab(name); setMessageType('public');}}>
                    <Avatar color="cyan" className="mr-xs" size={"sm"} radius="xl">{name?.slice(0,2)}</Avatar> {name}
                  </li>
                  )
                }
                </ul>
            </li>
            <li>
               <p className="chatroom-title text-xl">💬 Private Chats</p>
               <ul className="pl-xs py-xs">
                {
                  [...privateChatUserName.keys()]?.map((name:string, key:number)=>
                  <li key={key} className={`mt-xs cursor-pointer ${tab === name ? "active-tab" : 'bg-slate-300'} p-xs flex items-center`} onClick={()=>{setTab(name); setMessageType('private');}}>
                    <Avatar color="cyan" className="mr-xs" size={"sm"} radius="xl">{name?.slice(0,2)}</Avatar> {name}
                    </li>
                  )
                }
                </ul>
            </li>
         </ul>
      </div>
      <div className="message-section bg-slate-300 rounded-md p-md" style={{flex:1}}>
         <p className="chatRoom-name text-center text-xl flex justify-center items-center" style={{width:'100%'}}>
          <Avatar color="cyan" className="mr-sm" size={"md"} radius="xl">{tab?.slice(0,2)}</Avatar> {[ tab ]}
          {(tab !== 'general' && messageType === 'public') && 
          <div style={{height:'20px', width:'20px', cursor:'pointer'}} onClick={()=> leaveChatRoom(tab)}>
            <Tooltip label="leave ChatRoom">
             <img src={Logout} alt="leave room" className="ml-sm" style={{height:'100%', width:'100%', objectFit:'cover'}} />
            </Tooltip>
          </div>}
          </p>
          
          <div className="chat-box-area overflow-y-auto my-md" style={{height:'65vh'}}>
            {
              messageType === "public" ? [...chatRooms?.get(tab)].map((chat:any, key:number)=>{
                if(typeof chat === 'string' || chat instanceof String){
                  return <p className="text-center my-xs" key={key}>{chat}</p>
                }else{
                   if(chat?.senderName === userData?.username){
                   return <div className="mt-xs flex justify-end items-center" key={key}>
                      <span className=" bg-slate-400 py-xs px-sm rounded-3xl mr-xs">{chat?.message}</span>
                      <Avatar color="cyan" radius="xl">{chat?.senderName?.slice(0,2)}</Avatar>
                   </div>
                   }else{
                   return <div className="mt-xs flex justify-start items-center" key={key}>
                        <Avatar color="cyan" radius="xl">{chat?.senderName?.slice(0,2)}</Avatar>
                        <span className=" bg-slate-400 py-xs px-sm rounded-3xl ml-xs">{chat?.message}</span>
                   </div>
                   }
                }
              }) : [...privateChats?.get(tab)].map((chat,key)=>{
                if(chat?.senderName === userData?.username){
                  return <div className="mt-xs flex justify-end items-center" key={key}>
                     <span className=" bg-slate-400 py-xs px-sm rounded-3xl mr-xs">{chat?.message}</span>
                     <Avatar color="cyan" radius="xl">{chat?.senderName?.slice(0,2)}</Avatar>
                  </div>
                  }else{
                  return <div className="mt-xs flex justify-start items-center" key={key}>
                       <Avatar color="cyan" radius="xl">{chat?.senderName?.slice(0,2)}</Avatar>
                       <span className=" bg-slate-400 py-xs px-sm rounded-3xl ml-xs">{chat?.message}</span>
                  </div>
                  }
              })
            }
          </div>
            <form onSubmit={ messageType === "public" ? sendMessageToChatroom: sendMessgeToUser}>
                <TextInput
                    placeholder="Your message"
                    value={userData?.message}
                    name="message"
                    style={{fontWeight:'400'}}
                    onChange={handleInputValue}
                    size="xl"
                    sx={{fontSize:'16px'}}
                />
                <Group position="right" className="mt-sm">
                </Group>
            </form>
      </div>
    </div>
    </div>
  )
}

export default ChatPage
