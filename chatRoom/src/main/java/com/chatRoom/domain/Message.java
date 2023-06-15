package com.chatRoom.domain;

import com.chatRoom.domain.enumeration.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private LocalDateTime date = LocalDateTime.now();
    private UserStatus status;

    public Message(String senderName, LocalDateTime date, UserStatus status) {
        this.senderName = senderName;
        this.date = date;
        this.status = status;
    }
}
