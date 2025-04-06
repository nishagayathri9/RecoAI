import { useState } from "react";
import HD450 from '../assets/HD450.png';

export default function RecommendationsDashboard() {

  const productImages = import.meta.glob('/src/assets/*.png', {
    eager: true,
    import: 'default',
  });
  
  function getImageById(id) {
    return productImages[`../assets/${id}.png`] || null;
  }
  
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

  const [selectedUser, setSelectedUser] = useState(Object.keys(users)[0]);

  return (
    <div className="h-screen flex justify-center items-center bg-transparent p-2">
      <div className="w-full max-w-6xl bg-gray-50 p-6 rounded-2xl shadow-lg">
        {/* Header */}
        <header className="flex justify-center items-center pb-6 p-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Product Recommendations</h1>
        </header>

        {/* Content Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-1/4">
        <div className="w-full px-4 py-5 bg-white flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
          <legend className="text-xl font-semibold mb-3 select-none">Choose Customer</legend>

          {Object.keys(users).map((user, index) => (
            <label
              key={user}
              htmlFor={user}
              className="relative group cursor-pointer"
            >
              <input
                type="radio"
                id={user}
                name="userSelection"
                value={user}
                checked={selectedUser === user}
                onChange={() => setSelectedUser(user)}
                className="peer hidden"
              />
              <div
                className={`h-14 flex items-center gap-3 px-3 rounded-lg transition
                  ${selectedUser === user
                    ? "text-blue-500 bg-blue-50 ring-1 ring-blue-300"
                    : "hover:bg-zinc-100 text-gray-800"}
                `}
              >
                <div className="w-5 fill-blue-500">
                  {/* The original hexagon icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="w-5 h-5 text-blue-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>

                </div>

                <span className="font-medium select-none">{user}</span>

                {/* Custom radio bubble */}
                <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center 
                    border-gray-400 peer-checked:border-blue-500">
                  <div
                    className={`w-2 h-2 rounded-full transition-transform
                      ${selectedUser === user ? "bg-blue-500 scale-100" : "scale-0"}
                    `}
                  />
                </div>
              </div>
            </label>

          ))}
        </div>
      </aside>


          {/* Main Sections */}
          <div className="flex-grow grid grid-cols-2 gap-6">
            {/* Purchases Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Purchases</h3>
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
                  <img
                    src={getImageById(product.id)}
                    alt={product.name}
                    className="w-10 h-10 ml-2 mr-8 object-cover rounded"
                  />

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
