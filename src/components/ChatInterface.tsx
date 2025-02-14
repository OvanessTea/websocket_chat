'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import ChatMessage from './ChatMessage';
import { Message } from '../types/message';

interface ChatInterfaceProps {
    username: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ username }) => {
    const { isConnected, messages, sendMessage } = useSocket(username);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    }
    
    return (
        <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
            <h1 className="text-2xl font-bold mb-4 text-center">WebSocket Chat Demo</h1>
            <div className={`mb-4 text-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? "Connected" : "Disconnected"}
            </div>
            <div className="mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-2">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} isOwnMessage={msg.user === username} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow mr-2 p-2 border border-gray-300 rounded"
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={!inputMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatInterface;
