package main

import (
	"context"
	"crypto/md5"
	"fmt"
	"log"
	"math"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"

	"asianscraper/config"
	"asianscraper/database"
	"asianscraper/downloader"
	"asianscraper/muxer"
	"asianscraper/scrapers"

	tg "github.com/amarnathcjd/gogram/telegram"
)

var (
	cfg        *config.Config
	db         *database.Database
	client     *tg.Client
	dl         *downloader.Downloader
	botUser    string
	kissScrape *scrapers.KissasiaScraper
	keyScrape  *scrapers.DramakeyScraper
	coolScrape *scrapers.DramacoolScraper
	jobLock    sync.Mutex
	activeJobs = make(map[string]bool)
)

func formatETA(seconds float64) string {
	if seconds <= 0 || math.IsInf(seconds, 0) || math.IsNaN(seconds) {
		return "--:--"
	}
	sec := int(seconds)
	m := (sec % 3600) / 60
	s := sec % 60
	h := sec / 3600
	if h > 0 {
		return fmt.Sprintf("%02d:%02d:%02d", h, m, s)
	}
	return fmt.Sprintf("%02d:%02d", m, s)
}

func getProgressBar(actionTitle, showTitle string, epNum int, fileName string, current, total int64, speed float64) string {
	curMB := float64(current) / 1024.0 / 1024.0
	speedMB := speed / 1024.0 / 1024.0
	speedText := fmt.Sprintf("%.2f MB/s", speedMB)
	if speedMB < 0.05 {
		speedText = fmt.Sprintf("%.1f KB/s", speed/1024.0)
	}

	cleanShow := scrapers.StripTitleExtras(showTitle)
	if cleanShow == "" {
		cleanShow = "AsianDrama"
	}

	if total <= 0 {
		return fmt.Sprintf("<blockquote>🎬 <b>%s (Episode %02d)</b></blockquote>\n\n%s\n📁 <b>File:</b> <code>%s</code>\n📦 <b>Transferred:</b> <code>%.1f MB</code>\n⚡ <b>Speed:</b> <code>%s</code>",
			cleanShow, epNum, actionTitle, fileName, curMB, speedText)
	}

	percentage := (float64(current) / float64(total)) * 100.0
	completed := int(percentage / 10.0)
	if completed < 0 {
		completed = 0
	}
	if completed > 10 {
		completed = 10
	}
	bar := strings.Repeat("■", completed) + strings.Repeat("□", 10-completed)
	totMB := float64(total) / 1024.0 / 1024.0

	remainingBytes := total - current
	etaSec := 0.0
	if speed > 0 {
		etaSec = float64(remainingBytes) / speed
	}

	return fmt.Sprintf("<blockquote>🎬 <b>%s (Episode %02d)</b></blockquote>\n\n%s\n📁 <b>File:</b> <code>%s</code>\n[%s] %.1f%%\n⚡ <b>Speed:</b> <code>%s</code> | ⏳ <b>ETA:</b> <code>%s</code>\n📦 <b>Progress:</b> <code>%.1f MB / %.1f MB</code>",
		cleanShow, epNum, actionTitle, fileName, bar, percentage, speedText, formatETA(etaSec), curMB, totMB)
}

func cleanFilename(origName, showTitle string, epNum int, quality string) string {
	ext := ".mkv"
	if origName != "" {
		n := strings.Split(strings.Split(origName, "?")[0], "#")[0]
		foundExt := strings.ToLower(filepath.Ext(n))
		if foundExt == ".mp4" || foundExt == ".mkv" || foundExt == ".webm" {
			ext = foundExt
		}
	}
	cleanShow := scrapers.StripTitleExtras(showTitle)
	if cleanShow == "" {
		cleanShow = "AsianDrama"
	}
	return fmt.Sprintf("%s Episode %02d [%s] [@KDramazFlix]%s", cleanShow, epNum, quality, ext)
}

func buildEpisodeCaption(showTitle string, epNum int, quality string, subtitles string) string {
	cleanShow := scrapers.StripTitleExtras(showTitle)
	if cleanShow == "" {
		cleanShow = "AsianDrama"
	}
	subLine := ""
	if subtitles != "" {
		subLine = fmt.Sprintf("\n🌐 <b>Subtitles:</b> <code>%s</code>", subtitles)
	}
	return fmt.Sprintf("<blockquote>🎬 <b>%s</b></blockquote>\n\n📺 <b>Episode:</b> <code>%02d</code>\n💿 <b>Quality:</b> <code>%s</code>%s\n\n⚡ <b>Uploaded by:</b> @MoviesFlixers_DL",
		cleanShow, epNum, quality, subLine)
}

