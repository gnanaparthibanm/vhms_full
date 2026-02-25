import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { TableSkeleton } from '../../../components/ui/TableSkeleton';
import CategoryModal from './CategoryModal';
import { settingsService } from '../../../services/settingsService';

const CategoriesTab = ({ isAddModalOpen, onCloseAddModal }) => {
    const [categories, setCategories] = useState([]);
    const [editData, setEditData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await settingsService.getAllCategories({ limit: 100 });
            const data = response.data.data?.data || response.data;
            setCategories(data.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditData(category);
        setIsEditModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            if (editData) {
                // Update existing
                await settingsService.updateCategory(editData.id, data);
            } else {
                // Create new
                await settingsService.createCategory(data);
            }
            setIsEditModalOpen(false);
            onCloseAddModal();
            fetchCategories();
        } catch (err) {
            console.error('Error saving category:', err);
            alert(err.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await settingsService.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert(err.message || 'Failed to delete category');
        }
    };

    // Determine if we show the modal for adding (from prop) or editing (local state)
    const showAddModal = isAddModalOpen;
    const showEditModal = isEditModalOpen; 
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
                                        <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.category_name}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.type || 'N/A'}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{item.description}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_active
                                                ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
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
                                                    onClick={() => handleDelete(item.id)}
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
                                        {item.category_name}
                                    </p>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Type: {item.type || 'N/A'}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${item.is_active
                                            ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    {item.is_active ? 'Active' : 'Inactive'}
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
                                    onClick={() => handleDelete(item.id)}
                                    className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <CategoryModal
                isOpen={showAddModal}
                onClose={onCloseAddModal}
                onSave={handleSave}
                initialData={null}
            />

            {/* Edit Modal */}
            <CategoryModal
                isOpen={showEditModal}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                initialData={editData}
            />
        </div>
    );
};

export default CategoriesTab;
