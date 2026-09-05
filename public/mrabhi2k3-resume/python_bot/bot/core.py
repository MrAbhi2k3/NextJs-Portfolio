# Author: MrAbhi2k3
# GitHub: https://github.com/MrAbhi2k3
#
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

import asyncio
import gc
import hashlib
import logging
import math
import os
import random
import re
import shutil
import subprocess
import time
from urllib.parse import urlparse
import requests
import cloudscraper
import warpcrypto
import aiohttp
from bs4 import BeautifulSoup
from wzgram import Client, filters, enums
from wzgram.types import InlineKeyboardMarkup, InlineKeyboardButton, Message
from wzgram.errors import UserNotParticipant
from . import config
from .database import Database
from .scrapers import DramakeyScraper, KissasiaScraper, DramacoolScraper, strip_title_extras

logging.basicConfig(format="[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger("Asianscraper")

client = Client(
    "bot_session",
    api_id=config.API_ID,
    api_hash=config.API_HASH,
    bot_token=config.BOT_TOKEN,
    workers=8,
    max_concurrent_transmissions=4,
    max_message_cache_size=200
)
db = Database(config.MONGO_SRV)
bot_username = ""
forcesub_invite_link = ""

scrapers = [
    DramakeyScraper(),
    KissasiaScraper(),
    DramacoolScraper()
]

def get_ffmpeg_path():
    p = shutil.which("ffmpeg")
    if p:
        return p
    local_app = os.environ.get("LOCALAPPDATA", "")
    winget_ffmpeg = os.path.join(
        local_app,
        r"Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe"
    )
    if os.path.exists(winget_ffmpeg):
        return winget_ffmpeg
    return None

async def check_user_sub(user_id):
    if not config.ENABLE_FORCESUB:
        return True
    if not config.FORCESUB_CHANNEL:
        return True
    try:
        await client.get_chat_member(config.FORCESUB_CHANNEL, user_id)
        return True
    except UserNotParticipant:
        return False
    except Exception as e:
        logger.warning(f"Error checking user sub: {e}")
        return True

def get_hash(link):
    return hashlib.sha256(link.encode("utf-8")).hexdigest()[:16]

async def check_updates():
    while True:
        try:
            logger.info("Starting scheduled scraper check...")
            await scan_and_post()
            gc.collect()
            logger.info("Scheduled scraper check finished.")
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error during check_updates: {e}")
        await asyncio.sleep(config.CHECK_INTERVAL)

def format_eta(seconds):
    if not seconds or seconds < 0 or math.isinf(seconds) or math.isnan(seconds):
        return "--:--"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def get_progress_bar(action_title, show_title, ep_num, filename, current, total, speed, start_time):
    cur_mb = current / 1024 / 1024
    speed_mb = speed / 1024 / 1024 if speed else 0
    speed_text = f"{speed_mb:.2f} MB/s" if speed_mb >= 0.05 else f"{(speed or 0) / 1024:.1f} KB/s"
    
    clean_show = strip_title_extras(show_title) if show_title else "AsianDrama"
    ep_str = f"Episode {ep_num:02d}" if ep_num else "Episode"
    
    if not total or total <= 0:
        elapsed = time.time() - start_time
        return (
            f"<blockquote>🎬 <b>{clean_show} ({ep_str})</b></blockquote>\n\n"
            f"{action_title}\n"
            f"📁 <b>File:</b> <code>{filename}</code>\n"
            f"📦 <b>Transferred:</b> <code>{cur_mb:.1f} MB</code>\n"
            f"⚡ <b>Speed:</b> <code>{speed_text}</code>\n"
            f"⏱️ <b>Time Elapsed:</b> <code>{format_eta(elapsed)}</code>"
        )
    
    percentage = (current / total) * 100
    completed = int(percentage / 10)
    completed = max(0, min(10, completed))
    bar = "■" * completed + "□" * (10 - completed)
    tot_mb = total / 1024 / 1024
    
    remaining_bytes = max(0, total - current)
    eta_sec = (remaining_bytes / speed) if speed and speed > 0 else 0
    eta_str = format_eta(eta_sec)

    return (
        f"<blockquote>🎬 <b>{clean_show} ({ep_str})</b></blockquote>\n\n"
        f"{action_title}\n"
        f"📁 <b>File:</b> <code>{filename}</code>\n"
        f"[{bar}] {percentage:.1f}%\n"
        f"⚡ <b>Speed:</b> <code>{speed_text}</code>\n"
        f"⏳ <b>ETA:</b> <code>{eta_str}</code>\n"
        f"📦 <b>Size:</b> <code>{cur_mb:.1f} MB / {tot_mb:.1f} MB</code>"
    )

class UploadProgress:
    def __init__(self, filename, log_msg_id, show_title="", ep_num=1):
        self.filename = filename
        self.log_msg_id = log_msg_id
        self.show_title = show_title
        self.ep_num = ep_num
        self.last_update = 0
        self.last_bytes = 0
        self.start_time = time.time()

    async def callback(self, current, total):
        now = time.time()
        time_diff = now - self.last_update
        if (time_diff >= 3) or (current == total):
            bytes_diff = current - self.last_bytes
            speed = (bytes_diff / time_diff) if time_diff > 0 else 0
            self.last_update = now
            self.last_bytes = current
            bar_text = get_progress_bar(
                action_title="🚀 <b>Uploading Episode to Channel...</b>",
                show_title=self.show_title,
                ep_num=self.ep_num,
                filename=self.filename,
                current=current,
                total=total,
                speed=speed,
                start_time=self.start_time
            )
            try:
                await client.edit_message_text(
                    chat_id=config.LOG_CHANNEL,
                    message_id=self.log_msg_id,
                    text=bar_text,
                    parse_mode=enums.ParseMode.HTML
                )
            except Exception:
                pass

async def download_file_with_progress(url, filename, log_msg_id, show_title="", ep_num=1):
    logger.info(f"Starting download from URL: {url} -> File: {filename}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://kissasia.biz/"
    }
    connector = aiohttp.TCPConnector(limit=0, force_close=False, enable_cleanup_closed=True)
    async with aiohttp.ClientSession(connector=connector, read_bufsize=1024 * 1024) as session:
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=1800, connect=60)) as r:
            total_size = int(r.headers.get("Content-Length", 0))
            current_size = 0
            last_update = 0
            last_bytes = 0
            start_time = time.time()
            with open(filename, "wb") as f:
                async for chunk in r.content.iter_chunked(1024 * 1024):
                    f.write(chunk)
                    current_size += len(chunk)
                    now = time.time()
                    time_diff = now - last_update
                    if (time_diff >= 3) or (current_size == total_size):
                        bytes_diff = current_size - last_bytes
                        speed = (bytes_diff / time_diff) if time_diff > 0 else 0
                        last_update = now
                        last_bytes = current_size
                        bar_text = get_progress_bar(
                            action_title="📥 <b>Downloading Episode...</b>",
                            show_title=show_title,
                            ep_num=ep_num,
                            filename=filename,
                            current=current_size,
                            total=total_size,
                            speed=speed,
                            start_time=start_time
                        )
                        try:
                            await client.edit_message_text(
                                chat_id=config.LOG_CHANNEL,
                                message_id=log_msg_id,
                                text=bar_text,
                                parse_mode=enums.ParseMode.HTML
                            )
                        except Exception:
                            pass
    gc.collect()
    logger.info(f"Download finished: {filename}")

