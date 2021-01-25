import React, { useRef, useEffect, useState } from "react";
import { Comment, Badge, Avatar } from 'antd';
import { getChats } from '../../../_actions/chat_actions';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Link } from "react-router-dom";
function AllChats(props) {
    const messagesEndRef = useRef(null)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const data = { ids: [], userId: "" }
    const [chat, setchat] = useState([])
    const [ids, setids] = useState([])
    user.userData ? data.userId = user.userData._id : data.userId = ""
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }
    useEffect(() => {
        axios.post(`/api/chats/getIds`, data)
            .then(response => {

                response.data.chats.map((chat) => {
                    data.ids.push(chat.ids)
                })
                axios.post(`/api/chats/allChats`, data)
                    .then(response => {
                        setchat(...chat, response.data.allChats)
                    });
            });
    }, [user])
    useEffect(scrollToBottom, []);
    return (
        <div style={{ width: '100%', display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "30px", alignItems: "center" }}>
            {chat && (
                chat.map((chat) => (
                    chat.chatWith.name ?
                        <Link to={{
                            pathname: '/chat',
                            state: { params: { buyer: user.userData && user.userData._id, seller: chat.chatWith._id } }
                        }}> <Comment
                                author={<h3 style={{ color: "black" }}>{chat.chatWith.name}</h3>}
                                avatar={
                                    <Avatar
                                        src={chat.chatWith.image} alt={chat.chatWith.name}
                                    />
                                }
                                content={
                                    <p>
                                        {chat.messages[chat.messages.length - 1].seen ? chat.messages[chat.messages.length - 1].message : <b>new message &nbsp;<Badge count={1}></Badge></b>}
                                    </p>}
                            /></Link> :
                        <Link to={{
                            pathname: '/chat',
                            state: { params: { buyer: user.userData && user.userData._id, seller: chat.chatStartedBy._id } }
                        }}> <Comment
                                author={<h3 style={{ color: "black" }}>{chat.chatStartedBy.name}</h3>}
                                avatar={
                                    <Avatar
                                        src={chat.chatStartedBy.image} alt={chat.chatStartedBy.name}
                                    />
                                }
                                content={
                                    <p>
                                        {chat.messages[chat.messages.length - 1].seen ? chat.messages[chat.messages.length - 1].message : <b>new message &nbsp;<Badge count={1}></Badge></b>}
                                    </p>}
                            /></Link>

                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default AllChats;