"use client";

import { useEffect, useState } from "react";

type Row = Record<string, unknown>;
export default function AdminDataPage({ title, endpoint, columns }: { title: string; endpoint: string; columns: { key: string; label: string }[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch(endpoint).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Could not load data"); return body; }).then((body) => setRows(body[endpoint.split("/").pop() || "items"] || [])).catch((reason: Error) => setError(reason.message)); }, [endpoint]);
  return <div><p className="text-sm font-semibold uppercase tracking-widest text-muted">Management</p><h1 className="mt-2 font-core text-3xl font-semibold">{title}</h1>{error && <p className="mt-6 rounded-soft bg-[#ffe9e9] px-4 py-3 text-sm text-[#a51d2d]">{error}</p>}<section className="mt-8 overflow-hidden rounded-card bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-line/50 bg-canvas text-xs uppercase tracking-widest text-muted"><tr>{columns.map((column) => <th key={column.key} className="px-5 py-4">{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id || index)} className="border-b border-line/30 last:border-0">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-muted">{String(row[column.key] ?? "-")}</td>)}</tr>)}</tbody></table></div>{!rows.length && !error && <p className="p-8 text-center text-sm text-muted">No records found.</p>}</section></div>;
}
