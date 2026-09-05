# Author: MrAbhi2k3
# GitHub: https://github.com/MrAbhi2k3
#
# This file is part of the AutoAnime distribution.
#    Copyright (c) 2026 TeleroidGroup
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, version 3.
#
#    This program is distributed in the hope that it will be useful, but
#    WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
#    General Public License for more details.
#
# License can be found in <
# https://github.com/TeleroidGroup/AutoAnimeBot/blob/main/LICENSE > .
#
# if you are using this following code then don't forgot to give proper
# credit to t.me/TeleroidGroup (github.com/TeleroidGroup)



from pymongo import MongoClient
import sqlite3
import json

class Database:
    def __init__(self, mongo_srv):
        self.mongo_srv = mongo_srv
        if self.mongo_srv:
            try:
                self.client = MongoClient(self.mongo_srv)
                self.db = self.client["asianscraper"]
                self.collection = self.db["posted_items"]
                self.file_collection = self.db["file_store"]
                self.use_mongo = True
            except Exception:
                self.use_mongo = False
        else:
            self.use_mongo = False

        if not self.use_mongo:
            self.sqlite_path = "dramas.db"
            self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(self.sqlite_path)
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS posted_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_url TEXT UNIQUE,
                title TEXT,
                posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS file_store (
                id TEXT PRIMARY KEY,
                title TEXT,
                qualities TEXT
            )
            """
        )
        conn.commit()
        conn.close()

    def is_posted(self, item_url):
        if self.use_mongo:
            res = self.collection.find_one({"item_url": item_url})
            return res is not None
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM posted_items WHERE item_url = ?", (item_url,))
            res = cursor.fetchone()
            conn.close()
            return res is not None

    def mark_posted(self, item_url, title):
        if self.use_mongo:
            self.collection.update_one(
                {"item_url": item_url},
                {"$set": {"item_url": item_url, "title": title}},
                upsert=True
            )
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            try:
                cursor.execute(
                    "INSERT INTO posted_items (item_url, title) VALUES (?, ?)",
                    (item_url, title),
                )
                conn.commit()
            except sqlite3.IntegrityError:
                pass
            conn.close()

    def save_file_qualities(self, file_id, title, qualities):
        if self.use_mongo:
            self.file_collection.update_one(
                {"_id": file_id},
                {"$set": {"title": title, "qualities": qualities}},
                upsert=True
            )
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            qualities_str = json.dumps(qualities)
            try:
                cursor.execute(
                    "INSERT OR REPLACE INTO file_store (id, title, qualities) VALUES (?, ?, ?)",
                    (file_id, title, qualities_str)
                )
                conn.commit()
            except sqlite3.Error:
                pass
            conn.close()

    def get_file_qualities(self, file_id):
        if self.use_mongo:
            res = self.file_collection.find_one({"_id": file_id})
            if res:
                return {"title": res.get("title", ""), "qualities": res.get("qualities", {})}
            return None
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute("SELECT title, qualities FROM file_store WHERE id = ?", (file_id,))
            res = cursor.fetchone()
            conn.close()
            if res:
                try:
                    qualities = json.loads(res[1])
                except Exception:
                    qualities = {}
                return {"title": res[0], "qualities": qualities}
            return None
