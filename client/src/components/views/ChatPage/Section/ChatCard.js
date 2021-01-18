import React, { useRef, useEffect } from "react";
import { Comment, Tooltip, Avatar } from 'antd';

function ChatCard(props) {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    useEffect(scrollToBottom, []);
    return (
        <div style={{ width: '100%', }}>
            {props.messages && (
                props.messages.map((message) => (
                    <Comment
                        style={{ color: "white" }}
                        author={message.sender.name}
                        avatar={
                            <Avatar
                                src={message.sender.image} alt={message.sender.name}
                            />
                        }
                        content={
                            <p>
                                {message.message}
                            </p>}

                        datetime={
                            <Tooltip >
                                <span>{message.nowTime}</span>
                            </Tooltip>
                        }
                    />
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatCard;