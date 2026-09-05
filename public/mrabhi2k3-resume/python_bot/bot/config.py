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

import os
from dotenv import load_dotenv

load_dotenv()

API_ID = int(os.getenv("API_ID", "0"))
API_HASH = os.getenv("API_HASH", "")
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

CHANNEL_ID = os.getenv("CHANNEL_ID", "")
try:
    CHANNEL_ID = int(CHANNEL_ID)
except ValueError:
    pass

LOG_CHANNEL = os.getenv("LOG_CHANNEL", "")
try:
    LOG_CHANNEL = int(LOG_CHANNEL)
except ValueError:
    pass
if not LOG_CHANNEL:
    LOG_CHANNEL = CHANNEL_ID

BACKUP_CHANNEL = os.getenv("BACKUP_CHANNEL", "")
try:
    BACKUP_CHANNEL = int(BACKUP_CHANNEL)
except ValueError:
    pass

FORCESUB_CHANNEL = os.getenv("FORCESUB_CHANNEL", "")
try:
    FORCESUB_CHANNEL = int(FORCESUB_CHANNEL)
except ValueError:
    pass

FORCESUB_CHANNEL_LINK = os.getenv("FORCESUB_CHANNEL_LINK", "")

ENABLE_FORCESUB = os.getenv("ENABLE_FORCESUB", "False").strip().lower() in ("true", "1", "t", "yes", "y")
POST_TO_CHANNEL = os.getenv("POST_TO_CHANNEL", "False").strip().lower() in ("true", "1", "t", "yes", "y")
AUTO_SCRAPE = os.getenv("AUTO_SCRAPE", "False").strip().lower() in ("true", "1", "t", "yes", "y")

CLOUDFLARE_BASE_URL = os.getenv("CLOUDFLARE_BASE_URL", "")
BUTTON_UPLOAD = os.getenv("BUTTON_UPLOAD", "True").strip().lower() in ("true", "1", "t", "yes", "y")
CHECK_INTERVAL = int(os.getenv("CHECK_INTERVAL", "600"))
MONGO_SRV = os.getenv("MONGO_SRV", "")