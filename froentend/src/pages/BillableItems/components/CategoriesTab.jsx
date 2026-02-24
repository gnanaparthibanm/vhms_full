import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { TableSkeleton } from '../../../components/ui/TableSkeleton';
import CategoryModal from './CategoryModal';

// Mock Data
const mockCategories = [
    { id: 1, name: "Anesthesia", type: "product", description: "Anesthetic agents", status: "Active" },
    { id: 2, name: "Consultation", type: "service", description: "Veterinary consultation services", status: "Active" },
    { id: 3, name: "Hospitalization", type: "service", description: "In-patient care services", status: "Active" },
    { id: 4, name: "Laboratory", type: "service", description: "Lab tests and diagnostics", status: "Active" },
    { id: 5, name: "Medication", type: "product", description: "Prescription and OTC medications", status: "Active" },
    { id: 6, name: "Supplies", type: "product", description: "General medical supplies", status: "Active" },
    { id: 7, name: "Surgery", type: "service", description: "Surgical procedures", status: "Active" },
    { id: 8, name: "Surgical Supplies", type: "product", description: "Items for surgical procedures", status: "Active" },
    { id: 9, name: "Vaccines", type: "product", description: "Preventive vaccinations", status: "Active" },
];

const CategoriesTab = ({ onAdd }) => {
    const [categories, setCategories] = useState(mockCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = (category) => {
        // Mocking the "You can't edit default categories" error from screenshot
        if (category.name === "Surgery") {
            setError("You can't edit default categories");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setModalData(category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setModalData(null);
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        console.log("Saving category:", data);
        // Implement save logic here
    };

    // Expose handleAdd to parent via ref or prop if needed, or controlled by parent. 
    // Ideally the "Add Category" button is in the parent. 
    // But for now, let's assume the parent passes an "open add modal" trigger or we lift state up.
    // The design shows "Add Category" in the header which is common for all tabs.
    // We'll expose a method or rely on the parent to manage the modal state if preferred. 
    // However, to keep it simple, let's keep the modal internal or expose a trigger.

    // Actually, looking at the layout, the "Add Category" button is specific to the tab content header 
    // BUT the header "Item Settings" has a global "Add Category" button. 
    // Let's assume the parent "ItemSettings" page handles the "Add" button click 
    // and passes a prop to open the modal.

    // For this implementation, I'll attach the `onAdd` prop to the parent's button action.

    return (
        <div className="space-y-4">
            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Error</span>
                        <span className="text-xs">{error}</span>
                    </div>
                </div>
            )}

            <div className="hidden md:block rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                            <tr>
                                {["Name", "Type", "Description", "Status", "Actions"].map((header) => (
                                    <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {isLoading ? (
                                <TableSkeleton rowCount={5} columnCount={5} />
                            ) : (
                                categories.map((item) => (
                                    <tr key={item.id} className="group hover:bg-[var(--dashboard-secondary)] transition-colors">
                                        <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.name}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.type}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.description}</td>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Mobile Card Design */}
            <div className="md:hidden space-y-4">
                {isLoading ? (
                    <TableSkeleton rowCount={5} columnCount={1} />
                ) : (
                    categories.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-3"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Type: {item.type}
                                    </p>
                                </div>

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
                                <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                    Description
                                </p>
                                <p className="text-sm text-[var(--dashboard-text)]">
                                    {item.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
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
                    ))
                )}
            </div>
            <CategoryModal
                isOpen={isModalOpen} // Controlled effectively by parent if we hoist state, or kept simple here. 
                // Current design implies parent button triggers this. 
                // We'll need to coordinate this. For now let's keep it here 
                // and potentially expose a ref or similar if needed, 
                // or just let the parent pass "isAddModalOpen" prop.
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={modalData}
            />
        </div>
    );
};

export default CategoriesTab;
