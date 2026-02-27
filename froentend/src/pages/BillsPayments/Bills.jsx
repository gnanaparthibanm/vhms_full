import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Receipt,
    ChevronLeft,
    ChevronRight,
    Eye,
    Store
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

    const handleViewInvoice = async (sale) => {
        try {
            // If sale doesn't have items loaded, fetch full details
            if (!sale.items || sale.items.length === 0) {
                const response = await posService.getSaleById(sale.id);
                const saleData = response.data?.data || response.data;
                setSelectedSale(saleData);
            } else {
                setSelectedSale(sale);
            }
            setShowInvoiceModal(true);
        } catch (error) {
            console.error('Error fetching sale details:', error);
            alert('Failed to load invoice details');
        }
    };

    const handlePrintInvoice = () => {
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
                        <Store className="mr-1 h-3 w-3" />
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
                                                <Eye className="mr-2 h-4 w-4" />
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

                            {/* View Invoice Button */}
                            <button
                                onClick={() => handleViewInvoice(sale)}
                                className="w-full mt-2 px-4 py-2 bg-[var(--dashboard-primary)] text-white rounded-lg hover:bg-[var(--dashboard-primary-hover)] flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                View Invoice
                            </button>
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

            {/* Invoice Modal */}
            {showInvoiceModal && selectedSale && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Invoice Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
                            <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrintInvoice}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Print
                                </button>
                                <button
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div className="p-8">
                            {/* Invoice Header Info */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Invoice Number</p>
                                        <p className="font-semibold text-lg">{selectedSale.sale_no}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-semibold">{formatDate(selectedSale.sale_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                                <p className="text-gray-800 font-medium">{selectedSale.customer_name || 'Walk-in Customer'}</p>
                                {selectedSale.customer_phone && (
                                    <p className="text-gray-600">{selectedSale.customer_phone}</p>
                                )}
                            </div>

                            {/* Items Table */}
                            <div className="mb-8">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Qty</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tax</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedSale.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-800">{item.item_name}</p>
                                                    {item.item_type && (
                                                        <p className="text-xs text-gray-500">{item.item_type}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(item.tax_amount)}</td>
                                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end mb-8">
                                <div className="w-64">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(selectedSale.subtotal_amount)}</span>
                                    </div>
                                    {selectedSale.discount_amount > 0 && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Discount:</span>
                                            <span className="font-medium text-red-600">-{formatCurrency(selectedSale.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Tax:</span>
                                        <span className="font-medium">{formatCurrency(selectedSale.tax_amount)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                        <span className="text-lg font-bold text-gray-800">Total:</span>
                                        <span className="text-lg font-bold text-gray-800">{formatCurrency(selectedSale.total_amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-semibold capitalize">{selectedSale.payment_method}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(selectedSale.status)}`}>
                                        {selectedSale.status}
                                    </span>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedSale.notes && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                                    <p className="text-sm text-gray-600">{selectedSale.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bills;
