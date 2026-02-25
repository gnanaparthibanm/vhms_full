import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Upload,
    Settings as SettingsIcon,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import ImportBillableItemsModal from './ImportBillableItemsModal';
import FilterPanel from '../../components/common/FilterPanel';
import { billableItemService } from '../../services/billableItemService';

const ITEMS_PER_PAGE = 10;

const statusClass = (status) => {
    switch (status) {
        case "Active":
            return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
        case "Inactive":
            return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
        default:
            return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
    }
};

const BillableItems = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("All Status");
    const [appliedFilter, setAppliedFilter] = useState("All Status");
    const [searchQuery, setSearchQuery] = useState("");
    
    // API Integration State
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState(null);

    // Fetch items from backend
    useEffect(() => {
        fetchItems();
    }, [currentPage, appliedFilter, searchQuery]);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchQuery,
            };
            
            if (appliedFilter !== "All Status") {
                params.status = appliedFilter;
            }
            
            const response = await billableItemService.getAllItems(params);
            const data = response.data?.data || response.data || {};
            
            setItems(data.data || []);
            setTotalItems(data.total || 0);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err.message || 'Failed to load items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        
        try {
            await billableItemService.deleteItem(id);
            fetchItems(); // Refresh list
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item');
        }
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

    return (
        <div className="container mx-auto lg:p-4 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">Billable Items</h1>
                    <p className="text-sm text-[var(--dashboard-text-light)]">Manage your products, services, and other billable items</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="relative w-full md:w-fit">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--dashboard-text-light)]" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-9 w-full md:w-[250px] bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                        />
                    </div>

                    <Button
                        onClick={() => setIsFilterPanelOpen(true)}
                        variant="outline"
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-primary)] hover:text-white"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>

                    <Button
                        onClick={() => navigate('/billable-items/create')}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setIsImportModalOpen(true)}
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    onClick={() => navigate('/billable-items/settings')}
                    className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Item Settings
                </Button>
            </div>

            {/* Error State */}
            {error && !isLoading && (
                <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load items</p>
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <Button 
                        onClick={fetchItems}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && items.length === 0 && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
                    <p className="text-[var(--dashboard-text)] font-medium mb-2">No items found</p>
                    <p className="text-sm text-[var(--dashboard-text-light)] mb-4">
                        {searchQuery || appliedFilter !== "All Status" 
                            ? "Try adjusting your filters or search query" 
                            : "Get started by creating your first billable item"}
                    </p>
                    <Button 
                        onClick={() => navigate('/billable-items/create')}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Item
                    </Button>
                </div>
            )}

            {/* Table Section - Desktop */}
            {!error && items.length > 0 && (
                <div className="hidden lg:block">
                    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                                    <tr>
                                        {["Name", "SKU", "Type", "Price", "Initial Stock", "Current Stock", "Status", "Actions"].map((header) => (
                                            <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {isLoading ? (
                                        <TableSkeleton rowCount={8} columnCount={8} />
                                    ) : (
                                        items.map((item) => (
                                            <React.Fragment key={item.id}>
                                                <tr
                                                    onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                                    className="group hover:bg-[var(--dashboard-secondary)] transition-colors cursor-pointer"
                                                >
                                                    <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.name}</td>
                                                    <td className="p-4 text-[var(--dashboard-text-light)]">{item.sku}</td>
                                                    <td className="p-4 text-[var(--dashboard-text-light)]">{item.type}</td>
                                                    <td className="p-4 text-[var(--dashboard-text)] font-medium">₹{parseFloat(item.price).toFixed(2)}</td>
                                                    <td className="p-4 text-[var(--dashboard-text-light)]">
                                                        {item.stock_tracking ? item.initial_stock : 'N/A'}
                                                    </td>
                                                    <td className="p-4 text-[var(--dashboard-text-light)]">
                                                        {item.stock_tracking ? item.current_stock : 'N/A'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/billable-items/edit/${item.id}`)}
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
                                                {expandedRow === item.id && (
                                                    <tr>
                                                        <td colSpan={8} className="p-0">
                                                            <div className="bg-purple-100 dark:bg-purple-900/20 p-6 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                    {/* Item Information */}
                                                                    <div>
                                                                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-3">Item Information</h3>
                                                                        <div className="space-y-2 text-sm">
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Name:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.name}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Description:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.description || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Type:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.type}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Price:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">₹{parseFloat(item.price).toFixed(2)}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Cost:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">₹{parseFloat(item.cost || 0).toFixed(2)}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Category:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.category || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Duration:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.duration || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Inventory Details */}
                                                                    <div>
                                                                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-3">Inventory Details</h3>
                                                                        <div className="space-y-2 text-sm">
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Stock Tracking:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.stock_tracking ? 'Yes' : 'No'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">SKU:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.sku}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Initial Stock:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.stock_tracking ? item.initial_stock : 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Current Stock:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.stock_tracking ? item.current_stock : 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Reorder Level:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.reorder_level || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Created:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">
                                                                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                                                        month: 'short',
                                                                                        day: '2-digit',
                                                                                        year: 'numeric'
                                                                                    })}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Additional Information */}
                                                                    <div>
                                                                        <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-3">Additional Information</h3>
                                                                        <div className="space-y-2 text-sm">
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Status:</span>{' '}
                                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(item.status)}`}>
                                                                                    {item.status}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Tags:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.tags || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Tax Rate:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.tax_rate || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-[var(--dashboard-text)] font-medium">Manufacturer:</span>{' '}
                                                                                <span className="text-[var(--dashboard-text-light)]">{item.manufacturer || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Footer Pagination */}
                        <div className="flex items-center justify-between p-4 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
                            <div className="text-sm text-[var(--dashboard-text-light)] hidden md:block">
                                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                            </div>

                            <div className="flex items-center space-x-2 ms-auto md:ms-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-[var(--dashboard-text)] font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ImportBillableItemsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />

            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                title="Filter Items"
                filterOptions={[
                    { label: "All Status", value: "All Status" },
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" }
                ]}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onApply={() => {
                    setAppliedFilter(selectedFilter);
                    setIsFilterPanelOpen(false);
                    setCurrentPage(1);
                }}
                onReset={() => {
                    setSelectedFilter("All Status");
                    setAppliedFilter("All Status");
                    setCurrentPage(1);
                }}
            />
        </div>
    );
};

export default BillableItems;