func downloadAndUpload(item *scrapers.EpisodeItem, quality, directURL, showTitle string, epNum int) (int32, error) {
	if strings.Contains(directURL, "downloadwella.com") {
		resolved := scrapers.ResolveDownloadWellaLink(directURL)
		if resolved != "" {
			directURL = resolved
		}
	}

	uParts := strings.Split(strings.Split(directURL, "?")[0], "/")
	origName := ""
	if len(uParts) > 0 {
		origName = uParts[len(uParts)-1]
	}

	localFileName := cleanFilename(origName, showTitle, epNum, quality)
	downloadTarget := localFileName

	defer func() {
		for _, f := range []string{localFileName, downloadTarget} {
			if f != "" {
				_ = os.Remove(f)
			}
		}
	}()

	logChatID := cfg.LogChannel
	if logChatID == 0 {
		logChatID = cfg.ChannelID
	}

	var logMsg *tg.NewMessage
	if logChatID != 0 {
		logMsg, _ = client.SendMessage(logChatID, fmt.Sprintf("🚀 <b>Initializing download...</b>\n\n📁 <b>File:</b> <code>%s</code>", localFileName), &tg.SendOptions{ParseMode: "html"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Hour)
	defer cancel()

	var lastEdit time.Time
	progressCB := func(current, total int64, speed float64) {
		if logMsg == nil || logChatID == 0 {
			return
		}
		if time.Since(lastEdit) >= 3*time.Second || (total > 0 && current == total) {
			lastEdit = time.Now()
			text := getProgressBar("📥 <b>Downloading from Server...</b>", showTitle, epNum, localFileName, current, total, speed)
			_, _ = logMsg.Edit(text, &tg.SendOptions{ParseMode: "html"})
		}
	}

	log.Printf("Starting download for: %s (Ep %02d)", localFileName, epNum)
	err := dl.DownloadFile(ctx, directURL, downloadTarget, progressCB)
	if err != nil {
		if logMsg != nil && logChatID != 0 {
			_, _ = logMsg.Edit(fmt.Sprintf("❌ <b>Download Failed:</b> %v", err), &tg.SendOptions{ParseMode: "html"})
		}
		return 0, err
	}

	// Subtitle muxing
	if len(item.SubURLs) > 0 {
		if logMsg != nil && logChatID != 0 {
			_, _ = logMsg.Edit(fmt.Sprintf("🔄 <b>Muxing Subtitles into Episode...</b>\n\n📁 <b>File:</b> <code>%s</code>\n🌐 <b>Subtitles:</b> <code>%s</code>", localFileName, item.Subtitles), &tg.SendOptions{ParseMode: "html"})
		}
		muxedFile, mErr := muxer.MuxSubtitles(ctx, downloadTarget, item.SubURLs, item.Subtitles)
		if mErr == nil && muxedFile != "" {
			localFileName = muxedFile
		}
	}

	log.Printf("Uploading %s via MTProto 2GB protocol to Telegram Log Channel...", localFileName)
	var lastUpEdit time.Time
	upProgressCB := func(pi *tg.ProgressInfo) {
		if logMsg == nil || logChatID == 0 {
			return
		}
		if time.Since(lastUpEdit) >= 3*time.Second || (pi.TotalSize > 0 && pi.Current == pi.TotalSize) {
			lastUpEdit = time.Now()
			text := getProgressBar("📤 <b>Uploading via MTProto to Telegram...</b>", showTitle, epNum, localFileName, pi.Current, pi.TotalSize, pi.CurrentSpeed)
			_, _ = logMsg.Edit(text, &tg.SendOptions{ParseMode: "html"})
		}
	}

	caption := buildEpisodeCaption(showTitle, epNum, quality, item.Subtitles)
	thumbPath := ""
	for _, cand := range []string{"bot/logo.png", "logo.png", "python_bot/bot/logo.png"} {
		if _, err := os.Stat(cand); err == nil {
			thumbPath = cand
			break
		}
	}

	mediaOpts := &tg.MediaOptions{
		Caption:       caption,
		ParseMode:     "html",
		ForceDocument: true,
		Upload: &tg.UploadOptions{
			Threads:          8,
			ProgressCallback: upProgressCB,
			ProgressInterval: 2,
		},
	}
	if thumbPath != "" {
		mediaOpts.Thumb = thumbPath
	}

	uploadedMsg, err := client.SendMedia(logChatID, localFileName, mediaOpts)
	if err != nil {
		if logMsg != nil && logChatID != 0 {
			_, _ = logMsg.Edit(fmt.Sprintf("❌ <b>Upload Failed:</b> %v", err), &tg.SendOptions{ParseMode: "html"})
		}
		return 0, err
	}

	if logMsg != nil && logChatID != 0 {
		_, _ = logMsg.Edit(fmt.Sprintf("✅ <b>Successfully Processed!</b>\n\n📁 <b>File:</b> <code>%s</code>\n<b>Status:</b> Uploaded", localFileName), &tg.SendOptions{ParseMode: "html"})
	}

	return uploadedMsg.ID, nil
}

func processEpisodes(items []*scrapers.EpisodeItem, showURL string, manualChatID int64) {
	jobLock.Lock()
	defer jobLock.Unlock()

	defer func() {
		jobLock.Lock()
		delete(activeJobs, showURL)
		jobLock.Unlock()
	}()

	if len(items) == 0 {
		if manualChatID != 0 {
			_, _ = client.SendMessage(manualChatID, "No downloadable episode links found for this URL.", &tg.SendOptions{ParseMode: "html"})
		}
		return
	}

	sort.Slice(items, func(i, j int) bool {
		return scrapers.ExtractEpisodeNumber(items[i].Title) < scrapers.ExtractEpisodeNumber(items[j].Title)
	})

	showTitle := scrapers.StripTitleExtras(strings.Split(items[0].Title, " - ")[0])
	showID := fmt.Sprintf("%x", md5.Sum([]byte(showURL)))[:16]

	existing := db.GetFileQualities(showID)
	qualities := make(map[string]interface{})
	alreadyUploaded := make(map[int]bool)

	if existing != nil {
		qualities = existing.Qualities
		if showTitle == "" && existing.Title != "" {
			showTitle = existing.Title
		}
		for _, v := range qualities {
			if list, ok := v.([]interface{}); ok {
				for _, entry := range list {
					if m, ok := entry.(map[string]interface{}); ok {
						if epFloat, ok := m["episode"].(float64); ok {
							alreadyUploaded[int(epFloat)] = true
						}
					}
				}
			}
		}
	}

	if manualChatID != 0 {
		_, _ = client.SendMessage(manualChatID, fmt.Sprintf("<blockquote>🎬 <b>Processing show:</b> <code>%s</code>\nFound %d episode(s). Processing strictly in order...</blockquote>", showTitle, len(items)), &tg.SendOptions{ParseMode: "html"})
	}

	for _, epItem := range items {
		epNum := scrapers.ExtractEpisodeNumber(epItem.Title)
		if alreadyUploaded[epNum] {
			log.Printf("Skipping already uploaded: %s Ep %02d", showTitle, epNum)
			continue
		}

		log.Printf("Processing Episode %02d. Must complete before starting next.", epNum)
		var msgID int32
		var err error

		for attempt := 1; attempt <= 2; attempt++ {
			qURL := epItem.Qualities["720p"]
			if qURL == "" {
				for _, u := range epItem.Qualities {
					qURL = u
					break
				}
			}
			msgID, err = downloadAndUpload(epItem, "720p", qURL, showTitle, epNum)
			if err == nil && msgID != 0 {
				break
			}
			log.Printf("Attempt %d failed for Ep %02d: %v. Retrying in 5s...", attempt, epNum, err)
			time.Sleep(5 * time.Second)
		}

		if msgID != 0 {
			var epList []interface{}
			if existingList, ok := qualities["720p"].([]interface{}); ok {
				epList = existingList
			}
			epList = append(epList, map[string]interface{}{
				"episode": epNum,
				"msg_id":  msgID,
			})
			qualities["720p"] = epList
			if epItem.Subtitles != "" {
				qualities["_subtitles"] = epItem.Subtitles
			}
			alreadyUploaded[epNum] = true

			db.SaveFileQualities(showID, showTitle, qualities)
			db.MarkPosted(epItem.Link, epItem.Title)
		} else {
			log.Printf("Stopping show queue for %s at Ep %02d to avoid skipping episodes!", showTitle, epNum)
			if manualChatID != 0 {
				_, _ = client.SendMessage(manualChatID, fmt.Sprintf("⚠️ <b>Notice:</b> Failed to upload <code>%s</code> <b>Episode %02d</b>.\nStopping further episodes for this show until resolved.", showTitle, epNum), &tg.SendOptions{ParseMode: "html"})
			}
			break
		}
	}

	if manualChatID != 0 {
		batchURL := fmt.Sprintf("https://t.me/%s?start=batch_%s_720p", botUser, showID)
		_, _ = client.SendMessage(manualChatID, fmt.Sprintf("<blockquote>✅ <b>Completed processing for %s!</b>\n📥 <b>Batch Link:</b> <code>%s</code></blockquote>", showTitle, batchURL), &tg.SendOptions{ParseMode: "html"})
	}
}

func handleURL(rawURL string, chatID int64) {
	requestedEp := scrapers.ExtractRequestedEpisode(rawURL)
	baseShowURL := scrapers.GetBaseShowURL(rawURL)

	jobKey := rawURL
	if requestedEp > 0 {
		jobKey = fmt.Sprintf("%s#ep_%02d", baseShowURL, requestedEp)
	}

	jobLock.Lock()
	if activeJobs[jobKey] {
		jobLock.Unlock()
		log.Printf("Ignoring duplicate request for already running job: %s", jobKey)
		if chatID != 0 {
			_, _ = client.SendMessage(chatID, "⏳ This item is already currently being processed in queue. Please wait for it to complete.", &tg.SendOptions{ParseMode: "html"})
		}
		return
	}
	activeJobs[jobKey] = true
	jobLock.Unlock()

	u, err := url.Parse(baseShowURL)
	if err != nil {
		jobLock.Lock()
		delete(activeJobs, jobKey)
		jobLock.Unlock()
		_, _ = client.SendMessage(chatID, "Invalid URL format.", &tg.SendOptions{ParseMode: "html"})
		return
	}

	host := strings.ToLower(u.Host)
	statusText := fmt.Sprintf("🔍 <b>Analyzing show URL:</b> <code>%s</code>\nPlease wait...", baseShowURL)
	if requestedEp > 0 {
		statusText = fmt.Sprintf("🔍 <b>Analyzing URL for Episode %02d:</b> <code>%s</code>\nPlease wait...", requestedEp, rawURL)
	}
	statusMsg, _ := client.SendMessage(chatID, statusText, &tg.SendOptions{ParseMode: "html"})

	var items []*scrapers.EpisodeItem
	var sErr error

	if strings.Contains(host, "kissasia") {
		items, sErr = kissScrape.ScrapeShow(baseShowURL, "", "")
	} else if strings.Contains(host, "dramakey") {
		items, sErr = keyScrape.ScrapeShow(baseShowURL, "", "")
	} else if strings.Contains(host, "dramacool") {
		items, sErr = coolScrape.ScrapeShow(baseShowURL, "", "")
	} else {
		jobLock.Lock()
		delete(activeJobs, jobKey)
		jobLock.Unlock()
		if statusMsg != nil {
			_, _ = statusMsg.Edit("Unsupported link. Supported: <code>kissasia.biz</code>, <code>dramakey.com</code>, <code>dramacool.sh</code>.", &tg.SendOptions{ParseMode: "html"})
		}
		return
	}

	if sErr != nil || len(items) == 0 {
		log.Printf("Scrape failed for %s (host: %s): sErr=%v, itemsCount=%d", baseShowURL, host, sErr, len(items))
		jobLock.Lock()
		delete(activeJobs, jobKey)
		jobLock.Unlock()
		if statusMsg != nil {
			errDetails := ""
			if sErr != nil {
				errDetails = fmt.Sprintf("\n<i>Error: %v</i>", sErr)
			}
			_, _ = statusMsg.Edit(fmt.Sprintf("❌ Could not extract episodes from this URL.%s\nPlease verify that this is a drama episode page.", errDetails), &tg.SendOptions{ParseMode: "html"})
		}
		return
	}

	// Filter to specific episode if requested by user (e.g. ?episode=5 or -episode-5)
	if requestedEp > 0 {
		var filtered []*scrapers.EpisodeItem
		for _, item := range items {
			if scrapers.ExtractEpisodeNumber(item.Title) == requestedEp {
				filtered = append(filtered, item)
				break
			}
		}
		if len(filtered) == 0 {
			jobLock.Lock()
			delete(activeJobs, jobKey)
			jobLock.Unlock()
			if statusMsg != nil {
				_, _ = statusMsg.Edit(fmt.Sprintf("❌ Episode %02d was not found in this drama (available episodes: 1 to %d).", requestedEp, len(items)), &tg.SendOptions{ParseMode: "html"})
			}
			return
		}
		items = filtered
	}

	if statusMsg != nil {
		if requestedEp > 0 {
			_, _ = statusMsg.Edit(fmt.Sprintf("✅ <b>Found Episode %02d!</b>\nStarting download, subtitle muxing, and MTProto upload...", requestedEp), &tg.SendOptions{ParseMode: "html"})
		} else {
			_, _ = statusMsg.Edit(fmt.Sprintf("✅ <b>Found %d episode(s)!</b>\nProcessing strictly one episode at a time in order...", len(items)), &tg.SendOptions{ParseMode: "html"})
		}
	}

	go processEpisodes(items, jobKey, chatID)
}

func main() {
	log.Println("Initializing AsianScraper Native MTProto Engine (gogram)...")
	cfg = config.Load()
	db = database.NewDatabase(cfg.MongoSRV)
	dl = downloader.NewDownloader()

	kissScrape = scrapers.NewKissasiaScraper()
	keyScrape = scrapers.NewDramakeyScraper()
	coolScrape = scrapers.NewDramacoolScraper()

	var err error
	client, err = tg.NewClient(tg.ClientConfig{
		AppID:         int32(cfg.APIID),
		AppHash:       cfg.APIHash,
		MemorySession: true,
		LogLevel:      tg.LogWarn,
	})
	if err != nil {
		log.Fatalf("Failed to initialize gogram MTProto client: %v", err)
	}

	log.Println("Connecting directly to Telegram MTProto Datacenter...")
	if err := client.Connect(); err != nil {
		log.Fatalf("Failed to connect to Telegram MTProto: %v", err)
	}

	log.Println("Authorizing Bot Token via MTProto...")
	if err := client.LoginBot(cfg.BotToken); err != nil {
		log.Fatalf("Bot Token authentication failed on MTProto: %v", err)
	}

	me, err := client.GetMe()
	if err != nil {
		log.Fatalf("Failed to get bot profile: %v", err)
	}
	botUser = me.Username
	log.Printf("Bot successfully authorized as @%s via MTProto (Max Upload Size: 2 GB)", botUser)

	reURL := regexp.MustCompile(`https?://[^\s]+`)

	client.OnMessage("", func(m *tg.NewMessage) error {
		text := strings.TrimSpace(m.Text())
		chatID := m.ChatID()

		if strings.HasPrefix(text, "/start") {
			parts := strings.Split(text, " ")
			if len(parts) > 1 && strings.HasPrefix(parts[1], "batch_") {
				batchParts := strings.Split(parts[1], "_")
				if len(batchParts) >= 3 {
					showID := batchParts[1]
					qKey := batchParts[2]
					rec := db.GetFileQualities(showID)
					if rec != nil {
						if epList, ok := rec.Qualities[qKey].([]interface{}); ok && len(epList) > 0 {
							_, _ = m.Respond(fmt.Sprintf("<blockquote>📥 <b>Batch distribution for:</b> <code>%s</code> (%s)</blockquote>\nSending %d file(s)...", rec.Title, qKey, len(epList)), &tg.SendOptions{ParseMode: "html"})
						}
					}
				}
				return nil
			}

			welcomeText := "<blockquote>👋 <b>Hello! I am Asian Drama Uploader Bot (Golang Native MTProto Engine).</b></blockquote>\n\n" +
				"Send me any show URL (from <code>kissasia.biz</code>, <code>dramakey.com</code>, or <code>dramacool.sh</code>) " +
				"and I will automatically scrape all episodes, mux subtitles, and upload them at high speed!\n\n" +
				"<i>Features: Native MTProto binary protocol, 2 GB file upload support, 8-worker concurrent chunking, and zero RAM waste.</i>"
			_, _ = m.Respond(welcomeText, &tg.SendOptions{ParseMode: "html"})
			return nil
		}

		if strings.HasPrefix(text, "/run") {
			_, _ = m.Respond("Manual scan triggered. Checking scrapers...", &tg.SendOptions{ParseMode: "html"})
			return nil
		}

		matchURL := reURL.FindString(text)
		if matchURL != "" {
			handleURL(matchURL, chatID)
		}
		return nil
	})

	log.Println("Listening for Telegram messages via MTProto (Auto-scraping disabled, purely on-demand URLs)...")
	client.Idle()
}
