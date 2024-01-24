import React from "react";
import Navbar from "@/components/navBar";
import ChatButton from "@/components/newchat";

// functional component for the homepage
const page = () => {
  return (
    <>
      <Navbar />
      <h1>This is the main page</h1>
      <ChatButton />
    </>
  );
};

export default page;
