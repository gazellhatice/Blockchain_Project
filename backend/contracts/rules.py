# contracts/rules.py

def validate_transaction(user, action):
    """
    Smart contract benzeri işlem doğrulama fonksiyonu.
    - Boş veya çok kisa işlemler reddedilir.
    - "delete" gibi yasakli kelimeler engellenir.
    """
    if not action or len(action.strip()) < 3:
        raise ValueError("İşlem çok kisa veya boş olamaz. ( İşlem metni en az 3 karakter uzunluğunda ve boşluk içermeyen bir şey olmali (örn: Kitap satin alindi)")

    if "delete" in action.lower():
        raise ValueError("❌ 'delete' kelimesi içeren işlemler yasaktir.")

    return True