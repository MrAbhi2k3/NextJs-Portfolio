package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	APIID              int
	APIHash            string
	BotToken           string
	ChannelID          int64
	LogChannel         int64
	BackupChannel      int64
	ForceSubChannel    int64
	ForceSubLink       string
	EnableForceSub     bool
	PostToChannel      bool
	AutoScrape         bool
	CloudflareBaseURL  string
	ButtonUpload       bool
	CheckInterval      int
	MongoSRV           string
}

func parseBool(val string, defaultVal bool) bool {
	if val == "" {
		return defaultVal
	}
	val = strings.ToLower(strings.TrimSpace(val))
	return val == "true" || val == "1" || val == "yes"
}

func parseInt64(val string, defaultVal int64) int64 {
	if val == "" {
		return defaultVal
	}
	n, err := strconv.ParseInt(strings.TrimSpace(val), 10, 64)
	if err != nil {
		return defaultVal
	}
	return n
}

func parseInt(val string, defaultVal int) int {
	if val == "" {
		return defaultVal
	}
	n, err := strconv.Atoi(strings.TrimSpace(val))
	if err != nil {
		return defaultVal
	}
	return n
}

func Load() *Config {
	_ = godotenv.Load()

	return &Config{
		APIID:             parseInt(os.Getenv("API_ID"), 20389440),
		APIHash:           os.Getenv("API_HASH"),
		BotToken:          os.Getenv("BOT_TOKEN"),
		ChannelID:         parseInt64(os.Getenv("CHANNEL_ID"), 0),
		LogChannel:        parseInt64(os.Getenv("LOG_CHANNEL"), 0),
		BackupChannel:     parseInt64(os.Getenv("BACKUP_CHANNEL"), 0),
		ForceSubChannel:   parseInt64(os.Getenv("FORCESUB_CHANNEL"), 0),
		ForceSubLink:      os.Getenv("FORCESUB_CHANNEL_LINK"),
		EnableForceSub:    parseBool(os.Getenv("ENABLE_FORCESUB"), false),
		PostToChannel:     parseBool(os.Getenv("POST_TO_CHANNEL"), false),
		AutoScrape:        parseBool(os.Getenv("AUTO_SCRAPE"), false),
		CloudflareBaseURL: os.Getenv("CLOUDFLARE_BASE_URL"),
		ButtonUpload:      parseBool(os.Getenv("BUTTON_UPLOAD"), true),
		CheckInterval:     parseInt(os.Getenv("CHECK_INTERVAL"), 600),
		MongoSRV:          os.Getenv("MONGO_SRV"),
	}
}
