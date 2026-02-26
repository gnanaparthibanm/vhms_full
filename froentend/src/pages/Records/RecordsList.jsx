import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Printer, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { recordsService } from '../../services/recordsService';
import { useReactToPrint } from 'react-to-print';

const RecordRow = ({ record, formatDate, handleDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const printRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Medical_Record_${record.pet?.name || 'Unknown'}_${formatDate(record.date)}`,
    });

    return (
        <React.Fragment>
            <tr
                className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="p-4 font-medium text-[var(--dashboard-text)]">
                    <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-[var(--dashboard-text-light)]" /> : <ChevronRight className="h-4 w-4 text-[var(--dashboard-text-light)]" />}
                        {formatDate(record.date)}
                    </div>
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
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
            {isExpanded && (
                <tr className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                    <td colSpan="7" className="p-0">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-semibold text-[var(--dashboard-text)]">Record Details</h4>
                                <Button
                                    onClick={handlePrint}
                                    className="h-8 bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] flex items-center gap-2"
                                >
                                    <Printer className="h-4 w-4" /> Print Record
                                </Button>
                            </div>

                            {/* PRINTABLE CONTENT */}
                            <div ref={printRef} className="bg-white dark:bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 shadow-sm print:p-8 print:border-none print:shadow-none">
                                <div className="border-b border-[var(--border-color)] pb-4 mb-4 flex justify-between items-center print:border-gray-300">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--dashboard-text)] print:text-black">Medical Record</h2>
                                        <p className="text-[var(--dashboard-text-light)] print:text-gray-600">{record.record_type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[var(--dashboard-text)] print:text-black">Date: {formatDate(record.date)}</p>
                                        <p className="text-sm text-[var(--dashboard-text-light)] print:text-gray-600">ID: #{record.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--dashboard-text-light)] uppercase mb-2 print:text-gray-500">Patient Details</h3>
                                        <p className="font-bold text-[var(--dashboard-text)] text-lg print:text-black">{record.pet?.name}</p>
                                        <p className="text-[var(--dashboard-text)] print:text-black">Breed/Type: {record.pet?.pet_type || record.pet?.breed || "N/A"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--dashboard-text-light)] uppercase mb-2 print:text-gray-500">Status</h3>
                                        <p className="text-[var(--dashboard-text)] print:text-black">{record.is_active ? "Active" : "Inactive"}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-[var(--dashboard-text-light)] uppercase mb-2 print:text-gray-500">Description</h3>
                                    <p className="text-[var(--dashboard-text)] whitespace-pre-wrap print:text-black">{record.description || "N/A"}</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-[var(--dashboard-text-light)] uppercase mb-2 print:text-gray-500">Diagnosis</h3>
                                    <p className="text-[var(--dashboard-text)] whitespace-pre-wrap print:text-black">{record.diagnosis || "N/A"}</p>
                                </div>

                                {(() => {
                                    let parsedFields = {};
                                    try {
                                        if (typeof record.field_values === 'string') {
                                            parsedFields = JSON.parse(record.field_values);
                                        } else if (typeof record.field_values === 'object' && record.field_values !== null) {
                                            parsedFields = record.field_values;
                                        }
                                    } catch (e) {
                                        console.error("Error parsing field values", e);
                                    }

                                    if (Object.keys(parsedFields).length === 0) return null;

                                    return (
                                        <div>
                                            <h3 className="text-sm font-bold text-[var(--dashboard-text-light)] uppercase mb-3 print:text-gray-500">
                                                {record.template?.name || "Template Details"}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 bg-[var(--dashboard-secondary)] p-4 rounded-lg print:bg-white print:border print:border-gray-200">
                                                {Object.entries(parsedFields).map(([key, val]) => (
                                                    <div key={key}>
                                                        <span className="text-sm text-[var(--dashboard-text-light)] block print:text-gray-600">{key}</span>
                                                        <span className="font-medium text-[var(--dashboard-text)] print:text-black whitespace-pre-wrap">
                                                            {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : (val || '-')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

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
                                <RecordRow
                                    key={record.id}
                                    record={record}
                                    formatDate={formatDate}
                                    handleDelete={handleDelete}
                                />
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
