import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { TableSkeleton } from '../../../components/ui/TableSkeleton';
import PaymentMethodModal from './PaymentMethodModal';

const mockPaymentMethods = [
    { id: 1, name: "Bank Transfer", type: "transfer", status: "Active" },
    { id: 2, name: "Cash", type: "cash", status: "Active" },
    { id: 3, name: "Cheque", type: "cheque", status: "Active" },
    { id: 4, name: "Credit Card", type: "card", status: "Active" },
    { id: 5, name: "Digital Wallet", type: "digital", status: "Active" },
    { id: 6, name: "Mobile Money", type: "mobile_money", status: "Active" },
];

const PaymentMethodsTab = ({ isAddModalOpen, onCloseAddModal }) => {
    const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
    const [editData, setEditData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (method) => {
        setEditData(method);
        setIsEditModalOpen(true);
    };

    const handleSave = (data) => {
        console.log("Saving Payment Method:", data);
        // Implement save logic
    };

    return (
        <div className="space-y-4">
            <div className="hidden md:block rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                            <tr>
                                {["Name", "Type", "Status", "Actions"].map((header) => (
                                    <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {paymentMethods.map((item) => (
                                <tr key={item.id} className="group hover:bg-[var(--dashboard-secondary)] transition-colors">
                                    <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.name}</td>
                                    <td className="p-4 text-[var(--dashboard-text-light)]">{item.type}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active'
                                            ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="h-8 px-2 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--card-bg)] border border-[var(--border-color)]"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-200 dark:border-red-800"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Mobile Card Design */}
            <div className="md:hidden space-y-4">
                {paymentMethods.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-4"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                    {item.name}
                                </p>

                                <p className="text-xs text-[var(--dashboard-text-light)] mt-1">
                                    Type: {item.type}
                                </p>
                            </div>

                            {/* Status Badge */}
                            <span
                                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${item.status === "Active"
                                        ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </div>

                        {/* Divider + Actions */}
                        <div className="border-t border-[var(--border-color)] pt-3 flex gap-2">
                            <Button
                                onClick={() => handleEdit(item)}
                                className="flex-1 h-9 rounded-md border border-[var(--border-color)] text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                            >
                                Edit
                            </Button>

                            <Button
                                className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <PaymentMethodModal
                isOpen={isAddModalOpen}
                onClose={onCloseAddModal}
                onSave={handleSave}
                initialData={null}
            />

            {/* Edit Modal */}
            <PaymentMethodModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                initialData={editData}
            />

        </div>
    );
};

export default PaymentMethodsTab;
