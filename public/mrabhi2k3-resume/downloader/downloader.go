package downloader

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"sync"
	"time"
)

type ProgressCallback func(current, total int64, speed float64)

type Downloader struct {
	client *http.Client
}

func NewDownloader() *Downloader {
	return &Downloader{
		client: &http.Client{
			Timeout: 45 * time.Minute,
			Transport: &http.Transport{
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 20,
				IdleConnTimeout:     90 * time.Second,
			},
		},
	}
}

// DownloadFile downloads a file using multi-part HTTP ranges (if supported) or single stream.
// This achieves maximum speeds (20+ MB/s) by breaking past origin server single-connection throttle.
func (d *Downloader) DownloadFile(ctx context.Context, targetURL, outputPath string, progress ProgressCallback) error {
	// If URL has typo extension like .mp5/.mp6/.mp7, normalize to .mp4
	reTypo := regexp.MustCompile(`(?i)\.mp[5-9]$`)
	if reTypo.MatchString(targetURL) {
		targetURL = reTypo.ReplaceAllString(targetURL, ".mp4")
	}

	req, err := http.NewRequestWithContext(ctx, "HEAD", targetURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Referer", "https://kissasia.biz/")

	resp, err := d.client.Do(req)
	if err != nil {
		return d.singleStreamDownload(ctx, targetURL, outputPath, progress)
	}
	defer resp.Body.Close()

	contentLength := resp.ContentLength
	acceptRanges := resp.Header.Get("Accept-Ranges")

	// If server supports byte ranges and file is > 10MB, use 4 parallel chunks for high throughput
	numChunks := 4
	if contentLength > 10*1024*1024 && (acceptRanges == "bytes" || acceptRanges != "") {
		return d.multiPartDownload(ctx, targetURL, outputPath, contentLength, numChunks, progress)
	}

	return d.singleStreamDownload(ctx, targetURL, outputPath, progress)
}

func (d *Downloader) singleStreamDownload(ctx context.Context, targetURL, outputPath string, progress ProgressCallback) error {
	req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
	req.Header.Set("Referer", "https://kissasia.biz/")

	resp, err := d.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("unexpected status code %d", resp.StatusCode)
	}

	totalSize := resp.ContentLength
	outFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	buf := make([]byte, 512*1024)
	var current int64
	var lastBytes int64
	lastTime := time.Now()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		n, rErr := resp.Body.Read(buf)
		if n > 0 {
			if _, wErr := outFile.Write(buf[:n]); wErr != nil {
				return wErr
			}
			current += int64(n)

			now := time.Now()
			diff := now.Sub(lastTime).Seconds()
			if diff >= 2.5 || (totalSize > 0 && current == totalSize) {
				speed := float64(current-lastBytes) / diff
				lastTime = now
				lastBytes = current
				if progress != nil {
					progress(current, totalSize, speed)
				}
			}
		}

		if rErr != nil {
			if rErr == io.EOF {
				break
			}
			return rErr
		}
	}

	return nil
}

func (d *Downloader) multiPartDownload(ctx context.Context, targetURL, outputPath string, totalSize int64, chunks int, progress ProgressCallback) error {
	outFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	if err := outFile.Truncate(totalSize); err != nil {
		return err
	}

	chunkSize := totalSize / int64(chunks)
	var wg sync.WaitGroup
	errChan := make(chan error, chunks)

	var mu sync.Mutex
	var currentTransferred int64
	var lastBytes int64
	lastTime := time.Now()

	for i := 0; i < chunks; i++ {
		start := int64(i) * chunkSize
		end := start + chunkSize - 1
		if i == chunks-1 {
			end = totalSize - 1
		}

		wg.Add(1)
		go func(partIdx int, startByte, endByte int64) {
			defer wg.Done()

			req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
			if err != nil {
				errChan <- err
				return
			}
			req.Header.Set("Range", fmt.Sprintf("bytes=%d-%d", startByte, endByte))
			req.Header.Set("User-Agent", "Mozilla/5.0")
			req.Header.Set("Referer", "https://kissasia.biz/")

			resp, err := d.client.Do(req)
			if err != nil {
				errChan <- err
				return
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusPartialContent && resp.StatusCode != http.StatusOK {
				errChan <- fmt.Errorf("part %d failed with status %d", partIdx, resp.StatusCode)
				return
			}

			partFile, err := os.OpenFile(outputPath, os.O_WRONLY, 0644)
			if err != nil {
				errChan <- err
				return
			}
			defer partFile.Close()

			if _, err := partFile.Seek(startByte, io.SeekStart); err != nil {
				errChan <- err
				return
			}

			buf := make([]byte, 512*1024)
			for {
				select {
				case <-ctx.Done():
					errChan <- ctx.Err()
					return
				default:
				}

				n, rErr := resp.Body.Read(buf)
				if n > 0 {
					if _, wErr := partFile.Write(buf[:n]); wErr != nil {
						errChan <- wErr
						return
					}

					mu.Lock()
					currentTransferred += int64(n)
					now := time.Now()
					diff := now.Sub(lastTime).Seconds()
					if diff >= 2.5 || currentTransferred >= totalSize {
						speed := float64(currentTransferred-lastBytes) / diff
						lastTime = now
						lastBytes = currentTransferred
						if progress != nil {
							progress(currentTransferred, totalSize, speed)
						}
					}
					mu.Unlock()
				}

				if rErr != nil {
					if rErr == io.EOF {
						break
					}
					errChan <- rErr
					return
				}
			}
		}(i, start, end)
	}

	wg.Wait()
	close(errChan)

	if len(errChan) > 0 {
		return <-errChan
	}
	return nil
}
