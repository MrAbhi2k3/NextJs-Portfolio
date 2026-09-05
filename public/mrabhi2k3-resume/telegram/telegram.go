package telegram

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type BotClient struct {
	token      string
	httpClient *http.Client
}

type InlineKeyboardButton struct {
	Text string `json:"text"`
	URL  string `json:"url,omitempty"`
}

type InlineKeyboardMarkup struct {
	InlineKeyboard [][]InlineKeyboardButton `json:"inline_keyboard"`
}

type Message struct {
	MessageID int `json:"message_id"`
}

type APIResponse struct {
	OK          bool            `json:"ok"`
	Result      json.RawMessage `json:"result"`
	Description string          `json:"description,omitempty"`
}

type Update struct {
	UpdateID int `json:"update_id"`
	Message  *struct {
		MessageID int `json:"message_id"`
		Chat      struct {
			ID int64 `json:"id"`
		} `json:"chat"`
		From *struct {
			ID int64 `json:"id"`
		} `json:"from"`
		Text string `json:"text"`
	} `json:"message"`
}

type ProgressTracker func(uploaded, total int64, speed float64)

type countingReader struct {
	reader   io.Reader
	total    int64
	uploaded int64
	callback ProgressTracker
	lastTime time.Time
	lastUp   int64
}

func (cr *countingReader) Read(p []byte) (int, error) {
	n, err := cr.reader.Read(p)
	if n > 0 {
		cr.uploaded += int64(n)
		now := time.Now()
		diff := now.Sub(cr.lastTime).Seconds()
		if diff >= 2.5 || cr.uploaded == cr.total {
			speed := float64(cr.uploaded-cr.lastUp) / diff
			cr.lastTime = now
			cr.lastUp = cr.uploaded
			if cr.callback != nil {
				cr.callback(cr.uploaded, cr.total, speed)
			}
		}
	}
	return n, err
}

func NewBotClient(token string) *BotClient {
	return &BotClient{
		token: token,
		httpClient: &http.Client{
			Timeout: 45 * time.Minute,
			Transport: &http.Transport{
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 20,
			},
		},
	}
}

func (b *BotClient) SendMessage(chatID int64, text string, replyMarkup *InlineKeyboardMarkup) (*Message, error) {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", b.token)

	payload := map[string]interface{}{
		"chat_id":    chatID,
		"text":       text,
		"parse_mode": "HTML",
	}
	if replyMarkup != nil {
		payload["reply_markup"] = replyMarkup
	}

	body, _ := json.Marshal(payload)
	resp, err := b.httpClient.Post(apiURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var apiResp APIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}
	if !apiResp.OK {
		return nil, fmt.Errorf("telegram API error: %s", apiResp.Description)
	}

	var msg Message
	_ = json.Unmarshal(apiResp.Result, &msg)
	return &msg, nil
}

func (b *BotClient) EditMessageText(chatID int64, messageID int, text string) error {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/editMessageText", b.token)

	payload := map[string]interface{}{
		"chat_id":    chatID,
		"message_id": messageID,
		"text":       text,
		"parse_mode": "HTML",
	}

	body, _ := json.Marshal(payload)
	resp, err := b.httpClient.Post(apiURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

func (b *BotClient) DeleteMessage(chatID int64, messageID int) error {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/deleteMessage", b.token)
	payload := map[string]interface{}{
		"chat_id":    chatID,
		"message_id": messageID,
	}
	body, _ := json.Marshal(payload)
	resp, err := b.httpClient.Post(apiURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// SendDocument uploads a document with multipart streaming and live upload progress callback.
func (b *BotClient) SendDocument(chatID int64, filePath, caption string, thumbPath string, progress ProgressTracker) (*Message, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		return nil, err
	}
	fileSize := fi.Size()

	pr, pw := io.Pipe()
	mpWriter := multipart.NewWriter(pw)

	go func() {
		defer pw.Close()
		defer mpWriter.Close()

		_ = mpWriter.WriteField("chat_id", fmt.Sprintf("%d", chatID))
		_ = mpWriter.WriteField("caption", caption)
		_ = mpWriter.WriteField("parse_mode", "HTML")

		if thumbPath != "" {
			if tf, err := os.Open(thumbPath); err == nil {
				defer tf.Close()
				if tw, err := mpWriter.CreateFormFile("thumbnail", filepath.Base(thumbPath)); err == nil {
					_, _ = io.Copy(tw, tf)
				}
			}
		}

		part, err := mpWriter.CreateFormFile("document", filepath.Base(filePath))
		if err != nil {
			return
		}

		cr := &countingReader{
			reader:   file,
			total:    fileSize,
			callback: progress,
			lastTime: time.Now(),
		}
		_, _ = io.Copy(part, cr)
	}()

	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendDocument", b.token)
	req, err := http.NewRequest("POST", apiURL, pr)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", mpWriter.FormDataContentType())

	resp, err := b.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var apiResp APIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}
	if !apiResp.OK {
		return nil, fmt.Errorf("telegram API error: %s", apiResp.Description)
	}

	var msg Message
	_ = json.Unmarshal(apiResp.Result, &msg)
	return &msg, nil
}

func (b *BotClient) GetUpdates(offset int) ([]Update, error) {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/getUpdates?offset=%d&timeout=25", b.token, offset)
	resp, err := b.httpClient.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var apiResp struct {
		OK     bool     `json:"ok"`
		Result []Update `json:"result"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}
	return apiResp.Result, nil
}

func (b *BotClient) GetMe() (string, error) {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/getMe", b.token)
	resp, err := b.httpClient.Get(apiURL)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var apiResp struct {
		OK     bool `json:"ok"`
		Result struct {
			Username string `json:"username"`
		} `json:"result"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return "", err
	}
	return apiResp.Result.Username, nil
}
