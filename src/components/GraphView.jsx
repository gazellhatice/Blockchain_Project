import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";

export default function GraphView() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const fetchGraph = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/chain", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const data = await res.json();
      console.log("Zincir verisi:", data);
      console.log("Gelen blok sayısı:", data.length);

      if (!Array.isArray(data)) {
        throw new Error("Beklenen dizi değil, veri bozulmuş olabilir.");
      }

      const newNodes = data.map((block, index) => ({
        id: `${block.hash}`,
        data: {
          label: (
            <div>
              <strong>Blok {block.index}</strong><br />
              ⏰ {new Date(block.timestamp * 1000).toLocaleString()}<br />
              🔗 {block.hash.slice(0, 10)}...<br />
              ⬅️ {block.previous_hash.slice(0, 10)}...
            </div>
          )
        },
        position: { x: 220 * index, y: 100 },
        style: {
          background: "#1e293b",
          color: "white",
          border: "2px solid #4ade80",
          borderRadius: "12px",
          padding: 10,
          width: 200
        }
      }));

      const newEdges = data.slice(1).map((block, index) => ({
        id: `e${index}-${index + 1}`,
        source: `${data[index].hash}`,
        target: `${block.hash}`,
        animated: true,
        label: "→"
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error("Graph verisi alınamadı:", err.message);
      setNodes([]);
      setEdges([]);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <div style={{ width: "100%", height: 600 }} className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Blockchain Görselleştirme</h2>

      <button
        onClick={fetchGraph}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        🔄 Grafiği Yenile
      </button>

      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
