import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CreateRecordModal = ({ isOpen, onClose, onSubmit, recordTypes, templates }) => {
    const [formData, setFormData] = useState({
        petName: "",
        date: new Date(),
        recordType: "",
        description: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        isActive: true
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Create the record object to pass back
        const newRecord = {
            id: Date.now(),
            date: format(formData.date, 'MMMM do, yyyy'),
            pet: { name: formData.petName || "Unknown Pet", detail: "Unknown Breed" },
            type: formData.recordType || "General Record",
            description: formData.description || "No description",
            createdAt: format(new Date(), 'MMM d, yyyy, h:mm a'),
            status: formData.isActive ? "Active" : "Inactive"
        };
        onSubmit(newRecord);
        // Reset form
        setFormData({
            petName: "",
            date: new Date(),
            recordType: "",
            description: "",
            diagnosis: "",
            treatment: "",
            notes: "",
            isActive: true
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--card-bg)] shadow-2xl border border-[var(--border-color)] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] sticky top-0 bg-[var(--card-bg)] z-10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold . text-[var(--dashboard-text)]">Create Medical Record</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

                    {/* Record Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wide">Record Details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Pet <span className="text-red-500">*</span></label>
                                <Input
                                    placeholder="Search and select pet"
                                    className="bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                                    value={formData.petName}
                                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                />
                                <p className="text-xs text-[var(--dashboard-text-light)]">Select the pet for this medical record</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Date <span className="text-red-500">*</span></label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)] h-10 px-3 hover:bg-[var(--dashboard-secondary)] hover:text-[var(--dashboard-text)]",
                                                !formData.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-[var(--card-bg)]" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Record Type <span className="text-red-500">*</span></label>
                            <Select
                                value={formData.recordType}
                                onValueChange={(val) => setFormData({ ...formData, recordType: val })}
                            >
                                <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                    <SelectValue placeholder={formData.petName ? "Select record type" : "Select a pet first"} />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                    {recordTypes.map(type => (
                                        <SelectItem key={type.id} value={type.name} className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)]">
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!formData.petName && <p className="text-xs text-[var(--dashboard-text-light)]">Please select a pet first</p>}
                        </div>
                    </div>

                    {/* Medical Information Section */}
                    <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wide">Medical Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['Description', 'Diagnosis', 'Treatment', 'Notes'].map((field) => (
                                <div className="space-y-2" key={field}>
                                    <label className="text-sm font-medium text-[var(--dashboard-text-light)]">
                                        {field === 'Notes' ? 'Additional Notes' : field}
                                    </label>
                                    <textarea
                                        className="w-full min-h-[100px] p-3 rounded-md bg-[var(--dashboard-secondary)] border border-[var(--border-color)] text-[var(--dashboard-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)] focus:border-transparent resize-y placeholder:text-[var(--dashboard-text-light)]/50"
                                        placeholder={`Enter ${field.toLowerCase()}`}
                                        value={formData[field.toLowerCase()] || ""}
                                        onChange={(e) => setFormData({ ...formData, [field.toLowerCase()]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Toggle Section */}
                    <div className="pt-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center justify-between p-4 bg-[var(--dashboard-secondary)] rounded-lg border border-[var(--border-color)]">
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--dashboard-text)]">Active</h4>
                                <p className="text-xs text-[var(--dashboard-text-light)]">Set the active status of this medical record</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--dashboard-primary)]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)] sticky bottom-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-10 px-4 py-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="h-10 px-4 py-2 bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Create Record
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateRecordModal;
