"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import vertexLogo from '../public/transparent_verchat_logo.png'
import sendIcon from '../public/paper-plane.png'
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy';
import { output } from '../../next.config';

// populates chatTitles and first chat title history using data from API call
const getChatTitles = (setChatTitles, setTitleArray, chatTitle="")=>{
    let t_data = {}
    let output = ''

    fetch("http://127.1.1.1:4000/", { method: 'GET' })
        .then((res)=> {
            console.log(res.body)
            return res.json(); // Add return statement here
        })
        .then((data)=>{
            data['title'].forEach((title,index) => {
                t_data[`${title}`] = data['id'][index]
            });
            // t_data.reverse();
            if (chatTitle == ""){
                t_data[chatTitle] = "";
                setChatTitles(Object.fromEntries(Object.entries(t_data).reverse()))}
            else{
                setChatTitles(Object.fromEntries(Object.entries(t_data).reverse()))
            }
            setTitleArray(Object.keys(t_data).reverse())
        })
}
// populates chat History of current chat title
const getChatHistory = (id, setChatHistory) => {
    // console.log(`${f_path+b_path+output}`)
    // let res = fetch(`${f_path+b_path}`)
    let h_data = []
    if(id!== undefined){
    fetch(`http://127.1.1.1:4000/${id}`)
        .then((res)=>{return res.json()})
        .then((data)=>{
            // console.log(data)
            data['data'].forEach((data)=>{
                let user = {'type':'user','message':`${data[0]}`}
                let bot = {'type':'bot', 'message':`${data[1]}`}
                h_data.push(user)
                h_data.push(bot)
            })
        })
        .then(()=>{
            setChatHistory(h_data)
        })}
    else{
        console.log("id not defined")
    }
}

const ChatBar = ({ sendMsg }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        // console.log(e);
        setMessage(e.target.value);
    }

    const handleSend = () => {
        if (message.trim()) {
            sendMsg(message);
            setMessage('');  
        }
    }
    //className="mx-2 right-5 bg-[#7dd3fc] rounded-lg px-4 py-1"
    return (
        <div className="fixed bottom-0 left-4 m-12 w-full">
            <input id="chat" type="text" placeholder="Ask me anything..." className='bg-[#e5e5e5] rounded-lg px-4 py-1 w-3/5' value={message} onChange={handleChange} />
            <button onClick={handleSend}>
                <Image src={sendIcon} style={{ width: '28px', height:'28px',  marginLeft: '10px', marginBottom:'-7px'}} />
            </button>
            
        </div>
    );
}

