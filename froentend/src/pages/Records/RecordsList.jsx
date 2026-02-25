import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { recordsService } from '../../services/recordsService';

const RecordsList = ({ records, searchTerm, refreshRecords }) => {
    // Filter records based on search term
    const filteredRecords = records.filter(record => {
        const petNameMatch = record.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = record.record_type?.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = record.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return petNameMatch || typeMatch || descMatch;
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medical record?")) {
            try {
                await recordsService.deleteRecord(id);
                if (refreshRecords) refreshRecords();
                alert("Medical record deleted successfully!");
            } catch (error) {
                alert("Failed to delete record:");
                console.error(error);
            }
        }
    };

    const formatDate = (dateString, withTime = false) => {
        try {
            return format(new Date(dateString), withTime ? 'MMM d, yyyy, h:mm a' : 'MMMM do, yyyy');
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="w-full">
            {/* ================= MOBILE VIEW ================= */}
            <div className="md:hidden space-y-3 px-3 py-3">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <div
                            key={record.id}
                            className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
                        >
                            <div className="flex justify-between mb-2">
                                <p className="font-semibold">{formatDate(record.date)}</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${record.is_active ? 'bg-[var(--dashboard-primary)] text-white' : 'bg-gray-500 text-white'}`}>
                                    {record.status || (record.is_active ? "Active" : "Inactive")}
                                </span>
                            </div>

                            <p className="font-medium text-[var(--dashboard-text)]">{record.pet?.name || "Unknown Pet"}</p>
                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                {record.pet?.pet_type || record.pet?.breed || "N/A"}
                            </p>

                            <p className="mt-2 text-sm text-[var(--dashboard-text)]">{record.record_type}</p>
                            <p className="text-xs text-[var(--dashboard-text-light)] line-clamp-2">
                                {record.description || "No description"}
                            </p>

                            <div className="flex gap-2 mt-3">
                                <Button className="flex-1 h-8 text-xs bg-[var(--card-bg)] border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] border text-[var(--dashboard-text)]">Edit</Button>
                                <Button onClick={() => handleDelete(record.id)} className="flex-1 h-8 text-xs text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-[var(--dashboard-text-light)] py-4">
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
                                        {formatDate(record.date)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[var(--dashboard-text)]">{record.pet?.name || "Unknown"}</span>
                                            <span className="text-xs text-[var(--dashboard-text-light)]">{record.pet?.pet_type || record.pet?.breed || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)] border border-[var(--border-color)]">
                                            {record.record_type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--dashboard-text-light)] truncate max-w-[200px]">
                                        {record.description || "No description"}
                                    </td>
                                    <td className="p-4 text-[var(--dashboard-text-light)] text-xs">
                                        {formatDate(record.createdAt, true)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${record.is_active ? 'bg-[var(--dashboard-primary)] text-white' : 'bg-gray-500 text-white'}`}>
                                            {record.status || (record.is_active ? "Active" : "Inactive")}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(record.id)}
                                                className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
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
                </div>
            </div>
        </div>
    );
};

export default RecordsList;
