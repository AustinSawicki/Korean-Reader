This is a [Next.js] and [Flask] Project.

```bash
First, run the client from the client folder:

npm run dev

Second, run the server from the flask-server folder:

python ./server.py
```

This app is used to help Korean learners with their listening and comprehension abilities. There are three components to the app.

1. Number Guesser
    The number guesser produces a random number and the user must guess this number based purely off audio of the number being read out. The number will start from a range from 1-100. The user can edit this range as desired. The minimum and maximum that the user can set being -10,000 - 10,000.

    After entering the number into the input field, after hitting enter, if the number is correct the 'Correct Guesses' counter will go up by one and a new number will be generated.

2. Date Guesser.
    The date guesser produces a random date and the user must guess this date based purely off audio of the number being read out. The user must enter the date through the format of MM/DD/YYYY. The range is between 1/1/1500 - present. 


    There are three actions the user can do in the number and date guesser. Replay the audio, toggle the view of the number, and generate a new value. The shortcuts being:

        R: Replay the audio
        T: Toggle value visibility
        F: Generate a new value


3. Sentence Generator
    The sentence generator produces example sentences based off a word given by the user through the OpenAI API. The amount of sentences generated is based off what the user inputs, starting at ten. The max amount of sentences that can be generated at one time is thirty.

    A definition of the word will also be generated and shown to the user under the word input box. In the case of synonyms or and error from the OpenAI API, the user can directly type in the definition of the word and regenerate the example sentences.
    
    Click on any sentence to hear an AI voice readout the text.
