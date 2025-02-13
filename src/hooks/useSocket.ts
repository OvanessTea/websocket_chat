'use client';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
	id: string;
	text: string;
	timestamp: Date;
	isSent: boolean;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const socketInstance = io('http://localhost:3000');
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

    const sendMessage = (message: Message) => {
        if (socket) {
            socket.emit('chat message', message);
        }
    }

    return { isConnected, messages, sendMessage };
} 
