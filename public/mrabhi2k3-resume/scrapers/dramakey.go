package scrapers

import (
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
	reEpLinkNum = regexp.MustCompile(`(?i)(?:[Ee]|episode[s]?[-_\s]?|ep[-_\s]?)(\d+)`)
)

type DramakeyScraper struct {
	client *http.Client
}

func NewDramakeyScraper() *DramakeyScraper {
	return &DramakeyScraper{
		client: &http.Client{Timeout: 20 * time.Second},
	}
}

func (s *DramakeyScraper) fetchDocument(targetURL string) (*goquery.Document, error) {
	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return goquery.NewDocumentFromReader(resp.Body)
}

func (s *DramakeyScraper) ScrapeShow(showURL string, defaultTitle string, defaultImg string) ([]*EpisodeItem, error) {
	doc, err := s.fetchDocument(showURL)
	if err != nil {
		return nil, err
	}

	showTitle := StripTitleExtras(defaultTitle)
	if showTitle == "" {
		h1 := doc.Find("h1, title").First().Text()
		showTitle = StripTitleExtras(h1)
	}

	imgURL := defaultImg
	if imgURL == "" {
		ogImg, exists := doc.Find("meta[property='og:image']").Attr("content")
		if exists && ogImg != "" {
			imgURL = ogImg
		} else {
			imgTag := doc.Find(".entry-content img, img").First()
			src, _ := imgTag.Attr("src")
			if src == "" {
				src, _ = imgTag.Attr("data-src")
			}
			imgURL = src
		}
	}

	epLinks := make(map[int]map[string]string)

	doc.Find("a").Each(func(i int, sel *goquery.Selection) {
		href, exists := sel.Attr("href")
		if !exists {
			return
		}
		text := strings.TrimSpace(sel.Text())
		lowerHref := strings.ToLower(href)

		if strings.Contains(lowerHref, "downloadwella") || strings.Contains(lowerHref, "gofile") ||
			strings.Contains(lowerHref, "mega.nz") || strings.Contains(lowerHref, "drive.google") {

			parts := strings.Split(href, "/")
			fileName := parts[len(parts)-1]
			combined := fmt.Sprintf("%s %s", fileName, text)

			epNum := 1
			m := reEpLinkNum.FindStringSubmatch(combined)
			if len(m) > 1 {
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

			q := "720p"
			lowerComb := strings.ToLower(combined)
			if strings.Contains(lowerComb, "1080") {
				q = "1080p"
			} else if strings.Contains(lowerComb, "480") {
				q = "480p"
			}

			if _, ok := epLinks[epNum]; !ok {
				epLinks[epNum] = make(map[string]string)
			}
			epLinks[epNum][q] = href
		}
	})

	var results []*EpisodeItem
	for epNum, qualities := range epLinks {
		results = append(results, &EpisodeItem{
			Title:     fmt.Sprintf("%s - Episode %02d", showTitle, epNum),
			Link:      fmt.Sprintf("%s#Episode_%02d", showURL, epNum),
			ImgURL:    imgURL,
			Source:    "DramaKey",
			Qualities: qualities,
		})
	}

	return results, nil
}

type DramacoolScraper struct {
	client *http.Client
}

func NewDramacoolScraper() *DramacoolScraper {
	return &DramacoolScraper{
		client: &http.Client{Timeout: 20 * time.Second},
	}
}

func (s *DramacoolScraper) ScrapeShow(showURL string, defaultTitle string, defaultImg string) ([]*EpisodeItem, error) {
	req, err := http.NewRequest("GET", showURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0")
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	showTitle := StripTitleExtras(defaultTitle)
	if showTitle == "" {
		t := doc.Find("h1, title").First().Text()
		showTitle = StripTitleExtras(t)
	}

	imgURL := defaultImg
	if imgURL == "" {
		ogImg, _ := doc.Find("meta[property='og:image']").Attr("content")
		if ogImg != "" {
			imgURL = ogImg
		} else {
			src, _ := doc.Find(".img img, img").First().Attr("src")
			imgURL = src
		}
	}

	var results []*EpisodeItem
	doc.Find("ul.all-episode li a, ul.box li a").Each(func(i int, sel *goquery.Selection) {
		href, _ := sel.Attr("href")
		if href == "" {
			return
		}
		if !strings.HasPrefix(href, "http") {
			baseU, err := url.Parse(showURL)
			if err == nil {
				refU, err := url.Parse(href)
				if err == nil {
					href = baseU.ResolveReference(refU).String()
				}
			}
		}

		epTitle := sel.Find("h3, span.title").Text()
		if epTitle == "" {
			epTitle = sel.Text()
		}
		epNum := ExtractEpisodeNumber(epTitle)

		results = append(results, &EpisodeItem{
			Title:  fmt.Sprintf("%s - Episode %02d", showTitle, epNum),
			Link:   href,
			ImgURL: imgURL,
			Source: "DramaCool",
			Qualities: map[string]string{
				"720p": href,
			},
		})
	})

	return results, nil
}

func ResolveDownloadWellaLink(targetURL string) string {
	if !strings.Contains(targetURL, "downloadwella.com") {
		return targetURL
	}

	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		return targetURL
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
	resp, err := client.Do(req)
	if err != nil {
		return targetURL
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return targetURL
	}

	form := doc.Find("form").First()
	if form.Length() == 0 {
		return targetURL
	}

	formVals := url.Values{}
	form.Find("input").Each(func(i int, sel *goquery.Selection) {
		name, hasName := sel.Attr("name")
		val, _ := sel.Attr("value")
		if hasName {
			formVals.Set(name, val)
		}
	})

	postReq, err := http.NewRequest("POST", targetURL, strings.NewReader(formVals.Encode()))
	if err != nil {
		return targetURL
	}
	postReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	postReq.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

	postResp, err := client.Do(postReq)
	if err != nil {
		return targetURL
	}
	defer postResp.Body.Close()

	body, _ := io.ReadAll(postResp.Body)
	reMKV := regexp.MustCompile(`https?://[^\s"'<>]+\.(?:mkv|mp4)`)
	m := reMKV.FindString(string(body))
	if m != "" {
		return m
	}
	return targetURL
}
