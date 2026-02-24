import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const RecordsList = ({ records, searchTerm }) => {
    // Filter records based on search term
    const filteredRecords = records.filter(record =>
        record.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
       <div className="w-full">
        {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-3 px-3">
  {filteredRecords.length > 0 ? (
    filteredRecords.map((record) => (
      <div
        key={record.id}
        className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
      >
        <div className="flex justify-between mb-2">
          <p className="font-semibold">{record.date}</p>
          <span className="px-2 py-1 text-xs rounded-full bg-[var(--dashboard-primary)] text-white">
            {record.status}
          </span>
        </div>

        <p className="font-medium">{record.pet.name}</p>
        <p className="text-xs text-[var(--dashboard-text-light)]">
          {record.pet.detail}
        </p>

        <p className="mt-2 text-sm">{record.type}</p>
        <p className="text-xs text-[var(--dashboard-text-light)]">
          {record.description}
        </p>

        <div className="flex gap-2 mt-3">
          <Button className="flex-1 h-8 text-xs">Edit</Button>
          <Button className="flex-1 h-8 text-xs text-red-600">
            Delete
          </Button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-sm text-[var(--dashboard-text-light)]">
      No records found.
    </p>
  )}
</div>
<div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                    <tr>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)] cursor-pointer hover:bg-[var(--dashboard-secondary)]/80 transition-colors group">
                            <div className="flex items-center gap-1">
                                Date
                                <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Pet</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Record Type</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Description</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Created At</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Status</th>
                        <th className="h-10 px-4 text-right font-semibold text-[var(--dashboard-text)]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <tr key={record.id} className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors">
                                <td className="p-4 font-medium text-[var(--dashboard-text)]">
                                    {record.date}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-[var(--dashboard-text)]">{record.pet.name}</span>
                                        <span className="text-xs text-[var(--dashboard-text-light)]">{record.pet.detail}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)] border border-[var(--border-color)]">
                                        {record.type}
                                    </span>
                                </td>
                                <td className="p-4 text-[var(--dashboard-text-light)] truncate max-w-[200px]">
                                    {record.description}
                                </td>
                                <td className="p-4 text-[var(--dashboard-text-light)] text-xs">
                                    {record.createdAt}
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--dashboard-primary)] text-white">
                                        {record.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                            Edit
                                        </Button>
                                        <Button className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="p-8 text-center text-[var(--dashboard-text-light)]">
                                No records found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-[var(--border-color)]">
                <div className="text-sm text-[var(--dashboard-text-light)]">
                    Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
                </div>
                <div className="flex items-center gap-2">
                    <select className="h-8 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] text-sm px-2 focus:border-[var(--dashboard-primary)] outline-none">
                        <option>Show 10</option>
                        <option>Show 20</option>
                        <option>Show 50</option>
                    </select>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            disabled
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-[var(--dashboard-text)] px-2">Page 1 of 1</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            disabled
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default RecordsList;
