import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import io from 'socket.io-client'
import { getChats, afterPostMessage } from '../../../_actions/chat_actions';
import ChatCard from './Section/ChatCard';
import './Section/chat.css'
import { useSelector } from "react-redux";
function ChatPage(props) {
    const [name, setname] = useState("");
    const [chatmessage, setchatmessage] = useState("");
    const [chat, setchat] = useState([])
    const dispatch = useDispatch();
    const data = [props.location.state.params.buyer, props.location.state.params.seller]
    let socket;
    let server = "http://localhost:5000";
    var connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };

    socket = io(server, connectionOptions);

    const user = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(getChats(data)).then((response) => {
            setchat(...chat, response.payload.chats)
        })

    }, []);
    useEffect(() => {
        socket.on("Output Chat Message", data1 => {
            dispatch(afterPostMessage(data)).then((response) => {
                setchat(...chat, response.payload.chats)
            })
        })

    }, []);
    useEffect(() => {
        console.log("chats", chat)

    }, [chat]);

    const handleSearchChange = (e) => {
        setchatmessage(e.target.value)
        socket.emit("typing", {
            userName: user.userData.name
        });
        socket.on('typing', data => {
            setname(data.userName + " is typing...")
            setTimeout(() => { setname('') }, 5000)
        })
    };
    const submitChatMessage = (e) => {
        e.preventDefault();
        let chatMessage = chatmessage;
        let userId = user.userData._id;
        let userName = user.userData.name;
        let userImage = user.userData.image;
        let type = "Text";
        let ids = data

        socket.emit("Input Chat Message", {
            chatMessage, userId, userName, userImage, type, ids
        });
        setchatmessage("");

    }
    return (
        <div className="chatPage" >
            <div className="infinite-container" >
                <div className="infoBar">
                    <div className="leftInnerContainer">
                        {chat.length ? (
                            chat.map((chat) => (
                                chat.chatWith.name ?
                                <h3>{chat.chatWith.name}</h3>
                                :
                                <h3>{chat.chatStartedBy.name}</h3>
                            ))
                        ):
                        <h3>new chat</h3> }
                    </div>
                </div>
                {chat && (
                    chat.map((chat) => (
                        <ChatCard key={chat._id}  {...chat} user={user.userData._id} />
                    ))
                )}
            </div>

            <Row >
                <label>{name}</label>
                <Form layout="inline" onSubmit={submitChatMessage}>
                    <Col span={20}>
                        <Input
                            id="message"
                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Let's start talking"
                            type="text"
                            value={chatmessage}
                            onChange={handleSearchChange}
                        />
                    </Col>

                    <Col span={3} style={{ marginLeft: "10px" }}>
                        <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage} htmlType="submit">
                            <Icon type="enter" />
                        </Button>
                    </Col>
                </Form>
            </Row>
        </div>
    )
}

export default ChatPage
