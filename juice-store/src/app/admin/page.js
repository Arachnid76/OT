"use client";

import { useEffect, useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication state in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        onLogin();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-orange-600 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your credentials to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders from API
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated]);

  // Update order status
  async function handleStatusChange(orderId, newStatus) {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(data.message || "Failed to update order");
      }
    } catch (err) {
      alert("Failed to update order");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
      } else {
        setError(data.message || "Failed to delete order");
      }
    } catch (err) {
      setError("Failed to delete order");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-orange-600">Admin Orders</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Items</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Created</th>
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-xs font-mono text-gray-700">{order.orderId}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{order.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      <ul className="list-disc pl-4">
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.name} x{item.quantity} (GHS {item.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-orange-600">GHS {order.total}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'open' ? 'bg-yellow-200 text-yellow-800' :
                        order.status === 'paid' ? 'bg-blue-200 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                        order.status === 'failed' ? 'bg-red-200 text-red-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                    <td className="px-4 py-2">
                      {order.status === 'open' && (
                        <button
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-xs disabled:opacity-50 mr-2"
                          disabled={updating[order.orderId]}
                          onClick={() => handleStatusChange(order.orderId, 'paid')}
                        >
                          {updating[order.orderId] ? 'Updating...' : 'Mark Paid'}
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-green-600 transition-colors text-xs disabled:opacity-50"
                          disabled={updating[order.orderId]}
                          onClick={() => handleStatusChange(order.orderId, 'delivered')}
                        >
                          {updating[order.orderId] ? 'Updating...' : 'Mark Delivered'}
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button
                          className="bg-gray-700 text-white px-4 py-1 rounded-lg font-semibold hover:bg-gray-900 transition-colors text-xs disabled:opacity-50"
                          disabled={updating[order.orderId]}
                          onClick={() => handleStatusChange(order.orderId, 'closed')}
                        >
                          {updating[order.orderId] ? 'Updating...' : 'Mark Closed'}
                        </button>
                      )}
                      {order.status === 'closed' && (
                        <span className="text-gray-700 font-bold text-xs">Closed</span>
                      )}
                      {order.status === 'failed' && (
                        <span className="text-red-600 font-bold text-xs">Failed</span>
                      )}
                      <button
                        onClick={() => handleDelete(order.orderId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-bold ml-2"
                        aria-label="Delete Order"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;