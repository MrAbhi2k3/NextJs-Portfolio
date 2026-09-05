# Author: MrAbhi2k3
# GitHub: https://github.com/MrAbhi2k3
#
# This file is part of the AutoAnime distribution.
#    Copyright (c) 2026 TeleroidGroup
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, version 3.
#
#    This program is distributed in the hope that it will be useful, but
#    WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
#    General Public License for more details.
#
# License can be found in <
# https://github.com/TeleroidGroup/AutoAnimeBot/blob/main/LICENSE > .
#
# if you are using this following code then don't forgot to give proper
# credit to t.me/TeleroidGroup (github.com/TeleroidGroup)

import re
import cloudscraper
from bs4 import BeautifulSoup
import urllib3
from urllib.parse import urljoin, urlparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def strip_title_extras(raw_title: str) -> str:
    cleaned = re.sub(r'\((?:Episodes?|Eps?)[^)]*(?:Added|Complete|End)?[^)]*\)', '', raw_title, flags=re.IGNORECASE)
    cleaned = re.sub(r'\(Complete\)', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\[Complete\]', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'Episodes?\s*[\d\s&,-]+(?:\s*(?:Added|Complete|to\s*\d+))?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'Eps?\s*[\d\s&,-]+(?:\s*(?:Added|Complete|to\s*\d+))?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\(?dramakey\.com\)?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\(?kissasia\.biz\)?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\(?dramacool\.(?:sh|bg)\)?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\|\s*(?:Chinese|Korean|Japanese|Thai|Asian)?\s*Drama', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'English Sub Full Episodes HD', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'English Sub', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\[.*?\]', '', cleaned)
    cleaned = re.sub(r'—', '', cleaned)
    cleaned = re.sub(r'[\._-]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

class BaseScraper:
    def __init__(self):
        self.scraper = cloudscraper.create_scraper()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    def fetch_soup(self, url):
        try:
            r = self.scraper.get(url, headers=self.headers, timeout=15)
            if r.status_code == 200:
                return BeautifulSoup(r.text, "html.parser")
        except Exception:
            pass
        return None

    def clean_title(self, title):
        title = strip_title_extras(title)
        title = re.sub(r'\(\d{4}\)', '', title)
        title = re.sub(r'[\W_]+', ' ', title)
        return title.strip().lower()

    def detect_qualities(self, links_list):
        qualities_dict = {}
        for text, href in links_list:
            combined = (href + " " + text).lower()
            if "1080" in combined:
                q = "1080p"
            elif "720" in combined:
                q = "720p"
            elif "480" in combined:
                q = "480p"
            else:
                if "480p" not in qualities_dict:
                    q = "480p"
                elif "720p" not in qualities_dict:
                    q = "720p"
                else:
                    q = "1080p"
            qualities_dict[q] = href
        return qualities_dict

class DramakeyScraper(BaseScraper):
    def __init__(self, url="https://dramakey.com/"):
        super().__init__()
        self.url = url

    def get_latest(self):
        soup = self.fetch_soup(self.url)
        results = []
        if not soup:
            return results
        posts = soup.select(".eael-grid-post")[:10]
        for post in posts:
            title_a = post.select_one(".eael-entry-title a")
            img_el = post.select_one("img")
            if title_a:
                link = title_a.get("href")
                if link and not link.startswith("http"):
                    link = urljoin(self.url, link)
                show_title = strip_title_extras(title_a.text.strip())
                img_url = ""
                if img_el:
                    img_url = img_el.get("src") or img_el.get("data-src") or ""
                if img_url and not img_url.startswith("http"):
                    img_url = urljoin(self.url, img_url)
                
                show_results = self.scrape_show(link, default_title=show_title, default_img=img_url)
                results.extend(show_results)
        return results

    def scrape_show(self, show_url, default_title="", default_img=""):
        results = []
        sub_soup = self.fetch_soup(show_url)
        if not sub_soup:
            return results

        show_title = strip_title_extras(default_title) if default_title else ""
        if not show_title:
            t_el = sub_soup.find("h1") or sub_soup.find("title")
            raw = t_el.text.strip() if t_el else "Unknown Show"
            show_title = strip_title_extras(raw)

        img_url = default_img
        if not img_url:
            og_img = sub_soup.find("meta", property="og:image")
            if og_img and og_img.get("content"):
                img_url = og_img.get("content")
            else:
                img_el = sub_soup.select_one(".entry-content img") or sub_soup.find("img")
                if img_el:
                    img_url = img_el.get("src") or img_el.get("data-src") or ""

        ep_links = {}
        for a in sub_soup.find_all("a"):
            href = a.get("href", "")
            text = a.text.strip()
            if any(k in href for k in ["downloadwella", "gofile", "mega.nz", "drive.google"]):
                if href and not href.startswith("http"):
                    href = urljoin(show_url, href)
                filename = href.split("/")[-1]
                combined_name = f"{filename} {text}"
                ep_match = (
                    re.search(r"[Ee](\d+)", combined_name) or
                    re.search(r"episode[s]?[-_\s]?(\d+)", combined_name, re.IGNORECASE) or
                    re.search(r"ep[-_\s]?(\d+)", combined_name, re.IGNORECASE)
                )
                if ep_match:
                    ep_num = int(ep_match.group(1))
                    ep_key = f"Episode {ep_num:02d}"
                else:
                    ep_key = "Episode 01"
                
                if ep_key not in ep_links:
                    ep_links[ep_key] = []
                ep_links[ep_key].append((text, href))
        
        for ep_key, links in sorted(ep_links.items()):
            results.append({
                "title": f"{show_title} - {ep_key}",
                "link": f"{show_url}#{ep_key.replace(' ', '_')}",
                "img_url": img_url,
                "source": "DramaKey",
                "qualities": self.detect_qualities(links)
            })
        return results

class KissasiaScraper(BaseScraper):
    def __init__(self, url="https://kissasia.biz/"):
        super().__init__()
        self.url = url

    def get_blogger_feed(self):
        try:
            feed_r = self.scraper.get(
                "https://www.blogger.com/feeds/4927638411765974267/posts/default?alt=json&max-results=150",
                timeout=12
            )
            if feed_r.status_code == 200:
                return feed_r.json().get("feed", {}).get("entry", [])
        except Exception:
            pass
        return []

    def get_latest(self):
        soup = self.fetch_soup(self.url)
        results = []
        if not soup:
            return results
        posts = soup.select(".wp-block-post")[:10]
        
        blogger_feed = self.get_blogger_feed()
            
        for post in posts:
            title_a = post.select_one(".wp-block-post-title a")
            img_el = post.select_one("img.wp-post-image") or post.select_one("img")
            if title_a:
                link = title_a.get("href")
                if link and not link.startswith("http"):
                    link = urljoin(self.url, link)
                show_title = strip_title_extras(title_a.text.strip())
                img_url = ""
                if img_el:
                    img_url = img_el.get("src") or img_el.get("data-src") or ""
                if img_url and not img_url.startswith("http"):
                    img_url = urljoin(self.url, img_url)
                
                show_results = self.scrape_show(link, default_title=show_title, default_img=img_url, blogger_feed=blogger_feed)
                results.extend(show_results)
        return results

    def scrape_show(self, show_url, default_title="", default_img="", blogger_feed=None):
        results = []
        if blogger_feed is None:
            blogger_feed = self.get_blogger_feed()

        sub_soup = self.fetch_soup(show_url)
        show_title = strip_title_extras(default_title) if default_title else ""
        img_url = default_img

        if sub_soup:
            if not show_title:
                og_t = sub_soup.find("meta", property="og:title")
                if og_t and og_t.get("content"):
                    show_title = strip_title_extras(og_t.get("content"))
                else:
                    t_el = sub_soup.find("h1") or sub_soup.find("title")
                    raw = t_el.text.strip() if t_el else ""
                    show_title = strip_title_extras(raw)

            if not img_url:
                og_img = sub_soup.find("meta", property="og:image")
                if og_img and og_img.get("content"):
                    img_url = og_img.get("content")
                else:
                    img_el = sub_soup.find("img")
                    if img_el:
                        img_url = img_el.get("src") or img_el.get("data-src") or ""

        if not show_title:
            path_part = urlparse(show_url).path.strip("/").split("/")[-1]
            show_title = re.sub(r'[\-_]', ' ', path_part).title()
            show_title = strip_title_extras(show_title)

        cleaned_show = self.clean_title(show_title)
        matched_entry = None
        for entry in blogger_feed:
            b_title_obj = entry.get("title", {})
            b_title = b_title_obj.get("$t", "") if isinstance(b_title_obj, dict) else str(b_title_obj)
            if "-" in b_title:
                b_show = b_title.split("-", 1)[1]
            else:
                b_show = b_title
            cleaned_b = self.clean_title(b_show)
            if cleaned_b and (cleaned_b in cleaned_show or cleaned_show in cleaned_b):
                matched_entry = entry
                break
                
        if matched_entry:
            content_obj = matched_entry.get("content", {})
            content = content_obj.get("$t", "") if isinstance(content_obj, dict) else str(content_obj)
            lines = [line.strip() for line in content.split(";") if line.strip()]
            for idx, line in enumerate(lines):
                if "<img" in line.lower():
                    img_match = re.search(r'src="([^"]+)"', line)
                    if img_match and not img_url:
                        img_url = img_match.group(1)
                    continue
                
                link_match = re.search(r'(https?://[^\s|]+)', line)
                if link_match:
                    video_url = link_match.group(1)
                    subtitles = ""
                    sub_urls = []
                    sub_parts = line.split("|")
                    if len(sub_parts) >= 2:
                        subtitles = sub_parts[1].strip()
                    if len(sub_parts) >= 3:
                        sub_urls = [u.strip() for u in sub_parts[2].split(",") if u.strip().startswith("http")]
                        
                    ep_num = idx + 1
                    ep_match = (
                        re.search(r"\.s\d+e(\d+)", line, re.IGNORECASE) or
                        re.search(r"[Ee](\d+)", line) or
                        re.search(r"episode[s]?[-_\s]?(\d+)", line, re.IGNORECASE) or
                        re.search(r"ep[-_\s]?(\d+)", line, re.IGNORECASE)
                    )
                    if ep_match:
                        ep_num = int(ep_match.group(1))
                        
                    results.append({
                        "title": f"{show_title} - Episode {ep_num:02d}",
                        "link": f"{show_url}?episode={ep_num}",
                        "img_url": img_url,
                        "source": "KissAsia",
                        "subtitles": subtitles,
                        "sub_urls": sub_urls,
                        "qualities": {
                            "720p": video_url
                        }
                    })
        elif sub_soup:
            raw_links = []
            for a in sub_soup.find_all("a"):
                href = a.get("href", "")
                text = a.text.strip()
                if any(k in href.lower() for k in ["downloadwella", "gofile", "mega.nz", "drive.google", "download"]):
                    if href and not href.startswith("http"):
                        href = urljoin(show_url, href)
                    raw_links.append((text, href))
            if raw_links:
                results.append({
                    "title": show_title,
                    "link": show_url,
                    "img_url": img_url,
                    "source": "KissAsia",
                    "qualities": self.detect_qualities(raw_links)
                })
        return results

class DramacoolScraper(BaseScraper):
    def __init__(self, url="https://dramacool.sh/"):
        super().__init__()
        self.url = url

    def get_latest(self):
        soup = self.fetch_soup(self.url)
        results = []
        if not soup:
            return results
        items = soup.select("ul.box li")[:10]
        for item in items:
            a = item if item.name == "a" else item.find("a")
            if not a:
                continue
            link = a.get("href")
            if link and not link.startswith("http"):
                link = urljoin(self.url, link)
            title_el = item.find("h3") or item.find(class_="title") or a
            raw_title = title_el.text.strip() if title_el else ""
            title = strip_title_extras(raw_title)
            ep_num = item.find(class_="ep") or item.find(class_="ep sub")
            if ep_num:
                title = f"{title} - {ep_num.text.strip()}"
            img_el = item.find("img")
            img_url = ""
            if img_el:
                img_url = img_el.get("src") or img_el.get("data-src") or img_el.get("data-original") or ""
            if img_url and not img_url.startswith("http"):
                img_url = urljoin(self.url, img_url)
            
            show_results = self.scrape_show(link, default_title=title, default_img=img_url)
            results.extend(show_results)
        return results

    def scrape_show(self, show_url, default_title="", default_img=""):
        results = []
        sub_soup = self.fetch_soup(show_url)
        if not sub_soup:
            return results

        show_title = strip_title_extras(default_title) if default_title else ""
        if not show_title:
            t_el = sub_soup.find("h1") or sub_soup.find("title")
            raw = t_el.text.strip() if t_el else "Unknown Show"
            show_title = strip_title_extras(raw)

        img_url = default_img
        if not img_url:
            og_img = sub_soup.find("meta", property="og:image")
            if og_img and og_img.get("content"):
                img_url = og_img.get("content")

        raw_links = []
        for a_tag in sub_soup.find_all("a"):
            href = a_tag.get("href", "")
            text = a_tag.text.strip()
            if any(k in href.lower() for k in ["downloadwella", "gofile", "mega", "download", "drive"]):
                if href and not href.startswith("http"):
                    href = urljoin(show_url, href)
                raw_links.append((text, href))
        results.append({
            "title": show_title,
            "link": show_url,
            "img_url": img_url,
            "source": "DramaCool",
            "qualities": self.detect_qualities(raw_links)
        })
        return results
