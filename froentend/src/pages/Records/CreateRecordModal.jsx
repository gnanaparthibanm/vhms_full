import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar as CalendarIcon } from "lucide-react";
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
import { petService } from '../../services/petService';
import { recordsService } from '../../services/recordsService';

const CreateRecordModal = ({ isOpen, onClose, onSubmit, recordTypes, templates }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);

    // Derived selected template
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [formData, setFormData] = useState({
        pet_id: "",
        date: new Date(),
        record_type: "",
        template_id: "",
        description: "",
        diagnosis: "",
        field_values: {},
        is_active: true
    });

    // Extract unique record types from available templates if not passed
    const availableTypes = Array.from(new Set([...templates.map(t => t.record_type), ...recordTypes.map(rt => rt.name)]));

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const petsRes = await petService.getAllPets();
            // Handle varied nested API responses safely
            setPets(petsRes.data?.data?.pets || petsRes.data?.data || []);
        } catch (error) {
            console.error("Error fetching pets", error);
        } finally {
            setLoading(false);
        }
    };

    // When template changes, update the selected reference and reset dynamic field values
    useEffect(() => {
        if (formData.template_id) {
            const temp = templates.find(t => t.id === formData.template_id);
            if (temp && temp.fields) {
                // Ensure it is parsed as an array (JSON from backend)
                temp.fields = typeof temp.fields === 'string' ? JSON.parse(temp.fields) : temp.fields;
            }
            setSelectedTemplate(temp);
            // Preconfigure default values
            if (temp && Array.isArray(temp.fields)) {
                const initialFields = {};
                temp.fields.forEach(f => {
                    initialFields[f.label] = (f.type === 'checkbox') ? false : "";
                });
                setFormData(prev => ({ ...prev, field_values: initialFields }));
            }
        } else {
            setSelectedTemplate(null);
            setFormData(prev => ({ ...prev, field_values: {} }));
        }
    }, [formData.template_id, templates]);

    const handleFieldChange = (label, value) => {
        setFormData(prev => ({
            ...prev,
            field_values: {
                ...prev.field_values,
                [label]: value
            }
        }));
    };

    const handleSubmit = async () => {
        if (!formData.pet_id || !formData.record_type || !formData.template_id) {
            alert("Please fill all required details (Pet, Record Type, Template).");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                pet_id: formData.pet_id,
                template_id: formData.template_id,
                date: format(formData.date, 'yyyy-MM-dd'),
                record_type: formData.record_type,
                description: formData.description,
                diagnosis: formData.diagnosis,
                field_values: formData.field_values,
                is_active: formData.is_active,
                status: formData.is_active ? "Active" : "Inactive"
            };

            await recordsService.createRecord(payload);
            onSubmit(); // Callback to parent to refresh
            handleClose();
        } catch (error) {
            console.error("Failed to create record:", error);
            alert("Failed to create record. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            pet_id: "",
            date: new Date(),
            record_type: "",
            template_id: "",
            description: "",
            diagnosis: "",
            field_values: {},
            is_active: true
        });
        setSelectedTemplate(null);
        onClose();
    };

    if (!isOpen) return null;

    // Filter available templates based on standard type logic
    const availableTemplates = templates.filter(t => t.record_type === formData.record_type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--card-bg)] shadow-2xl border border-[var(--border-color)] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] sticky top-0 bg-[var(--card-bg)] z-10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[var(--dashboard-text)]">Create Medical Record</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

                    {/* Section 1: Record Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wide">Record Details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Pet <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.pet_id}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, pet_id: val }))}
                                >
                                    <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                        <SelectValue placeholder="Select a pet" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card-bg)]">
                                        {pets.map(pet => (
                                            <SelectItem key={pet.id} value={pet.id}>{pet.name} ({pet.pet_type || pet.breed})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Date <span className="text-red-500">*</span></label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)] h-10 px-3 hover:bg-[var(--dashboard-secondary)]",
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
                                            onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Record Type <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.record_type}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, record_type: val, template_id: "" }))}
                                >
                                    <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                        <SelectValue placeholder="Select record type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        {availableTypes.map((type, idx) => (
                                            <SelectItem key={`rt-${idx}`} value={type || "Unknown"} className="text-[var(--dashboard-text)]">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Template <span className="text-red-500">*</span></label>
                                <Select
                                    value={formData.template_id}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, template_id: val }))}
                                    disabled={!formData.record_type}
                                >
                                    <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                        <SelectValue placeholder={formData.record_type ? "Select template" : "Select a record type first"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        {availableTemplates.map(template => (
                                            <SelectItem key={template.id} value={template.id} className="text-[var(--dashboard-text)]">
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Medical Information */}
                    <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wide">Medical Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Description</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-md bg-[var(--dashboard-secondary)] border border-[var(--border-color)] text-[var(--dashboard-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                    placeholder="Enter general description/notes"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text-light)]">Diagnosis</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-md bg-[var(--dashboard-secondary)] border border-[var(--border-color)] text-[var(--dashboard-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                    placeholder="Enter diagnosis"
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Template Fields (Dynamic) */}
                    {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                            <h3 className="text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wide">
                                {selectedTemplate.name} fields
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6 gap-4">
                                {selectedTemplate.fields.map(field => (
                                    <div className="space-y-2" key={field.id}>
                                        <label className="text-sm font-medium text-[var(--dashboard-text-light)]">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                className="w-full min-h-[80px] p-3 rounded-md bg-[var(--dashboard-secondary)] border border-[var(--border-color)] text-[var(--dashboard-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                                value={formData.field_values[field.label] || ""}
                                                onChange={(e) => handleFieldChange(field.label, e.target.value)}
                                            />
                                        ) : field.type === 'checkbox' ? (
                                            <div className="flex items-center space-x-2 pt-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-400 text-[var(--dashboard-primary)] focus:ring-[var(--dashboard-primary)]"
                                                    checked={!!formData.field_values[field.label]}
                                                    onChange={(e) => handleFieldChange(field.label, e.target.checked)}
                                                />
                                            </div>
                                        ) : field.type === 'select' ? (
                                            <Select
                                                value={formData.field_values[field.label] || ""}
                                                onValueChange={(val) => handleFieldChange(field.label, val)}
                                            >
                                                <SelectTrigger className="w-full bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]">
                                                    <SelectValue placeholder={`Select ${field.label}`} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                                    {(field.options ? field.options.split(',') : []).map((opt, idx) => {
                                                        const optionValue = opt.trim();
                                                        if (!optionValue) return null;
                                                        return (
                                                            <SelectItem key={idx} value={optionValue} className="text-[var(--dashboard-text)]">
                                                                {optionValue}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        ) : field.type === 'date' ? (
                                            <Input
                                                type={"date"}
                                                className="bg-[var(--dashboard-secondary)] border-[var(--border-color)] w-full"
                                                value={formData.field_values[field.label] || ""}
                                                onChange={(e) => handleFieldChange(field.label, e.target.value)}
                                            />
                                        ) : (
                                            <Input
                                                type={field.type === 'number' ? 'number' : 'text'}
                                                placeholder={`Enter ${field.label}`}
                                                className="bg-[var(--dashboard-secondary)] border-[var(--border-color)]"
                                                value={formData.field_values[field.label] || ""}
                                                onChange={(e) => handleFieldChange(field.label, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)] sticky bottom-0">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                        className="h-10 px-4 py-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-10 px-4 py-2 bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        {loading ? "Creating..." : "Create Record"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateRecordModal;
