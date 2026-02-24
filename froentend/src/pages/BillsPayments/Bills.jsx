import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Receipt,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TableSkeleton } from '../../components/ui/TableSkeleton';

const ITEMS_PER_PAGE = 10;

// Mock data based on the screenshot
const mockBills = [
    { id: 1, code: "INV-00021", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20260124", date: "Jan 24, 2026 1:18 PM", petClient: "Unknown - Unknown\nUnknown", amount: 6700.00, status: "paid", type: "sale" },
    { id: 2, code: "INV-00020", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20251227", date: "Dec 27, 2025 3:03 PM", petClient: "Unknown - Unknown\nUnknown", amount: 13150.00, status: "paid", type: "sale" },
    { id: 3, code: "INV-00018", reference: "BILL-Fusionedge Test Hospital - Main Branch-saqer-20251223", date: "Dec 23, 2025 11:38 AM", petClient: "saqer - S25PGKL6\ntest", amount: 2500.00, status: "overdue", type: "sale" },
    { id: 4, code: "INV-00019", reference: "BILL-Fusionedge Test Hospital - Main Branch-saqer-20251223", date: "Dec 23, 2025 11:38 AM", petClient: "saqer - S25PGKL6\ntest", amount: 2500.00, status: "paid", type: "sale" },
    { id: 5, code: "INV-00017", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20251127", date: "Nov 27, 2025 8:53 PM", petClient: "Unknown - Unknown\nUnknown", amount: 4050.00, status: "paid", type: "sale" },
    { id: 6, code: "INV-00016", reference: "BILL-Fusionedge Test Hospital - Main Branch-saqer-20251125", date: "Nov 26, 2025 3:16 AM", petClient: "saqer - S25PGKL6\ntest", amount: 1600.00, status: "paid", type: "sale" },
    { id: 7, code: "INV-00015", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20251103", date: "Nov 4, 2025 1:45 AM", petClient: "Unknown - Unknown\nUnknown", amount: 5800.00, status: "paid", type: "sale" },
    { id: 8, code: "INV-00014", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20251028", date: "Oct 28, 2025 5:24 PM", petClient: "Unknown - Unknown\nUnknown", amount: 850.00, status: "paid", type: "sale" },
    { id: 9, code: "INV-00013", reference: "BILL-Fusionedge Test Hospital - Main Branch-WALKIN-20251016", date: "Oct 16, 2025 5:32 PM", petClient: "Unknown - Unknown\nUnknown", amount: 1450.00, status: "paid", type: "sale" },
    { id: 10, code: "INV-00012", reference: "BILL-Srinivasa Clinic - Main Branch-WALKIN-20251015", date: "Oct 15, 2025 4:21 PM", petClient: "Unknown - Unknown\nUnknown", amount: 800.00, status: "paid", type: "sale" },
];

const statusClass = (status) => {
    switch (status) {
        case "paid":
            return "bg-green-500/10 text-green-600 dark:text-green-400";
        case "overdue":
            return "bg-red-500/10 text-red-600 dark:text-red-400";
        case "pending":
            return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
        default:
            return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
};

const Bills = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const totalItems = mockBills.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = mockBills.slice(startIndex, endIndex);

    return (
        <div className="container mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">Bills</h1>
                    <p className="text-sm text-[var(--dashboard-text-light)]">Manage and track all bills and invoices</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--dashboard-text-light)]" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 w-[250px] bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                        />
                    </div>

                    <Button variant="outline" className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-primary)] hover:text-white">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>

                    <Button
                        onClick={() => navigate('/bills-payments/create')}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>

                    <Button
                        variant="outline"
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <Receipt className="mr-2 h-4 w-4" />
                        POS
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="hidden lg:block rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)] shadow-sm">
                <div className=" overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                            <tr>
                                {["Code", "Reference", "Date ↑", "Pet / Client", "Amount", "Status", "Type", "Actions"].map((header) => (
                                    <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {isLoading ? (
                                <TableSkeleton rowCount={10} columnCount={8} />
                            ) : (
                                currentItems.map((bill) => (
                                    <tr key={bill.id} className="group hover:bg-[var(--dashboard-secondary)] transition-colors">
                                        <td className="p-4 font-medium text-[var(--dashboard-text)]">{bill.code}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)] max-w-xs truncate">{bill.reference}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{bill.date}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)] whitespace-pre-line text-xs">{bill.petClient}</td>
                                        <td className="p-4 text-[var(--dashboard-text)] font-medium">₹{bill.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                {bill.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/bills-payments/edit/${bill.id}`)}
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
                <div className="lg:flex hidden items-center justify-between p-4 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
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
            {/* ================= PREMIUM MOBILE CARD VIEW ================= */}
            <div className="lg:hidden space-y-4 bg-[var(--dashboard-secondary)]/30">

                {currentItems.map((bill) => (
                    <div
                        key={bill.id}
                        className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm p-4 space-y-4 transition hover:shadow-md"
                    >

                        {/* Header Row */}
                        <div className="flex justify-between items-start">

                            <div>
                                <p className="text-base font-semibold text-[var(--dashboard-text)]">
                                    {bill.code}
                                </p>
                                <p className="text-xs text-[var(--dashboard-text-light)] mt-1">
                                    {bill.date}
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass(bill.status)}`}
                            >
                                {bill.status}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[var(--border-color)]" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-3 text-sm">

                            <div>
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    Reference
                                </p>
                                <p className="text-[var(--dashboard-text)] truncate">
                                    {bill.reference}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    Type
                                </p>
                                <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    {bill.type}
                                </span>
                            </div>

                            <div className="col-span-2">
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    Pet / Client
                                </p>
                                <p className="text-xs text-[var(--dashboard-text)] whitespace-pre-line mt-1">
                                    {bill.petClient}
                                </p>
                            </div>

                        </div>

                        {/* Amount Section */}
                        <div className="flex justify-between items-center bg-[var(--dashboard-secondary)] rounded-lg px-3 py-2">

                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                Total Amount
                            </p>

                            <p className="text-lg font-bold text-[var(--dashboard-text)]">
                                ₹{bill.amount.toFixed(2)}
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/bills-payments/edit/${bill.id}`)}
                                className="flex-1 border-[var(--border-color)]"
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                Delete
                            </Button>
                        </div>

                    </div>
                ))}
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
        </div>
    );
};

export default Bills;
