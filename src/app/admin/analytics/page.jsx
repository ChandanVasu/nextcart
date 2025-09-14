"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by date
  const filterByDate = (orders) => {
    if (dateFilter === "all") return orders;

    const days = parseInt(dateFilter, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return orders.filter((o) => new Date(o.createdAt) >= cutoff);
  };

  // Apply filters & sorting
  const filteredOrders = filterByDate(orders).sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.paymentDetails?.total || 0),
    0
  );
  const currencySymbol = filteredOrders[0]?.paymentDetails?.currencySymbol || "$";
  const uniqueCustomers = new Set(filteredOrders.map((o) => o.email)).size;
  const recentOrders = filteredOrders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Analytics</h1>
          <p className="text-sm text-gray-500">
            Overview of your store performance
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="15">Last 15 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<HiOutlineShoppingBag />}
          color="indigo"
        />
        <StatCard
          title="Total Revenue"
          value={`${currencySymbol}${totalRevenue.toLocaleString()}`}
          icon={<HiOutlineCurrencyDollar />}
          color="green"
        />
        <StatCard
          title="Unique Customers"
          value={uniqueCustomers}
          icon={<HiOutlineUsers />}
          color="pink"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recent Orders
        </h3>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{o.name}</td>
                  <td className="px-4 py-2">
                    {o.products?.items?.[0]?.title || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {o.paymentDetails?.currencySymbol}
                    {o.paymentDetails?.total}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        o.paymentDetails?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.paymentDetails?.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---- Reusable StatCard ---- */
function StatCard({ title, value, icon, color }) {
  const colors = {
    indigo: "from-indigo-50 to-indigo-100 text-indigo-600",
    green: "from-green-50 to-green-100 text-green-600",
    pink: "from-pink-50 to-pink-100 text-pink-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} p-5 rounded-xl shadow-sm border`}
    >
      <div className="flex items-center gap-2 mb-2 text-sm font-medium">
        <span className="text-lg">{icon}</span>
        {title}
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
