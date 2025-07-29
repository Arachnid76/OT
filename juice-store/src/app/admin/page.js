"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  // Fetch orders from API
  useEffect(() => {
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
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-orange-600 mb-8 text-center">Admin Orders</h1>
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
                  <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Email</th>
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
                    <td className="px-4 py-2 text-sm text-gray-700">{order.email}</td>
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