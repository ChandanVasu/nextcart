"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, User, Pagination } from "@heroui/react";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import Empty from "@/components/block/Empty"; // Your Empty state component
import DeleteConfirmationModal from "@/components/block/DeleteConfirmationModal"; // Confirm modal
import formatDate from "@/utils/formatDate"; // Utility to format date
import { Spinner } from "@heroui/react";

export default function ProductTablePage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(products.length / rowsPerPage);
  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: selectedProduct }),
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== selectedProduct));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600">Easily manage, update, and organize all your products in one place.</p>
        </div>
        <Button as={Link} href="/admin/product/new" size="sm" className="bg-black text-white">
          New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Empty title="No Products Found" description="You currently have no products in your store. Start adding new products to manage them here." />
      ) : (
        <div className="overflow-auto">
          <Table
            shadow="none"
            aria-label="Product Table"
            bottomContent={
              products.length > rowsPerPage ? (
                <div className="w-full flex justify-center mt-4 sticky bottom-0 bg-white py-2 z-10">
                  <Pagination isCompact showControls showShadow color="secondary" page={page} total={totalPages} onChange={(page) => setPage(page)} />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>Product</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Last Update</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <User
                      avatarProps={{
                        src: product.images?.[0] || "",
                        name: product.title,
                        size: "md",
                      }}
                      name={product.title}
                      description={product.description ? product.description.replace(/<[^>]+>/g, "").slice(0, 30) + "..." : "No description"}
                    />
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell>{formatDate(product.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div
                        className="bg-red-100 p-2 rounded-md cursor-pointer hover:bg-red-200"
                        onClick={() => {
                          setSelectedProduct(product._id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <MdDelete className="text-red-600 text-lg" />
                      </div>
                      <Link
                        href={{
                          pathname: "/admin/product/new",
                          query: { productId: product._id, isUpdate: true },
                        }}
                      >
                        <div className="bg-blue-100 p-2 rounded-md cursor-pointer hover:bg-blue-200">
                          <RiEditCircleFill className="text-blue-600 text-lg" />
                        </div>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
}
