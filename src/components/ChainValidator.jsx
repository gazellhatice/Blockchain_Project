import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

export default function ChainValidator() {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("⛔ Yetkisiz erişim! Lütfen tekrar giriş yapın.");
          } else {
            throw new Error("🚫 Sunucu hatası oluştu.");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (typeof data.valid !== "boolean") {
          throw new Error("⚠️ Beklenmeyen veri: 'valid' alanı eksik.");
        }
        setIsValid(data.valid);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Doğrulama hatası:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-indigo-400 animate-fade-in">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="text-lg font-medium">Zincir doğrulanıyor, lütfen bekleyin...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-24 bg-gray-800 p-10 rounded-2xl shadow-lg text-center animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-indigo-300">⛓ Zincir Doğrulama Sonucu</h2>

      {error ? (
        <div className="bg-yellow-700 text-yellow-300 px-6 py-4 rounded-lg shadow-md text-lg flex items-center gap-3 justify-center">
          <FaExclamationTriangle className="text-2xl" />
          {error}
        </div>
      ) : isValid ? (
        <div className="bg-green-700 text-green-200 px-6 py-6 rounded-xl shadow-lg text-2xl font-semibold flex items-center justify-center gap-3">
          <FaCheckCircle className="text-3xl" />
          Blockchain zinciri <span className="underline">GEÇERLİ</span> ✅
        </div>
      ) : (
        <div className="bg-red-700 text-red-200 px-6 py-6 rounded-xl shadow-lg text-2xl font-semibold flex items-center justify-center gap-3">
          <FaTimesCircle className="text-3xl" />
          Blockchain zinciri <span className="underline">GEÇERSİZ</span> ❌
        </div>
      )}
    </div>
  );
}