def resolve_downloadwella_link(url):
    if "downloadwella.com" not in url:
        return url
    try:
        scraper = cloudscraper.create_scraper()
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        r = scraper.get(url, headers=headers, timeout=12)
        if r.status_code != 200:
            return url
        soup = BeautifulSoup(r.text, "html.parser")
        form = soup.find("form")
        if not form:
            return url
        payload = {}
        for inp in form.find_all("input"):
            name = inp.get("name")
            val = inp.get("value", "")
            if name:
                payload[name] = val
        r2 = scraper.post(url, data=payload, headers=headers, timeout=15)
        if r2.status_code != 200:
            return url
        soup2 = BeautifulSoup(r2.text, "html.parser")
        for a in soup2.find_all("a"):
            href = a.get("href", "")
            if href.endswith(".mkv") or href.endswith(".mp4") or (href and ".mkv" in href):
                return href
    except Exception:
        pass
    return url

def clean_filename(filename, show_title="", ep_num=1, quality="720p"):
    # Always format as "{Show Title} Episode {ep_num:02d} [{quality}] [@KDramazFlix]{ext}"
    ext = ".mkv"
    if filename:
        name_only = filename.split("?")[0].split("#")[0]
        _, found_ext = os.path.splitext(name_only)
        if found_ext.lower() in [".mp4", ".mkv", ".webm"]:
            ext = found_ext.lower()
            
    clean_show = strip_title_extras(show_title) if show_title else "AsianDrama"
    return f"{clean_show} Episode {ep_num:02d} [{quality}] [@KDramazFlix]{ext}"

