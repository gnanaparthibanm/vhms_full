import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const SelectBranchModal = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock branch data
    const mockBranches = [
        { id: 1, name: "Fusionedge Test Hospital - Main Branch", location: "Accra, Ghana", status: "Active" },
    ];

    if (!isOpen) return null;

    const filteredBranches = mockBranches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Select Item</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>

                    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Name</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Location</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {filteredBranches.map((branch) => (
                                    <tr
                                        key={branch.id}
                                        onClick={() => {
                                            onSelect(branch);
                                            onClose();
                                        }}
                                        className="cursor-pointer hover:bg-[var(--dashboard-secondary)] transition-colors"
                                    >
                                        <td className="p-4 text-[var(--dashboard-text)]">{branch.name}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{branch.location}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                                                {branch.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectBranchModal;
