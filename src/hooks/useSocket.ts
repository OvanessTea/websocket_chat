'use client';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types/message';
import { v4 as uuidv4 } from 'uuid';

export const useSocket = (username: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const socketInstance = io();
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });
        
        socketInstance.on('chat message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketInstance.disconnect();
        }
    }, [])

    const sendMessage = (text: string, roomId?: string) => {
        if (socket) {
            const message: Message = {
                id: uuidv4(),
                user: username,
                text,
                timestamp: new Date(),
                roomId,
            };
            socket.emit('chat message', message);
        }
    }

    return { isConnected, messages, sendMessage };
} 