def clean_show_title(title):
    return strip_title_extras(title)

def get_base_show_link(url):
    base = url.split("?")[0].split("#")[0]
    base = re.sub(r'-episode-\d+/?$', '/', base)
    return base

def extract_episode_number(title):
    match = (
        re.search(r"\.s\d+e(\d+)", title, re.IGNORECASE) or
        re.search(r"episode\s*(\d+)", title, re.IGNORECASE) or
        re.search(r"ep\s*(\d+)", title, re.IGNORECASE) or
        re.search(r"ep\.\s*(\d+)", title, re.IGNORECASE) or
        re.search(r"[Ee](\d+)", title)
    )
    if match:
        return int(match.group(1))
    return 1

def build_episode_caption(show_title, ep_num, quality, subtitles=""):
    clean_show = strip_title_extras(show_title) if show_title else "AsianDrama"
    sub_line = f"\n🌐 <b>Subtitles:</b> <code>{subtitles}</code>" if subtitles else ""
    return (
        f"<blockquote>🎬 <b>{clean_show}</b></blockquote>\n\n"
        f"📺 <b>Episode:</b> <code>{ep_num:02d}</code>\n"
        f"💿 <b>Quality:</b> <code>{quality}</code>"
        f"{sub_line}\n\n"
        f"⚡ <b>Uploaded by:</b> @MoviesFlixers_DL"
    )

async def mux_subtitles_into_video(video_path, sub_urls, sub_names_str):
    ffmpeg_bin = get_ffmpeg_path()
    if not ffmpeg_bin or not sub_urls:
        return video_path

    logger.info(f"Muxing {len(sub_urls)} subtitles into {video_path}...")
    sub_names = [s.strip() for s in sub_names_str.split(",") if s.strip()]
    downloaded_subs = []
    
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://kissasia.biz/"
    }
    
    uid = hashlib.md5(video_path.encode("utf-8")).hexdigest()[:8]
    scraper = cloudscraper.create_scraper()
    for idx, sub_url in enumerate(sub_urls):
        try:
            r = scraper.get(sub_url, headers=headers, timeout=12)
            if r.status_code == 200:
                ext = ".vtt" if sub_url.endswith(".vtt") else ".srt"
                temp_sub = f"temp_sub_{uid}_{idx}{ext}"
                with open(temp_sub, "wb") as sf:
                    sf.write(r.content)
                
                lang_name = sub_names[idx] if idx < len(sub_names) else f"Track_{idx+1}"
                downloaded_subs.append((temp_sub, lang_name))
        except Exception as e:
            logger.warning(f"Failed to download subtitle from {sub_url}: {e}")

    if not downloaded_subs:
        return video_path

    base, _ = os.path.splitext(video_path)
    output_path = f"{base}_muxed.mkv"

    cmd = [ffmpeg_bin, "-y", "-i", video_path]
    for sub_file, _ in downloaded_subs:
        cmd.extend(["-i", sub_file])

    cmd.extend(["-map", "0"])
    for idx in range(len(downloaded_subs)):
        cmd.extend(["-map", f"{idx+1}:0"])

    cmd.extend(["-c", "copy"])
    for idx, (_, lang_name) in enumerate(downloaded_subs):
        cmd.extend([f"-metadata:s:s:{idx}", f"title={lang_name}"])

    cmd.append(output_path)

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()
        if proc.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            logger.info(f"Subtitles successfully muxed into {output_path}")
            if os.path.abspath(video_path) != os.path.abspath(output_path) and os.path.exists(video_path):
                try:
                    os.remove(video_path)
                except Exception:
                    pass
            video_path = output_path
        else:
            logger.warning("FFmpeg muxing failed or produced empty file; keeping original video.")
            if os.path.exists(output_path):
                try:
                    os.remove(output_path)
                except Exception:
                    pass
    except Exception as mux_err:
        logger.error(f"Error executing ffmpeg mux: {mux_err}")
        if os.path.exists(output_path):
            try:
                os.remove(output_path)
            except Exception:
                pass
    finally:
        for sub_file, _ in downloaded_subs:
            if os.path.exists(sub_file):
                try:
                    os.remove(sub_file)
                except Exception:
                    pass

    return video_path

