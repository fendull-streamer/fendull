import sqlite3
from sqlite3 import Error
import json
import datetime

DATABASE_FILE = "song_list.db"

def sanitize(s):
    return s.replace("'", "''")

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
        query = """CREATE TABLE IF NOT EXISTS songs (
            NAME TEXT NOT NULL,
            BY TEXT NOT NULL,
            LINK TEXT NOT NULL,
            TAGS TEXT NOT NULL,
            LAST_PLAYED INT
        );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()

        query = """CREATE TABLE IF NOT EXISTS requests (
            NAME TEXT NOT NULL,
            BY TEXT NOT NULL,
            LINK TEXT NOT NULL,
            REQUEST_BY TEXT NOT NULL,
            ADDED_AT INT NOT NULL,
            STATUS TEXT NOT NULL
            );"""
        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
        
    def add_song(self, name, by, link, tags):
        dt = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        query = """INSERT INTO songs 
            (NAME, BY, LINK, TAGS, LAST_PLAYED)
            VALUES ('{}', '{}', '{}', '{}', {});
        """.format(name.replace("'", "''"), by.replace("'", "''"), link.replace("'", "''"), json.dumps(tags), dt)

        c = self.conn.cursor()
        c.execute(query)
        self.conn.commit()
    
    def song_exists(self, name, by):
        query = """SELECT COUNT(*) FROM songs WHERE NAME = '{}' AND BY = '{}';""".format(name.replace("'", "''"), by.replace("'", "''"))
        return self.conn.cursor().execute(query).fetchone()[0] > 0
        
    def song_in_requests(self, name, by):
        query = """SELECT COUNT(*) FROM requests WHERE NAME = '{}' AND BY = '{}';""".format(name.replace("'", "''"), by.replace("'", "''"))
        return self.conn.cursor().execute(query).fetchone()[0] > 0
    

    def request_song(self, name, by, requester):
        STATUS = "queued"
        ADDED_AT = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        if not self.song_exists(name, by):
            return "DNE"

        if self.song_in_requests(name, by):
            return "SIR"
        
        query = """SELECT LINK FROM songs WHERE NAME = '{}' AND BY = '{}';""".format(name.replace("'", "''"), by.replace("'", "''"))
        link = self.conn.cursor().execute(query).fetchone()[0]

        query = """INSERT INTO requests (NAME, BY, LINK, REQUEST_BY, ADDED_AT, STATUS)
            VALUES ('{}', '{}', '{}', '{}', {}, '{}');
        """.format(sanitize(name), sanitize(by), sanitize(link), requester, ADDED_AT, STATUS)
        self.conn.cursor().execute(query)
        self.conn.commit()

        return "SRS"

    def finish_song(self):
        query = """DELETE FROM requests WHERE STATUS = 'playing'"""

        self.conn.cursor().execute(query)
        self.conn.commit()

    def delete_song(self, name, by):
        query = """DELETE FROM songs WHERE NAME = '{}' and BY = '{}'""".format(sanitize(name), sanitize(by))
        self.conn.cursor().execute(query)
        self.conn.commit()

    def play_song(self, name, by):
        if self.song_in_requests(name, by):
            query = """UPDATE requests SET STATUS = 'playing' WHERE NAME = '{}' AND BY = '{}';""".format(sanitize(name), sanitize(by))
            self.conn.cursor().execute(query)
            self.conn.commit()

            if self.song_exists(name, by):
                ts = int(datetime.datetime.now(datetime.timezone.utc).timestamp())

                query = """UPDATE songs SET LAST_PLAYED = {} WHERE NAME = '{}' AND BY = '{}';""".format(ts, sanitize(name), sanitize(by))
                self.conn.cursor().execute(query)
                self.conn.commit()
    
    def currently_playing(self):
        query = """SELECT * FROM requests WHERE STATUS = 'playing';"""
        
        data = self.conn.cursor().execute(query).fetchone()
        
        if data is None:
            return ""
        return list(data)
    
    def list_songs(self):
        query = """SELECT * FROM songs;"""
        result = self.conn.cursor().execute(query).fetchall()
        def fix_tags(row):
            row[3] = json.loads(row[3])
        return [fix_tags(list(row)) for row in result]

    def list_requests(self):
        query = """SELECT * FROM requests;"""
        return [list(row) for row in self.conn.cursor().execute(query).fetchall()]
