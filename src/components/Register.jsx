// frontend/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        navigate("/login");
      } else {
        alert("❌ Kayıt başarısız: " + (data.message || "Bilinmeyen hata"));
      }
    } catch (err) {
      alert("❌ Sunucu hatası: " + err.message);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-16 bg-gray-800 p-6 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Kayıt Ol</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}