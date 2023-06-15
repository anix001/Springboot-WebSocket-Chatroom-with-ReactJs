package com.chatRoom.listener;

import com.chatRoom.domain.Message;
import com.chatRoom.domain.enumeration.UserStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import static java.lang.String.format;

@Component
public class WebSocketEventListener {

    private final static Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final SimpMessageSendingOperations messageTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    ){
        //TODO -> to be implemented
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String chatroom = (String) headerAccessor.getSessionAttributes().get("chatroom");
        if(username != null){
            logger.info("user disconnected: {}", username);
            Message message = new Message(username, LocalDateTime.now(),UserStatus.LEAVE);
            messageTemplate.convertAndSend(format("/chatroom/%s", chatroom),message);
        }
    }
}