async def download_and_upload_document(item, quality, direct_link, show_title, ep_num):
    if "downloadwella.com" in direct_link:
        logger.info(f"Resolving downloadwella link: {direct_link}")
        resolved = resolve_downloadwella_link(direct_link)
        if resolved != direct_link:
            logger.info(f"Successfully resolved to direct file link: {resolved}")
            direct_link = resolved

    original_filename = direct_link.split("/")[-1].split("?")[0]
    local_filename = clean_filename(original_filename, show_title=show_title, ep_num=ep_num, quality=quality)
    downloaded_target = local_filename

    logger.info(f"Processing download and upload of {local_filename}")
    log_msg = await client.send_message(
        chat_id=config.LOG_CHANNEL,
        text=f"🚀 <b>Initializing file download...</b>\n\n📁 <b>File:</b> <code>{local_filename}</code>",
        parse_mode=enums.ParseMode.HTML
    )

    try:
        await download_file_with_progress(direct_link, local_filename, log_msg.id, show_title=show_title, ep_num=ep_num)
        
        sub_urls = item.get("sub_urls", [])
        subtitles = item.get("subtitles", "")
        if sub_urls:
            await client.edit_message_text(
                chat_id=config.LOG_CHANNEL,
                message_id=log_msg.id,
                text=f"🔄 <b>Muxing Subtitles into Episode...</b>\n\n📁 <b>File:</b> <code>{local_filename}</code>\n🌐 <b>Subtitles:</b> <code>{subtitles}</code>",
                parse_mode=enums.ParseMode.HTML
            )
            local_filename = await mux_subtitles_into_video(local_filename, sub_urls, subtitles)

        progress = UploadProgress(local_filename, log_msg.id, show_title=show_title, ep_num=ep_num)
        caption = build_episode_caption(show_title, ep_num, quality, subtitles)
        thumb_path = "bot/logo.png" if os.path.exists("bot/logo.png") else None
        
        logger.info(f"Uploading file: {local_filename} to Telegram LOG_CHANNEL (thumb={thumb_path})")
        
        msg = await client.send_document(
            chat_id=config.LOG_CHANNEL,
            document=local_filename,
            caption=caption,
            thumb=thumb_path,
            force_document=True,
            parse_mode=enums.ParseMode.HTML,
            progress=progress.callback
        )
        
        logger.info(f"Successfully uploaded: {local_filename} with message ID {msg.id}")
        await client.edit_message_text(
            chat_id=config.LOG_CHANNEL,
            message_id=log_msg.id,
            text=f"✅ <b>Successfully Processed!</b>\n\n📁 <b>File:</b> <code>{local_filename}</code>\n<b>Status:</b> Uploaded",
            parse_mode=enums.ParseMode.HTML
        )
        return msg.id
    except Exception as e:
        logger.error(f"Processing failed for file: {local_filename}. Error: {str(e)}")
        try:
            await client.edit_message_text(
                chat_id=config.LOG_CHANNEL,
                message_id=log_msg.id,
                text=f"❌ <b>Failed to Process!</b>\n\n📁 <b>File:</b> <code>{local_filename}</code>\n<b>Error:</b> <code>{str(e)}</code>",
                parse_mode=enums.ParseMode.HTML
            )
        except Exception:
            pass
        return None
    finally:
        # Guarantee deletion of downloaded / muxed file from local disk
        for fpath in [local_filename, downloaded_target]:
            if fpath and os.path.exists(fpath):
                try:
                    os.remove(fpath)
                    logger.info(f"Cleaned up local file: {fpath}")
                except Exception as del_err:
                    logger.warning(f"Could not remove local file {fpath}: {del_err}")