const Sidebar = ({ chatTitles, changeTopic, currentIndex, handleNewChat }) => {
    const [searchQuery, setSearchQuery] = useState('')
    //array to hold original titles
    let arr = []
    Object.entries(chatTitles).forEach((key) => {
        arr.push(key[0])
    })
    // changing filter query
    const handleChange =(e)=>{
        setSearchQuery(e.target.value)
    }
    // filter handler: currently filters based on chat title only
    const filterTitle = (array) => {
        return array.filter(
            (el)=> el.toLowerCase().includes(searchQuery)
        )
    }
    // creating and applying filter
    const toShow = filterTitle(arr)
    
    const handleNewTopic = (i) => {
        changeTopic(i);
    }


    return (
        <div id="histlog" className="bg-[#d7e3fb] w-1/5 h-screen flex flex-col">
            {/*Verchat Logo*/}
            <div className="flex justify-center">
                <Image src={vertexLogo} alt="ChatSideBar Image"  style={{ width: '210px', height:'70px',  marginTop: '10px', marginBottom:'25px'}}  className="rounded-lg " />
            </div>
            {/* New Chat button */}
            <div className="flex justify-center">
                <button className="bg-[#7dd3fc] rounded-lg px-4 py-1 mx-2" onClick={handleNewChat}>
                    New Chat
                </button>
            </div>
            <div><br /><br /><br /></div>
            <h1 className='text-center'>Chat History</h1>
            {/* Search Bar */}
            <div className="flex justify-center">
                <input type="text" placeholder="Search..." className="border border-gray-400 rounded-full px-2 py-1 mt-2" style={{ width:'90%' }} onChange={handleChange} />
            </div>
            {/* Display chat history in reverse order .slice(0).reverse() */}
            {toShow.map((title, index) => (
                <div key={chatTitles[`${title}`]} className='flex flex-col items-center justify-center'>
                    <button key={chatTitles[`${title}`]} id={chatTitles[`${title}`]} className={chatTitles[`${title}`] != currentIndex ? `bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 m-2 border border-blue-700 rounded` : 'text-white bg-[#4B5563] dark:bg-[#4B5563] cursor-not-allowed font-bold px-2 m-2 text-center border border-[#111827] rounded'} disabled={chatTitles[`${title}`] == currentIndex} onClick={handleNewTopic}>{title}</button>
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
    const chatTitle = "Untitled Chat";
    const [currentIndex, setCurrentIndex] = useState('');
    const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatTitles, setChatTitles] = useState([currentChatTitle]);
    // const [chatHistories, setChatHistories] = useState({});
    const [titleArray, setTitleArray] = useState([]);
    const [isChatLoading, setChatLoading] = useState(true)
    const [isHistoryLoading, setHistoryLoading] = useState(true)

    const handleNewChat = () => {
        setChatTitles({ [chatTitle]: "123", ...chatTitles }); // Add the current chat title to the list of chat titles
        // setChatHistories({ ...chatHistori1es, [chatTitles.length - currentIndex - 1]: chatHistory }); // Add the current chat history to the list of chat histories
        setChatHistory([]); // Clear chat history when starting a new chat
        setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder

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
        // console.log(currentChatTitle)
        // console.log(chatTitle)
        if (currentChatTitle === chatTitle) {
            // API call to create new chat
            // function needs to detect that the chat is empty and new before API is called
            fetch(`http://127.1.1.1:4000/chatbot/${msg}`, { method: 'POST' })
                .then((res) => {
                    console.log(res.body)
                    return res.json();
                })
                .then((data) => {
                    console.log(data)
                    let user = {'type':'user','message':`${data.question}`}
                    let bot = {'type':'bot', 'message':`${data.answer}`}
                    setChatHistory([...chatHistory, user, bot])
                    getChatTitles(setChatTitles, setTitleArray)
                    setCurrentChatTitle(data.title)
                })
        }
        else {
            // let param = {"id":chatTitles[currentChatTitle], "qn":msg}
            // param = JSON.stringify(param)
            // fetch(`http://127.1.1.1:4000/chatbot/question/${param}`, { method: 'POST' , body: JSON. stringify(param) } )
            fetch(`http://127.1.1.1:4000/chatbot/question/${currentChatTitle}/${msg}`, { method: 'POST'} )
                .then((res) => {
                    console.log(res.body)
                    return res.json();
                })
                .then((data) => {
                    console.log(data)
                    let user = {'type':'user','message':`${data.data[1]}`}
                    let bot = {'type':'bot', 'message':`${data.data[2]}`}
                    setChatHistory([...chatHistory, user, bot])
                })
        }

        const updatedChatHistory = [...chatHistory, { type: 'user', message: msg }];
        setChatHistory(updatedChatHistory);
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

    return (
        <div className="flex">
            <Sidebar chatTitles={chatTitles} changeTopic={(i) => { handleChangeTopic(i) }} currentIndex={currentIndex} handleNewChat={handleNewChat} />
            <div className="flex-auto">
                <div className='grid grid-flow-row auto-rows-max grid-cols-2 gap-y-4 mx-2'>
                    <WlcMsg/>
                    <div></div>
                    <div></div>
                   {/* Display chat history */}
                <div className="flex flex-col">
                    {/* .slice(0).reverse() */}
                {chatHistory.map((chat, index) => (
                <div key={index} className={chat.type === 'user' ? 'user-message' : 'bot-message'}>
                    <div key={index} className={`bg-[#e4e4e4] rounded-lg px-2 py-1 text-wrap mb-2 ${chat.type === 'user' ? 'ml-auto' : 'mr-auto'}`} >
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