import base64
import hashlib
from cryptography.fernet import Fernet
from app.core.config import settings

# 1. SHA-256 hash guarantees we always get exactly 32 bytes from any key length/type
key_bytes = hashlib.sha256(settings.FERNET_KEY.encode()).digest()

# 2. Base64 encoding the 32 bytes generates a valid url-safe Fernet key representation
fernet_key = base64.urlsafe_b64encode(key_bytes)

cipher_password = Fernet(fernet_key)

def encryptPassword(passcode: str) -> str:
    return cipher_password.encrypt(passcode.encode()).decode()

def decryptPassword(passcode: str) -> str:
    return cipher_password.decrypt(passcode.encode()).decode()