async def process_scraped_items(items, manual_chat_id=None):
    if not items:
        if manual_chat_id:
            await client.send_message(manual_chat_id, "No downloadable episode links found for this URL.")
        return

    shows = {}
    for item in items:
        base_link = get_base_show_link(item["link"])
        if base_link not in shows:
            shows[base_link] = {
                "base_link": base_link,
                "title": clean_show_title(item["title"].split(" - ")[0].strip()),
                "img_url": item.get("img_url", ""),
                "source": item.get("source", "AsianDrama"),
                "episodes": []
            }
        shows[base_link]["episodes"].append(item)
        
    for base_link, show in shows.items():
        show_id = get_hash(base_link)
        existing = db.get_file_qualities(show_id)
        if existing:
            qualities = existing.get("qualities", {})
            show_title = clean_show_title(existing.get("title", show["title"]))
        else:
            qualities = {}
            show_title = clean_show_title(show["title"])
        
        # Build lookup of already processed episodes per quality to resume exactly where left off
        already_uploaded_eps = {}
        for q, ep_list in qualities.items():
            if not q.startswith("_"):
                already_uploaded_eps[q] = {ep_info["episode"] for ep_info in ep_list if "episode" in ep_info}

        # Sort episodes strictly by episode number (1, 2, 3...)
        sorted_episodes = sorted(show["episodes"], key=lambda x: extract_episode_number(x["title"]))
        total_eps = len(sorted_episodes)
        logger.info(f"Starting resume-capable processing for show: {show_title} ({total_eps} episodes)")
        if manual_chat_id:
            await client.send_message(
                manual_chat_id,
                f"<blockquote>🎬 <b>Processing show:</b> <code>{show_title}</code>\n"
                f"Found {total_eps} episode(s). Processing strictly in order...</blockquote>",
                parse_mode=enums.ParseMode.HTML
            )

        updated = False
        show_failed = False
        for ep_item in sorted_episodes:
            if show_failed:
                break

            ep_num = extract_episode_number(ep_item["title"])
            qualities_map = ep_item.get("qualities", {})
            subtitles = ep_item.get("subtitles", "")
            
            if subtitles:
                qualities["_subtitles"] = subtitles
                
            for q, q_url in qualities_map.items():
                # Check if this episode is already uploaded in DB
                if q in already_uploaded_eps and ep_num in already_uploaded_eps[q]:
                    logger.info(f"Skipping already uploaded: {show_title} Ep {ep_num:02d} ({q})")
                    continue
                    
                logger.info(f"Processing Ep {ep_num:02d} ({q}). Must complete before starting next episode.")
                msg_id = None
                for attempt in range(2):
                    msg_id = await download_and_upload_document(ep_item, q, q_url, show_title, ep_num)
                    if msg_id:
                        break
                    logger.warning(f"Attempt {attempt + 1} failed for {show_title} Ep {ep_num:02d}. Retrying...")
                    await asyncio.sleep(5)

                if msg_id:
                    if q not in qualities:
                        qualities[q] = []
                    qualities[q].append({"episode": ep_num, "msg_id": msg_id})
                    if q not in already_uploaded_eps:
                        already_uploaded_eps[q] = set()
                    already_uploaded_eps[q].add(ep_num)
                    
                    db.save_file_qualities(show_id, show_title, qualities)
                    db.mark_posted(ep_item["link"], ep_item["title"])
                    updated = True
                    gc.collect()
                else:
                    logger.error(f"Episode {ep_num:02d} ({q}) failed to download/upload after retries. Pausing show queue to avoid skipping episodes!")
                    if manual_chat_id:
                        await client.send_message(
                            manual_chat_id,
                            f"⚠️ <b>Notice:</b> Failed to upload <code>{show_title}</code> <b>Episode {ep_num:02d}</b>.\n"
                            f"Stopping further episodes for this show until resolved.",
                            parse_mode=enums.ParseMode.HTML
                        )
                    show_failed = True
                    break
                    
        logger.info(f"Completed processing for show: {show_title}")
        if updated or not existing:
            db.save_file_qualities(show_id, show_title, qualities)
            
            if manual_chat_id:
                await client.send_message(
                    manual_chat_id,
                    f"<blockquote>✅ <b>Completed processing for {show_title}!</b>\n"
                    f"📥 <b>Batch Link:</b> <code>https://t.me/{bot_username}?start=batch_{show_id}_720p</code></blockquote>",
                    parse_mode=enums.ParseMode.HTML
                )

            if not config.POST_TO_CHANNEL:
                logger.info(f"Posting to channel is disabled (POST_TO_CHANNEL={config.POST_TO_CHANNEL}). Skipping channel post for: {show_title}")
                db.mark_posted(base_link, show_title)
                continue

            subtitles = qualities.get("_subtitles", "")
            sub_line = f"\n🌐 <b>Subtitles:</b> <code>{subtitles}</code>" if subtitles else ""
            caption = (
                f"<blockquote>🎬 <b>NEW DRAMA SHOW UPDATES</b> 🎬</blockquote>\n\n"
                f"📝 <b>Title:</b> <code>{show_title}</code>\n"
                f"ℹ️ <b>Source:</b> <code>{show['source']}</code>"
                f"{sub_line}\n\n"
                f"⚡ <b>Uploaded by:</b> @MoviesFlixers_DL"
            )
            
            keyboard = []
            row = []
            for q in sorted([k for k in qualities.keys() if not k.startswith("_")]):
                start_url = f"https://t.me/{bot_username}?start=batch_{show_id}_{q}"
                row.append(InlineKeyboardButton(f"📥 {q}", url=start_url))
                if len(row) == 3:
                    keyboard.append(row)
                    row = []
            if row:
                keyboard.append(row)
            reply_markup = InlineKeyboardMarkup(keyboard) if keyboard else None
                
            channel_msg_id = qualities.get("_channel_msg_id")
            local_img_path = ""
            if show["img_url"] and not channel_msg_id:
                try:
                    logger.info(f"Downloading poster locally from: {show['img_url']}")
                    img_r = requests.get(show["img_url"], timeout=15)
                    if img_r.status_code == 200:
                        local_img_path = f"poster_{show_id}.jpg"
                        with open(local_img_path, "wb") as img_f:
                            img_f.write(img_r.content)
                        logger.info(f"Poster downloaded locally: {local_img_path}")
                except Exception as img_err:
                    logger.error(f"Failed to download poster locally: {str(img_err)}")
                    
            try:
                if channel_msg_id:
                    logger.info(f"Editing existing channel show card message ID: {channel_msg_id}")
                    await client.edit_message_text(
                        chat_id=config.CHANNEL_ID,
                        message_id=channel_msg_id,
                        text=caption,
                        reply_markup=reply_markup,
                        parse_mode=enums.ParseMode.HTML,
                        disable_web_page_preview=True
                    )
                else:
                    logger.info(f"Posting new show card to main channel: {show_title}")
                    if local_img_path and os.path.exists(local_img_path):
                        msg = await client.send_photo(
                            chat_id=config.CHANNEL_ID,
                            photo=local_img_path,
                            caption=caption,
                            reply_markup=reply_markup,
                            parse_mode=enums.ParseMode.HTML
                        )
                        qualities["_channel_msg_id"] = msg.id
                        db.save_file_qualities(show_id, show_title, qualities)
                        try:
                            os.remove(local_img_path)
                        except Exception:
                            pass
                    else:
                        msg = await client.send_message(
                            chat_id=config.CHANNEL_ID,
                            text=caption,
                            reply_markup=reply_markup,
                            parse_mode=enums.ParseMode.HTML,
                            disable_web_page_preview=True
                        )
                        qualities["_channel_msg_id"] = msg.id
                        db.save_file_qualities(show_id, show_title, qualities)
                db.mark_posted(base_link, show_title)
            except Exception as post_err:
                logger.error(f"Failed to post show card to channel: {str(post_err)}")
                if local_img_path and os.path.exists(local_img_path):
                    try:
                        os.remove(local_img_path)
                    except Exception:
                        pass
    items.clear()
    shows.clear()

