'use client';
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types/message';
import { v4 as uuidv4 } from 'uuid';

export const useSocket = (username: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    const addSystemMessage = useCallback((text: string, roomId?: string) => {
        setMessages((prevMsgs) => [
            ...prevMsgs,
            {
                id: uuidv4(),
                user: 'System',
                text,
                timestamp: new Date(),
                roomId,
                system: true,
            }
        ])
    }, []);

    useEffect(() => {
        const socketInstance = io();
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
            socketInstance.emit('user joined', username);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });
        
        socketInstance.on('chat message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        socketInstance.on('update users', (updatedUsers: string[]) => {
            setUsers(updatedUsers);
        })

        socketInstance.on("user joined", (joinedUsername: string) => {
            addSystemMessage(`${joinedUsername} joined the chat`);
        })

        socketInstance.on("user left", (leftUsername: string) => {
            addSystemMessage(`${leftUsername} has left the chat`);
        })

        return () => {
            socketInstance.disconnect();
        }
    }, [username, addSystemMessage]);

    const sendMessage = (text: string) => {
        if (socket) {
            const message: Message = {
                id: uuidv4(),
                user: username,
                text,
                timestamp: new Date(),
            };
            socket.emit('chat message', message);
        }
    }

    return { isConnected, messages, sendMessage, users };
} 
