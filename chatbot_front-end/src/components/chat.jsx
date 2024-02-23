"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import vertexLogo from '../public/verchat_logo.png'
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy';
import { output } from '../../next.config';

// populates chatTitles and first chat title history using data from API call
const getStartUpData = (f_path, t_data, setCurrentIndex, setChatTitles, setChatLoading, h_data)=>{
    let output = ''
    let res = fetch(`${f_path}`)
                .then((res)=>res.json())
                .then((data)=>{
                    data['title'].forEach((title,index) => {
                        t_data[`${title}`] = data['id'][index]
                        if (index == 0) {
                            output = data['id'][index]
                            // console.log(output)
                        }
                    });

                    setChatTitles(t_data)
                    // setCurrentIndex(output)
                    setChatLoading(false)
                })
                // .then(()=>{
                //     getHistoryData(f_path, output,h_data)
                // })
}
// populates chat History of current chat title
// function getHistoryData (f_path, output,h_data, setChatHistory,chatHistory) {
//     // console.log(`${f_path+b_path+output}`)
//     // let res = fetch(`${f_path+b_path}`)
//     let res = fetch(`${f_path+output}`)
//                 .then((res)=>{res.json()})
//                 .then((data)=>{
//                     // console.log(data)
//                     data['data'].forEach((data)=>{
//                         let user = {'type':'user','message':`${data[0]}`}
//                         let bot = {'type':'bot', 'message':`${data[1]}`}
//                         h_data.push(user)
//                         h_data.push(bot)
//                         console.log(h_data)
//                     })
//                 })
//                 .then(()=>{
//                     if (chatHistory){
//                         setChatHistory(...chatHistory,h_data)
//                     }
//                     setChatHistory(...h_data)
//                 })
// }

const ChatBar = ({ sendMsg }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        console.log(e);
        setMessage(e.target.value);
    }

    const handleSend = () => {
        if (message.trim()) {
            sendMsg(message);
            setMessage('');  
        }
    }

    return (
        <div className="fixed bottom-0 m-12 w-full flex">
            {/* <input id="chat" type="text" placeholder="Ask me anything..." className='bg-[#e5e5e5] rounded-lg px-4 py-1 w-3/5' value={message} onChange={handleChange} />
            <button className="mx-2 right-5 bg-[#7dd3fc] rounded-lg px-4 py-1" onClick={handleSend}>Send</button> */}
            <input id="chat" type="text" placeholder="Ask me anything..." className='border border-black bg-[#fffff] rounded-full px-4 py-1 w-3/5' value={message} onChange={handleChange} onKeyDown={(e)=>{if(e.key==='Enter'){handleSend()}}} />
            <button className={`mx-2 right-5 text-white rounded-full px-4 py-4 ${!message.trim() ? 'bg-[#4f65e5] focus:outline-none' : 'bg-[#7dd3fc]'}`} onClick={handleSend} disabled={!message.trim()}>
            </button>
        </div>
    );
}

const Sidebar = ({ chatTitles, changeTopic, currentIndex, handleNewChat }) => {
    const handleNewTopic = (i) => {
        changeTopic(i);
    }

    const arr = []
    Object.entries(chatTitles).forEach((key) => {
        arr.push(key[0])
    })

    return (
        <div id="histlog" className="bg-[#d7e3fb] w-1/5 h-screen flex flex-col">
            {/*Verchat Logo*/}
            <div className="flex justify-center">
            <Image width={200} height={115} src={vertexLogo} alt="ChatSideBar Image" />
            </div>
            {/* New Chat button */}
            <div className="flex justify-center">
                <button className="bg-[#7dd3fc] rounded-lg px-4 py-1 mx-2" onClick={handleNewChat}>
                    New Chat
                </button>
            </div>
            <h1 className='text-center'>Chat History</h1>
            {/* Search Bar */}
            <div className="flex justify-center">
                <input type="text" placeholder="Search..." className="border border-gray-400 rounded-full px-2 py-1 mt-2" />
            </div>
            {/* Display chat history in reverse order .slice(0).reverse() */}
            {arr.map((title, index) => (
                <div key={index} className='flex flex-col items-center justify-center'>
                    <button id={index} className={index != currentIndex ? `bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 m-2 border border-blue-700 rounded` : 'text-white bg-[#4B5563] dark:bg-[#4B5563] cursor-not-allowed font-bold px-2 m-2 text-center border border-[#111827] rounded'} disabled={index == currentIndex} onClick={handleNewTopic}>{title}</button>
                </div>
            ))}
        </div>
    );
}