async def scan_and_post():
    logger.info("Scanning scrapers for new updates...")
    for scraper in scrapers:
        try:
            logger.info(f"Running scraper: {scraper.__class__.__name__}")
            items = scraper.get_latest()
            logger.info(f"Found {len(items)} items from {scraper.__class__.__name__}")
            await process_scraped_items(items)
        except Exception as scraper_err:
            logger.error(f"Scraper error: {str(scraper_err)}")
            pass

async def delete_messages_after_delay(chat_id, message_ids, delay=1800):
    await asyncio.sleep(delay)
    try:
        await client.delete_messages(chat_id=chat_id, message_ids=message_ids)
    except Exception as e:
        logger.error(f"Failed to delete batch messages: {str(e)}")

@client.on_message(filters.command("start"))
async def start_handler(c: Client, message: Message):
    text = (message.text or "").strip()
    user_id = message.from_user.id if message.from_user else message.chat.id
    logger.info(f"Received /start from user ID: {user_id}")
    
    parts = text.split(maxsplit=1)
    if len(parts) > 1:
        param = parts[1]
        if param.startswith("batch_"):
            param_parts = param.split("_")
            if len(param_parts) >= 3:
                show_id = param_parts[1]
                quality = param_parts[2]
                logger.info(f"User requesting batch ID: {show_id} | Quality: {quality}")
                
                is_subbed = await check_user_sub(user_id)
                if not is_subbed:
                    logger.info(f"User ID: {user_id} is not subscribed to ForceSub channel.")
                    buttons = [
                        [InlineKeyboardButton("Join Channel", url=forcesub_invite_link or "https://t.me")],
                        [InlineKeyboardButton("Try Again", url=f"https://t.me/{bot_username}?start={param}")]
                    ]
                    await message.reply_text(
                        "You must join our channel to get the download files. Please join and try again.",
                        reply_markup=InlineKeyboardMarkup(buttons)
                    )
                    return
                    
                file_data = db.get_file_qualities(show_id)
                if file_data and quality in file_data["qualities"]:
                    episodes = file_data["qualities"][quality]
                    if not episodes:
                        await message.reply_text("No episodes found for this quality.")
                        return
                        
                    loading_msg = await message.reply_text("<b>Preparing your batch files... Please wait.</b>", parse_mode=enums.ParseMode.HTML)
                    episodes = sorted(episodes, key=lambda x: x["episode"])
                    sent_msg_ids = []
                    
                    subtitles = file_data["qualities"].get("_subtitles", "")
                    clean_title = clean_show_title(file_data.get("title", ""))
                    
                    for ep in episodes:
                        msg_id = ep.get("msg_id")
                        if msg_id:
                            try:
                                caption = build_episode_caption(clean_title, ep['episode'], quality, subtitles)
                                sent_msg = await client.copy_message(
                                    chat_id=message.chat.id,
                                    from_chat_id=config.LOG_CHANNEL,
                                    message_id=msg_id,
                                    caption=caption,
                                    parse_mode=enums.ParseMode.HTML
                                )
                                sent_msg_ids.append(sent_msg.id)
                            except Exception as copy_err:
                                logger.error(f"Failed to copy batch message ID {msg_id}: {str(copy_err)}")
                                
                    try:
                        await loading_msg.delete()
                    except Exception:
                        pass
                    
                    if sent_msg_ids:
                        delete_warn_msg = await message.reply_text(
                            "<blockquote>⚠️ <b>Your files will be deleted after 30 Mins. Forward and save them.</b></blockquote>",
                            reply_markup=InlineKeyboardMarkup([
                                [InlineKeyboardButton("Backup Channel", url="https://t.me/KDramazFlix")]
                            ]),
                            parse_mode=enums.ParseMode.HTML
                        )
                        sent_msg_ids.append(delete_warn_msg.id)
                        asyncio.create_task(delete_messages_after_delay(message.chat.id, sent_msg_ids, delay=1800))
                else:
                    await message.reply_text("Batch files not found or link has expired.")
                return
            
    await message.reply_text(
        "<blockquote>👋 <b>Hello! I am Asian Drama Uploader Bot.</b></blockquote>\n\n"
        "Send me any show URL (from <code>kissasia.biz</code>, <code>dramakey.com</code>, or <code>dramacool.sh</code>) "
        "and I will automatically scrape all episodes, mux subtitles, and upload them!\n\n"
        "<i>Automatic background scans are currently disabled. Send URLs on-demand.</i>",
        parse_mode=enums.ParseMode.HTML
    )

