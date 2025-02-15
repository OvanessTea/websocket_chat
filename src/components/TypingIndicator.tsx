import React from 'react';

interface TypingIndicatorProps {
    typingUsers: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
    if (!typingUsers.length) return null

    const typingText = typingUsers.length === 1 
    ? `${typingUsers[0]} is typing...` 
    : `${typingUsers.join(', ')} are typing...`;

    return (
        <div className="text-sm text-gray-500 italic">
            {typingText}
        </div>
    )
}

export default TypingIndicator;