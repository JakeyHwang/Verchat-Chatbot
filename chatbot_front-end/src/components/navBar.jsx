"use client";
import React, { useState } from "react";
import Link from "next/link";
// this is the functional component for the navigation bar
const Navbar = () => {
  // use state for navbar menu toggle
  const [menu, setMenu] = useState(false);
  // use state for settings menu toggle
  const [settings, setSettings] = useState(false);

  return (
    <>
      <nav className="bg-blue-400 border-b-3 flex flex-row justify-between items-center text-2xl font-bold sticky top-0 max-sm:flex-col">
        <div className="flex flex-col">
          <Link href="/mainPage" className="justify-start m-2">
            Verbot
          </Link>
          <div
            className="max-sm:flex hidden absolute top-2 right-0 mr-3 flex-col justify-between w-9 h-8"
            onClick={() => setMenu(!menu)}
          >
            <span className="h-2 w-full bg-white rounded"></span>
            <span className="h-2 w-full bg-white rounded"></span>
            <span className="h-2 w-full bg-white rounded"></span>
          </div>
        </div>

        <div className={menu ? "" : "max-sm:hidden"}>
          <ul className="flex max-sm:flex-col max-sm:w-full max-sm:mb-1">
            <li className="list-none max-sm:w-full max-sm:text-center">
              <Link
                className="max-sm:my-1 max-sm:mx-2 p-2 mx-2 active:bg-blue-600 hover:bg-blue-200 rounded"
                href="/mainPage/services"
              >
                Services
              </Link>
            </li>
            <li className="list-none max-sm:w-full max-sm:text-center">
              <Link
                className="max-sm:my-1 max-sm:mx-2 p-2 mx-2 active:bg-blue-600 hover:bg-blue-200 rounded"
                href="/mainPage/contact"
              >
                About
              </Link>
            </li>
            <li className="list-none max-sm:w-full max-sm:text-center">
              <button onClick={() => setSettings(!settings)}>⚙️</button>
            </li>
          </ul>
        </div>
      </nav>
      <div className={settings ? "" : "hidden"}>
        <div className="absolute border-black border-4 bg-blue-400 w-1/6 py-5 px-2 mx-1 my-2 h-10 right-0">
          <ul className="flex flex-col">
            <li>
              <Link href="/">Log Out</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