@client.on_message(filters.command("run"))
async def run_handler(c: Client, message: Message):
    await message.reply_text("Starting manual scan...")
    logger.info("Manual scan triggered by user.")
    await scan_and_post()
    gc.collect()
    logger.info("Manual scan completed.")
    await message.reply_text("Manual scan completed.")

@client.on_message(filters.regex(r"https?://[^\s]+"))
async def url_handler(c: Client, message: Message):
    text = (message.text or "").strip()
    match = re.search(r"https?://[^\s]+", text)
    if not match:
        return
    url = match.group(0)

    parsed = urlparse(url)
    domain = parsed.netloc.lower()

    scraper = None
    if "kissasia" in domain:
        scraper = KissasiaScraper()
    elif "dramakey" in domain:
        scraper = DramakeyScraper()
    elif "dramacool" in domain:
        scraper = DramacoolScraper()

    if not scraper:
        await message.reply_text(
            "Unsupported link. Supported domains: <code>kissasia.biz</code>, <code>dramakey.com</code>, <code>dramacool.sh</code>.",
            parse_mode=enums.ParseMode.HTML
        )
        return

    status_msg = await message.reply_text(
        f"🔍 <b>Analyzing show URL:</b> <code>{url}</code>\nPlease wait...",
        parse_mode=enums.ParseMode.HTML
    )
    try:
        items = scraper.scrape_show(url)
        if not items:
            await status_msg.edit_text("❌ Could not extract episodes from this URL. Please verify the URL.")
            return

        await status_msg.edit_text(
            f"✅ <b>Found {len(items)} episode(s)!</b>\nResuming / starting download, subtitle muxing, and upload to log channel...",
            parse_mode=enums.ParseMode.HTML
        )
        await process_scraped_items(items, manual_chat_id=message.chat.id)
    except Exception as e:
        logger.error(f"Error scraping URL {url}: {e}")
        await status_msg.edit_text(f"❌ <b>Error processing URL:</b> <code>{e}</code>", parse_mode=enums.ParseMode.HTML)

