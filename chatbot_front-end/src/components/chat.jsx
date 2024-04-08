"use client";
import React, { useState } from "react";
import Image from "next/image";
import vertexLogo from "../public/transparent_verchat_logo.png";
import sendIcon from "../public/paper-plane.png";
import new_chat_icon from "../public/new_chat_icon.png";
import upload_icon from "../public/submit.png";
import loading_icon from "../public/loading.png";
import rightArrow from "../public/rightArrow.png"
import "../public/styles.css";

// populates chatTitles and first chat title history using data from API call
const getChatTitles = (setChatTitles, setTitleArray, setUploadedFile) => {
  let t_data = {};

  fetch("http://127.1.1.1:4000/", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      if (
        data &&
        data.title &&
        Array.isArray(data.title) &&
        data.id &&
        Array.isArray(data.id)
      ) {
        data.title.forEach((title, index) => {
          t_data[title] = data.id[index];
        });
        setChatTitles(Object.fromEntries(Object.entries(t_data).reverse()));
        setTitleArray(Object.keys(t_data).reverse());
        setUploadedFile(data.namespace)
      } else {
        throw new Error("Invalid data format");
      }
    })
    .catch((error) => {
      console.error("Error fetching chat titles:", error);
    });
};

const getChatHistory = (id, setChatHistory) => {
  let h_data = [];

  if (id !== undefined && id !=123) {
    fetch(`http://127.1.1.1:4000/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          data.data.forEach((item) => {
            if (Array.isArray(item) && item.length >= 1) {
              let user = { type: "user", message: item[0] };
              let bot = { type: "bot", message: item[1] };
              h_data.push(user);
              h_data.push(bot);
            }
          });
          setChatHistory(h_data);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      });
  } else {
    setChatHistory(h_data);
  }
};

const ChatBar = ({ sendMsg }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMsg(message);
      setMessage("");
    }  
  setMessage("");
  };

  return (
    <div className="flex flex-1 flex-row w-[100%]bottom-0 justify-center items-center mx-auto">
      <input
        id="chat"
        type="text"
        placeholder="Ask me anything..."
        className="border border-black bg-white rounded-full px-4 py-2 w-[80%] mb-2 mr-3" // Adjusted padding and width
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => {if (e.key === "Enter") {handleSend();}}}/>
      <button id="sendButton" onClick={handleSend} disabled={!message.trim()}>
        <Image
          alt="send image"
          src={sendIcon}
          className="w-8 h-8 mb-3" />
      </button>
    </div>
  );
};

const Sidebar = ({
  chatTitles,
  changeTopic,
  currentIndex,
  handleNewChat,
  handleOpenMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // state for menu open/close
  const [openMenu, setOpenMenu] = useState(false);

  let arr = [];
  Object.entries(chatTitles).forEach((key) => {
    arr.push(key[0]);
  });

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterTitle = (array) => {
    return array.filter((el) => el.toLowerCase().includes(searchQuery));
  };

  const toShow = filterTitle(arr);

  const handleNewTopic = (i) => {
    changeTopic(i);
  };

  return (
      <div id="histlog" className="relative bg-[#d7e3fb] max-h-screen h-screen">
        {/* Verchat Logo */}
        <div className="flex">
          <Image src={vertexLogo} alt="ChatSideBar Image" className="rounded-lg w-[270px] h-[85.5px] mb-[25px]" />
        </div>
        {/* New Chat button */}
        <div className="flex justify-center mx-1">
          <button
            id="newChatButton"
            className="bg-[#d7e3fb] w-full rounded-md py-2 px-4 text-left flex items-center font-medium justify-between hover:bg-blue-300 transition-colors duration-500 ease-in-out"
            style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
            onClick={handleNewChat}>
            <span>New Chat</span>
            <Image src={new_chat_icon} alt="Icon" className="h-4 w-4" />{" "}
            {/* Image */}
          </button>
        </div>
        <h1 className="text-left text-gray-600 font-medium pt-1 px-4 ">Chat History</h1>
        {/* Search Bar */}
        <div className="flex mx-1 mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 rounded-lg px-2 py-1 mt-2 w-full"
            onChange={handleChange} />
        </div>
        {/* Display chat history in reverse order */}
        <ol className="relative max-h-[66.5vh] overflow-y-hidden hover:overflow-y-auto" >
          {toShow.map((title, index) => (
            <li
              id ={chatTitles[`${title}`]}
              key={chatTitles[`${title}`]}
              className={`chat-items font-medium mx-1 translate-y-0`}>
              <button
                key={chatTitles[`${title}`]}
                id={chatTitles[`${title}`]}
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                className={`w-full rounded-md py-2 px-4 text-left transition-colors duration-500 ease-in-out ${chatTitles[`${title}`] != currentIndex ? "bg-[#d7e3fb] hover:bg-blue-300 text-black" : "bg-blue-400 pointer-events-none text-white"} `}
                disabled={chatTitles[`${title}`] == currentIndex}
                onClick={handleNewTopic}>
                {title}
              </button>
            </li>
          ))}
        </ol>
      </div>
  );
};

const NewChat = () => {
  const chatTitle = "Untitled Chat";
  const [currentIndex, setCurrentIndex] = useState("");
  const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatTitles, setChatTitles] = useState([currentChatTitle]);
  const [titleArray, setTitleArray] = useState([]);
  const [uploadedFile, setUploadedFile] = useState({});
  const [menu, setMenu] = useState(false);
  const [openUpload, setOpenUpload] = useState(false)


  //delay function
  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // function for sliding transition
  const slideDown = async () => {
    var items = document.getElementsByClassName("chat-items");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove(`transition-transform`);
      items[i].classList.remove(`duration-1000`);
      if (i >= 0) {
        items[i].classList.replace(`translate-y-0`, `translate-y-[-40px]`);
      }
    }
    await delay(500);
    for (var i = 0; i < items.length; i++) {
      if (i >= 0) {
        items[i].classList.add(`transition-transform`);
        items[i].classList.add(`duration-1000`);
        items[i].classList.replace(`translate-y-[-40px]`, `translate-y-0`);
      }
    }
  };

  const handleNewChat = () => {
    setChatTitles({ [chatTitle]: "123", ...chatTitles }); // Add the current chat title to the list of chat titles
    setChatHistory([]); // Clear chat history when starting a new chat
    setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder
    setCurrentIndex("123");
    slideDown();
  };

  // running API call only once upon page load
  if (currentIndex === "") {
    getChatTitles(setChatTitles, setTitleArray, setUploadedFile);
    setCurrentChatTitle(chatTitle);
    setCurrentIndex(0);
  }

  const handleOpenMenu = () => {
    setMenu(!menu);
  };


  const handleSend = async (msg) => {
    
    // Display user message immediately
    const userMessage = { type: "user", message: msg };
    setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);
        
    // case when new chat
    if (currentChatTitle === chatTitle) {
      // case if there is no uploaded file
      if (uploadedFile[currentIndex]){
        var namespace = uploadedFile[currentIndex]
        fetch(`http://127.1.1.1:4000/chatbot/${msg}/${namespace}`, { method: "POST" })
        .then((res) => {
          
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          
          return res.json();
        })
        .then((data) => {
          if (!data) {
            throw new Error("Response data is undefined");
          }
          let user = { type: "user", message: msg };
          let bot = { type: "bot", message: data.answer };
          setChatHistory([...chatHistory, user, bot]);
          getChatTitles(setChatTitles, setTitleArray ,setUploadedFile);
          setCurrentChatTitle(data.title);
          setCurrentIndex(data.id);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      // case if new chat has uploaded file
      else {
        fetch(`http://127.1.1.1:4000/chatbot/${msg}`, { method: "POST" })
        .then((res) => {
          
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          
          return res.json();
        })
        .then((data) => {
          if (!data) {
            throw new Error("Response data is undefined");
          }
          let user = { type: "user", message: msg };
          let bot = { type: "bot", message: data.answer };
         
          setChatHistory([...chatHistory, user, bot]);
          getChatTitles(setChatTitles, setTitleArray,setUploadedFile);
          setCurrentChatTitle(data.title);
          setCurrentIndex(data.id);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      
    } 
    else {
      var namespace = uploadedFile[currentIndex]
      if (namespace != 'knowledgebase_consolidated') {
        namespace = namespace.replaceAll("_","~")
        fetch(`http://127.1.1.1:4000/chatbot/question/${currentIndex}/${msg}/${namespace}`, {
        method: "POST",
      })
        .then((res) => {
          
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          
          return res.json();
        })
        .then((data) => {
          if (!data) {
            throw new Error("Response data is undefined");
          }
          let user = { type: "user", message: msg };
          let bot = { type: "bot", message: data.data };
          setChatHistory([...chatHistory, user, bot]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      else{
        namespace = namespace.replaceAll("_","~")
        fetch(`http://127.1.1.1:4000/chatbot/question/${currentIndex}/${msg}/${namespace}`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          
          return res.json();
        })
        .then((data) => {
          if (!data) {
            throw new Error("Response data is undefined");
          }

          let user = { type: "user", message: msg };
          let bot = { type: "bot", message: data.data };
          setChatHistory([...chatHistory, user, bot]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
    }
    
  };

  const handleChangeTopic = (i) => {
      if (i.target.id === chatTitle) {
          setChatHistory([]);
      } else {
          getChatHistory(i.target.id, setChatHistory);
      }
      setCurrentIndex(i.target.id);
      setCurrentChatTitle(i.target.id);
  };

  const handlePDF = (id,fpath) =>{

    fetch(`http://127.1.1.1:4000/upload/${id}/${fpath}`, { method: "POST" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
            })
            .then((data) => {
            if (!data) {
                throw new Error("Response data is undefined");
            }
            setUploadedFile({ [currentIndex]: data.namespace })
            let bot = {'type':'bot', 'message': "Your file has been received and processed! How can I help?"};

            setChatHistory([...chatHistory, bot])
            })
            .catch((error) => {
            console.error("Error:", error);
            });
  }
  const handleOpenUpload =()=>{
    setOpenUpload(!openUpload)
  }

  const OpenUpload = () =>{
    return(
      <div className="z-10 flex flex-col bg-blue-400 rounded-md justify-center absolute top-[40%] left-[10%] sm:left-[40%] border-4 w-[400px] h-[150px]">
          <button className="absolute top-0 right-2 text-2xl" onClick={handleOpenUpload}>x</button>
          <h1 className="place-self-center">Enter file path of PDF</h1>
          <p className="place-self-center mb-5 italic font-thin text-[12px]">i.e. C:/path/to/file.pdf</p>
        <div className="place-self-center">
          <input
          id="uploadDoc"
          type="text"
          placeholder="Please Enter PDF URL"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleOpenUpload()
              var fpath = e.target.value
              fpath = fpath.replaceAll("/", "_")
              handlePDF(currentIndex,fpath)
            }}}></input>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-10 max-h-screen h-screen">
      {openUpload? <OpenUpload />:""}
      <div className={`h-full ${menu ? "relative col-span-4 md:col-span-2" : "z-10 absolute translate-x-[-200%] transition-transform duration-300"}`}>
        <div className="flex absolute top-[50vh] right-[-21.5px] h-[50px] border border-b-2 rounded-r-lg">
          <button onClick={handleOpenMenu}>
            <Image src={rightArrow} alt=">" width={20} height={45}/>
          </button>
        </div>
        <Sidebar
          chatTitles={chatTitles}
          changeTopic={(i) => {handleChangeTopic(i);}}
          currentIndex={currentIndex}
          handleNewChat={handleNewChat}
          handleOpenMenu={handleOpenMenu} />
      </div>
      <div id="chatlog" className={`flex flex-col max-h-[100vh] justify-between overflow-y-auto ${menu ? "col-span-6 md:col-span-8" : "col-span-10"}`}>
        <div className="grid grid-flow-row auto-rows-max grid-cols-5 gap-y-1">
          <div className="z-10 flex absolute top-[50vh] h-[50px] border border-b-2 rounded-r-lg">
            <button onClick={handleOpenMenu} className="hover:bg-blue-300">
              <Image src={rightArrow} alt=">" width={20} height={45}/>
            </button>
          </div>
          <div className="sticky top-0 col-span-10 z-10 bg-[#d7e3fb] grid grid-cols-5">
            <div className="relative col-start-3 top-[-5px]">
              <button
                onClick={handleOpenUpload}
                disabled={uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex]}
                className={`flex w-50 text-white font-bold py-1 px-2 rounded transition-colors duration-500 ease-in-out mx-auto ${ uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex] ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"}`} style={{ marginTop: "10px" }}>
                <>Upload</>
                <Image src={upload_icon} alt="^" className="w-6 h-6 ml-1" />
              </button>
            </div>
            <div className="mt-[13px] col-end-6 justify-center mx-auto">
              <label className="inline-flex items-center cursor-pointer mx-auto">
                <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600 right-0"></div>
                <span className="ms-1 text-gray-900 text-xs hidden md:block mx-auto ">External Search</span>
              </label>
            </div>
          </div>
          <div className={`col-span-5 relative place-self-start pl-3`}>
            <div className={`rounded-t-lg rounded-br-lg px-2 py-1 text-wrap mb-2 bg-[#d7e3fb] mr-auto`}>
              <h1>Hi, how may I help you today?</h1>
            </div>
          </div>
          {Array.from(chatHistory).map((chat, index) => (
            <>
              <div
                id = {index}
                key={index}
                className={`rounded-t-lg ${chat.type === "user" ? "col-end-6 col-span-2 rounded-bl-lg relative pr-3" : "col-start-1 col-span-3 rounded-br-lg relative pl-3"}`}>
                <div
                  id = {index}
                  key={index}
                  className={`rounded-t-lg px-2 py-1 text-wrap mb-2 ${chat.type === "user" ? "rounded-bl-lg bg-[#e4e4e4] ml-auto" : "rounded-br-lg bg-[#d7e3fb] mr-auto "}`}>
                  <h1>{chat.message}</h1>
                </div>
              </div>
              <div></div>
            </>
          ))}
        </div>
        <div className={`sticky w-[100%] bottom-0 order-last bg-[#FFFFFF]  ${menu ? "col-span-6 md:col-span-8" : "col-span-10"}`}>
          <ChatBar sendMsg={(msg) => {handleSend(msg);}} />
        </div>
      </div>
    </div>
  );
};

export default NewChat;
