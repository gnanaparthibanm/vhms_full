import React from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const ImportBillableItemsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Import Billable Items</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Download Template
                        </Button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[var(--dashboard-text)] whitespace-nowrap">Choose File</span>
                            <Input
                                type="file"
                                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium text-[var(--dashboard-text-light)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]">
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImportBillableItemsModal;
