import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { recordsService } from '../../services/recordsService';

const CreateRecordTypeModal = ({ isOpen, onClose, onRefresh, typeToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "general",
        templateRequired: true,
        is_active: true
    });

    useEffect(() => {
        if (isOpen && typeToEdit) {
            setFormData({
                name: typeToEdit.name || "",
                category: typeToEdit.category || "general",
                templateRequired: typeToEdit.templateRequired !== false,
                is_active: typeToEdit.is_active !== false,
            });
        } else if (isOpen) {
            setFormData({
                name: "",
                category: "general",
                templateRequired: true,
                is_active: true
            });
        }
    }, [isOpen, typeToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!formData.name) {
            alert("Name is required");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                status: formData.is_active ? "Active" : "Inactive"
            };

            if (typeToEdit) {
                await recordsService.updateRecordType(typeToEdit.id, payload);
            } else {
                await recordsService.createRecordType(payload);
            }
            if (onRefresh) onRefresh();
            onClose();
        } catch (error) {
            console.error("Failed to save record type:", error);
            alert("Failed to save record type");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-2xl border border-[var(--border-color)] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
                    <h2 className="text-lg font-bold text-[var(--dashboard-text)]">
                        {typeToEdit ? "Edit Record Type" : "Create Record Type"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Name <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="e.g. Annual Wellness Exam"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Category</label>
                        <Select
                            value={formData.category}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                        >
                            <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                <SelectItem value="general" className="text-[var(--dashboard-text)]">General</SelectItem>
                                <SelectItem value="examination" className="text-[var(--dashboard-text)]">Examination</SelectItem>
                                <SelectItem value="preventive" className="text-[var(--dashboard-text)]">Preventive</SelectItem>
                                <SelectItem value="urgent" className="text-[var(--dashboard-text)]">Urgent / Emergency</SelectItem>
                                <SelectItem value="procedure" className="text-[var(--dashboard-text)]">Procedure / Surgery</SelectItem>
                                <SelectItem value="consultation" className="text-[var(--dashboard-text)]">Consultation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--dashboard-secondary)] rounded-lg border border-[var(--border-color)] mt-4">
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--dashboard-text)]">Template Required</h4>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Is a template mandatory for this type?</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.templateRequired}
                                onChange={(e) => setFormData(prev => ({ ...prev, templateRequired: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--dashboard-primary)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--dashboard-secondary)] rounded-lg border border-[var(--border-color)] mt-4">
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--dashboard-text)]">Active</h4>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Can this type be used?</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--dashboard-primary)]"></div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        {loading ? "Saving..." : (typeToEdit ? "Update Type" : "Create Type")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateRecordTypeModal;
