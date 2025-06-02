import React, { useState } from "react";
import {
  FaUser, FaLock, FaEnvelope, FaCamera, FaSave
} from "react-icons/fa";


export default function Profile() {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await fetch("http://localhost:5000/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);
      setError("");
    } catch {
      setError("❌ Profil fotoğrafı yüklenemedi.");
      setMessage("");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ Profil başarıyla güncellendi!");
      setError("");
    } catch (err) {
      setError("❌ " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="profile-container">
      <section className="profile-photo-section">
        <h2 className="section-title">Profil Fotoğrafı</h2>

        {preview ? (
          <img src={preview} alt="Avatar" className="avatar-preview" />
        ) : (
          <div className="avatar-placeholder">
            <FaUser />
          </div>
        )}

        <label className="file-upload-button">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden-input"
          />
          📷 Fotoğraf Seç
        </label>

        <br />
        <button onClick={handleUploadAvatar} className="upload-button">
          <FaSave /> Fotoğrafı Yükle
        </button>
      </section>

      <section className="profile-form-section">
        <h2 className="section-title">Kullanıcı Bilgileri</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="örn: hatice_gzl"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>E-posta</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Yeni Şifre</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleUpdateProfile} className="update-button">
            <FaSave /> Bilgileri Güncelle
          </button>
        </div>
      </section>

      {(message || error) && (
        <div className="feedback-message">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}