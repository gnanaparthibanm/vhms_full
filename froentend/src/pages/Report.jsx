import { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
    FiDollarSign, FiShoppingBag, FiTruck, FiTrendingUp, FiDownload,
    FiHome, FiUsers, FiPackage, FiActivity, FiCalendar
} from 'react-icons/fi';
import { BsCurrencyRupee, BsTaxiFront } from 'react-icons/bs';
import StatCard from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { utils, writeFile } from 'xlsx';
import { Select } from '@/components/ui/select';
import { ChevronDown, IndianRupee, Receipt } from 'lucide-react';

const data = {
    2026: {
        monthlyStats: [
            {
                month: 'Jan',
                totalInvoices: 120,
                taxableAmount: 150000,
                cgst: 13500,
                sgst: 13500,
                igst: 0,
                totalGST: 27000,
                totalAmount: 177000,
                paidAmount: 165000,
                pendingAmount: 12000,
            },
            {
                month: 'Feb',
                totalInvoices: 95,
                taxableAmount: 130000,
                cgst: 11700,
                sgst: 11700,
                igst: 0,
                totalGST: 23400,
                totalAmount: 153400,
                paidAmount: 145000,
                pendingAmount: 8400,
            },
            {
                month: 'Mar',
                totalInvoices: 140,
                taxableAmount: 180000,
                cgst: 16200,
                sgst: 16200,
                igst: 0,
                totalGST: 32400,
                totalAmount: 212400,
                paidAmount: 200000,
                pendingAmount: 12400,
            },
            {
                month: 'Apr',
                totalInvoices: 110,
                taxableAmount: 160000,
                cgst: 14400,
                sgst: 14400,
                igst: 0,
                totalGST: 28800,
                totalAmount: 188800,
                paidAmount: 170000,
                pendingAmount: 18800,
            },
            {
                month: 'May',
                totalInvoices: 125,
                taxableAmount: 175000,
                cgst: 15750,
                sgst: 15750,
                igst: 0,
                totalGST: 31500,
                totalAmount: 206500,
                paidAmount: 195000,
                pendingAmount: 11500,
            },
            {
                month: 'Jun',
                totalInvoices: 100,
                taxableAmount: 145000,
                cgst: 13050,
                sgst: 13050,
                igst: 0,
                totalGST: 26100,
                totalAmount: 171100,
                paidAmount: 160000,
                pendingAmount: 11100,
            },
            {
                month: 'Jul',
                totalInvoices: 150,
                taxableAmount: 210000,
                cgst: 18900,
                sgst: 18900,
                igst: 0,
                totalGST: 37800,
                totalAmount: 247800,
                paidAmount: 230000,
                pendingAmount: 17800,
            },
            {
                month: 'Aug',
                totalInvoices: 135,
                taxableAmount: 195000,
                cgst: 17550,
                sgst: 17550,
                igst: 0,
                totalGST: 35100,
                totalAmount: 230100,
                paidAmount: 215000,
                pendingAmount: 15100,
            },
            {
                month: 'Sep',
                totalInvoices: 115,
                taxableAmount: 155000,
                cgst: 13950,
                sgst: 13950,
                igst: 0,
                totalGST: 27900,
                totalAmount: 182900,
                paidAmount: 170000,
                pendingAmount: 12900,
            },
            {
                month: 'Oct',
                totalInvoices: 160,
                taxableAmount: 220000,
                cgst: 19800,
                sgst: 19800,
                igst: 0,
                totalGST: 39600,
                totalAmount: 259600,
                paidAmount: 240000,
                pendingAmount: 19600,
            },
            {
                month: 'Nov',
                totalInvoices: 170,
                taxableAmount: 240000,
                cgst: 21600,
                sgst: 21600,
                igst: 0,
                totalGST: 43200,
                totalAmount: 283200,
                paidAmount: 265000,
                pendingAmount: 18200,
            },
            {
                month: 'Dec',
                totalInvoices: 180,
                taxableAmount: 260000,
                cgst: 23400,
                sgst: 23400,
                igst: 0,
                totalGST: 46800,
                totalAmount: 306800,
                paidAmount: 290000,
                pendingAmount: 16800,
            },
        ],

        yearlyStats: {
            totalInvoices: 1600,
            taxableAmount: 2220000,
            cgst: 199800,
            sgst: 199800,
            igst: 0,
            totalGST: 399600,
            totalAmount: 2619600,
            paidAmount: 2445000,
            pendingAmount: 174600,
        },
    },
    2025: {
        monthlyStats: [
            {
                month: 'Jan',
                totalInvoices: 100,
                taxableAmount: 120000,
                cgst: 10800,
                sgst: 10800,
                igst: 0,
                totalGST: 21600,
                totalAmount: 141600,
                paidAmount: 130000,
                pendingAmount: 11600,
            },
            {
                month: 'Feb',
                totalInvoices: 90,
                taxableAmount: 110000,
                cgst: 9900,
                sgst: 9900,
                igst: 0,
                totalGST: 19800,
                totalAmount: 129800,
                paidAmount: 120000,
                pendingAmount: 9800,
            },
            // continue remaining months similar structure
        ],
        yearlyStats: {
            totalInvoices: 1400,
            taxableAmount: 1950000,
            cgst: 175500,
            sgst: 175500,
            igst: 0,
            totalGST: 351000,
            totalAmount: 2301000,
            paidAmount: 2100000,
            pendingAmount: 201000,
        }
    },

    2024: {
        monthlyStats: [
            {
                month: 'Jan',
                totalInvoices: 80,
                taxableAmount: 100000,
                cgst: 9000,
                sgst: 9000,
                igst: 0,
                totalGST: 18000,
                totalAmount: 118000,
                paidAmount: 110000,
                pendingAmount: 8000,
            },
            // continue for full 12 months
        ],
        yearlyStats: {
            totalInvoices: 1200,
            taxableAmount: 1600000,
            cgst: 144000,
            sgst: 144000,
            igst: 0,
            totalGST: 288000,
            totalAmount: 1888000,
            paidAmount: 1700000,
            pendingAmount: 188000,
        }
    },
    petCategoryBreakdown: [
        { name: 'Dogs', value: 720 },
        { name: 'Cats', value: 410 },
        { name: 'Birds', value: 130 },
        { name: 'Others', value: 90 },
    ],

    serviceTypeBreakdown: [
        { name: 'Consultation', value: 850 },
        { name: 'Vaccination', value: 520 },
        { name: 'Surgery', value: 230 },
    ],

    topPetOwners: [
        { name: 'Rahul Sharma', phone: '9876543210', visits: 14, totalSpent: 52000 },
        { name: 'Priya Patel', phone: '9876543201', visits: 11, totalSpent: 46000 },
        { name: 'Arun Kumar', phone: '9876543202', visits: 9, totalSpent: 39000 },
        { name: 'Sneha Reddy', phone: '9876543203', visits: 12, totalSpent: 48000 },
        { name: 'Vikram Singh', phone: '9876543204', visits: 8, totalSpent: 36000 },
        { name: 'Meera Iyer', phone: '9876543205', visits: 10, totalSpent: 41000 },
        { name: 'Karthik Raj', phone: '9876543206', visits: 7, totalSpent: 33000 },
        { name: 'Anita Verma', phone: '9876543207', visits: 6, totalSpent: 29000 },
        { name: 'Rohit Nair', phone: '9876543208', visits: 13, totalSpent: 50000 },
        { name: 'Divya Shah', phone: '9876543209', visits: 5, totalSpent: 25000 },
    ]
};

