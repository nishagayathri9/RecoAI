import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { generateGroupPayload } from '../../utils/groupRecommender';

type Props = {
  fileName: string | null;
};

type Product = {
  id: string;
  name: string;
  category: string;
  color: string;
  date?: string;
  score?: number;
};

const users = {
  "User #BK30": {
    purchases: [
      { id: "HD450", name: "Wooden Coffee Table", category: "Furniture", color: "Brown", date: "12/03/2023" },
      { id: "DC784", name: "Modern Desk Lamp", category: "Lighting", color: "White", date: "05/07/2023" },
    ],
    recommendations: [
      { id: "SM012", name: "Smart LED Strip", category: "Home", color: "Multi-color", score: 90 },
      { id: "PL890", name: "Indoor Plant Set", category: "Home", color: "Green", score: 78 },
    ],
  },
  "User #XM13": {
    purchases: [
      { id: "XR890", name: "Gaming Laptop", category: "Electronics", color: "Black", date: "15/06/2023" },
      { id: "WH225", name: "Wireless Headphones", category: "Audio", color: "Silver", date: "22/05/2023" },
    ],
    recommendations: [
      { id: "RD873", name: "4K UltraWide Monitor", category: "Electronics", color: "Black", score: 85 },
      { id: "MS351", name: "Mechanical Keyboard", category: "Accessories", color: "RGB", score: 80 },
    ],
  },
  "User #FN91": {
    purchases: [
      { id: "FB920", name: "Smart Fitness Band", category: "Wearable", color: "Blue", date: "08/02/2023" },
      { id: "YT995", name: "Yoga Mat", category: "Fitness", color: "Purple", date: "28/01/2023" },
    ],
    recommendations: [
      { id: "GY101", name: "Adjustable Dumbbells", category: "Fitness", color: "Black", score: 88 },
      { id: "BL856", name: "Blender Bottle", category: "Nutrition", color: "Transparent", score: 70 },
    ],
  },
};

type UserKey = keyof typeof users;

const ProductRecommendationsDashboard: React.FC<Props> = ({ fileName }) => {
  const [selectedUser, setSelectedUser] = useState<UserKey>('User #BK30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGroupRecommend = async () => {
    if (!fileName) return console.warn('File name missing for group recommend');

    const payload = generateGroupPayload(fileName);
    console.log("📦 Group Recommender Payload:", payload); // 🔍 Add this line

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const endpoint = `${API_BASE}/group_recommend/`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('[❌] Group Recommend Error:', await res.text());
        return;
      }

      const data = await res.json();
      console.log('[✅] Group Recommend Results:', data);
    } catch (error) {
      console.error('[🔥] Network error during group recommend:', error);
    }
  };


  return (
    <div className="bg-background-tertiary rounded-xl shadow-lg overflow-hidden w-full max-w-6xl mx-auto">
      <div className="border-b border-white/10 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center">
          <BarChart3 className="mr-3 h-6 w-6 text-primary" />
          Product Recommendations
        </h2>
        <button
          onClick={handleGroupRecommend}
          className="btn-outline"
          disabled={loading || !fileName}
        >
          {loading ? 'Running...' : 'Run Group Recommend'}
        </button>
      </div>

      {error && (
        <div className="text-red-400 px-6 py-2 font-mono text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* User Selector */}
        <aside className="md:w-1/4 w-full">
          <div className="bg-background rounded-xl p-4 flex flex-col gap-3 shadow">
            <legend className="text-lg font-semibold mb-3 select-none">Choose Customer</legend>
            {Object.keys(users).map((user) => (
              <label key={user} className="relative group cursor-pointer">
                <input
                  type="radio"
                  name="userSelection"
                  value={user}
                  checked={selectedUser === user}
                  onChange={() => setSelectedUser(user as UserKey)}
                  className="peer hidden"
                />
                <div
                  className={`h-12 flex items-center gap-3 px-3 rounded-lg transition 
                    ${selectedUser === user
                      ? "text-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:bg-white/5 text-white/90"
                    }`}
                >
                  <span className="font-medium select-none">{user}</span>
                  <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center border-primary peer-checked:border-primary">
                    <div className={`w-2 h-2 rounded-full transition-transform ${selectedUser === user ? "bg-primary scale-100" : "scale-0"}`} />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </aside>

        {/* Purchases & Recommendations */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Purchases */}
          <section className="bg-background rounded-xl p-6 shadow border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Purchases</h3>
            {users[selectedUser].purchases.map((product) => (
              <div key={product.id} className="flex flex-col bg-background-secondary p-4 rounded-lg mb-3 border border-white/10">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-white/70">ID: #{product.id}</p>
                <p className="text-sm text-white/70">Category: {product.category}</p>
                <p className="text-sm text-white/70">Color: {product.color}</p>
                <p className="text-sm text-white/70">Purchase Date: {product.date}</p>
              </div>
            ))}
          </section>

          {/* Recommendations */}
          <section className="bg-background rounded-xl p-6 shadow border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            {users[selectedUser].recommendations.map((product) => (
              <div key={product.id} className="flex flex-col bg-background-secondary p-4 rounded-lg mb-3 border border-white/10">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-white/70">ID: #{product.id}</p>
                <p className="text-sm text-white/70">Category: {product.category}</p>
                <p className="text-sm text-white/70">Color: {product.color}</p>
                <p className="text-sm text-white/70 font-semibold mt-2 mb-2">Recommendation Score</p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                  <div className="bg-primary h-2" style={{ width: `${product.score ?? 0}%` }}></div>
                </div>
                <p className="text-sm font-semibold text-primary">{product.score}%</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendationsDashboard;
