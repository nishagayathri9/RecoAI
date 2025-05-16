import React, { useState, useRef, useEffect } from 'react';

export default function Demo() {
  const [selectedProductFile, setSelectedProductFile] = useState(null);
  const [selectedUserFile, setSelectedUserFile] = useState(null);

  const [showUserSection, setShowUserSection] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedUser, setSelectedUser] = useState("User #BK30");

  const userSectionRef = useRef(null);
  const dashboardRef = useRef(null);

  const handleProductFileChange = (e) => {
    setSelectedProductFile(e.target.files[0]);
  };

  const handleUserFileChange = (e) => {
    setSelectedUserFile(e.target.files[0]);
  };

  const handleSubmitProduct = () => {
    setShowUserSection(true);
    setTimeout(() => {
      if (userSectionRef.current) {
        userSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSubmitUser = () => {
    setShowProgress(true);
    setProgressValue(0);

    let current = 0;
    const intervalId = setInterval(() => {
      current += 1;
      setProgressValue(current);
      if (current >= 100) {
        clearInterval(intervalId);
        setShowDashboard(true);
        setTimeout(() => {
          if (dashboardRef.current) {
            dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }, 50);
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <style>
        {`
          button {
            padding: 17px 40px;
            border-radius: 50px;
            cursor: pointer;
            border: 0;
            background-color: white;
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 15px;
            transition: all 0.5s ease;
          }
          button:hover {
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 7px 29px 0px;
          }
          button:active {
            letter-spacing: 3px;
            background-color: hsl(261deg 80% 48%);
            color: hsl(0, 0%, 100%);
            box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
            transform: translateY(10px);
            transition: 100ms;
          }
        `}
      </style>

      {/* Upload Product Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-5xl font-bold text-center mb-12">Upload Your Product Data</h2>
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center flex flex-col items-center space-y-4 cursor-pointer hover:border-blue-500 transition-colors">
          <input type="file" className="hidden" onChange={handleProductFileChange} accept=".csv" />
          <span className="font-semibold text-2xl text-gray-600">Upload file</span>
          <span className="text-lg text-gray-400">Only CSV files are allowed.</span>
        </label>
        {selectedProductFile && <p className="mt-4 text-xl">{selectedProductFile.name}</p>}
        <div className="mt-8">
          <button onClick={handleSubmitProduct}>Submit Product Data</button>
        </div>
      </div>

      {/* Upload User Section */}
      {showUserSection && (
        <div ref={userSectionRef} className="min-h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-bold text-center mb-12">Upload Your User Data</h2>
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center flex flex-col items-center space-y-4 cursor-pointer hover:border-blue-500 transition-colors">
            <input type="file" className="hidden" onChange={handleUserFileChange} accept=".csv" />
            <span className="font-semibold text-2xl text-gray-600">Upload file</span>
            <span className="text-lg text-gray-400">Only CSV files are allowed.</span>
          </label>
          {selectedUserFile && <p className="mt-4 text-xl">{selectedUserFile.name}</p>}
          <div className="mt-8">
            <button onClick={handleSubmitUser}>Submit User Data</button>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mt-8 w-full max-w-md text-center">
              <p className="text-lg font-semibold mb-2">Running Model, Creating Dashboard...</p>
              <div className="w-full bg-gray-200 h-4 rounded-lg overflow-hidden">
                <div className="h-4" style={{ width: `${progressValue}%`, backgroundColor: 'hsl(261deg 80% 48%)' }} />
              </div>
              <p className="mt-2 text-gray-600">{progressValue}%</p>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Section */}
      {showDashboard && (
    <div ref={dashboardRef} className="h-screen flex justify-center items-center bg-transparent p-2">
      <div className="w-full max-w-6xl bg-gray-100 p-6 rounded-2xl shadow-lg">
        <header className="flex justify-center items-center pb-6 p-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Product Recommendations</h1>
        </header>
        <div className="flex gap-6">
          <aside className="w-1/4">
            <div className="w-full px-4 py-5 bg-white flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
              <legend className="text-xl font-semibold mb-3 select-none">Choose Customer</legend>
              {Object.keys(users).map((user) => (
                <label key={user} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="userSelection"
                    value={user}
                    checked={selectedUser === user}
                    onChange={() => setSelectedUser(user)}
                    className="peer hidden"
                  />
                  <div
                    className={`h-14 flex items-center gap-3 px-3 rounded-lg transition ${selectedUser === user ? "text-blue-500 bg-blue-50 ring-1 ring-blue-300" : "hover:bg-zinc-100 text-gray-800"}`}
                  >
                    <span className="font-medium select-none">{user}</span>
                    <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center border-gray-400 peer-checked:border-blue-500">
                      <div className={`w-2 h-2 rounded-full transition-transform ${selectedUser === user ? "bg-blue-500 scale-100" : "scale-0"}`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </aside>
          <div className="flex-grow grid grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Purchases</h3>
              {users[selectedUser].purchases.map((product) => (
                <div key={product.id} className="flex flex-col bg-gray-100 p-4 rounded-lg mb-2">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">ID: #{product.id}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Color: {product.color}</p>
                  <p className="text-sm text-gray-600">Purchase Date: {product.date}</p>
                </div>
              ))}
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              {users[selectedUser].recommendations.map((product) => (
                <div key={product.id} className="flex flex-col bg-gray-100 p-4 rounded-lg mb-2">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">ID: #{product.id}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Color: {product.color}</p>
                  <p className="text-sm text-gray-600 font-semibold mt-2 mb-2">Recommendation Score</p>
                  <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-2" style={{ width: `${product.score}%` }}></div>
                  </div>
                  <p className="text-sm font-semibold text-blue-500">{product.score}%</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
