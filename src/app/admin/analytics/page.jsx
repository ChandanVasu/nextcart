"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner } from "@heroui/react";
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
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const uniqueCustomers = new Set(filteredOrders.map((o) => o.email)).size;
  const recentOrders = filteredOrders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <Spinner color="secondary" size="lg" />
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
        <div className="overflow-auto">
          <Table
            shadow="none"
            aria-label="Recent Orders Table"
          >
            <TableHeader>
              <TableColumn>Customer</TableColumn>
              <TableColumn>Product</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No orders found">
              {recentOrders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>
                    {o.products?.items?.[0]?.title || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {o.paymentDetails?.currencySymbol}
                    {o.paymentDetails?.total?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        o.paymentDetails?.paymentStatus === "succeeded" || o.paymentDetails?.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : o.paymentDetails?.paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.paymentDetails?.paymentStatus || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* ---- Reusable StatCard ---- */
function StatCard({ title, value, icon, color }) {
  const colors = {
    indigo: "text-indigo-600",
    green: "text-green-600", 
    pink: "text-pink-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className={`${colors[color]} text-xl`}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  );
}
