"use client";
import React from "react";
import styles from "../input.css";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navBar";
import Link from "next/link";

// function component for log in page
// currently does not actually check for any username/password
// input. also probably not gonna be used since we dont need login
const page = () => {
  const router = useRouter();

  return (
    <div className="w-screen h-screen radial-blue flex flex-grid justify-center">
      <div className="w-1/2 h-64 absolute top-1/3 right-3/5 bg-white rounded-lg flex flex-col">
        <h1 className="rounded-t-lg w-full h-1/6 bg-blue-300 text-center font-bold text-white text-3xl">
          Welcome
        </h1>
        <div className="rounded-b-lg h-full w-full bg-blue-200 flex flex-col items-center justify-center">
          <h1 className="p-3">Please Log In</h1>
          <form className="p-3 flex flex-col w-3/5 justify-center">
            <input
              className="rounded border-b-4 text-center"
              placeholder="Username"
            ></input>
            <input
              className="rounded border-b-4 text-center"
              placeholder="Password"
            ></input>
          </form>
          <button className="bg-blue-500 border-blue-900 border-3 rounded-lg w-1/6 h-1/6 font-bold text-xl">
            <Link href="./mainPage">Log In</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
