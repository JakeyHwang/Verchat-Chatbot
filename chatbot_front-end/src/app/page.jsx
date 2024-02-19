"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/navBar";
import NewChat from "@/components/chat";
import styles from "../input.css";



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
    let f_path = process.env.NEXT_PUBLIC_API_URL
    let b_path = '/'
    // let res = await fetch(process.env.NEXT_PUBLIC_API_URL + path)
    // const json = await res.json()
    let res;
    fetch(`${f_path+b_path}`)
    .then((response) => response.json())
    .then((data) => (res = data))
    .then(() => console.log(res));
    setChatTitle(res)

    return res;
  }

  return (
    <>
      <NewChat />
    </>
  );
};

export default page;
