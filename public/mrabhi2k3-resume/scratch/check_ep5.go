package main

import (
	"fmt"
	"asianscraper/scrapers"
)

func main() {
	scraper := scrapers.NewKissasiaScraper()
	testURL := "https://kissasia.biz/bloodhounds-season-2/"
	items, err := scraper.ScrapeShow(testURL, "", "")
	if err != nil {
		panic(err)
	}
	for _, ep := range items {
		epNum := scrapers.ExtractEpisodeNumber(ep.Title)
		if epNum == 5 {
			fmt.Printf("Ep 5 Title: %s\n", ep.Title)
			fmt.Printf("Ep 5 Qualities: %v\n", ep.Qualities)
			fmt.Printf("Ep 5 SubURLs: %v\n", ep.SubURLs)
		}
	}
}
