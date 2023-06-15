package com.chatRoom.resource;

import com.chatRoom.domain.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import static java.lang.String.format;

@Controller
public class ChatResource {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public ChatResource(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }


    @MessageMapping("/{chatRoom}/message")
//    @SendTo("/chatroom/public")
    public void receivePublicMessage(@DestinationVariable String chatRoom,  @Payload Message message){
        simpMessagingTemplate.convertAndSend(format("/chatroom/%s", chatRoom), message); //listens to /app/{chatroom}/message
//        return message;
    }

    @MessageMapping("/private-message")
    public Message receivePrivateMessage(@Payload Message message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        return message;
    }

    @MessageMapping("/{chatRoom}/message.addUser")
//    @SendTo("/chatroom/public")
    public Message addUser(
            @DestinationVariable String chatRoom,
            @Payload Message message,
            SimpMessageHeaderAccessor headerAccessor
    ){
        /* add username in websocket session */
      headerAccessor.getSessionAttributes().put("username", message.getSenderName());
      String chatroom = (String) headerAccessor.getSessionAttributes().put("chatroom", chatRoom);
      simpMessagingTemplate.convertAndSend(format("/chatroom/%s", chatroom), message);
      return message;
    }
}
