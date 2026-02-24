import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const TaxRateModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rate: '',
        default: false,
        active: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                description: '',
                rate: '',
                default: false,
                active: true,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">
                        {initialData ? 'Edit Tax Rate' : 'Add Tax Rate'}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Name<span className="text-red-500">*</span></label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter name"
                                className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description"
                                className="flex min-h-[80px] w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--dashboard-text)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Rate (%)<span className="text-red-500">*</span></label>
                            <select
                                value={formData.rate}
                                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="0">0%</option>
                                <option value="5">5%</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="25">25%</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Default Rate</label>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={formData.default}
                                    onClick={() => setFormData({ ...formData, default: !formData.default })}
                                    className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                        ${formData.default ? 'bg-[var(--dashboard-primary)]' : 'bg-gray-200 dark:bg-gray-700'}
                        `}
                                >
                                    <span
                                        className={`
                            pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                            ${formData.default ? 'translate-x-5' : 'translate-x-0'}
                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Active</label>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={formData.active}
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${formData.active ? 'bg-[var(--dashboard-primary)]' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                                >
                                    <span
                                        className={`
                      pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                      ${formData.active ? 'translate-x-5' : 'translate-x-0'}
                    `}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxRateModal;
