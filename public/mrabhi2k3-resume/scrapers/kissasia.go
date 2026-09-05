package scrapers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

var (
	reHTTPURL   = regexp.MustCompile(`(https?://[^\s|]+)`)
	reImgSrc    = regexp.MustCompile(`(?i)src="([^"]+)"`)
	reEpSubLine = regexp.MustCompile(`(?i)(?:\.s\d+e|episode[s]?[-_\s]?|ep[-_\s]?|[Ee])(\d+)`)
)

type BloggerFeed struct {
	Feed struct {
		Entry []struct {
			Title struct {
				Text string `json:"$t"`
			} `json:"title"`
			Content struct {
				Text string `json:"$t"`
			} `json:"content"`
		} `json:"entry"`
	} `json:"feed"`
}

type SingleBloggerPost struct {
	Entry struct {
		Title struct {
			Text string `json:"$t"`
		} `json:"title"`
		Content struct {
			Text string `json:"$t"`
		} `json:"content"`
	} `json:"entry"`
}

type KissasiaScraper struct {
	client *http.Client
}

func NewKissasiaScraper() *KissasiaScraper {
	return &KissasiaScraper{
		client: &http.Client{Timeout: 20 * time.Second},
	}
}

func (s *KissasiaScraper) fetchURL(targetURL string) (string, error) {
	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Referer", "https://kissasia.biz/")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func (s *KissasiaScraper) fetchPostByID(postID string) (string, string, error) {
	apiURL := fmt.Sprintf("https://www.blogger.com/feeds/4927638411765974267/posts/default/%s?alt=json", postID)
	body, err := s.fetchURL(apiURL)
	if err != nil {
		return "", "", err
	}

	var sp SingleBloggerPost
	if err := json.Unmarshal([]byte(body), &sp); err != nil {
		return "", "", err
	}
	return sp.Entry.Title.Text, sp.Entry.Content.Text, nil
}

func (s *KissasiaScraper) GetBloggerFeed() []struct {
	Title   string
	Content string
} {
	feedURL := "https://www.blogger.com/feeds/4927638411765974267/posts/default?alt=json&max-results=150"
	body, err := s.fetchURL(feedURL)
	if err != nil {
		return nil
	}

	var bf BloggerFeed
	if err := json.Unmarshal([]byte(body), &bf); err != nil {
		return nil
	}

	var out []struct {
		Title   string
		Content string
	}
	for _, e := range bf.Feed.Entry {
		out = append(out, struct {
			Title   string
			Content string
		}{
			Title:   e.Title.Text,
			Content: e.Content.Text,
		})
	}
	return out
}

