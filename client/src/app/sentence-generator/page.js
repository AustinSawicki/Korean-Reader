// pages/sentence-generator/index.js
"use client";
import React, { useState, useEffect, useRef  } from 'react';
import OpenAI from "openai";
import { API_URL } from '../constants';


export default function SentenceGenerator() {
  const [word, setWord] = useState('');
  const [numSentences, setNumSentences] = useState(10); // Default to 10 sentences
  const [sentences, setSentences] = useState([]);
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [correctedDefinition, setCorrectedDefinition] = useState('');
  const [needDefinition, setneedDefinition] = useState(true);

  const [audioSrc, setAudioSrc] = useState(API_URL + "/output.mp3?type=sentence&sentence=");
  const [isMounted, setIsMounted] = useState(false);

  
  useEffect(() => {
    if (audioSrc && isMounted) {
        handlePlay();
    }
  }, [audioSrc]);

  const handleWordChange = (event) => {
    setWord(event.target.value);
    setneedDefinition(true);
    setError('');
  };

  const handleNumSentencesChange = (event) => {
    const num = parseInt(event.target.value, 10);
    if (!isNaN(num) && num >= 1 && num <= 30) {
      setNumSentences(num);
      setError('');
    } else {
      setError('Number of sentences must be between 1 and 30.');
    }
  };

  const handleCorrectedDefinitionChange = (event) => {
    setCorrectedDefinition(event.target.value);
    setneedDefinition(false)
  };


  const generateSentence = async () => {
    if (!word) {
      setError('Please enter a word.');
    }
    else {
      setIsLoading(true);
      try {
        let def; // getting definition first then setting it

        if (needDefinition) {
          const response = await fetch(`${API_URL}/get-definition?word=${word}`);
          const data = await response.json();
          def = data.def;

          setneedDefinition(false);
        }
        else if (correctedDefinition) {
          def = correctedDefinition;
          setCorrectedDefinition('');
        }
        else {
          def = definition;
        }

        setDefinition(def);

        const response = await fetch(`${API_URL}/get-sentence?def=${def}&word=${word}&sens=${numSentences}`);
        const data = await response.json();
        setSentences(data.sentences);
      } catch (error) {
        console.error("Error generating sentences:", error);
        setError('Error generating sentences. Please try again.');
      } finally {
        setIsLoading(false); // Set loading to false after fetching is complete
      }
    }
  };

  const audioRef = useRef(null); // Direct ref usage
  const handlePlay = () => {
    if (audioRef.current ) {
      audioRef.current.play();
    }
  };

  const handleSentenceClick = async (sentence) => {
    try {
      await fetch(API_URL + `/output.mp3?type=sentence&sentence=${sentence}`);
      setAudioSrc(API_URL + `/output.mp3?type=sentence&sentence=${sentence}`)
      setIsMounted(true);
      handlePlay();
    } catch (error) {
      console.error("Error generating audio file:", error);
    }
  };


  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      generateSentence();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center pt-20 overflow-auto">
      <h1 className="text-3xl font-bold mb-4">Sentence Generator</h1>
      <audio ref={audioRef} src= {audioSrc} />
      <div className="mb-4">
        <div className="relative flex items-center">
          <label htmlFor="wordInput" className="mr-2">Word:</label>
          <input
            id="wordInput"
            type="text"
            value={word}
            onChange={handleWordChange}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 px-2 py-1 rounded"
          />
          {isLoading && (
            <img
              src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
              alt="Loading..."
              className="right-0 mr-2 h-6 ml-2"
            />
          )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {definition && (
        <div className="mb-4">
          <p onClick={() => handleSentenceClick(definition)} style={{ cursor: 'pointer' }}><strong>Definition</strong>: {definition}</p>
          <div className="mt-2">
            <label htmlFor="correctedDefinitionInput" className="mr-2">Definition not right? Enter the correct definition:</label>
            <input
              id="correctedDefinitionInput"
              type="text"
              value={correctedDefinition}
              onChange={handleCorrectedDefinitionChange}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 px-2 py-1 rounded"
            />
          </div>
        </div>
      )}
          
      <div className="mb-4 mt-2">
        <label htmlFor="numSentencesInput" className="mr-2">Number of Sentences (1-30):</label>
        <input
          id="numSentencesInput"
          type="number"
          min="1"
          max="30"
          value={numSentences}
          onChange={handleNumSentencesChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 px-2 py-1 rounded"
        />
      </div>

      <button
        onClick={generateSentence}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4">
        Generate Sentences
      </button>

      {sentences.length > 0 && (
        <div className="text-xl">
          <h1 className="font-bold">Generated Sentences:</h1>
          <br />
          <div className="pl-4">
            {sentences.map((sentence, index) => (
              <React.Fragment key={index}>
                <p onClick={() => handleSentenceClick(sentence)} style={{ cursor: 'pointer' }}>{sentence}</p>
                {index !== sentences.length - 1 && <br />} {/* Add <br /> except after the last sentence */}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}