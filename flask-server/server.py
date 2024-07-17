from flask import Flask
from flask_cors import CORS
from flask_app import create_app
import os 


app = create_app()
CORS(app)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT")), use_reloader=True)