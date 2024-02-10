"use client";
import React, { useState } from 'react';

const handleNewChat = async () => {
    // Add logic for creating a new chat here
    console.log('Creating a new chat...');
    const sendMsgElements = document.getElementsByClassName('send-msg');
    
    // Remove all send messages
    while (sendMsgElements.length > 0) {
        sendMsgElements[0].remove();
    }
}

const ChatBar = ({ handleNewChat, sendMsg }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSend = () => {
        sendMsg(message);
        setMessage('');
    }

    return (
        <div className="fixed bottom-0 left-0 m-12 w-full">
            <button className="left-0 bg-[#7dd3fc] rounded-lg px-4 py-1 mx-2" onClick={handleNewChat}>
                New Chat
            </button>
            <input id="chat" type="text" placeholder="Ask me anything..." className='bg-[#e5e5e5] rounded-lg px-4 py-1 w-3/5' value={message} onChange={handleChange} />
            <button className="mx-2 right-5 bg-[#7dd3fc] rounded-lg px-4 py-1" onClick={handleSend}>Send</button>
        </div>
    );
}


const WlcMsg = () => {
    return (
        // <div id="allmsg" className=''>
            <div className="">
                <h1 className='bg-[#dcc1ff] rounded-lg px-2 py-1 col-start-1 col-end-2'>Hi, how may I help you today?</h1>
            </div>
            /* <div className="">
            </div>
        </div> */
    );
}

const sendMsg = (msg) => {
    console.log('Sending message:', msg);
    // Add logic for sending the message here
    document.getElementById('allmsg').innerHTML +=
        `<div class="">
        </div>
        <div class="send-msg bg-[#e7e5e4] rounded-lg px-2 py-1 col-end-3 col-span-1 text-wrap">
            <h1>${msg}</h1>
        </div>`;
}

// Create a upload document button component
const UploadDocument = () => {
    return (
        <div className="fixed bottom-0 left-0 m-12 w-full">
            <input id="upload" type="file" />
            <button className="mx-2 right-5 bg-[#7dd3fc] rounded-lg px-4 py-1" onClick={handleSend}>Send</button>
        </div>
    );
}

const NewChat = () => {
    const chatTitle = "Untitled Chat2";
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatTitles, setChatTitles] = useState([currentChatTitle]);
    const [chatHistories, setChatHistories] = useState({});

    const handleNewChat = () => {
        console.log('Creating a new chat...');
        console.log(chatHistory);
        setChatTitles([...chatTitles, currentChatTitle]); // Add the current chat title to the list of chat titles
        setChatHistories({ ...chatHistories, [chatTitles.length-1]: chatHistory }); // Add the current chat history to the list of chat histories
        setChatHistory([]); // Clear chat history when starting a new chat
        setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder
    };

    const handleSend = (msg) => {
        // if (chatHistory.length === 0) {
            const updatedChatHistory = [...chatHistory, { type: 'user', message: msg }];
            setChatHistory(updatedChatHistory);
            
        // }
    };

    const handleChangeTopic = (i) => {
        // console.log(i.target.id);
        // console.log(((Number(i.target.id)+1)*-1));
        // console.log(chatHistories);
        console.log(document.getElementById(currentIndex));
        document.getElementById(currentIndex).disabled = false;
        console.log(document.getElementById(currentIndex));
        document.getElementById(currentIndex).className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 m-2 border border-blue-700 rounded';
        console.log(chatHistories[chatTitles.length + ((Number(i.target.id)+1)*-1)]);
        setCurrentIndex(i.target.id);
        setCurrentChatTitle(chatTitles[chatTitles.length + ((Number(i.target.id)+1)*-1)]);
        setChatHistory(chatHistories[chatTitles.length + ((Number(i.target.id)+1)*-1)]);
        document.getElementById(currentIndex).disabled = true;
        document.getElementById(currentIndex).className = 'text-white bg-[#4B5563] dark:bg-[#4B5563] cursor-not-allowed font-bold px-2 m-2 text-center border border-[#111827] rounded';
    }

    return (
        <div className="flex">
            {/* Include the Sidebar component and pass the chatTitle prop */}
            <Sidebar chatTitles={chatTitles} changeTopic={(i) => {handleChangeTopic(i)}} />
            <div className='grid grid-flow-row auto-rows-max grid-cols-2 gap-y-4 mx-2'>
                <WlcMsg />
                {/* Display chat history */}
                {chatHistory.map((chat, index) => (
                    <div key={index} className={chat.type === 'user' ? 'user-message' : 'bot-message'}>
                        <div className="send-msg bg-[#e7e5e4] rounded-lg px-2 py-1 col-end-3 col-span-1 text-wrap">
                            <h1>{chat.message}</h1>
                        </div>
                    </div>
                ))}
                {/* Assuming handleNewChat and sendMsg are defined */}
                <ChatBar handleNewChat={handleNewChat} sendMsg={(msg) => { handleSend(msg); }} />
            </div>
        </div>
    );
}

const Sidebar = ({chatTitles, changeTopic}) => {
    const handleNewTopic = (i) => {
        changeTopic(i);
    }
    return (
        <div id="histlog" className="bg-blue-200 w-1/5 h-screen">
            <h1 className='text-center'>Chat History</h1>
            {/* Display chat history in reverse order */}
            {chatTitles.slice(0).reverse().map((title, index) => (
                <div className='flex flex-col items-center justify-center'>
                    <button id={index} className={index !== 0 ? `bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 m-2 border border-blue-700 rounded` : 'text-white bg-[#4B5563] dark:bg-[#4B5563] cursor-not-allowed font-bold px-2 m-2 text-center border border-[#111827] rounded'} disabled={index === 0} onClick={handleNewTopic}>{title}</button>
                </div>
            ))}
        </div>
        
    );
}
export default NewChat;