const WlcMsg = () => {
    return (
            <div style={{ paddingTop: '20px' }}>
                <h1 className='bg-[#d7e3fb] rounded-lg px-2 py-1 col-start-1 col-end-2'>Hi, how may I help you today?</h1>
            </div>     
    );
}

const NewChat = ({chatData}) => {
    const chatTitle = "New chat";
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatTitles, setChatTitles] = useState([currentChatTitle]);
    const [chatHistories, setChatHistories] = useState({});
    const [isChatLoading, setChatLoading] = useState(true)
    const [isHistoryLoading, setHistoryLoading] = useState(true)

    

    // running API call only once upon page load
    // useEffect(() => {
    //     let f_path = process.env.NEXT_PUBLIC_API_URL
    //     let t_data = {}
    //     let h_data = []
    //     getStartUpData(f_path,t_data, setCurrentIndex, setChatTitles, setChatLoading, h_data)
    //     // getHistoryData(f_path,'51mMlSZMDsbNuZUXg10T',h_data, setChatHistory,chatHistory)
    // }, [])

    // if (isChatLoading) return <p>Loading...</p>


    const handleNewChat = () => {
        setChatTitles([...chatTitles, currentChatTitle]); // Add the current chat title to the list of chat titles
        setChatHistories({ ...chatHistories, [chatTitles.length - currentIndex - 1]: chatHistory }); // Add the current chat history to the list of chat histories
        setChatHistory([]); // Clear chat history when starting a new chat
        setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder

        // api call to create new chat
        // function needs to detect that the chat is empty and new before API is called
    };

    const handleSend = (msg) => {
        const updatedChatHistory = [...chatHistory, { type: 'user', message: msg }];
        setChatHistory(updatedChatHistory);
        // API call here to send message
        // will require chat id and message
        console.log(chatHistories)
        console.log(chatTitles)
        console.log(chatHistory)

    };

    const handleChangeTopic = (i) => {
        setChatHistories({ ...chatHistories, [chatTitles.length - currentIndex - 1]: chatHistory })
        setCurrentIndex(i.target.id);
        setCurrentChatTitle(chatTitles[chatTitles.length + ((Number(i.target.id) + 1) * -1)]);
        setChatHistory(chatHistories[chatTitles.length + ((Number(i.target.id) + 1) * -1)]);

        // API call to collect chat history of selected chat
            // let f_path = process.env.NEXT_PUBLIC_API_URL
            // let t_data = {}
            // let h_data = []
            // getHistoryData(f_path,i,h_data)
            // if (isHistoryLoading) return <p>Loading chat history...</p>
    }

    return (
        <div className="flex">
            <Sidebar chatTitles={chatTitles} changeTopic={(i) => { handleChangeTopic(i) }} currentIndex={currentIndex} handleNewChat={handleNewChat} />
            <div className="flex-auto">
                <div className='grid grid-flow-row auto-rows-max grid-cols-2 gap-y-4 mx-2'>
                    <WlcMsg/>
                    <div></div>
                    <div></div>
                   {/* Display chat history */}
                <div className="flex flex-col-reverse">
                    {/* .slice(0).reverse() */}
                {chatHistory.map((chat, index) => (
                <div key={index} className={chat.type === 'user' ? 'user-message' : 'bot-message'}>
                    <div className={`bg-[#e4e4e4] rounded-lg px-2 py-1 text-wrap mb-2 ${chat.type === 'user' ? 'ml-auto' : 'mr-auto'}`} >
                        <h1>{chat.message}</h1>
                    </div>
                </div>
                ))}
            </div>
                {/* Assuming sendMsg is defined */}
                <ChatBar sendMsg={(msg) => { handleSend(msg); }} />
            </div>
        </div>
    </div>
    );
}

export default NewChat;

// const handleSend = () => {
//         if (message.trim()) {
//             sendMsg(message);
//             setMessage('');  
//         }
//     }

//     return (
//         <div className="fixed bottom-0 left-0 m-12 w-full">
//             <button className="left-0 bg-[#7dd3fc] rounded-lg px-4 py-1 mx-2" onClick={handleNewChat}>
//                 New Chat
//             </button>
//             <input id="chat" type="text" placeholder="Ask me anything..." className='bg-[#e5e5e5] rounded-lg px-4 py-1 w-3/5' value={message} onChange={handleChange} onKeyDown={(e)=>{if(e.key==='Enter'){handleSend()}}} />
//             <button className={`mx-2 right-5 text-white rounded-lg px-4 py-1 ${!message.trim() ? 'bg-red-300 focus:outline-none' : 'bg-[#7dd3fc]'}`} onClick={handleSend} disabled={!message.trim()}>
//                 Send
//             </button>
//         </div>
//     );