import sqlite3
from sqlite3 import Error
import json
import datetime

DATABASE_FILE = "challenges.db"

class DataInterface:
    def __init__(self):
        self.is_connected = False
        try:
            self.conn = sqlite3.connect(DATABASE_FILE)
            self.is_connected = True
            self.create_db()
        except Exception as e:
            print(e)

    
    def create_db(self):
        query = """CREATE TABLE IF NOT EXISTS challenges (
            NAME TEXT NOT NULL,
            POINTS INT NOT NULL,
            PATH TEXT NOT NULL
        );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        

        query = """CREATE TABLE IF NOT EXISTS users (
            USERNAME TEXT NOT NULL,
            POINTS INTEGER NOT NULL
        );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()

        query = """CREATE TABLE IF NOT EXISTS challenge_completed (
            USERNAME TEXT NOT NULL,
            CHALLENGENAME TEXT NOT NULL,
            DATE INT NOT NULL
        );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()

    def list_challenges(self):
        query = """SELECT * FROM challenges"""
        c = self.conn.cursor().execute(query).fetchall()
        print(c)

        return [list(item) for item in c]

    def add_challenge(self, name, points, path):
        query = """INSERT INTO challenges (NAME, POINTS, PATH) VALUES ('{}', {}, '{}');""".format(name, points, path)
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
    