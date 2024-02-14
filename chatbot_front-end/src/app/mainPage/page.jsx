import React from "react";
import Navbar from "@/components/navBar";
import NewChat from "@/components/chat";

// functional component for the homepage
const page = () => {
  return (
    <>
      <Navbar />
      <NewChat />
    </>
  );
};

export default page;
