import { useState } from "react";

export default function ColdStart() {
  const productImages = import.meta.glob('../assets/*.png', {
    eager: true,
    import: 'default',
  });

  function getImageById(id) {
    return productImages[`../assets/${id}.png`] || null;
  }

  const users = {
    "User #MU01": {
      purchases: [
        { id: "MK001", name: "Matte Lipstick", category: "Makeup", color: "Crimson", date: "12/03/2024" },
        { id: "MK002", name: "Glow Highlighter", category: "Makeup", color: "Champagne", date: "10/03/2024" },
      ],
      recommendations: [
        { id: "MK101", name: "Waterproof Mascara", category: "Makeup", color: "Black", score: 91 },
        { id: "MK102", name: "Velvet Blush", category: "Makeup", color: "Peach", score: 86 },
      ],
    },
    "User #SH02": {
      purchases: [
        { id: "SH201", name: "Running Shoes", category: "Footwear", color: "Grey", date: "15/03/2024" },
        { id: "SH202", name: "Leather Sneakers", category: "Footwear", color: "White", date: "14/03/2024" },
      ],
      recommendations: [
        { id: "SH301", name: "Hiking Boots", category: "Footwear", color: "Brown", score: 88 },
        { id: "SH302", name: "Slip-On Loafers", category: "Footwear", color: "Navy", score: 82 },
      ],
    },
    "User #HL03": {
      purchases: [
        { id: "HL401", name: "Vitamin C Serum", category: "Skincare", color: "Clear", date: "11/03/2024" },
        { id: "HL402", name: "Multivitamin", category: "Health", color: "Mixed", date: "09/03/2024" },
      ],
      recommendations: [
        { id: "HL501", name: "Omega-3 Softgels", category: "Health", color: "Amber", score: 90 },
        { id: "HL502", name: "Face Mist", category: "Skincare", color: "Transparent", score: 83 },
      ],
    },
  };

  const [selectedUser, setSelectedUser] = useState(Object.keys(users)[0]);

  return (
    <div className="h-screen flex justify-center items-center bg-transparent p-2">
      <div className="w-full max-w-6xl bg-gray-100 p-6 rounded-2xl shadow-lg">
        {/* Header */}
        <header className="flex justify-center items-center pb-6 p-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Cold Start Problem</h1>
        </header>

        {/* Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-1/4">
            <div className="w-full px-4 py-5 bg-white flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
              <legend className="text-xl font-semibold mb-3 select-none">Choose Customer</legend>
              {Object.keys(users).map((user) => (
                <label key={user} htmlFor={user} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    id={user}
                    name="userSelection"
                    value={user}
                    checked={selectedUser === user}
                    onChange={() => setSelectedUser(user)}
                    className="peer hidden"
                  />
                  <div className={`h-14 flex items-center gap-3 px-3 rounded-lg transition
                    ${selectedUser === user
                      ? "text-blue-500 bg-blue-50 ring-1 ring-blue-300"
                      : "hover:bg-zinc-100 text-gray-800"}`}>
                    <div className="w-5 fill-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5 text-blue-500">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="font-medium select-none">{user}</span>
                    <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center 
                      border-gray-400 peer-checked:border-blue-500">
                      <div className={`w-2 h-2 rounded-full transition-transform
                        ${selectedUser === user ? "bg-blue-500 scale-100" : "scale-0"}`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </aside>

          {/* Main Sections */}
          <div className="flex-grow grid grid-cols-2 gap-6">
            {/* Recently Viewed */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recently Viewed Products</h3>
              {users[selectedUser].purchases.map((product) => (
                <div key={product.id} className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <img
                    src={getImageById(product.id)}
                    alt={product.name}
                    className="w-10 h-10 ml-2 mr-8 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">ID: #{product.id}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                    <p className="text-sm text-gray-600">Color: {product.color}</p>
                    <p className="text-sm text-gray-600">Viewed Date: {product.date}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Recommendations */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              {users[selectedUser].recommendations.map((product) => (
                <div key={product.id} className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <img
                    src={getImageById(product.id)}
                    alt={product.name}
                    className="w-10 h-10 ml-2 mr-8 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">ID: #{product.id}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                    <p className="text-sm text-gray-600">Color: {product.color}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-gray-600">Recommendation Score</p>
                    <div className="w-32 bg-gray-300 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2" style={{ width: `${product.score}%` }}></div>
                    </div>
                    <p className="text-sm font-semibold text-green-600">{product.score}%</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
