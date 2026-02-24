import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import PhoneInput from '../../components/common/PhoneInput';

const AddClientModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        alternatePhone: '',
        email: '',
        city: '',
        address: '',
        purposeOfVisit: '',
        notes: '',
        active: true
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--card-bg)] z-10">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Add New Client</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="name"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Phone</label>
                            <PhoneInput
                                value={formData.phone}
                                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                placeholder="Phone number"
                                defaultCountry="1"
                            />
                        </div>

                        {/* Alternate Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Alternate Phone</label>
                            <PhoneInput
                                value={formData.alternatePhone}
                                onChange={(value) => setFormData(prev => ({ ...prev, alternatePhone: value }))}
                                placeholder="Alternate phone number"
                                defaultCountry="1"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Email</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">City</label>
                            <Input
                                name="city"
                                placeholder="Enter city"
                                value={formData.city}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Address</label>
                            <Input
                                name="address"
                                placeholder="Enter address"
                                value={formData.address}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Purpose of Visit */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Purpose of Visit</label>
                            <Input
                                name="purposeOfVisit"
                                placeholder="Enter purpose of visit"
                                value={formData.purposeOfVisit}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Notes</label>
                            <Input
                                name="notes"
                                placeholder="Enter notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)]">
                        <div>
                            <div className="font-medium text-[var(--dashboard-text)]">Active</div>
                            <div className="text-sm text-[var(--dashboard-text-light)]">Set the active status of this client</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Create Client
                    </Button>
                    <Button
                        onClick={() => {
                            handleSubmit();
                            // Logic to navigate to add pet would go here
                        }}
                        className="bg-pink-500 text-white hover:bg-pink-600"
                    >
                        Save & Add Pet
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;
