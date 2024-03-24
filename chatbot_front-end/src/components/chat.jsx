"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import vertexLogo from '../public/transparent_verchat_logo.png'
import sendIcon from '../public/paper-plane.png'
import new_chat_icon from '../public/new_chat_icon.png'
import upload_icon from '../public/submit.png'
import '../public/styles.css';
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy';
import { output } from '../../next.config';



// populates chatTitles and first chat title history using data from API call
const getChatTitles = (setChatTitles, setTitleArray, chatTitle = "") => {
    let t_data = {};

    fetch("http://127.1.1.1:4000/", { method: 'GET' })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.title && Array.isArray(data.title) && data.id && Array.isArray(data.id)) {
                data.title.forEach((title, index) => {
                    t_data[title] = data.id[index];
                });

                setChatTitles(Object.fromEntries(Object.entries(t_data).reverse()));
                setTitleArray(Object.keys(t_data).reverse());
            } else {
                throw new Error('Invalid data format');
            }
        })
        .catch((error) => {
            console.error('Error fetching chat titles:', error);
        });
}

const getChatHistory = (id, setChatHistory) => {
    let h_data = [];

    if (id !== undefined) {
        fetch(`http://127.1.1.1:4000/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }
                return res.json();
            })
            .then((data) => {
                if (data && data.data && Array.isArray(data.data)) {
                    data.data.forEach((item) => {
                        if (Array.isArray(item) && item.length >= 2) {
                            let user = { 'type': 'user', 'message': item[0] };
                            let bot = { 'type': 'bot', 'message': item[1] };
                            h_data.push(user);
                            h_data.push(bot);
                        }
                    });
                    setChatHistory(h_data);
                } else {
                    throw new Error('Invalid data format');
                }
            })
            .catch((error) => {
                console.error('Error fetching chat history:', error);
            });
    } else {
        console.log("id not defined");
    }
};


const ChatBar = ({ sendMsg }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSend = () => {
        if (message.trim()) {
            sendMsg(message);
            setMessage('');  
        }
    }

    return (
        <div className="fixed bottom-0 m-2 w-full flex flex-row">
            <input
                id="chat"
                type="text"
                placeholder="Ask me anything..."
                className="border border-black bg-white rounded-full px-4 py-1 w-[70%] mb-2 mr-2"
                value={message}
                onChange={handleChange}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSend() } }}
            />
            <button onClick={handleSend} disabled={!message.trim()} className="bg-blue-500 text-white px-4 py-2 rounded-full flex-shrink-0 h-9 items-center">
                <Image alt="send image" src={sendIcon} className="w-6 h-6" />
            </button>
        </div>

    );
}


const Sidebar = ({ chatTitles, changeTopic, currentIndex, handleNewChat }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // state for menu open/close
    const [openMenu, setOpenMenu] = useState(false)

    let arr = [];
    Object.entries(chatTitles).forEach((key) => {
        arr.push(key[0]);
    });

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const filterTitle = (array) => {
        return array.filter((el) => el.toLowerCase().includes(searchQuery));
    }

    const toShow = filterTitle(arr);

    const handleNewTopic = (i) => {
        changeTopic(i);
    }

    // function to open and close menu
    const handleMenu = () => {
        setOpenMenu(!openMenu)
        // console.log("this happe")
    }

    return (
        <>
            <div className={openMenu ? 'bg-[#d7e3fb] absolute left-[339px] top-[100px] z-20 sm:hidden' : 'bg-[#d7e3fb] absolute top-[100px] z-20 sm:hidden'}>
                <button onClick={handleMenu} className='text-4xl font-black'>☰</button>
            </div>
            <div id="histlog" className={openMenu ? "bg-[#d7e3fb] z-10 w-2/3 absolute sm:block sm:w-2/5 lg:block lg:w-1/6" : "bg-[#d7e3fb] hidden sm:block sm:w-2/5 lg:block lg:w-1/6"}>
                {/* Verchat Logo */}
                <div className="flex">
                    <Image src={vertexLogo} alt="ChatSideBar Image" style={{ width: '270px', height: '85.5px', marginBottom: '25px' }} className="rounded-lg" />
                </div>
                {/* New Chat button */}
                <div className="flex justify-center mx-1">
                    <button
                        className="bg-[#d7e3fb] w-full rounded-md py-2 px-4 text-left flex items-center font-medium justify-between hover:bg-blue-300"
                        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                        onClick={handleNewChat}>
                        <span>New Chat</span>
                        <Image src={new_chat_icon} alt="Icon" className="h-4 w-4" /> {/* Image */}
                    </button>
                </div>
                <h1 className='text-left text-gray-600 font-medium pt-1 px-4 '>Chat History</h1>
                {/* Search Bar */}
                <div className="flex mx-1 mb-2">
                    <input type="text" placeholder="Search..." className="border border-gray-400 rounded-lg px-2 py-1 mt-2 w-full" onChange={handleChange} />
                </div>
                {/* Display chat history in reverse order .slice(0).reverse() */}
                <div className="overflow-y-auto">
                    {toShow.map((title, index) => (
                        <div key={chatTitles[`${title}`]} className='font-medium mx-1'>
                            <button
                                key={chatTitles[`${title}`]}
                                id={chatTitles[`${title}`]}
                                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                className={`
                                    w-full rounded-md py-2 px-4 text-left
                                    ${chatTitles[`${title}`] != currentIndex ? 'bg-[#d7e3fb] hover:bg-blue-300 text-black' : 'bg-blue-400 pointer-events-none text-white'} 
                                `}
                                disabled={chatTitles[`${title}`] == currentIndex}
                                onClick={handleNewTopic}
                            >
                                {title}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


const WlcMsg = () => {
    return (
            <div>
                <h1 className='bg-[#d7e3fb] rounded-lg px-2 py-1 col-start-1 col-end-2'>Hi, how may I help you today?</h1>
            </div>     
    );
}

const NewChat = ({chatData}) => {
    const chatTitle = "Untitled Chat";
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatTitles, setChatTitles] = useState([currentChatTitle]);
    const [titleArray, setTitleArray] = useState([]);
    const [isChatLoading, setChatLoading] = useState(true)
    const [isHistoryLoading, setHistoryLoading] = useState(true)
    const [uploadedFile, setUploadedFile] = useState({})

    const handleNewChat = () => {
        setChatTitles({ [chatTitle]: "123", ...chatTitles }); // Add the current chat title to the list of chat titles
        // setChatHistories({ ...chatHistori1es, [chatTitles.length - currentIndex - 1]: chatHistory }); // Add the current chat history to the list of chat histories
        setChatHistory([]); // Clear chat history when starting a new chat
        setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder
        setCurrentIndex("123")
        // api call to create new chat
        // function needs to detect that the chat is empty and new before API is called
    };

    // running API call only once upon page load
    if (currentIndex === '') {
        getChatTitles(setChatTitles, setTitleArray, chatTitle)
        setCurrentChatTitle(chatTitle);
        setCurrentIndex(0);
        setChatLoading(false)
    }

    if (isChatLoading) return <p>Loading chat...</p>

    const handleSend = (msg) => {
        if (currentChatTitle === chatTitle) {
            fetch(`http://127.1.1.1:4000/chatbot/${msg}`, { method: 'POST' })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    if (!data) {
                        throw new Error('Response data is undefined');
                    }
                    let user = {'type':'user', 'message': msg};
                    let bot = {'type':'bot', 'message': data.answer};
                    setChatHistory([...chatHistory, user, bot]);
                    getChatTitles(setChatTitles, setTitleArray);
                    setCurrentChatTitle(data.title);
                    setCurrentIndex(data.id);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            fetch(`http://127.1.1.1:4000/chatbot/question/${currentIndex}/${msg}`, { method: 'POST'})
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    if (!data) {
                        throw new Error('Response data is undefined');
                    }
                    let user = {'type':'user', 'message': msg};
                    let bot = {'type':'bot-message', 'message': data.data[1]};
                    setChatHistory([...chatHistory, user]);
                    setTimeout(() => {
                        setChatHistory(prevHistory => [...prevHistory, bot]);
                    }, 3000); // Delay of 1 second (1000 milliseconds)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };
    

    const handleChangeTopic = (i) => {

        if (i.target.id === chatTitle){
            setChatHistory([])
        }
        else{
            getChatHistory(i.target.id, setChatHistory)
        }
        setCurrentIndex(i.target.id)
        setCurrentChatTitle(i.target.id)
    }

    const promptFile = () => {
        var input = document.createElement("input");
        input.id="file";
        input.type = "file";
        // input.accept = contentType;
    
        return new Promise(function(resolve) {
            input.onchange = function(event) {
                var files = Array.from(event.target.files)[0];
                resolve(files);
                console.log(files.name);
                setUploadedFile({ [currentChatTitle]: files })
                handleSend(files.name);
                console.log(uploadedFile);
            };
            input.click();
            // console.log(files);
        });
    }

    return (
        
        
        <div className="flex">
            <Sidebar chatTitles={chatTitles} changeTopic={(i) => { handleChangeTopic(i) }} currentIndex={currentIndex} handleNewChat={handleNewChat} />
            <div className="flex-auto">
                                <div className='grid grid-flow-row auto-rows-max grid-cols-2 gap-y-4 mx-2'>
                                    <div className='col-span-2 mx-auto'>
                                        <button onClick={promptFile} disabled={uploadedFile[currentChatTitle]} className={`flex items-center text-white font-bold py-1 px-2 rounded ${uploadedFile[currentChatTitle] ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`} style={{ marginTop: '10px' }}>
                                            Upload <Image src={upload_icon} className='w-6 h-6 ml-1' />
                                        </button>
                                    </div>
                                    <WlcMsg/>
                                </div>
                    {/* <div className='topright'></div>
                    <div className='bottom left'></div> */}
                   {/* Display chat history */}
                <div className="flex flex-col mt-2">
                    {/* .slice(0).reverse() */}
                {chatHistory.map((chat, index) => (
                <div key={index} className={chat.type === 'user' ? 'relative w-[500px] place-self-end pr-3' : 'relative w-[700px] place-self-start pl-3'}>
                <div key={index} className={`rounded-lg px-2 py-1 text-wrap mb-2 ${chat.type === 'user' ? 'bg-[#e4e4e4] ml-auto' : 'bg-[#d7e3fb] mr-auto '}`} >
                <h1>{chat.message}</h1>
                </div>
            </div>
            ))}
                {/* Assuming sendMsg is defined */}
                <ChatBar sendMsg={(msg) => { handleSend(msg); }} />
            </div>
        </div>
    </div>
    );
}

export default NewChat;