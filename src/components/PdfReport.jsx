import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

export default function PdfReport() {
  const generatePDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/chain", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Zincir verisi alınamadı (403 olabilir)");
      }

      const chain = await res.json();

      if (!Array.isArray(chain)) {
        console.error("Beklenmeyen veri tipi:", chain);
        alert("⚠️ Zincir verisi alınamadı. Lütfen giriş yaptığınızdan emin olun.");
        return;
      }

      const doc = new jsPDF();

      const tableData = chain.map((block) => [
        block.index,
        new Date(block.timestamp * 1000).toLocaleString(),
        block.transactions.map((t) => `${t.user}: ${t.action}`).join("\n"),
        block.hash.slice(0, 10) + "...",
        block.previous_hash.slice(0, 10) + "...",
      ]);

      doc.setFontSize(16);
      doc.text("📄 Blockchain Raporu", 14, 20);

      autoTable(doc, {
        head: [["Blok", "Zaman", "İşlem", "Hash", "Önceki Hash"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
      });

      doc.save("blockchain_raporu.pdf");
    } catch (err) {
      console.error("PDF oluşturulamadı:", err.message);
      alert("❌ PDF oluşturulamadı: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-8 bg-gray-800 rounded-2xl shadow-lg text-center animate-fade-in">
      <h2 className="text-3xl font-extrabold text-red-400 mb-6 flex justify-center items-center gap-3">
        <FaFilePdf className="text-red-500 text-4xl" />
        Blockchain PDF Raporu
      </h2>
      <p className="text-gray-300 mb-8">
        Zincirdeki tüm blokları ve işlemleri içeren detaylı bir PDF raporu oluşturmak için aşağıdaki butona tıklayın.
      </p>
      <button
        onClick={generatePDF}
        className="px-6 py-3 text-lg bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 text-white font-semibold rounded-full transition transform hover:scale-105"
      >
        PDF İndir 🔻
      </button>
    </div>
  );
}
