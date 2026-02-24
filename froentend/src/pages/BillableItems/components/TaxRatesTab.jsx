import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { TableSkeleton } from '../../../components/ui/TableSkeleton';
import TaxRateModal from './TaxRateModal';

const mockTaxRates = [
    { id: 1, name: "Pharmacy Tax", rate: 7.5, description: "Tax on pharmaceuticals", default: false, status: "Active" },
    { id: 2, name: "Reduced Rate", rate: 5, description: "Reduced rate for medical supplies", default: false, status: "Active" },
    { id: 3, name: "Service Tax", rate: 10, description: "Tax on professional services", default: false, status: "Active" },
    { id: 4, name: "Standard VAT", rate: 20, description: "Standard Value Added Tax", default: false, status: "Active" },
    { id: 5, name: "Zero Rate", rate: 0, description: "Zero-rated items", default: false, status: "Active" },
];

const TaxRatesTab = ({ isAddModalOpen, onCloseAddModal }) => {
    // We can use props to open modal, or manage internally if the button was inside this component.
    // The parent has the "Add Tax Rate" button.
    const [taxRates, setTaxRates] = useState(mockTaxRates);
    const [editData, setEditData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (taxRate) => {
        setEditData(taxRate);
        setIsEditModalOpen(true);
    };

    const handleSave = (data) => {
        console.log("Saving Tax Rate:", data);
        // Implement save logic
    };

    // Determine if we show the modal for adding (from prop) or editing (local state)
    const showAddModal = isAddModalOpen;
    const showEditModal = isEditModalOpen;

    return (
        <div className="space-y-4">
            <div className="hidden md:block rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                            <tr>
                                {["Name", "Rate", "Description", "Default", "Status", "Actions"].map((header) => (
                                    <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {taxRates.map((item) => (
                                <tr key={item.id} className="group hover:bg-[var(--dashboard-secondary)] transition-colors">
                                    <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.name}</td>
                                    <td className="p-4 text-[var(--dashboard-text-light)]">{item.rate}%</td>
                                    <td className="p-4 text-[var(--dashboard-text-light)]">{item.description}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.default
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {item.default ? "Yes" : "No"}
                                        </span>
                                    </td>
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
                {taxRates.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-4"
                    >
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                    {item.name}
                                </p>

                                {/* Rate Highlight */}
                                <p className="text-lg font-bold text-pink-600 dark:text-pink-400 mt-1">
                                    {item.rate}%
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

                        {/* Description */}
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase tracking-wide">
                                Description
                            </p>
                            <p className="text-sm text-[var(--dashboard-text)] mt-1 line-clamp-2">
                                {item.description}
                            </p>
                        </div>

                        {/* Default Info Row */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[var(--dashboard-text-light)]">
                                Default Tax
                            </span>

                            <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${item.default
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {item.default ? "Yes" : "No"}
                            </span>
                        </div>

                        {/* Divider */}
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
            <TaxRateModal
                isOpen={showAddModal}
                onClose={onCloseAddModal}
                onSave={handleSave}
                initialData={null}
            />

            {/* Edit Modal */}
            <TaxRateModal
                isOpen={showEditModal}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                initialData={editData}
            />

        </div>
    );
};

export default TaxRatesTab;
