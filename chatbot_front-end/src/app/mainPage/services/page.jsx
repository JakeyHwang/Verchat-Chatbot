import React from "react";
import Navbar from "@/components/navBar";
import ServicesButton from "@/components/servicesButton";

const page = () => {
  const items = ["ChatBot", "Chatbot History", "Upload Document"];
  return (
    <>
      <Navbar />
      <section className="flex flex-row justify-between">
        {items.map((item, index) => {
          return (
            <div key={index} className="bg-blue-300 m-4 p-5 w-1/3 h-full">
              <ServicesButton item={item} />
            </div>
          );
        })}
      </section>
    </>
  );
};

export default page;
