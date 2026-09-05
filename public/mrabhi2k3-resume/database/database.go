package database

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	_ "modernc.org/sqlite"
)

type Database struct {
	useMongo    bool
	mongoClient *mongo.Client
	collection  *mongo.Collection
	fileColl    *mongo.Collection
	sqliteDB    *sql.DB
}

type FileStoreRecord struct {
	Title     string                 `json:"title"`
	Qualities map[string]interface{} `json:"qualities"`
}

func NewDatabase(mongoSRV string) *Database {
	db := &Database{}

	if mongoSRV != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		client, err := mongo.Connect(options.Client().ApplyURI(mongoSRV))
		if err == nil {
			if pingErr := client.Ping(ctx, nil); pingErr == nil {
				db.mongoClient = client
				mDB := client.Database("asianscraper")
				db.collection = mDB.Collection("posted_items")
				db.fileColl = mDB.Collection("file_store")
				db.useMongo = true
			}
		}
	}

	if !db.useMongo {
		sDB, err := sql.Open("sqlite", "dramas.db")
		if err == nil {
			db.sqliteDB = sDB
			db.initSQLite()
		}
	}

	return db
}

func (db *Database) initSQLite() {
	if db.sqliteDB == nil {
		return
	}
	_, _ = db.sqliteDB.Exec(`
		CREATE TABLE IF NOT EXISTS posted_items (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			item_url TEXT UNIQUE,
			title TEXT,
			posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS file_store (
			id TEXT PRIMARY KEY,
			title TEXT,
			qualities TEXT
		);
	`)
}

func (db *Database) IsPosted(itemURL string) bool {
	if db.useMongo {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		var res bson.M
		err := db.collection.FindOne(ctx, bson.M{"item_url": itemURL}).Decode(&res)
		return err == nil
	}

	if db.sqliteDB != nil {
		var exists int
		err := db.sqliteDB.QueryRow("SELECT 1 FROM posted_items WHERE item_url = ?", itemURL).Scan(&exists)
		return err == nil
	}
	return false
}

func (db *Database) MarkPosted(itemURL, title string) {
	if db.useMongo {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		opts := options.UpdateOne().SetUpsert(true)
		_, _ = db.collection.UpdateOne(ctx,
			bson.M{"item_url": itemURL},
			bson.M{"$set": bson.M{"item_url": itemURL, "title": title}},
			opts,
		)
		return
	}

	if db.sqliteDB != nil {
		_, _ = db.sqliteDB.Exec("INSERT OR IGNORE INTO posted_items (item_url, title) VALUES (?, ?)", itemURL, title)
	}
}

func (db *Database) SaveFileQualities(fileID, title string, qualities map[string]interface{}) {
	if db.useMongo {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		opts := options.UpdateOne().SetUpsert(true)
		_, _ = db.fileColl.UpdateOne(ctx,
			bson.M{"_id": fileID},
			bson.M{"$set": bson.M{"title": title, "qualities": qualities}},
			opts,
		)
		return
	}

	if db.sqliteDB != nil {
		b, _ := json.Marshal(qualities)
		_, _ = db.sqliteDB.Exec("INSERT OR REPLACE INTO file_store (id, title, qualities) VALUES (?, ?, ?)", fileID, title, string(b))
	}
}

func (db *Database) GetFileQualities(fileID string) *FileStoreRecord {
	if db.useMongo {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()
		var res bson.M
		err := db.fileColl.FindOne(ctx, bson.M{"_id": fileID}).Decode(&res)
		if err == nil {
			rec := &FileStoreRecord{
				Title:     "",
				Qualities: make(map[string]interface{}),
			}
			if t, ok := res["title"].(string); ok {
				rec.Title = t
			}
			if q, ok := res["qualities"].(bson.M); ok {
				for k, v := range q {
					rec.Qualities[k] = v
				}
			}
			return rec
		}
		return nil
	}

	if db.sqliteDB != nil {
		var title, qStr string
		err := db.sqliteDB.QueryRow("SELECT title, qualities FROM file_store WHERE id = ?", fileID).Scan(&title, &qStr)
		if err == nil {
			rec := &FileStoreRecord{
				Title:     title,
				Qualities: make(map[string]interface{}),
			}
			_ = json.Unmarshal([]byte(qStr), &rec.Qualities)
			return rec
		}
	}

	return nil
}
