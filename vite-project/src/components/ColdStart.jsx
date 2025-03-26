import { useState } from "react";

export default function ColdStart() {
  const users = {
    "User #BK30": {
      purchases: [
        { id: "HD450", name: "Wooden Coffee Table", category: "Furniture", color: "Brown", date: "12/03/2023" },
        { id: "DC784", name: "Modern Desk Lamp", category: "Lighting", color: "White", date: "05/07/2023" },
      ],
      recommendations: [
        { id: "SM012", name: "Smart LED Strip", category: "Smart Home", color: "Multi-color", score: 90 },
        { id: "PL890", name: "Indoor Plant Set", category: "Home & Garden", color: "Green", score: 78 },
      ],
    },
    "User #XM13": {
      purchases: [
        { id: "XR890", name: "Gaming Laptop", category: "Electronics", color: "Black", date: "15/06/2023" },
        { id: "WH225", name: "Wireless Headphones", category: "Audio", color: "Silver", date: "22/05/2023" },
      ],
      recommendations: [
        { id: "RD8763", name: "4K UltraWide Monitor", category: "Electronics", color: "Black", score: 85 },
        { id: "MS305", name: "Mechanical Gaming Keyboard", category: "Accessories", color: "RGB", score: 80 },
      ],
    },
    "User #FN91": {
      purchases: [
        { id: "FB900", name: "Smart Fitness Band", category: "Wearable", color: "Blue", date: "08/02/2023" },
        { id: "YT990", name: "Yoga Mat", category: "Fitness", color: "Purple", date: "28/01/2023" },
      ],
      recommendations: [
        { id: "GYM001", name: "Adjustable Dumbbells", category: "Fitness", color: "Black", score: 88 },
        { id: "BLD456", name: "Protein Blender Bottle", category: "Nutrition", color: "Transparent", score: 70 },
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

        {/* Content Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-1/4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Select User</h2>
            <div className="space-y-2">
              {Object.keys(users).map((user) => (
                <label key={user} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userSelection"
                    value={user}
                    checked={selectedUser === user}
                    onChange={() => setSelectedUser(user)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{user}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Main Sections */}
          <div className="flex-grow grid grid-cols-2 gap-6">
            {/* Purchases Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recently Viewed Products</h3>
              {users[selectedUser].purchases.map((product) => (
                <div key={product.id} className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">ID: #{product.id}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                    <p className="text-sm text-gray-600">Color: {product.color}</p>
                    <p className="text-sm text-gray-600">Purchase Date: {product.date}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Recommendations Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              {users[selectedUser].recommendations.map((product) => (
                <div key={product.id} className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{product.name} </h4>
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
