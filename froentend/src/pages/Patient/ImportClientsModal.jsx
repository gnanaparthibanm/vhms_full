import React, { useState } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const ImportClientsModal = ({ isOpen, onClose, onImport }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (selectedFile) {
            onImport(selectedFile);
            setSelectedFile(null);
            onClose();
        }
    };

    const handleDownloadTemplate = () => {
        // Logic to download CSV template
        console.log('Downloading template...');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Import Clients and Pets</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Download Template Button */}
                    <Button
                        onClick={handleDownloadTemplate}
                        variant="outline"
                        className="w-full justify-start border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                    </Button>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--dashboard-text)]">Choose File</span>
                            <Input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium text-[var(--dashboard-text-light)]"
                            />
                        </div>
                        {selectedFile && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--dashboard-secondary)]/50 border border-[var(--border-color)]">
                                <Upload className="h-4 w-4 text-[var(--dashboard-primary)]" />
                                <span className="text-sm text-[var(--dashboard-text)] flex-1">{selectedFile.name}</span>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-[var(--dashboard-text-light)] hover:text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info Message */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            💡 Download the template to see the required format for importing clients and pets. Make sure your file follows the same structure.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={!selectedFile}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImportClientsModal;
