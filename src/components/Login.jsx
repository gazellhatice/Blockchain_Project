// frontend/src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Giriş başarılı!");
        navigate("/dashboard");
      } else {
        alert("❌ Giriş başarısız: " + (data.message || "Bilinmeyen hata"));
      }
    } catch (err) {
      alert("❌ Sunucu hatası: " + err.message);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-16 bg-gray-800 p-6 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Giriş Yap</h2>
      <form onSubmit={handleLogin} className="space-y-6">
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
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
