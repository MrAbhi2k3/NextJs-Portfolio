package muxer

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func FindFFmpegPath() string {
	p, err := exec.LookPath("ffmpeg")
	if err == nil && p != "" {
		return p
	}

	localApp := os.Getenv("LOCALAPPDATA")
	wingetPath := filepath.Join(
		localApp,
		`Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe`,
	)
	if _, err := os.Stat(wingetPath); err == nil {
		return wingetPath
	}
	return "ffmpeg"
}

// MuxSubtitles downloads VTT/SRT subtitles and muxes them into a single MKV file using FFmpeg.
func MuxSubtitles(ctx context.Context, videoPath string, subURLs []string, subNamesStr string) (string, error) {
	ffmpegBin := FindFFmpegPath()
	if len(subURLs) == 0 {
		return videoPath, nil
	}

	client := &http.Client{Timeout: 30 * time.Second}
	var downloadedSubs []string
	var downloadedTitles []string

	subNames := strings.Split(subNamesStr, ",")
	hash := md5.Sum([]byte(videoPath))
	uid := hex.EncodeToString(hash[:])[:8]

	for idx, subURL := range subURLs {
		req, err := http.NewRequestWithContext(ctx, "GET", subURL, nil)
		if err != nil {
			continue
		}
		req.Header.Set("User-Agent", "Mozilla/5.0")
		req.Header.Set("Referer", "https://kissasia.biz/")

		resp, err := client.Do(req)
		if err != nil || resp.StatusCode != http.StatusOK {
			continue
		}

		ext := ".srt"
		if strings.HasSuffix(strings.ToLower(subURL), ".vtt") {
			ext = ".vtt"
		}
		tempSubName := fmt.Sprintf("temp_sub_%s_%d%s", uid, idx, ext)
		f, err := os.Create(tempSubName)
		if err != nil {
			resp.Body.Close()
			continue
		}
		_, _ = io.Copy(f, resp.Body)
		f.Close()
		resp.Body.Close()

		langTitle := fmt.Sprintf("Track_%d", idx+1)
		if idx < len(subNames) && strings.TrimSpace(subNames[idx]) != "" {
			langTitle = strings.TrimSpace(subNames[idx])
		}

		downloadedSubs = append(downloadedSubs, tempSubName)
		downloadedTitles = append(downloadedTitles, langTitle)
	}

	if len(downloadedSubs) == 0 {
		return videoPath, nil
	}

	defer func() {
		for _, s := range downloadedSubs {
			_ = os.Remove(s)
		}
	}()

	ext := filepath.Ext(videoPath)
	base := strings.TrimSuffix(videoPath, ext)
	outputPath := fmt.Sprintf("%s_muxed.mkv", base)

	args := []string{"-y", "-i", videoPath}
	for _, s := range downloadedSubs {
		args = append(args, "-i", s)
	}

	args = append(args, "-map", "0")
	for i := range downloadedSubs {
		args = append(args, "-map", fmt.Sprintf("%d:0", i+1))
	}
	args = append(args, "-c", "copy")

	for i, t := range downloadedTitles {
		args = append(args, fmt.Sprintf("-metadata:s:s:%d", i), fmt.Sprintf("title=%s", t))
	}
	args = append(args, outputPath)

	cmd := exec.CommandContext(ctx, ffmpegBin, args...)
	if err := cmd.Run(); err != nil {
		_ = os.Remove(outputPath)
		return videoPath, err
	}

	if fi, err := os.Stat(outputPath); err == nil && fi.Size() > 0 {
		_ = os.Remove(videoPath)
		return outputPath, nil
	}

	_ = os.Remove(outputPath)
	return videoPath, nil
}
