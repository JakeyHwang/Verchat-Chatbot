"use client";
import React, { useState } from "react";
import Image from "next/image";
import vertexLogo from "../public/transparent_verchat_logo.png";
import sendIcon from "../public/paper-plane.png";
import new_chat_icon from "../public/new_chat_icon.png";
import upload_icon from "../public/submit.png";
import loading_icon from "../public/loading.png";
import "../public/styles.css";

// populates chatTitles and first chat title history using data from API call
const getChatTitles = (setChatTitles, setTitleArray, chatTitle = "", setUploadedFile) => {
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

  if (id !== undefined) {
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
            console.log(item)
            if (Array.isArray(item) && item.length >= 1) {
              item.forEach((value, index) => {
                let user = { type: "user", message: value[0] };
                let bot = { type: "bot", message: value[1] };
                h_data.push(user);
                h_data.push(bot);
              })
              // let user = { type: "user", message: item[0] };
              // let bot = { type: "bot", message: item[1] };
              // h_data.push(user);
              // h_data.push(bot);
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
    console.log("id not defined");
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
      document.getElementById("loading-screen").classList.remove("hidden");
    }
    setTimeout(() => {
      document.getElementById("loading-screen").classList.add("hidden");
  }, 5000); // 2000 milliseconds = 2 seconds
  
  setMessage("");
  };

  return (
    <div className="w-full justify-center fixed bottom-0 items-center">
      <div className="flex flex-1 flex-row w-[80%] justify-center items-center">
        <input
          id="chat"
          type="text"
          placeholder="Ask me anything..."
          className="border border-black bg-white rounded-full px-4 py-2 w-[80%] mb-2 mr-3" // Adjusted padding and width
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button id="sendButton" onClick={handleSend} disabled={!message.trim()}>
          <Image
            alt="send image"
            src={sendIcon}
            className="w-8 h-8 mb-3 mr-7"
          />
        </button>
      </div>
    </div>
  );
};
const Sidebar = ({
  chatTitles,
  changeTopic,
  currentIndex,
  handleNewChat,
  openMenuu,
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

  // function to open and close menu
  const handleMenu = () => {
    setOpenMenu(!openMenu);
    // console.log("this happe")
    openMenuu(openMenu);
  };

  return (
    <div>
      <div
        className={
          openMenu ? "bg-[#d7e3fb] md:hidden" : "md:bg-[#d7e3fb] md:hidden"
        }
      >
        <button onClick={handleMenu} className="text-4xl font-black">
          ☰
        </button>
      </div>
      <div
        id="histlog"
        className={
          openMenu ? "bg-[#d7e3fb]" : "bg-[#d7e3fb] invisible md:visible"
        }
        style={{ height: "100vh", overflowY: "auto" }}
      >
        {/* Verchat Logo */}
        <div className="flex">
          <Image
            src={vertexLogo}
            alt="ChatSideBar Image"
            style={{ width: "270px", height: "85.5px", marginBottom: "25px" }}
            className="rounded-lg"
          />
        </div>
        {/* New Chat button */}
        <div className="flex justify-center mx-1">
          <button
            id="newChatButton"
            className="bg-[#d7e3fb] w-full rounded-md py-2 px-4 text-left flex items-center font-medium justify-between hover:bg-blue-300 transition-colors duration-500 ease-in-out"
            style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
            onClick={handleNewChat}
          >
            <span>New Chat</span>
            <Image src={new_chat_icon} alt="Icon" className="h-4 w-4" />{" "}
            {/* Image */}
          </button>
        </div>
        <h1 className="text-left text-gray-600 font-medium pt-1 px-4 ">
          Chat History
        </h1>
        {/* Search Bar */}
        <div className="flex mx-1 mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 rounded-lg px-2 py-1 mt-2 w-full"
            onChange={handleChange}
          />
        </div>
        {/* Display chat history in reverse order*/}
        <ol className="">
          {toShow.map((title, index) => (
            <li
              id ={chatTitles[`${title}`]}
              key={chatTitles[`${title}`]}
              className={`chat-items font-medium mx-1 translate-y-0`}
            >
              <button
                key={chatTitles[`${title}`]}
                id={chatTitles[`${title}`]}
                style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                className={`
                                    w-full rounded-md py-2 px-4 text-left transition-colors duration-500 ease-in-out
                                    ${
                                      chatTitles[`${title}`] != currentIndex
                                        ? "bg-[#d7e3fb] hover:bg-blue-300 text-black"
                                        : "bg-blue-400 pointer-events-none text-white"
                                    } `}
                disabled={chatTitles[`${title}`] == currentIndex}
                onClick={handleNewTopic}
              >
                {title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const WlcMsg = () => {
  return (
    <div>
      <h1 className="bg-[#d7e3fb] rounded-lg px-2 py-1 col-span-2">
        Hi, how may I help you today?
      </h1>
    </div>
  );
};

const NewChat = ({ chatData }) => {
  const chatTitle = "Untitled Chat";
  const [currentIndex, setCurrentIndex] = useState("");
  const [currentChatTitle, setCurrentChatTitle] = useState(chatTitle);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatTitles, setChatTitles] = useState([currentChatTitle]);
  const [titleArray, setTitleArray] = useState([]);
  const [isChatLoading, setChatLoading] = useState(true);
  const [isHistoryLoading, setHistoryLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState({});
  const [openMenu, setOpenMenu] = useState(false);
 

  
  //delay function
  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // function for sliding transition
  const slideDown = async () => {
    let items = document.getElementsByClassName("chat-items");
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
      // item.classList.replace(`translate-y-[-64px]`,`translate-y-[0px]`)
      // transition-transform duration-1000
    }
  };

  const handleNewChat = () => {
    setChatTitles({ [chatTitle]: "123", ...chatTitles }); // Add the current chat title to the list of chat titles
    // setChatHistories({ ...chatHistori1es, [chatTitles.length - currentIndex - 1]: chatHistory }); // Add the current chat history to the list of chat histories
    setChatHistory([]); // Clear chat history when starting a new chat
    setCurrentChatTitle(chatTitle); // Reset chat title to the placeholder
    setCurrentIndex("123");
    // api call to create new chat
    // function needs to detect that the chat is empty and new before API is called
    slideDown();
  };

  // running API call only once upon page load
  if (currentIndex === "") {
    getChatTitles(setChatTitles, setTitleArray, chatTitle, setUploadedFile);
    setCurrentChatTitle(chatTitle);
    setCurrentIndex(0);
    setChatLoading(false);
  }

  const openMenuu = (menu) => {
    setOpenMenu(!menu);
    console.log(openMenu);
  };

  if (isChatLoading) return <p>Loading chat...</p>;

  const handleSend = (msg) => {
    
    if (currentChatTitle === chatTitle) {
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
    else if (uploadedFile[currentIndex] != "knowledge_consolidated") {
      namespace = uploadedFile[currentIndex]
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
    else {
      fetch(`http://127.1.1.1:4000/chatbot/question/${currentIndex}/${msg}`, {
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
          setChatHistory([...chatHistory, user]);
          setTimeout(() => {
            setChatHistory((prevHistory) => [...prevHistory, bot]);
          }, 3000); // Delay of 1 second (1000 milliseconds)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
                
                setChatHistory((prevHistory) => [...prevHistory, bot])
                })
                .catch((error) => {
                console.error("Error:", error);
                });

    }

    const promptFile = (id) => {
        var input = document.createElement("input");
        input.id="file";
        input.type = "file";

        return new Promise(function(resolve) {
            input.onchange = function(event) {
                var file = Array.from(event.target.files)[0];
                
                
                resolve(file);
                                
                var file_path = "C:/Users/hwang/Desktop/company data/Ace Hardware Annual Report 2022.pdf"
                file_path = file_path.replaceAll("/", "_")
                handlePDF(id,file_path)
                          
            };
            input.click();
        });
    }

  return (
    <div className="flex" style={{ maxHeight: "100vh" }}>
      <div className="grid grid-cols-10">
        <div
          className={`md:col-span-2 ${
            openMenu ? "col-span-4" : "col-span-1"
          } md:visible`}
        >
          <Sidebar
            chatTitles={chatTitles}
            changeTopic={(i) => {
              handleChangeTopic(i);
            }}
            currentIndex={currentIndex}
            handleNewChat={handleNewChat}
            openMenuu={openMenuu}
          />
        </div>

        <div
          className={`flex-auto ${
            openMenu ? "col-span-6" : "col-span-9"
          } md:col-span-8`}
          style={{ height: "91.4vh", overflowY: "auto" }}
        >
          <div className="grid grid-flow-row auto-rows-max grid-cols-5 gap-y-1 mx-2">
            <div className="w-[100%] flex col-span-5 mx-auto items-center">
              {/* {/* <Sidebar chatTitles={chatTitles} changeTopic={(i) => { handleChangeTopic(i) }} currentIndex={currentIndex} handleNewChat={handleNewChat} /> */}
              <button
                onClick={()=>promptFile(currentIndex)}
                disabled={uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex]}
                className={`flex items-center text-white font-bold py-1 px-2 rounded transition-colors duration-500 ease-in-out mx-auto ${
                  uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex]
                    ? "bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
                style={{ marginTop: "10px" }}
              >
                Upload <Image src={upload_icon} className="w-6 h-6 ml-1" />
              </button>
              <div className="mt-[13px] right-0">
              <label class="inline-flex items-center me-5 cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer" />
  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
  <span class="ms-3 text-gray-900">External Search</span>
</label>
              </div>
              </div>

            {/* <div className="col-start-3 col-end-4">
            <button
                onClick={()=>promptFile(currentIndex)}
                disabled={uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex]}
                className={`flex items-center text-white font-bold py-1 px-2 rounded transition-colors duration-500 ease-in-out mx-auto ${
                  uploadedFile[currentIndex] !="knowledgebase_consolidated" && uploadedFile[currentIndex]
                    ? "bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
                style={{ marginTop: "10px" }}
              >
                Upload <Image src={upload_icon} className="w-6 h-6 ml-1" />
              </button>
            </div>

            <div className="col-start-5 col-end-6">
              <label class="inline-flex items-center justify-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer" />
  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
  <span class="ms-3 text-gray-900">External Search</span>
</label>
              </div> */}

            <div
                  className={`col-span-3 relative place-self-start pl-3`}
                >
                  <div
                    className={`rounded-t-lg rounded-br-lg px-2 py-1 text-wrap mb-2 bg-[#d7e3fb] mr-auto`}
                  >
                    <h1>Hi, how may I help you today?</h1>
                  </div>
                </div>
            {Array.from(chatHistory).map((chat, index) => (
              <>
              <div></div>
                <div
                  id = {index}
                  key={index}
                  className={`rounded-t-lg ${
                    chat.type === "user"
                      ? "col-end-6 col-span-2 rounded-bl-lg relative pr-3" // "relative w-[400px] place-self-end pr-3"
                      : "col-start-1 col-span-3 rounded-br-lg relative pl-3" // "relative w-[600px] place-self-start pl-3"
                  }`}
                >
                  <div
                    id = {index}
                    key={index}
                    className={`rounded-t-lg px-2 py-1 text-wrap mb-2 ${
                      chat.type === "user"
                        ? "rounded-bl-lg bg-[#e4e4e4] ml-auto"
                        : "rounded-br-lg bg-[#d7e3fb] mr-auto "
                    }`}
                  >
                    <h1>{chat.message}</h1>
                  </div>
                </div>
              </>
            ))}
            <div id="loading-screen" className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center hidden">
              <div className="spinner-border text-primary animate-spin" role="status">
              <Image
                alt="loading"
                src={loading_icon}
                className="w-8 h-8 "
              />
              </div>
              <div class ="text-white text-lg ml-3">Loading...</div>
            </div>
            <div className="col-span-5">
            <ChatBar
              sendMsg={(msg) => {
                handleSend(msg);
              }}
            />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
