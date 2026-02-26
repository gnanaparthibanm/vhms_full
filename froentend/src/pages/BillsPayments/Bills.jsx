import React, { useState, useEffect } from 'react';
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
import { posService } from '../../services/posService';

const ITEMS_PER_PAGE = 10;

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
    const [isLoading, setIsLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    useEffect(() => {
        fetchSales();
    }, [currentPage, searchQuery]);

    const fetchSales = async () => {
        try {
            setIsLoading(true);
            const offset = (currentPage - 1) * ITEMS_PER_PAGE;
            const params = {
                limit: ITEMS_PER_PAGE,
                offset: offset
            };

            if (searchQuery) {
                params.sale_no = searchQuery;
            }

            const response = await posService.getAllSales(params);
            const data = response.data?.data?.data || response.data || {};
            
            setSales(data.data || []);
            setTotalItems(data.total || 0);
        } catch (error) {
            console.error('Error fetching sales:', error);
            setSales([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleViewInvoice = (sale) => {
        setSelectedSale(sale);
        setShowInvoiceModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

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
                            placeholder="Search by sale number..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-9 w-[250px] bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                        />
                    </div>

                    <Button variant="outline" className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-primary)] hover:text-white">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>

                    {/* <Button
                        onClick={() => navigate('/bills-payments/create')}
                        variant="outline"
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-primary)] hover:text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button> */}

                    <Button
                        onClick={() => navigate('/pos')}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] shadow-md hover:shadow-lg transition-all"
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
                                {["Sale No", "Customer", "Date", "Items", "Subtotal", "Tax", "Total", "Payment", "Status", "Actions"].map((header) => (
                                    <th key={header} className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] uppercase text-xs tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {isLoading ? (
                                <TableSkeleton rowCount={10} columnCount={10} />
                            ) : sales.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="p-8 text-center text-[var(--dashboard-text-light)]">
                                        No sales found
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="group hover:bg-[var(--dashboard-secondary)] transition-colors">
                                        <td className="p-4 font-medium text-[var(--dashboard-text)]">{sale.sale_no}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">
                                            <div className="text-sm">{sale.customer_name || 'Walk-in'}</div>
                                            {sale.customer_phone && (
                                                <div className="text-xs text-[var(--dashboard-text-light)]">{sale.customer_phone}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-[var(--dashboard-text-light)] text-xs">{formatDate(sale.sale_date)}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)] text-center">{sale.items?.length || 0}</td>
                                        <td className="p-4 text-[var(--dashboard-text)]">{formatCurrency(sale.subtotal_amount)}</td>
                                        <td className="p-4 text-[var(--dashboard-text)]">{formatCurrency(sale.tax_amount)}</td>
                                        <td className="p-4 text-[var(--dashboard-text)] font-medium">{formatCurrency(sale.total_amount)}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 capitalize">
                                                {sale.payment_method}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewInvoice(sale)}
                                                className="h-8 px-3 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--card-bg)] border border-[var(--border-color)]"
                                            >
                                                View Invoice
                                            </Button>
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
                {isLoading ? (
                    <div className="text-center py-8 text-[var(--dashboard-text-light)]">
                        Loading sales...
                    </div>
                ) : sales.length === 0 ? (
                    <div className="text-center py-8 text-[var(--dashboard-text-light)]">
                        No sales found
                    </div>
                ) : (
                    sales.map((sale) => (
                        <div
                            key={sale.id}
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm p-4 space-y-4 transition hover:shadow-md"
                        >
                            {/* Header Row */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-base font-semibold text-[var(--dashboard-text)]">
                                        {sale.sale_no}
                                    </p>
                                    <p className="text-xs text-[var(--dashboard-text-light)] mt-1">
                                        {formatDate(sale.sale_date)}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass(sale.status)}`}
                                >
                                    {sale.status}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[var(--border-color)]" />

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Customer
                                    </p>
                                    <p className="text-[var(--dashboard-text)]">
                                        {sale.customer_name || 'Walk-in'}
                                    </p>
                                    {sale.customer_phone && (
                                        <p className="text-xs text-[var(--dashboard-text-light)]">
                                            {sale.customer_phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Payment Method
                                    </p>
                                    <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 capitalize">
                                        {sale.payment_method}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Items
                                    </p>
                                    <p className="text-[var(--dashboard-text)]">
                                        {sale.items?.length || 0} items
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Tax
                                    </p>
                                    <p className="text-[var(--dashboard-text)]">
                                        {formatCurrency(sale.tax_amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className="flex justify-between items-center bg-[var(--dashboard-secondary)] rounded-lg px-3 py-2">
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    Total Amount
                                </p>
                                <p className="text-lg font-bold text-[var(--dashboard-text)]">
                                    {formatCurrency(sale.total_amount)}
                                </p>
                            </div>

                            {sale.notes && (
                                <div className="text-xs text-[var(--dashboard-text-light)] bg-[var(--dashboard-secondary)] rounded-lg p-2">
                                    <span className="font-medium">Notes:</span> {sale.notes}
                                </div>
                            )}
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
        </div>
    );
};

export default Bills;
