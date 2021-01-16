import axios from 'axios';
import {
    GET_CHATS,
    AFTER_POST_MESSAGE
} from './types';
import { CHAT_SERVER } from '../components/Config.js';

export function getChats(data){
    const request = axios.post(`${CHAT_SERVER}/getChats`,data)
        .then(response => response.data);

    return {
        type: GET_CHATS,
        payload: request
    }
}
export function afterPostMessage(data){
    const request = axios.post(`${CHAT_SERVER}/getChats`,data)
        .then(response => response.data);
    return {
        type: AFTER_POST_MESSAGE,
        payload: request
    }
}
