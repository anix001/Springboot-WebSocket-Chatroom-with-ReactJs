import { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import { ChatHolderInfo } from '../context/ChatHolderContext';

var stompClient:any =null;
const ChatRoom = () => {
    const {privateChats, setPrivateChats, messageType, chatRooms, setChatRooms}= ChatHolderInfo();
    
    const [tab, setTab] = useState("general");
    console.log("🚀 ~ file: ChatRoom.tsx:13 ~ ChatRoom ~ tab:", tab)
    

    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    
      const [userLogin, setUserLogin] = useState(false);


    const connect =()=>{
        let Sock = new SockJS('http://localhost:8081/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }
    
    const onConnected = () => {
        setUserLogin(true);
        setUserData({...userData,"connected": true});
        [...chatRooms?.keys()]?.map((name)=>stompClient?.subscribe(`/chatroom/${name}`, onMessageReceived))
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send(`/app/${tab}/message`, {}, JSON.stringify(chatMessage));
          stompClient.send(`/app/${tab}/message.addUser`, {}, JSON.stringify(chatMessage))
    }

    const onMessageReceived = (payload:any)=>{
        var payloadData:any = JSON.parse(payload.body);
        console.log("🚀 ~ file: ChatRoom.tsx:45 ~ onMessageReceived ~ payload:", payload)
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats?.get(payloadData.senderName)){
                    privateChats?.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                    let message = payloadData.senderName + ' joined the chatroom !! 😀';
                    chatRooms.get(tab).push(message);
                }
                break;
            case "MESSAGE":
                // chatRooms.set(tab,[...chatRooms.get(tab), payloadData]);
                chatRooms.get(tab).push(payloadData);
                setChatRooms(new Map(chatRooms));
                break;
            case "LEAVE":
                    let message = payloadData.senderName + ' left the chatroom !! 😔';
                    privateChats.delete(payloadData.senderName);
                    setPrivateChats(new Map(privateChats));
                    chatRooms.get(tab).push(message);
                    // setChatRooms(new Map(chatRooms));
                break;
        }
    }
    
    const onPrivateMessage = (payload:any)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err:any) => {
        console.log(err);    
    }

    const sendMessageToChatroom=(event: any)=>{
        event.preventDefault();
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send(`/app/${tab}/message`, {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendMessgeToUser=(event: any)=>{
        event.preventDefault();
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }


    const handleInputValue =(event:any)=>{
        event.preventDefault();
        setUserData(
            {
                ...userData,
                [event?.target?.name]: event?.target?.value
            }
        )
    }

    const registerUser=(event:any)=>{
        event.preventDefault();
        connect();
    }
    const [roomAdded, setRoomAdded] = useState(false);
    
    const checkNewChatRoomAdded = ()=>{
        setRoomAdded(!roomAdded);
    }

    useEffect(()=>{
        setTab('general')
        chatRooms?.set('general',[]);
        setChatRooms(new Map(chatRooms));
    },[])

    useEffect(()=>{
        if(userLogin) userJoin();
    },[userLogin])
    

    useEffect(()=>{
        if(chatRooms?.size>1) {
            stompClient?.subscribe(`/chatroom/${tab}`, onMessageReceived);
            userJoin();
        }
    },[roomAdded])
 
    return (
    <div className="container">
        {
        userData.connected
        ? 
        <ChatPage 
        tab={tab} 
        setTab={setTab} 
        sendMessgeToUser={sendMessgeToUser} 
        sendMessageToChatroom={sendMessageToChatroom} 
        handleInputValue={handleInputValue} 
        userData={userData}
        checkNewChatRoomAdded={checkNewChatRoomAdded}
        />
        :
        <LoginPage 
        handleInputValue={handleInputValue} 
        registerUser={registerUser} />
        }
    </div>
    )
}

export default ChatRoom