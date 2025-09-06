"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Spinner,
  User,
} from "@heroui/react";
import { Eye } from "lucide-react";
import formatDate from "@/utils/formatDate";
import Empty from "@/components/block/Empty";

export default function OrderTablePage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = orders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600">All orders placed by your customers.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Empty title="No Orders Found" description="There are no orders yet in your store." />
      ) : (
        <div className="overflow-auto">
          <Table
            shadow="none"
            aria-label="Order Table"
            bottomContent={
              orders.length > rowsPerPage ? (
                <div className="w-full flex justify-center mt-4 sticky bottom-0 bg-white py-2 z-10">
                  <Pagination isCompact showControls showShadow color="secondary" page={page} total={totalPages} onChange={(page) => setPage(page)} />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>Customer</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <User
                      name={order.name}
                      description={order.email}
                      avatarProps={{
                        src: order.products.items?.[0]?.images?.[0] || "",
                        size: "md",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {order.paymentDetails?.currencySymbol}
                    {order.paymentDetails?.total}
                  </TableCell>
                  <TableCell className="capitalize">{order.paymentDetails?.paymentStatus}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer inline-block" onClick={() => handleView(order)}>
                      <Eye className="text-gray-700 w-5 h-5" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} size="lg" placement="center">
        <ModalContent className="!p-0 bg-white rounded-xl shadow-xl">
          <ModalHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </ModalHeader>

          <ModalBody className="px-6 py-5 space-y-5 text-sm text-gray-800">
            {selectedOrder && (
              <>
                {/* Customer & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.name}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.shipping?.phone}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                  <p className="leading-5 text-sm text-gray-700">
                    {selectedOrder.shipping?.address?.address1}, {selectedOrder.shipping?.address?.address2},<br />
                    {selectedOrder.shipping?.address?.city}, {selectedOrder.shipping?.address?.state},<br />
                    {selectedOrder.shipping?.address?.country} - {selectedOrder.shipping?.address?.zip}
                  </p>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600">Payment Method</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentDetails?.paymentMethod}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-yellow-600">Payment Status</p>
                    <p className="font-medium capitalize">{selectedOrder.paymentDetails?.paymentStatus}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-blue-600">Amount Paid</p>
                    <p className="font-bold text-lg">
                      {selectedOrder.paymentDetails?.currencySymbol}
                      {selectedOrder.paymentDetails?.total}
                    </p>
                  </div>
                </div>

                {/* Products List */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Ordered Products</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedOrder.products.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white rounded-lg sha-one p-3  transition">
                        <img src={item.images?.[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} • {item.currencySymbol}
                            {item.sellingPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </ModalBody>

          <ModalFooter className="px-6 py-3 bg-gray-50 rounded-b-xl">
            <Button size="sm" onPress={() => setModalOpen(false)} className="bg-red-700 text-white border border-black">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
