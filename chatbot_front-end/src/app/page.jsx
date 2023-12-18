"use client";
import React from "react";
import styles from "../input.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navBar";

const page = () => {
  const router = useRouter();

  return (
    <div>
      <Navbar />
      This is main page
    </div>
  );
};

export default page;
