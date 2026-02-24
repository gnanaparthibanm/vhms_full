import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const SelectItemModal = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for billable items
    const mockItems = [
        { id: 1, name: "Fecey - Large Plug", code: "FTH-001", qty: 1, price: 7000, discount: "Loyalty Discount", discountValue: 350, tax: 5 },
        { id: 2, name: "Select Item", code: "FTH-002", qty: 1, price: 0, discount: "Select discount", discountValue: 0, tax: 0 },
    ];

    if (!isOpen) return null;

    const filteredItems = mockItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
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
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Code</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Qty</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Price</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Discount</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Tax</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {filteredItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => {
                                            onSelect(item);
                                            onClose();
                                        }}
                                        className="cursor-pointer hover:bg-[var(--dashboard-secondary)] transition-colors"
                                    >
                                        <td className="p-4 text-[var(--dashboard-text)]">{item.name}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.code}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.qty}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">₹{item.price}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.discount}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.tax}%</td>
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

export default SelectItemModal;
