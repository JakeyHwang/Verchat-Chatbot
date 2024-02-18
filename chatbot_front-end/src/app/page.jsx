import React from "react";
import Navbar from "@/components/navBar";
import NewChat from "@/components/chat";
import styles from "../input.css";
import Logo from "@/components/logo";



// functional component for the homepage
const page = () => {
  return (
    <>
      <Logo />
      <NewChat />
    </>
  );
};

export default page;