const Report = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState('');
    const [period, setPeriod] = useState('year'); // 'year' or 'month'
    const currentYear = new Date().getFullYear();

    const [yearOpen, setYearOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState("All Months");

    const years = Object.keys(data)
        .filter(key => !isNaN(key)) // only numeric years
        .map(Number)
        .sort((a, b) => b - a);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleExport = () => {
        const selectedData = data[selectedYear];

        if (!selectedData) return;

        const { monthlyStats, yearlyStats } = selectedData;

        // Prepare data for Excel
        const ws1Data = monthlyStats.map(row => ({
            Month: row.month,
            Invoices: row.totalInvoices,
            TaxableValue: row.taxableAmount,
            CGST: row.cgst,
            SGST: row.sgst,
            IGST: row.igst,
            TotalGST: row.totalGST,
            TotalAmount: row.totalAmount,
            Paid: row.paidAmount,
            Pending: row.pendingAmount,
        }));

        // Add yearly summary
        ws1Data.push({
            Month: 'TOTAL',
            Invoices: yearlyStats.totalInvoices,
            TaxableValue: yearlyStats.taxableAmount,
            CGST: yearlyStats.cgst,
            SGST: yearlyStats.sgst,
            IGST: yearlyStats.igst,
            TotalGST: yearlyStats.totalGST,
            TotalAmount: yearlyStats.totalAmount,
            Paid: yearlyStats.paidAmount,
            Pending: yearlyStats.pendingAmount,
        });

        const ws1 = utils.json_to_sheet(ws1Data);

        // Device breakdown sheet
        const ws2Data = petCategoryBreakdown?.map(item => ({
            'Pet Category': item.name,
            'Count': item.value,
            'Percentage': `${((item.value / yearlyStats.totalInvoices) * 100).toFixed(1)}%`
        })) || [];
        const ws2 = utils.json_to_sheet(ws2Data);

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws1, "Monthly Report");
        utils.book_append_sheet(wb, ws2, "Pet Category Breakdown");

        writeFile(wb, `Business_Report_${selectedYear}.xlsx`);
    };


    const selectedData = data[selectedYear];

    const monthlyStats = selectedData?.monthlyStats || [];
    const yearlyStats = selectedData?.yearlyStats || {
        totalInvoices: 0,
        taxableAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalGST: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
    };

    const COLORS = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#b5179e'];

    const monthIndex = months.indexOf(selectedMonth);

    const selectedMonthData =
        monthIndex >= 0 ? monthlyStats[monthIndex] : null;

    const revenue =
        selectedMonth === "All Months"
            ? yearlyStats.taxableAmount
            : selectedMonthData?.taxableAmount || 0;

    const totalGST =
        selectedMonth === "All Months"
            ? yearlyStats.totalGST
            : selectedMonthData?.totalGST || 0;

    const totalInvoiceValue =
        selectedMonth === "All Months"
            ? yearlyStats.totalAmount
            : selectedMonthData?.totalAmount || 0;

    const totalGSTCollected =
        selectedMonth === "All Months"
            ? yearlyStats.totalGST
            : selectedMonthData?.totalGST || 0;

    const stats = [
        {
            title: 'Total Invoice Value',
            value: `₹${totalInvoiceValue.toLocaleString()}`,
            label: 'Including GST',
            icon: IndianRupee,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'GST Total Amount',
            value: `₹${totalGST.toLocaleString()}`,
            label: 'CGST + SGST + IGST',
            icon: Receipt,
            color: 'bg-emerald-100 text-emerald-600',
        },
        {
            title: 'Net Profit',
            value: `₹${revenue.toLocaleString()}`,
            label: period === 'year' ? 'Total Invoice Value - GST Total Amount' : 'Selected Month Revenue',
            icon: BsCurrencyRupee,
            color: 'bg-blue-100 text-blue-600',
        },

    ];



    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Business Reports & Analytics</h1>
                    <p className=" text-sm mt-1">
                        Comprehensive insights for {selectedYear}
                    </p>

                </div>
                <div className="flex items-center gap-3 flex-wrap">

                    {/* Year Select */}
                    <div className="space-y-1.5 relative w-32">
                        <button
                            onClick={() => setYearOpen(!yearOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm"
                        >
                            <span>{selectedYear}</span>
                            <ChevronDown size={16} className="text-slate-400" />
                        </button>

                        {yearOpen && (
                            <div className="absolute z-50 mt-1 w-full border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-md shadow-md max-h-60 overflow-y-auto">
                                {years.map((year) => (
                                    <div
                                        key={year}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setYearOpen(false);
                                        }}
                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100/10"
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Month Select (Optional) */}
                    <div className="space-y-1.5 relative w-40">
                        <button
                            onClick={() => setMonthOpen(!monthOpen)}
                            className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm"
                        >
                            <span>{selectedMonth}</span>
                            <ChevronDown size={16} className="text-slate-400" />
                        </button>

                        {monthOpen && (
                            <div className="absolute z-50 mt-1 w-full border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-md shadow-md max-h-60 overflow-y-auto">
                                {["All Months", ...months].map((month) => (
                                    <div
                                        key={month}
                                        onClick={() => {
                                            setSelectedMonth(month);
                                            setMonthOpen(false);
                                        }}
                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100/10"
                                    >
                                        {month}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="btn-primary flex items-center gap-2"
                    >
                        <FiDownload />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 min-[425px]:grid-cols-3 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} className="h-full" />
                ))}
            </div>

            {/* Detailed Monthly Breakdown Table */}
            <div className="card overflow-hidden  bg-[var(--card-bg)] shadow rounded-2xl hidden lg:block">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h3 className="font-bold  text-lg">Detailed Monthly Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm ">
                        <thead className=" bg-[var(--card-bg)]  uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4 text-right">Invoices</th>
                                <th className="px-6 py-4 text-right">Taxable Value</th>
                                <th className="px-6 py-4 text-right">CGST</th>
                                <th className="px-6 py-4 text-right">SGST</th>
                                <th className="px-6 py-4 text-right">IGST</th>
                                <th className="px-6 py-4 text-right">Total GST</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {monthlyStats.map((row) => (
                                <tr key={row.month} className="hover:bg-gray-50/10 transition-colors">
                                    <td className="px-6 py-4 font-medium ">{row.month}</td>
                                    <td className="px-6 py-4 text-right">{row.totalInvoices}</td>
                                    <td className="px-6 py-4 text-right">{row.taxableAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                                        {row.cgst.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">{row.sgst.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">{row.igst.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        ₹{row.totalGST.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-rose-500">
                                        ₹{row.totalAmount.toLocaleString()}
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                        <tfoot className="font-bold">
                            <tr className="border-t-2 border-[var(--border-color)]">
                                <td className="px-6 py-4">TOTAL</td>
                                <td className="px-6 py-4 text-right">{yearlyStats.totalInvoices}</td>
                                <td className="px-6 py-4 text-right text-emerald-600">
                                    {yearlyStats.taxableAmount}
                                </td>
                                <td className="px-6 py-4 text-right">{yearlyStats.cgst || 0}</td>
                                <td className="px-6 py-4 text-right">{yearlyStats.sgst || 0}</td>
                                <td className="px-6 py-4 text-right">₹{(yearlyStats.igst || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-rose-600">
                                    ₹{(yearlyStats.totalGST || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-blue-600">
                                    ₹{(yearlyStats.totalAmount || 0).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* ================= MOBILE CARD VIEW ================= */}
            <div className="lg:hidden space-y-4">
                {monthlyStats.map((row) => (
                    <div
                        key={row.month}
                        className="bg-[var(--card-bg)] rounded-xl p-4 shadow space-y-2"
                    >
                        <div className="flex justify-between font-semibold text-lg">
                            <span>{row.month}</span>
                            <span className="text-blue-600">
                                ₹{row.totalAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Invoices:</div>
                            <div className="text-right">{row.totalInvoices}</div>

                            <div>Taxable:</div>
                            <div className="text-right">
                                ₹{row.taxableAmount.toLocaleString()}
                            </div>

                            <div>CGST:</div>
                            <div className="text-right">
                                ₹{row.cgst.toLocaleString()}
                            </div>

                            <div>SGST:</div>
                            <div className="text-right">
                                ₹{row.sgst.toLocaleString()}
                            </div>

                            <div>IGST:</div>
                            <div className="text-right">
                                ₹{row.igst.toLocaleString()}
                            </div>

                            <div className="font-semibold">Total GST:</div>
                            <div className="text-right font-semibold text-emerald-600">
                                ₹{row.totalGST.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Report;
