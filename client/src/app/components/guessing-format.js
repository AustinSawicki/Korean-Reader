import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../constants';

function GuessingFormat({ type }) {
    const [data, setData] = useState([{}]);
    const [inputValue, setInputValue] = useState('');
  
    const [audioSrc, setAudioSrc] = useState(API_URL + `/output.mp3?audioNum=0&type=number`);
    const [audioNum, setAudioNum] = useState(Math.random);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [showValue, setShowValue] = useState(false);
    const [error, setError] = useState(false); // Track if input has error
    const [isMounted, setIsMounted] = useState(false); // Don't play first audio, false when first audio
    const [showInfo, setShowInfo] = useState(false); // State to control modal visibility
  
    const [minValue, setMinValue] = useState(1);
    const [maxValue, setMaxValue] = useState(100);

    useEffect(() => {
      updateRange(false);
    }, [])

    useEffect(() => {
      fetchAudio();
    }, [data])
  
    useEffect(() => {
        if (audioSrc && isMounted) {
            handlePlay();
        } 
    }, [audioSrc]);
  
    const fetchText = async () => {
      let response;
      if(type === "number") {
         response = await fetch(API_URL + "/generate_number");
      }
      else if(type === "date") {
        response = await fetch(API_URL + "/generate_date");
      }
      const data = await response.json()
      
      setData(data)
    }

    const fetchAudio = async () => {
      setAudioNum(audioNum => audioNum+1);
      setAudioSrc(API_URL + `/output.mp3?audioNum=${audioNum}&type=${type === "number" ? "number" : "date"}`)
      console.log(audioSrc)
    }
  
  
    const audioRef = useRef(null); // Direct ref usage
    const handlePlay = () => {
      if (audioRef.current ) {
        audioRef.current.play();
      }
    };
  
    const handleInputChange = (e) => {
      let value = e.target.value;
      if (type === "number") {
        value = value.replace(/[^0-9]/g, '');
      }
      else if (type === "date") {
        value = value.replace(/[^0-9/]/g, '');
      }
      setInputValue(value);
      setError(false);
    };
  
    const handleKeyPress = async (e) => {
      if (e.key === 'Enter') {
        if(inputValue === data[`${type === "number" ? "text_data" : "date_data"}`]) {
          refresh()
          setCorrectGuesses(correctGuesses+1);
          setInputValue('')
        }
        else {
          console.log("Incorrect", inputValue);
          setError(true);
        }
      }
    };
  
    const toggleValue = () => {
      setShowValue(showValue => !showValue);
    }
  
    const refresh = async () => {
      setIsMounted(true);
      await fetchText()
    }
  
    const handleMinChange = (e) => {
      let value = parseInt(e.target.value);
      if (value < -10000) {
        value = -10000;
      }
      setMinValue(value);
      e.target.value = value;
      e.target.size = value.toString().length || 1;
    };
    
    const handleMaxChange = (e) => {
      let value = parseInt(e.target.value);
      if (value > 10000) {
        value = 10000;
      }
      setMaxValue(value);
      e.target.value = value;
      e.target.size = value.toString().length || 1;
    };
  
    const updateRange = async (withAudio) => {
      await fetch(API_URL + "/update-range", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ min: minValue, max: maxValue }),
      }).then(res => res.json()).then(data => {
        console.log(data);
      })

      console.log(withAudio)
      if(withAudio) {
        refresh()
      }
      else {
        fetchText()
      }
      
    };
  
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'r') {
          handlePlay();
        }
        if (e.key === 't') {
          toggleValue();
        }
        if (e.key === 'f') {
          refresh(true);
        }
      };
  
  
      document.addEventListener('keydown', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []); // Empty dependency array to run the effect only once on component mount
  
    
    const openInfoModal = () => {
      setShowInfo(true);
    };

    const closeInfoModal = () => {
      setShowInfo(false);
    };

    return (
      <>
        <div className="flex justify-center items-center min-h-screen pt-16">
          <div className="w-full max-w-lg bg-gray-100 rounded-lg p-8">
            <div className="absolute">
                        <button
                            onClick={openInfoModal}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <img src="https://i.pinimg.com/originals/51/cb/f8/51cbf8e6f6a7cc3bf91936f6676a20bc.png" alt="Info" className="h-10" />
                        </button>
            </div>
            <h1 className="text-3xl font-bold text-center">{type === "number" ? "Number Guesser" : "Date Guesser"}</h1>
            <h2 className="text-lg text-center mt-4">{type === "number" ? "Enter the number you hear." : "Enter the date you hear in MM/DD/YYYY format."}</h2>
            {showInfo && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                            {type === "number" ? 
                                ( <>
                                <h2 className="text-2xl font-bold mb-4">About Number Guesser</h2>
                                <p>This app helps you practice your number recognition skills. Listen to the number and type what you hear.</p>
                                <h3 className="text-lg font-bold mt-4">Shortcuts:</h3>
                                <ul className="list-disc list-inside">
                                    <li><strong>R:</strong> Replay the audio</li>
                                    <li><strong>T:</strong> Toggle number visibility</li>
                                    <li><strong>F:</strong> Generate a new number</li>
                                </ul>
                                </> ) :
                                (<> 
                                 <h2 className="text-2xl font-bold mb-4">About Date Guesser</h2>
                                 <p>This app tests your listening and comprehension ability for dates in Korean. Listen to the date and repeat it in the MM/DD/YYYY format.</p>
                                 <h3 className="text-lg font-bold mt-4">Shortcuts:</h3>
                                 <ul className="list-disc list-inside">
                                    <li><strong>R:</strong> Replay the audio</li>
                                    <li><strong>T:</strong> Toggle date visibility</li>
                                    <li><strong>F:</strong> Fetch a new date</li>
                                 </ul>
                                </>)
                            }

                            <button
                                onClick={closeInfoModal}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

            <div className="border border-gray-300 rounded-lg p-4 mt-8">
              {showValue && <p className="text-2xl font-bold flex items-center justify-center">{data[type === "number" ? "text_data" : "date_data"]}</p>}
            </div>
            <div className="flex mt-8">
              <audio ref={audioRef} src= {audioSrc} />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`flex-1 px-4 py-2 border rounded text-center ${error ? 'border-red-500' : ''}`}
              />
              <button onClick={handlePlay} className="flex-5 ml-2">
                <img src="https://winaero.com/blog/wp-content/uploads/2018/01/Music-mute-sound-volume-speaker-audio-player-icon-256-04.png" alt="Play" className="h-10" />
              </button>
            </div>
            {error && <p className=" mt-1 text-red-500 flex items-center justify-center">Incorrect</p>}

            {type === "number" && (
                <div className="mt-4">
                  <div className="flex ">
                    <input
                        type="number"
                        placeholder="min"
                        value={minValue}
                        onChange={handleMinChange}
                        size={minValue.toString().length || 1}
                        className="flex-1/3 px-4 py-2 border rounded text-center mr-2 w-1/2"
                    />
                    <input
                        type="number"
                        placeholder="max"
                        value={maxValue}
                        onChange={handleMaxChange}
                        size={maxValue.toString().length || 1}
                        className="flex-1/3 px-4 py-2 border rounded text-center mr-2 w-1/2"
                    />
                    <button onClick={updateRange} className="w-1/2 flex-1/3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        Update Range
                    </button>
                  </div>
                </div>
            )}

            <div className="flex justify-between mt-4">
              <button onClick={toggleValue} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-1">
                {type === "number" ? "Toggle Number" : "Toggle Number"}
              </button>
              <button onClick={refresh} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Refresh
              </button>
            </div>
            <p className="text-green-500 mt-4 flex items-center justify-center font-bold">Correct Guesses: {correctGuesses}</p>
          </div>
        </div>
      </>
    );
}

export default GuessingFormat;