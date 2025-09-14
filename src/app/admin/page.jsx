"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, User } from "@heroui/react";
import formatDate from "@/utils/formatDate";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/order"),
        fetch("/api/product"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setOrders(ordersData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sort orders by newest first
  const filteredOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.paymentDetails?.total || 0),
    0
  );
  const currencySymbol =
    filteredOrders[0]?.paymentDetails?.currencySymbol || "$";
  const uniqueCustomers = new Set(filteredOrders.map((o) => o.email)).size;

  const recentOrders = filteredOrders.slice(0, 5);
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Dashboard Overview</h1>
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

      {/* Latest Products and Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Products Table */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Latest Products</h2>
          <div className="overflow-auto">
            <Table
              shadow="none"
              aria-label="Latest Products Table"
              className="min-h-[300px]"
            >
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No products found"}>
                {latestProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <User
                        avatarProps={{
                          src: product.images?.[0] || "",
                          name: product.title,
                          size: "sm",
                        }}
                        name={product.title}
                        description={product.shortDescription ? product.shortDescription.slice(0, 40) + "..." : "No description"}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-indigo-600">
                        {product.currencySymbol}{product.salePrice || product.regularPrice}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Latest Orders Table */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Latest Orders</h2>
          <div className="overflow-auto">
            <Table
              shadow="none"
              aria-label="Latest Orders Table"
              className="min-h-[300px]"
            >
              <TableHeader>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No orders found"}>
                {recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <User
                        avatarProps={{
                          name: order.name,
                          size: "sm",
                        }}
                        name={order.name}
                        description={order.email}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {order.paymentDetails?.currencySymbol}{order.paymentDetails?.total}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
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
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-lg ${colors[color]}`}>{icon}</span>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}
