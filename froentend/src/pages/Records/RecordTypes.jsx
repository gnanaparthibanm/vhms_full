import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const RecordTypes = ({ types, searchTerm }) => {
    // Filter types based on search term
    const filteredTypes = types.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            {/* ================= MOBILE VIEW ================= */}
<div className="md:hidden space-y-3 px-3">
{filteredTypes.length > 0 ? (
filteredTypes.map((recordType) => (
<div
key={recordType.id}
className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
>
<div className="flex justify-between mb-2">
<p className="font-semibold text-[var(--dashboard-text)]">
{recordType.name}
</p>
<span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
{recordType.status}
</span>
</div>

<p className="text-xs text-[var(--dashboard-text-light)]">
Category: {recordType.category}
</p>

<p className="text-xs text-[var(--dashboard-text-light)]">
Templates: {recordType.templates}
</p>

<p className="text-xs text-[var(--dashboard-text-light)]">
Created: {recordType.created}
</p>

<div className="flex gap-2 mt-3">
<Button className="flex-1 h-8 text-xs">Edit</Button>
<Button className="flex-1 h-8 text-xs text-red-600">Delete</Button>
</div>
</div>
))
) : (
<p className="text-center text-sm text-[var(--dashboard-text-light)]">
No record types found matching your search.
</p>
)}
</div>
{/* ================= TABLET + DESKTOP ================= */}
<div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                    <tr>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)] cursor-pointer hover:bg-[var(--dashboard-secondary)]/80 transition-colors group">
                            <div className="flex items-center gap-1">
                                Name
                                <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Category</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Template Required</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Templates</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Created</th>
                        <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Status</th>
                        <th className="h-10 px-4 text-right font-semibold text-[var(--dashboard-text)]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredTypes.length > 0 ? (
                        filteredTypes.map((recordType) => (
                            <tr key={recordType.id} className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors">
                                <td className="p-4 font-medium text-[var(--dashboard-text)]">
                                    {recordType.name}
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)] border border-[var(--border-color)]">
                                        {recordType.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recordType.templateRequired ? 'bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)]' : 'bg-gray-100 text-gray-500'}`}>
                                        {recordType.templateRequired ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="p-4 text-[var(--dashboard-text)]">
                                    {recordType.templates}
                                </td>
                                <td className="p-4 text-[var(--dashboard-text-light)] text-xs">
                                    {recordType.created}
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                                        {recordType.status}
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
                                No record types found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-[var(--border-color)]">
                <div className="text-sm text-[var(--dashboard-text-light)]">
                    Showing 1 to {filteredTypes.length} of {filteredTypes.length} entries
                </div>
                <div className="flex items-center gap-2">
                    <select className="h-8 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] text-sm px-2 focus:border-[var(--dashboard-primary)] outline-none">
                        <option>Show 10</option>
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

export default RecordTypes;
