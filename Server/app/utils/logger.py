import logging
import os
import colorlog
from logging.handlers import RotatingFileHandler

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Define levels and formatter similar to the Node.js implementation
log_level = logging.DEBUG if os.getenv("ENVIRONMENT", "development").lower() == "development" else logging.WARNING

# Custom format to match `YYYY-MM-DD HH:mm:ss:ms`
log_format = "%(asctime)s %(levelname)s: %(message)s"
date_format = "%Y-%m-%d %H:%M:%S"

# Initialize logger
logger = logging.getLogger("SocityOne")
logger.setLevel(log_level)

# 1. Console Handler with colors
console_handler = logging.StreamHandler()
console_handler.setLevel(log_level)
console_formatter = colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s %(levelname)s: %(message)s",
    datefmt=date_format,
    log_colors={
        'DEBUG': 'white',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    }
)
console_handler.setFormatter(console_formatter)

# 2. Error File Handler
error_file_handler = RotatingFileHandler("logs/error.log", maxBytes=10485760, backupCount=5)
error_file_handler.setLevel(logging.ERROR)
error_file_formatter = logging.Formatter(log_format, datefmt=date_format)
error_file_handler.setFormatter(error_file_formatter)

# 3. All Logs File Handler
all_file_handler = RotatingFileHandler("logs/all.log", maxBytes=10485760, backupCount=5)
all_file_handler.setLevel(log_level)
all_file_formatter = logging.Formatter(log_format, datefmt=date_format)
all_file_handler.setFormatter(all_file_formatter)

# Add handlers to the logger
if not logger.handlers:
    logger.addHandler(console_handler)
    logger.addHandler(error_file_handler)
    logger.addHandler(all_file_handler)