async def start_bot():
    global bot_username, forcesub_invite_link
    logger.info("Starting wzgram MTProto Client bot...")
    await client.start()
    me = await client.get_me()
    bot_username = me.username
    logger.info(f"Bot successfully started as @{bot_username}")
    
    if config.ENABLE_FORCESUB and config.FORCESUB_CHANNEL:
        try:
            logger.info(f"Querying join invite link for ForceSub channel: {config.FORCESUB_CHANNEL}")
            forcesub_invite_link = await client.export_chat_invite_link(config.FORCESUB_CHANNEL)
            logger.info(f"ForceSub invite link generated: {forcesub_invite_link}")
        except Exception as invite_err:
            logger.warning(f"Failed to auto-export invite link: {str(invite_err)}")
            forcesub_invite_link = config.FORCESUB_CHANNEL_LINK or ""
    else:
        forcesub_invite_link = config.FORCESUB_CHANNEL_LINK or ""
            
    if config.AUTO_SCRAPE:
        logger.info("Auto-scraping is enabled in config. Starting check_updates loop...")
        asyncio.create_task(check_updates())
    else:
        logger.info("Auto-scraping is disabled (AUTO_SCRAPE=False). Running purely on user show URLs or /run.")
    
    stop_event = asyncio.Event()
    try:
        await stop_event.wait()
    finally:
        await client.stop()