import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaCube } from "react-icons/fa";

export default function Dashboard() {
  const [action, setAction] = useState("");
  const [chain, setChain] = useState([]);
  const [valid, setValid] = useState(null);

  const token = localStorage.getItem("token");

  const addTransaction = async () => {
    try {
      const res = await fetch("http://localhost:5000/add_transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: action.trim() }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      alert(data.message);
      fetchChain();
    } catch (err) {
      alert("İşlem eklenemedi: " + err.message);
    }
  };

  const fetchChain = async () => {
    try {
      const res = await fetch("http://localhost:5000/chain", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Zincir verisi alınamadı");
      const data = await res.json();
      setChain(data);
    } catch (err) {
      setChain([]);
    }
  };

  const validateChain = async () => {
    try {
      const res = await fetch("http://localhost:5000/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setValid(data.valid);
    } catch (err) {
      setValid(null);
    }
  };

  const deleteBlock = async (id) => {
  if (!window.confirm(`Bu bloğu silmek istediğine emin misin?`)) return;

  try {
    const res = await fetch(`http://localhost:5000/delete_block/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });


      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Silme işlemi başarısız");

      alert(data.message);
      fetchChain();
    } catch (err) {
      alert("❌ Blok silinemedi: " + err.message);
    }
  };

  useEffect(() => {
    if (token) fetchChain();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-400">📊 Blockchain Dashboard</h2>

      {/* Yeni İşlem Ekle */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Yeni İşlem Ekle
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="İşlem açıklaması"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            onClick={addTransaction}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-all"
          >
            İşlemi Ekle
          </button>
        </div>
      </div>

      {/* Zincir Doğrulama */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaCheckCircle /> Zincir Geçerlilik Kontrolü
        </h3>
        <button
          onClick={validateChain}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-medium"
        >
          Zinciri Kontrol Et
        </button>
        {valid !== null && (
          <p className="mt-4 text-lg font-semibold">
            Zincir Durumu:{" "}
            {valid ? (
              <span className="text-green-400 flex items-center gap-2">
                <FaCheckCircle /> Geçerli
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-2">
                <FaTimesCircle /> Geçersiz
              </span>
            )}
          </p>
        )}
      </div>

      {/* Blockchain Listesi */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-300">
          <FaCube /> Bloklar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chain.map((block, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-5 relative hover:scale-[1.02] transition-transform duration-300"
            >
              <p><strong>🧱 Index:</strong> {block.index}</p>
              <p><strong>⏰ Zaman:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
              <p><strong>📄 İşlemler:</strong> {JSON.stringify(block.transactions)}</p>
              <p><strong>🔗 Hash:</strong> <span className="text-xs break-all">{block.hash}</span></p>
              <p><strong>⬅️ Önceki Hash:</strong> <span className="text-xs break-all">{block.previous_hash}</span></p>

              {block.index !== 0 && (
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-xs rounded"
                > Sil
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
