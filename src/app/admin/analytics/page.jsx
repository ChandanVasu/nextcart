"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineCurrencyDollar } from "react-icons/hi";
import { subDays, format, isAfter, isSameDay } from "date-fns";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysRange, setDaysRange] = useState(7); // Default to 7 days

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

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentDetails?.total || 0), 0);
  const currencySymbol = orders[0]?.paymentDetails?.currencySymbol || "$";
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;
  const recentOrders = orders.slice(0, 5);

  const today = new Date();
  const startDate = subDays(today, daysRange - 1);

  // Prepare chart data
  const dateLabels = Array.from({ length: daysRange }, (_, i) => subDays(today, daysRange - 1 - i));

  const chartData = dateLabels.map((date) => {
    const label = format(date, "MMM dd");

    const dailyOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return isSameDay(orderDate, date);
    });

    const totalRevenue = dailyOrders.reduce((sum, o) => sum + (o.paymentDetails?.total || 0), 0);

    return {
      name: label,
      orders: dailyOrders.length,
      revenue: totalRevenue,
    };
  });

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
          <p className="text-sm text-gray-500">Overview of recent orders and performance</p>
        </div>
        <select
          value={daysRange}
          onChange={(e) => setDaysRange(parseInt(e.target.value))}
          className="border border-gray-300 text-sm rounded-md px-3 py-2 bg-white shadow-sm focus:outline-none"
        >
          <option value={7}>Last 7 Days</option>
          <option value={15}>Last 15 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <HiOutlineShoppingBag className="text-xl" />
            <p className="text-sm font-medium">Total Orders</p>
          </div>
          <h2 className="text-3xl font-bold text-indigo-800">{totalOrders}</h2>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-green-600">
            <HiOutlineCurrencyDollar className="text-xl" />
            <p className="text-sm font-medium">Total Revenue</p>
          </div>
          <h2 className="text-3xl font-bold text-green-800">
            {currencySymbol}
            {totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-pink-600">
            <HiOutlineUsers className="text-xl" />
            <p className="text-sm font-medium">Unique Customers</p>
          </div>
          <h2 className="text-3xl font-bold text-pink-800">{uniqueCustomers}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue (Last {daysRange} Days)</h3>
          <div className="w-full h-64 bg-white rounded-xl shadow-sm p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#34d399" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Orders (Last {daysRange} Days)</h3>
          <div className="w-full h-64 bg-white rounded-xl shadow-sm p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
