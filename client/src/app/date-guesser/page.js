// pages/dateguesser/index.js
"use client"
import React, { useState, useEffect, useRef } from 'react';
import GuessingFormat from '../components/guessing-format';

function DateGuesser() {
  return <GuessingFormat type = "date"/>;
}


export default DateGuesser;