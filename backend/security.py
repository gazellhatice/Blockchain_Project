# security.py

from cryptography.fernet import Fernet

# Uygulama başlatılırken bu key sabit olmalı. Gerçek ortamda .env dosyasından alınmalı
SECRET_ENCRYPTION_KEY = b'MD4UKx5yGlHvR3VRWaO3oI7TgaKkSHlU0VckU4quvWk='
fernet = Fernet(SECRET_ENCRYPTION_KEY)

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
