from .functions import *
from flask import send_from_directory, request, current_app
import os 
import random
import logging
from dotenv import load_dotenv
from openai import AsyncOpenAI
import asyncio

app = current_app

load_dotenv()

text_block = [0]
start, end = [1], [100]

client = AsyncOpenAI(
  api_key = os.getenv('OPENAI_API_KEY'),
  organization = os.getenv('OPENAI_ORGANIZATION'),
  project = os.getenv('OPENAI_PROJECT'),
)

@app.route("/generate_number", methods=['GET'])
def get_number():
    text_block[0] = str(random.randint(start[0], end[0]))
    return {"text_data": text_block[0]}


@app.route("/generate_date", methods=['GET'])
def get_date():
    text_block[0] = generate_date()
    return {"date_data": text_block[0]}

@app.route('/output.mp3')
def get_mp3():
    generate_mp3(text_block)

    logging.debug(f"Serving MP3 from: {app.root_path}")
    return send_from_directory(app.root_path, 'output.mp3')

@app.route('/get-sentence', methods=['GET'])
async def get_sentence():
    definition = request.args.get('def')
    word = request.args.get('word')
    sens = request.args.get('sens')
    sentences = await generate_sentence(client, definition, word, sens)

    return {"sentences": sentences}

@app.route('/get-definition', methods=['GET'])
async def get_definition():
    word = request.args.get('word')
    definition = await generate_definition(client, word)

    return {"def": definition}

@app.route('/update-range', methods=['POST'])
def update_range():
    data = request.json
    start[0] = int(data.get('min'))
    end[0] = int(data.get('max'))
    return {"message": "Range updated", "start": start[0], "end": end[0]}



