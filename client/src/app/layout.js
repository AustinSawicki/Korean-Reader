"use client"
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link"
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1280 && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <html lang="en">
      <head>
        <title>Korean Generator</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Generates random Korean expressions" />
      </head>
      <body className={inter.className}>
        <nav className="bg-gray-800 py-4 fixed w-full top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">Korean Generator</h1>
            <div className="hidden xl:flex items-center">
              <Link href="/number-guesser" className="text-white text-lg font-semibold mr-8 hover:text-gray-300" >Number Guesser</Link>
              <Link href="/date-guesser" className="text-white text-lg font-semibold mr-8 hover:text-gray-300">Date Guesser</Link>
              <Link href="/sentence-generator" className="text-white text-lg font-semibold mr-8 hover:text-gray-300">Sentence Generator</Link>
            </div>
            <div className="xl:hidden flex items-center">
              <button onClick={toggleDropdown} className="text-white focus:outline-none ml-4 hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </div>
          {isOpen && (
                <div className="absolute left-0 top-10 bg-gray-800 w-48 rounded-lg shadow-lg">
                  <div className="flex flex-col items-start py-2">
                    <Link href="/number-guesser" className="text-white text-lg font-semibold py-2 px-4 w-full hover:text-gray-300" onClick={toggleDropdown}>Number Guesser</Link>
                    <Link href="/date-guesser" className="text-white text-lg font-semibold py-2 px-4 w-full hover:text-gray-300" onClick={toggleDropdown}>Date Guesser</Link>
                    <Link href="/sentence-generator" className="text-white text-lg font-semibold py-2 px-4 w-full hover:text-gray-300" onClick={toggleDropdown}>Sentence Generator</Link>
                  </div>
                </div>
              )}
        </nav>
        {children}
      </body>
    </html>
  );
}
