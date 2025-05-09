import { useState } from "react";

function AdminERModelPage() {
  const [model, setModel] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchERModel = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/er-model");
      const data = await response.json();
      setModel(data);
    } catch (err) {
      alert("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ER Modelni Ko‘rish</h1>
      <button onClick={fetchERModel} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        {loading ? "Yuklanmoqda..." : "Yuklash"}
      </button>
      <div>
        {model.map((table, i) => (
          <div key={i} className="mb-6">
            <h2 className="text-lg font-semibold">{table.name}</h2>
            <ul className="list-disc pl-6">
              {table.columns.map((col: string, j: number) => (
                <li key={j}>{col}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminERModelPage;
