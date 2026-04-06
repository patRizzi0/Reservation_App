from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy import text


app = Flask(__name__)
engine = create_engine("postgresql://postgres:fortnite1211@localhost:5432/reservation_app")
