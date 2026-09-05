package scrapers

import (
	"regexp"
	"strings"
)

var (
	reEpRange     = regexp.MustCompile(`(?i)\((?:Episodes?|Eps?)[^)]*(?:Added|Complete|End)?[^)]*\)`)
	reComplete1   = regexp.MustCompile(`(?i)\(Complete\)`)
	reComplete2   = regexp.MustCompile(`(?i)\[Complete\]`)
	reEpAdded1    = regexp.MustCompile(`(?i)Episodes?\s*[\d\s&,-]+(?:\s*(?:Added|Complete|to\s*\d+))?`)
	reEpAdded2    = regexp.MustCompile(`(?i)Eps?\s*[\d\s&,-]+(?:\s*(?:Added|Complete|to\s*\d+))?`)
	reDomain1     = regexp.MustCompile(`(?i)\(?dramakey\.com\)?`)
	reDomain2     = regexp.MustCompile(`(?i)\(?kissasia\.biz\)?`)
	reDomain3     = regexp.MustCompile(`(?i)\(?dramacool\.(?:sh|bg)\)?`)
	reDramaTag    = regexp.MustCompile(`(?i)\|\s*(?:Chinese|Korean|Japanese|Thai|Asian)?\s*Drama`)
	reEngSubHD    = regexp.MustCompile(`(?i)English Sub Full Episodes HD`)
	reEngSub      = regexp.MustCompile(`(?i)English Sub`)
	reBracketTags = regexp.MustCompile(`\[.*?\]`)
	reSpecialDash = regexp.MustCompile(`—`)
	rePunct       = regexp.MustCompile(`[\._-]`)
	reSpaces      = regexp.MustCompile(`\s+`)
	reYearTag        = regexp.MustCompile(`\(\d{4}\)`)
	reNonAlpha       = regexp.MustCompile(`[\W_]+`)
	reDownloadPrefix = regexp.MustCompile(`(?i)^(?:download|watch)\s+`)

	reEpNumPatterns = []*regexp.Regexp{
		regexp.MustCompile(`(?i)\.s\d+e(\d+)`),
		regexp.MustCompile(`(?i)episode\s*(\d+)`),
		regexp.MustCompile(`(?i)episodes?\s*[-_\s]?(\d+)`),
		regexp.MustCompile(`(?i)ep\s*(\d+)`),
		regexp.MustCompile(`(?i)ep\.\s*(\d+)`),
		regexp.MustCompile(`[Ee](\d+)`),
	}
)

type EpisodeItem struct {
	Title     string            `json:"title"`
	Link      string            `json:"link"`
	ImgURL    string            `json:"img_url"`
	Source    string            `json:"source"`
	Subtitles string            `json:"subtitles"`
	SubURLs   []string          `json:"sub_urls"`
	Qualities map[string]string `json:"qualities"`
}

func StripTitleExtras(rawTitle string) string {
	cleaned := reEpRange.ReplaceAllString(rawTitle, "")
	cleaned = reComplete1.ReplaceAllString(cleaned, "")
	cleaned = reComplete2.ReplaceAllString(cleaned, "")
	cleaned = reEpAdded1.ReplaceAllString(cleaned, "")
	cleaned = reEpAdded2.ReplaceAllString(cleaned, "")
	cleaned = reDomain1.ReplaceAllString(cleaned, "")
	cleaned = reDomain2.ReplaceAllString(cleaned, "")
	cleaned = reDomain3.ReplaceAllString(cleaned, "")
	cleaned = reDramaTag.ReplaceAllString(cleaned, "")
	cleaned = reEngSubHD.ReplaceAllString(cleaned, "")
	cleaned = reEngSub.ReplaceAllString(cleaned, "")
	cleaned = reBracketTags.ReplaceAllString(cleaned, "")
	cleaned = reSpecialDash.ReplaceAllString(cleaned, "")
	cleaned = rePunct.ReplaceAllString(cleaned, " ")
	cleaned = reSpaces.ReplaceAllString(cleaned, " ")
	cleaned = strings.TrimSpace(cleaned)
	cleaned = reDownloadPrefix.ReplaceAllString(cleaned, "")
	return strings.TrimSpace(cleaned)
}

func CleanSearchTitle(title string) string {
	t := StripTitleExtras(title)
	t = reYearTag.ReplaceAllString(t, "")
	t = reNonAlpha.ReplaceAllString(t, " ")
	return strings.ToLower(strings.TrimSpace(t))
}

func ExtractEpisodeNumber(title string) int {
	for _, re := range reEpNumPatterns {
		m := re.FindStringSubmatch(title)
		if len(m) > 1 {
			var n int
			for _, ch := range m[1] {
				if ch >= '0' && ch <= '9' {
					n = n*10 + int(ch-'0')
				}
			}
			if n > 0 {
				return n
			}
		}
	}
	return 1
}

var (
	reEpPathSuffix = regexp.MustCompile(`(?i)-episode-\d+/?$`)
	reEpParamQuery = regexp.MustCompile(`(?i)[?&](?:episode|ep)=(\d+)`)
	reEpPathSlug   = regexp.MustCompile(`(?i)(?:-|_|\/)(?:episode|ep)-?(\d+)/?$`)
)

// ExtractRequestedEpisode parses ?episode=5, ?ep=5, or -episode-5 from a user-supplied URL.
// Returns 0 if no specific episode was requested (meaning scrape all episodes).
func ExtractRequestedEpisode(rawURL string) int {
	if m := reEpParamQuery.FindStringSubmatch(rawURL); len(m) > 1 {
		var n int
		for _, ch := range m[1] {
			if ch >= '0' && ch <= '9' {
				n = n*10 + int(ch-'0')
			}
		}
		if n > 0 {
			return n
		}
	}

	cleanBase := strings.Split(rawURL, "?")[0]
	cleanBase = strings.Split(cleanBase, "#")[0]
	if m := reEpPathSlug.FindStringSubmatch(cleanBase); len(m) > 1 {
		var n int
		for _, ch := range m[1] {
			if ch >= '0' && ch <= '9' {
				n = n*10 + int(ch-'0')
			}
		}
		if n > 0 {
			return n
		}
	}
	return 0
}

// GetBaseShowURL normalizes an episode-specific link (like /bloodhounds-episode-5 or ?episode=5) to the main show page URL.
func GetBaseShowURL(rawURL string) string {
	base := strings.Split(rawURL, "?")[0]
	base = strings.Split(base, "#")[0]
	base = reEpPathSuffix.ReplaceAllString(base, "/")
	if !strings.HasSuffix(base, "/") {
		base += "/"
	}
	return base
}

