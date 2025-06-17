"use client";

import React, { useEffect, useState } from "react";
import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Tooltip } from "@heroui/react";
import { IoCopyOutline } from "react-icons/io5";
import Empty from "@/components/block/Empty";

const COLLECTION = "news-latter";

export default function NewsLatterPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const rowsPerPage = 8;

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data?collection=${COLLECTION}`);
      const data = await res.json();
      if (res.ok) {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEmails(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch emails", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleCopy = async (email, id) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const totalPages = Math.ceil(emails.length / rowsPerPage);
  const currentPageData = emails.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-45px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Newsletter Emails</h1>
        <p className="text-sm text-gray-600">View all subscribers to your newsletter.</p>
      </div>

      {emails.length === 0 ? (
        <Empty title="No Subscribed Emails" description="Once users subscribe, their emails will appear here." />
      ) : (
        <>
          <Table aria-label="Newsletter Emails Table" shadow="none" isStriped>
            <TableHeader>
              <TableColumn>Email</TableColumn>
              <TableColumn>Subscribed At</TableColumn>
              <TableColumn>Copy</TableColumn>
            </TableHeader>
            <TableBody>
              {currentPageData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Tooltip content={copiedId === item._id ? "Copied!" : "Copy email"} placement="top">
                      <button
                        onClick={() => handleCopy(item.data, item._id)}
                        className={`p-2 rounded-md hover:bg-gray-200 transition cursor-pointer ${copiedId === item._id ? "bg-green-100" : ""}`}
                      >
                        <IoCopyOutline className="text-gray-700 text-lg" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {emails.length > rowsPerPage && (
            <div className="flex justify-center mt-4">
              <Pagination isCompact showControls showShadow color="secondary" page={page} total={totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
