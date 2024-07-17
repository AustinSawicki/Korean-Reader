from flask import request, current_app
import os 
import random
from google.cloud import texttospeech
from dotenv import load_dotenv
import logging
import asyncio
import openai

app = current_app


def days_in_month(year, month):
    # A simple function to determine the number of days in a given month and year
    month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if month == 2 and year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
        return 29  # Leap year
    return month_days[month - 1]


def generate_mp3(text_block):
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'gcp-text-to-speech-key.json'
    print(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
    client = texttospeech.TextToSpeechClient()
    
    type_param = request.args.get('type')
    sentence = request.args.get('sentence')

    if type_param == 'number':
        synthesis_input = texttospeech.SynthesisInput(text=text_block[0])
    elif type_param == 'date':
        synthesis_input = texttospeech.SynthesisInput(text=text_block[0])
    elif type_param == 'sentence' and sentence:
        synthesis_input = texttospeech.SynthesisInput(text=sentence)
    else:
        return {'error': 'Invalid type parameter or missing sentence'}, 400

    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        name="ko-KR-Neural2-C"
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding = texttospeech.AudioEncoding.MP3,
        effects_profile_id = ['small-bluetooth-speaker-class-device'],
        speaking_rate=1,
        pitch=1
    )

    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )

    output_path = os.path.join(app.root_path, "output.mp3")
    logging.debug(f"Output path for MP3: {output_path}")

    with open(output_path, "wb") as output:
        output.write(response.audio_content)

    logging.debug("MP3 file created successfully")

def generate_date():
    month = random.randint(1, 12)
    year = random.randint(1500, 2024)
    max_day = days_in_month(year, month)
    day = random.randint(1, max_day)

    return f"{month}/{day}/{year}"

async def generate_sentence(client, definition, word, num_sentences):
    try:
        prompt = f"'{definition}'의 의미를 가진 단어 '{word}'가 들어간 예문을 '{num_sentences}' 개, {word}의 의미를 이해할수록, 생성해 주세요."
        sentences = []
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )

        sentence = ""
        async for chunk in response:
           if chunk.choices and chunk.choices[0].delta.content:
               sentence += chunk.choices[0].delta.content
               if '\n' in chunk.choices[0].delta.content:
                   sentences.append(sentence)
                   sentence = ""
        
        if sentence:
            sentences.append(sentence)

        return sentences
    except Exception as error:
        print("Error generating sentences:", error)
        return []

async def generate_definition(client, word):
    try:
        prompt = f"한국어로는 '{word}'를 간단하게 한 문장으로 정의해줘."

        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        definition = response.choices[0].message.content or ""

        return definition
    except Exception as error:
        print("Error generating word definition:", error)
        return 'Error generating definition. Please try again later.'