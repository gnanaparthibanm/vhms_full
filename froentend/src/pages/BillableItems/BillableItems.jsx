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
    ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import ImportBillableItemsModal from './ImportBillableItemsModal';
import FilterPanel from '../../components/common/FilterPanel';

const ITEMS_PER_PAGE = 10;

const mockItems = [
    {
        id: 1,
        name: "Blood Test - CBC",
        sku: "FTH-S-0017",
        type: "Service",
        price: 800.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Complete Blood Count test",
        cost: 0.00,
        category: "Laboratory",
        duration: "30 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 3rd, 2025 6:17 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "diagnostics",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 2,
        name: "Blood Test - Chemistry",
        sku: "FTH-S-0018",
        type: "Service",
        price: 1500.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Chemistry panel blood test",
        cost: 0.00,
        category: "Laboratory",
        duration: "45 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 3rd, 2025 6:18 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "diagnostics",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 3,
        name: "Consultation - General",
        sku: "FTH-S-0001",
        type: "Service",
        price: 500.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "General veterinary consultation",
        cost: 0.00,
        category: "Consultation",
        duration: "20 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 1st, 2025 2:00 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "consultation",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 4,
        name: "Cremation - Large Pet",
        sku: "FTH-S-0023",
        type: "Service",
        price: 5000.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Cremation service for large pets",
        cost: 0.00,
        category: "End of Life Services",
        duration: "N/A",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 5th, 2025 10:00 AM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "cremation",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 5,
        name: "Cremation - Small Pet",
        sku: "FTH-S-0022",
        type: "Service",
        price: 3000.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Cremation service for small pets",
        cost: 0.00,
        category: "End of Life Services",
        duration: "N/A",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 5th, 2025 10:00 AM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "cremation",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 6,
        name: "Dental Cleaning",
        sku: "FTH-S-0014",
        type: "Service",
        price: 3000.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Professional dental cleaning service",
        cost: 0.00,
        category: "Dental",
        duration: "60 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 3rd, 2025 4:00 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "dental",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 7,
        name: "Deworming - Adult Dog",
        sku: "FTH-M-0010",
        type: "Medication",
        price: 200.00,
        initialStock: "200",
        currentStock: "199",
        status: "Active",
        description: "Deworming medication for adult dogs",
        cost: 100.00,
        category: "Medication",
        duration: "N/A",
        stockTracking: "Yes",
        reorderLevel: "50",
        created: "September 2nd, 2025 11:00 AM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "medication, deworming",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Medicine Tax - 5%"
    },
    {
        id: 8,
        name: "Deworming - Puppy",
        sku: "FTH-M-0009",
        type: "Medication",
        price: 150.00,
        initialStock: "200",
        currentStock: "199",
        status: "Active",
        description: "Deworming medication for puppies",
        cost: 75.00,
        category: "Medication",
        duration: "N/A",
        stockTracking: "Yes",
        reorderLevel: "50",
        created: "September 2nd, 2025 11:00 AM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "medication, deworming",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Medicine Tax - 5%"
    },
    {
        id: 9,
        name: "Ear Cleaning",
        sku: "FTH-S-0026",
        type: "Service",
        price: 500.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Professional ear cleaning service",
        cost: 0.00,
        category: "Grooming",
        duration: "15 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 4th, 2025 3:00 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "grooming",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
    {
        id: 10,
        name: "Emergency Consultation",
        sku: "FTH-S-0002",
        type: "Service",
        price: 1200.00,
        initialStock: "N/A",
        currentStock: "N/A",
        status: "Active",
        description: "Emergency veterinary consultation service",
        cost: 0.00,
        category: "Emergency",
        duration: "30 minutes",
        stockTracking: "No",
        reorderLevel: "100",
        created: "September 1st, 2025 2:30 PM",
        updated: "2/11/2026, 5:35:07 PM",
        tags: "emergency, consultation",
        branch: "Fusionedge Test Hospital - Main Branch",
        taxRate: "Service Tax - 10%"
    },
];

const statusClass = (status) => {
    switch (status) {
        case "Active":
            return "bg-pink-500/10 text-pink-600 dark:text-pink-400"; // Matches screenshot pink/red theme
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

    // Simulate loading effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const totalItems = mockItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = mockItems.slice(startIndex, endIndex);

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

            {/* Table Section */}
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
                                    currentItems.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr
                                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                                className="group hover:bg-[var(--dashboard-secondary)] transition-colors cursor-pointer"
                                            >
                                                <td className="p-4 font-medium text-[var(--dashboard-text)]">{item.name}</td>
                                                <td className="p-4 text-[var(--dashboard-text-light)]">{item.sku}</td>
                                                <td className="p-4 text-[var(--dashboard-text-light)]">{item.type}</td>
                                                <td className="p-4 text-[var(--dashboard-text)] font-medium">₹{item.price.toFixed(2)}</td>
                                                <td className="p-4 text-[var(--dashboard-text-light)]">{item.initialStock}</td>
                                                <td className="p-4 text-[var(--dashboard-text-light)]">{item.currentStock}</td>
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
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.description}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Type:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.type}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Price:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">₹{item.price.toFixed(2)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Cost:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">₹{item.cost.toFixed(2)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Category:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.category}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Duration:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.duration}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Inventory Details */}
                                                                <div>
                                                                    <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-3">Inventory Details</h3>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Stock Tracking:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.stockTracking}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">SKU:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.sku}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Initial Stock:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.initialStock}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Current Stock:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.currentStock}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Reorder Level:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.reorderLevel}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Created:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.created}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Updated:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.updated}</span>
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
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.tags}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Branch:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.branch}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--dashboard-text)] font-medium">Tax Rate:</span>{' '}
                                                                            <span className="text-[var(--dashboard-text-light)]">{item.taxRate}</span>
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
            <div className="lg:flex hidden items-center justify-between p-4 border-t border-[var(--border-color)] bg-[var(--card-bg)] ">
                <div className="text-sm text-[var(--dashboard-text-light)] hidden md:block">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
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

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <TableSkeleton rowCount={4} columnCount={1} />
                    </div>
                ) : (
                    currentItems.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-3"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-base font-semibold text-[var(--dashboard-text)]">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        SKU: {item.sku}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            {/* Price */}
                            <div>
                                <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                    Price
                                </p>
                                <p className="text-lg font-semibold text-[var(--dashboard-text)]">
                                    ₹{item.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Stock Info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                        Type
                                    </p>
                                    <p className="text-[var(--dashboard-text)]">
                                        {item.type}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                        Initial Stock
                                    </p>
                                    <p className="text-[var(--dashboard-text)]">
                                        {item.initialStock}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                        Current Stock
                                    </p>
                                    <p
                                        className={`font-medium ${item.currentStock <= 5
                                            ? "text-red-500"
                                            : "text-[var(--dashboard-text)]"
                                            }`}
                                    >
                                        {item.currentStock}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/billable-items/edit/${item.id}`)}
                                    className="flex-1 h-9 border border-[var(--border-color)] text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-9 border border-red-200 dark:border-red-800 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Footer Pagination */}
            <div className="lg:hidden flex items-center justify-between">
                <div className="text-sm text-[var(--dashboard-text-light)] hidden md:block">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
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
                }}
                onReset={() => {
                    setSelectedFilter("All Status");
                    setAppliedFilter("All Status");
                }}
            />
        </div>
    );
};

export default BillableItems;
