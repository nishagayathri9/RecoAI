// src/components/dashboard/ProductRecommendationsDashboard.tsx
import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import rawUsersData from '../../assets/data/users.json';  // default-only import

export interface Product {
  id: string;
  name: string;
  category: string;
  color?: string;
  date?: string;
  score?: number;
}

export interface UsersData {
  [userId: string]: {
    purchases: Product[];
    recommendations: Product[];
  };
}

const MAX_LIST_HEIGHT = 'calc(100vh - 8rem)';

type Props = {
  data?: UsersData;
  selectedUser: string;
  onUserChange: (userId: string) => void;
};

const ProductRecommendationsDashboard: React.FC<Props> = React.memo(
  ({ data, selectedUser, onUserChange }) => {
    // Cast the imported JSON to UsersData
    const users: UsersData = data ?? (rawUsersData as UsersData);

    // Use string[] for keys
    const userKeys = useMemo<string[]>(
      () => Object.keys(users),
      [users]
    );

    return (
      <div className="bg-background-tertiary rounded-xl shadow-lg overflow-hidden w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex justify-center items-center">
          <h2 className="text-2xl font-semibold flex items-center">
            <BarChart3 className="mr-3 h-6 w-6 text-primary" />
            Product Recommendations
          </h2>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* User selection */}
          <aside
            className="md:w-1/4 w-full bg-background rounded-xl p-4 shadow max-h-[var(--max-list-height)] overflow-y-auto"
            style={{ '--max-list-height': MAX_LIST_HEIGHT } as React.CSSProperties}
          >
            <fieldset>
              <legend className="text-lg font-semibold mb-3">Choose Customer</legend>
              {userKeys.map((u) => {
                const user = u as string;
                return (
                  <label key={user} className="relative group cursor-pointer mb-2 block">
                    <input
                      type="radio"
                      name="userSelection"
                      value={user}
                      checked={selectedUser === user}
                      onChange={() => onUserChange(user)}
                      className="peer sr-only"
                    />
                    <div
                      className={`h-12 flex items-center gap-3 px-3 rounded-lg transition ${
                        selectedUser === user
                          ? 'text-primary bg-primary/10 ring-1 ring-primary'
                          : 'hover:bg-white/5 text-white/90'
                      }`}
                    >
                      <span className="font-medium select-none">{user}</span>
                      <div className="ml-auto w-4 h-4 border-2 rounded-full flex items-center justify-center border-primary peer-checked:border-primary">
                        <div
                          className={`w-2 h-2 rounded-full transition-transform ${
                            selectedUser === user ? 'bg-primary scale-100' : 'scale-0'
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                );
              })}
            </fieldset>
          </aside>

          {/* Purchases & Recommendations */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchases */}
            <section className="bg-background rounded-xl p-6 shadow border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Purchases</h3>
              {users[selectedUser].purchases.map((product: Product) => (
                <div
                  key={product.id}
                  className="flex flex-col bg-background-secondary p-4 rounded-lg mb-3 border border-white/10"
                >
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-white/70">ID: #{product.id}</p>
                  <p className="text-sm text-white/70">Category: {product.category}</p>
                </div>
              ))}
            </section>

            {/* Recommendations */}
            <section className="bg-background rounded-xl p-6 shadow border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              {users[selectedUser].recommendations.map((product: Product) => (
                <div
                  key={product.id}
                  className="flex flex-col bg-background-secondary p-4 rounded-lg mb-3 border border-white/10"
                >
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-white/70">ID: #{product.id}</p>
                  <p className="text-sm text-white/70">Category: {product.category}</p>

                  <div className="mt-4">
                    <p className="text-sm text-white/70 font-semibold mb-1">
                      Recommendation Score
                    </p>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-2 ${
                          (product.score ?? 0) > 70
                            ? 'bg-green-500'
                            : (product.score ?? 0) > 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${product.score ?? 0}%` }}
                      />
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        (product.score ?? 0) > 70
                          ? 'text-green-500'
                          : (product.score ?? 0) > 50
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {product.score}%
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }
);

export default ProductRecommendationsDashboard;
