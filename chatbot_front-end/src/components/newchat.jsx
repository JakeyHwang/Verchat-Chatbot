"use client";
import React from 'react';

const ChatButton = () => {

    const handleNewChat = async () => {
        // Add logic for creating a new chat here
        console.log('Creating a new chat...');
    };

    return (
        <div className="fixed bottom-0 right-0 m-12">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleNewChat}>
                New Chat
            </button>
        </div>
    );
}

export default ChatButton;
