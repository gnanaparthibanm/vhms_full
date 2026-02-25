import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { recordsService } from '../../services/recordsService';

const RecordTemplates = ({ templates, searchTerm, refreshTemplates }) => {
    const navigate = useNavigate();

    // Filter templates based on search term
    const filteredTemplates = templates.filter(template => {
        const nameMatch = template.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const typeMatch = template.record_type?.toLowerCase().includes(searchTerm.toLowerCase())
        return nameMatch || typeMatch
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await recordsService.deleteTemplate(id);
                if (refreshTemplates) refreshTemplates();
                alert("Template deleted successfully!");
            } catch (error) {
                alert("Failed to delete template");
            }
        }
    }

    return (
        <div className="w-full">
            {/* ================= MOBILE VIEW ================= */}
            <div className="md:hidden space-y-3 px-3 py-3">
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
                        >
                            <div className="flex justify-between mb-2">
                                <p className="font-semibold text-[var(--dashboard-text)]">
                                    {template.name}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${template.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-600'}`}>
                                    {template.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                Type: {template.record_type}
                            </p>

                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                Version: {template.version}
                            </p>

                            <div className="flex gap-2 mt-3">
                                {template.is_default ? (
                                    <span className="flex-1 text-center py-1 text-xs text-[var(--dashboard-text-light)] italic border border-dashed border-[var(--border-color)] rounded-md">
                                        System Default
                                    </span>
                                ) : (
                                    <>
                                        <Button onClick={() => navigate(`/records/update/template/${template.id}`)} className="flex-1 h-8 text-xs bg-[var(--card-bg)] text-[var(--dashboard-text)] border border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]">Edit</Button>
                                        <Button onClick={() => handleDelete(template.id)} className="flex-1 h-8 text-xs text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20">Delete</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-[var(--dashboard-text-light)] py-4">
                        No templates found matching your search.
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
                            <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Record Type</th>
                            <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Version</th>
                            <th className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">Status</th>
                            <th className="h-10 px-4 text-right font-semibold text-[var(--dashboard-text)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
                                <tr key={template.id} className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors">
                                    <td className="p-4 font-medium text-[var(--dashboard-text)]">
                                        <div className="flex items-center gap-2">
                                            {template.name}
                                            {template.is_default && (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[var(--dashboard-text-light)]">
                                        {template.record_type}
                                    </td>
                                    <td className="p-4 text-[var(--dashboard-text)]">
                                        {template.version}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${template.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-600'}`}>
                                            {template.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {template.is_default ? (
                                                <span className="text-xs text-[var(--dashboard-text-light)] italic py-1 px-3">
                                                    Cannot modify default template
                                                </span>
                                            ) : (
                                                <>
                                                    <Button
                                                        onClick={() => navigate(`/records/update/template/${template.id}`)}
                                                        className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(template.id)}
                                                        className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-[var(--dashboard-text-light)]">
                                    No templates found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-4 py-4 border-t border-[var(--border-color)]">
                    <div className="text-sm text-[var(--dashboard-text-light)]">
                        Showing 1 to {filteredTemplates.length} of {filteredTemplates.length} entries
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordTemplates;
