import React from 'react';

const ChatButton = () => {
    return (
        <div className="fixed bottom-0 right-0 m-12">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            New Chat
        </button>
        </div>
    );
    }

export default ChatButton;