func (s *KissasiaScraper) ScrapeShow(showURL string, defaultTitle string, defaultImg string) ([]*EpisodeItem, error) {
	var results []*EpisodeItem

	htmlBody, _ := s.fetchURL(showURL)
	showTitle := StripTitleExtras(defaultTitle)
	imgURL := defaultImg
	var postID string

	if htmlBody != "" {
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlBody))
		if err == nil {
			// Extract direct blogger post ID from data-post-id
			doc.Find("[data-post-id]").Each(func(i int, sel *goquery.Selection) {
				pid, exists := sel.Attr("data-post-id")
				if exists && pid != "" && postID == "" {
					postID = strings.TrimSpace(pid)
				}
			})

			if showTitle == "" {
				ogTitle, exists := doc.Find("meta[property='og:title']").Attr("content")
				if exists && ogTitle != "" {
					showTitle = StripTitleExtras(ogTitle)
				} else {
					h1 := doc.Find("h1, title").First().Text()
					showTitle = StripTitleExtras(h1)
				}
			}

			if imgURL == "" {
				ogImg, exists := doc.Find("meta[property='og:image']").Attr("content")
				if exists && ogImg != "" {
					imgURL = ogImg
				} else {
					imgTag := doc.Find("img").First()
					src, _ := imgTag.Attr("src")
					if src == "" {
						src, _ = imgTag.Attr("data-src")
					}
					imgURL = src
				}
			}
		}
	}

	if showTitle == "" {
		u, err := url.Parse(showURL)
		if err == nil {
			parts := strings.Split(strings.Trim(u.Path, "/"), "/")
			if len(parts) > 0 {
				showTitle = StripTitleExtras(strings.ReplaceAll(parts[len(parts)-1], "-", " "))
			}
		}
	}

	var matchedContent string

	// Method 1: Direct exact Blogger Post ID lookup (100% reliable for all shows)
	if postID != "" {
		pTitle, pContent, pErr := s.fetchPostByID(postID)
		if pErr == nil && pContent != "" {
			matchedContent = pContent
			if showTitle == "" && pTitle != "" {
				if strings.Contains(pTitle, "-") {
					parts := strings.SplitN(pTitle, "-", 2)
					showTitle = StripTitleExtras(parts[1])
				} else {
					showTitle = StripTitleExtras(pTitle)
				}
			}
		}
	}

	// Method 2: Fallback to searching recent Blogger Feed if postID wasn't found in HTML
	if matchedContent == "" {
		entries := s.GetBloggerFeed()
		cleanedShow := CleanSearchTitle(showTitle)

		for _, entry := range entries {
			bTitle := entry.Title
			if strings.Contains(bTitle, "-") {
				parts := strings.SplitN(bTitle, "-", 2)
				bTitle = parts[1]
			}
			cleanedB := CleanSearchTitle(bTitle)
			if cleanedB != "" && (strings.Contains(cleanedShow, cleanedB) || strings.Contains(cleanedB, cleanedShow)) {
				matchedContent = entry.Content
				break
			}
		}
	}

	if matchedContent != "" {
		lines := strings.Split(matchedContent, ";")
		for idx, line := range lines {
			line = strings.TrimSpace(line)
			if line == "" {
				continue
			}

			if strings.Contains(strings.ToLower(line), "<img") {
				imgMatch := reImgSrc.FindStringSubmatch(line)
				if len(imgMatch) > 1 && imgURL == "" {
					imgURL = imgMatch[1]
				}
				continue
			}

			linkMatch := reHTTPURL.FindStringSubmatch(line)
			if len(linkMatch) > 1 {
				videoURL := linkMatch[1]
				// Fix Blogger typo extensions (.mp5, .mp6, .mp7 -> .mp4)
				reTypoExt := regexp.MustCompile(`(?i)\.mp[5-9]$`)
				if reTypoExt.MatchString(videoURL) {
					videoURL = reTypoExt.ReplaceAllString(videoURL, ".mp4")
				}
				subtitles := ""
				var subURLs []string
				subParts := strings.Split(line, "|")
				if len(subParts) >= 2 {
					subtitles = strings.TrimSpace(subParts[1])
				}
				if len(subParts) >= 3 {
					for _, uStr := range strings.Split(subParts[2], ",") {
						uStr = strings.TrimSpace(uStr)
						if strings.HasPrefix(uStr, "http") {
							subURLs = append(subURLs, uStr)
						}
					}
				}

				epNum := idx + 1
				// Check for explicit episode markers in line (e.g. "-ep-1-", "ep-01", "episode-1")
				reSpecificEp := regexp.MustCompile(`(?i)(?:[-_.]ep[-_.]|episode[-_\s.]?|ep[-_\s.]?)(\d+)`)
				if sm := reSpecificEp.FindStringSubmatch(line); len(sm) > 1 {
					var n int
					for _, ch := range sm[1] {
						if ch >= '0' && ch <= '9' {
							n = n*10 + int(ch-'0')
						}
					}
					if n > 0 {
						epNum = n
					}
				} else if m := reEpSubLine.FindStringSubmatch(line); len(m) > 1 {
					var n int
					for _, ch := range m[1] {
						if ch >= '0' && ch <= '9' {
							n = n*10 + int(ch-'0')
						}
					}
					if n > 0 {
						epNum = n
					}
				}

				results = append(results, &EpisodeItem{
					Title:     fmt.Sprintf("%s - Episode %02d", showTitle, epNum),
					Link:      fmt.Sprintf("%s?episode=%d", showURL, epNum),
					ImgURL:    imgURL,
					Source:    "KissAsia",
					Subtitles: subtitles,
					SubURLs:   subURLs,
					Qualities: map[string]string{
						"720p": videoURL,
					},
				})
			}
		}
	}

	// Method 3: Direct anchor tag links fallback on page (e.g. downloadwella, gofile, etc.)
	if len(results) == 0 && htmlBody != "" {
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlBody))
		if err == nil {
			var rawLinks [][2]string
			doc.Find("a").Each(func(i int, sel *goquery.Selection) {
				href, exists := sel.Attr("href")
				if !exists {
					return
				}
				text := strings.TrimSpace(sel.Text())
				lower := strings.ToLower(href)
				if strings.Contains(lower, "downloadwella") || strings.Contains(lower, "gofile") ||
					strings.Contains(lower, "mega.nz") || strings.Contains(lower, "drive.google") ||
					strings.Contains(lower, "download") {
					rawLinks = append(rawLinks, [2]string{text, href})
				}
			})

			if len(rawLinks) > 0 {
				qualities := make(map[string]string)
				for _, pair := range rawLinks {
					t, h := pair[0], pair[1]
					comb := strings.ToLower(t + " " + h)
					q := "720p"
					if strings.Contains(comb, "1080") {
						q = "1080p"
					} else if strings.Contains(comb, "480") {
						q = "480p"
					}
					qualities[q] = h
				}
				results = append(results, &EpisodeItem{
					Title:     showTitle,
					Link:      showURL,
					ImgURL:    imgURL,
					Source:    "KissAsia",
					Qualities: qualities,
				})
			}
		}
	}

	return results, nil
}
