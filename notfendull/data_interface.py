import sqlite3
from sqlite3 import Error
import json
import datetime

DATABASE_FILE = "commands.db"

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
        query = """CREATE TABLE IF NOT EXISTS commands (
            NAME TEXT NOT NULL,
            RESPONSE TEXT NOT NULL
        );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        
    def get_response(self, command):
        query = """SELECT RESPONSE FROM commands WHERE NAME = '{}'""".format(command.replace("'", "''"))
        c = self.conn.cursor().execute(query).fetchall()

        if len(c) > 0:
            return c[0][0]

        else:
            return None

    def add_command(self, command, response):
        if not self.get_response(command) is None:
            return False
        query = """INSERT INTO commands (NAME, RESPONSE) VALUES ('{}', '{}');""".format(command.replace("'", "''"), response.replace("'", "''"))
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        return True
    
    def delete_command(self, command):
        if self.get_response(command) is None:
            return False

        query = """DELETE FROM commands WHERE NAME = '{}'""".format(command.replace("'", "''"))
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        return True

    def edit_command(self, command, response):
        if self.get_response(command) is None:
            return False

        query = """UPDATE commands SET RESPONSE = '{}' WHERE NAME = '{}'""".format(response.replace("'", "''"), command.replace("'", "''"))
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        return True
