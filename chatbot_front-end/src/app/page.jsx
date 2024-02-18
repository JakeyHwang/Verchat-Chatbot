"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/navBar";
import NewChat from "@/components/chat";
import styles from "../input.css";
import Logo from "@/components/logo";



// functional component for the homepage
const page = () => {
  // state to hold chat titles corresponding id
  const [chatTitle, setChatTitle] = useState({})
  // reference to check if API call has run
  const didFetchRef = useRef(false)

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true
      fetchChatTitles()
    }
  }, [])

  async function fetchChatTitles() {
    let path = '/'
    console.log(process.env.NEXT_PUBLIC_API_URL + path)
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path)
    const json = await res.json()
    setChatTitle(json)
    console.log(chatTitle)
    console.log(res)
  }

  return (
    <>
      <NewChat />
    </>
  );
};

export default page;
