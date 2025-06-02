# 🛡️ Blockchain_Project: Dijital Kimlik ve Giriş Doğrulama Sistemi

Bu proje, kullanıcıların dijital kimliklerini güvenli bir şekilde doğrulayarak gerçekleştirdikleri işlemleri **blockchain** yapısında kayıt altına alan bir web uygulamasıdır.  
Amaç, hem kimlik doğrulamanın güvenliğini artırmak hem de işlem geçmişinin **şeffaf ve değiştirilemez** biçimde saklanmasını sağlamaktır.

## 🚀 Projede Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| 🖥️ Frontend | React.js, Tailwind CSS |
| 🧠 Backend | Python (Flask) |
| 🧱 Veritabanı | PostgreSQL |
| 🔗 Blockchain | Custom blockchain (Python ile yazıldı) |
| 🔒 Güvenlik | JWT Authentication, SHA-256 hash |
| 🐘 ORM | SQLAlchemy |
| 📦 Paket Yönetimi | pip, npm |

---

## 🔧 Özellikler

- 🔐 **Kullanıcı Kayıt ve Giriş**  
  - Şifreler hash’lenerek saklanır (bcrypt).
  - JWT token ile oturum yönetimi.

- 📜 **İşlem Ekleme ve Blockchain'e Yazma**  
  - Her işlem bir blok olarak blockchain’e eklenir.
  - Her blok hash’lenir ve önceki blokla ilişkilendirilir.

- 📚 **İşlem Geçmişini Listeleme**  
  - Kullanıcılar kendi geçmiş işlemlerini görebilir.
  - Tüm blok zinciri istemciye görsel olarak sunulur.

- 🛡️ **Veri Mahremiyeti ve Güvenlik**  
  - Parola güvenliği
  - JWT ile endpoint güvenliği
  - Block integrity kontrolü

---

## 📁 Proje Yapısı

```bash
Blockchain_Project/
│
├── backend/
│   ├── app.py
│   ├── blockchain/
│   ├── models/
│   ├── routes/
│   ├── auth/
│   └── database.py
│
├── frontend-ui/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
