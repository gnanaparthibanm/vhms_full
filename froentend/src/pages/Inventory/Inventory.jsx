import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
const appointments = [
    {
        id: 1,
        reference: "AS123",
        itemName: "Pet Carrier - Small",
        type: "Return",
        quantity: 1,
        date: "Feb 16, 2026",
        reason: "Damaged stock",
        cost: "$2200.00",
    },
    {
        id: 2,
        reference: "87HJ7U",
        itemName: "Prescription Diet Food",
        type: "Purchase",
        quantity: 3,
        date: "Oct 16, 2025",
        reason: "N/A",
        cost: "$1200.00",
    },
    {
        id: 3,
        reference: "BK9081",
        itemName: "Dog Leash - Premium",
        type: "Purchase",
        quantity: 5,
        date: "Jan 12, 2026",
        reason: "N/A",
        cost: "$450.00",
    },
    {
        id: 4,
        reference: "TR5543",
        itemName: "Cat Scratching Post",
        type: "Return",
        quantity: 2,
        date: "Feb 02, 2026",
        reason: "Customer complaint",
        cost: "$780.00",
    },
    {
        id: 5,
        reference: "LM3322",
        itemName: "Bird Cage - Medium",
        type: "Purchase",
        quantity: 4,
        date: "Nov 20, 2025",
        reason: "N/A",
        cost: "$1600.00",
    },
    {
        id: 6,
        reference: "GH7710",
        itemName: "Fish Tank Filter",
        type: "Return",
        quantity: 1,
        date: "Dec 05, 2025",
        reason: "Defective item",
        cost: "$300.00",
    },
    {
        id: 7,
        reference: "ZX8821",
        itemName: "Hamster Wheel",
        type: "Purchase",
        quantity: 6,
        date: "Jan 28, 2026",
        reason: "N/A",
        cost: "$540.00",
    },
    {
        id: 8,
        reference: "QP1109",
        itemName: "Dog Bed - Large",
        type: "Return",
        quantity: 1,
        date: "Feb 10, 2026",
        reason: "Wrong size",
        cost: "$950.00",
    },
    {
        id: 9,
        reference: "MN4456",
        itemName: "Cat Litter - 10kg",
        type: "Purchase",
        quantity: 8,
        date: "Oct 30, 2025",
        reason: "N/A",
        cost: "$720.00",
    },
    {
        id: 10,
        reference: "RT9901",
        itemName: "Pet Grooming Kit",
        type: "Return",
        quantity: 2,
        date: "Jan 18, 2026",
        reason: "Damaged packaging",
        cost: "$680.00",
    },
];


const statusClass = (status) => {
    switch (status) {
        case "Confirmed":
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        case "Pending":
            return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
        case "Cancelled":
            return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
        default:
            return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
    }
};

const ITEMS_PER_PAGE = 10;
const Inventory = () => {
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("List");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const totalItems = appointments.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [branchOpen, setBranchOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const branches = ["All Branches", "Chennai", "Coimbatore", "Madurai"];
    const statuses = ["All Statuses", "Confirmed", "Pending", "Cancelled", "Completed", "No Show"];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [openPicker, setOpenPicker] = useState(null); // "from" | "to" | null
    const currentAppointments = appointments.slice(startIndex, endIndex);
    return (
        <div className="container mx-auto lg:p-4">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
                            Inventory Management
                        </h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">
                            Track and manage your inventory items
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            className="h-9 w-full sm:w-[300px] rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
                            placeholder="Search..."
                        />
                        <Button onClick={() => setOpenModal(true)} className="h-9 rounded-md border border-[var(--border-color)] px-4 text-sm bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] hover:text-white">
                            Filters
                        </Button>
                        <Button onClick={() => navigate("/inventory/create")} className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]">
                            <Plus size={20} />
                            Create New
                        </Button>
                    </div>
                    {openModal && (
                        <div className="fixed inset-0 z-50 flex justify-end">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                                onClick={() => setOpenModal(false)}
                            />

                            {/* Side Pane */}
                            <div className="relative w-full max-w-sm bg-[var(--card-bg)] shadow-2xl border border-[var(--border-color)] h-full flex flex-col animate-in slide-in-from-right duration-300">

                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h2 className="text-lg font-semibold text-[var(--dashboard-text)] ">Filter Appointments</h2>
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className="p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                                    {/* Branch Dropdown */}
                                    {/* Branch Dropdown */}
                                    <div className="space-y-1.5 relative">
                                        <button
                                            onClick={() => setBranchOpen(!branchOpen)}
                                            className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm transition-colors"
                                        >
                                            <span className="">{selectedBranch}</span>
                                            <ChevronDown size={16} className="text-slate-400" />
                                        </button>

                                        {branchOpen && (
                                            <div className="absolute z-10 mt-1 w-full border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-md shadow-md">
                                                {branches.map((branch) => (
                                                    <div
                                                        key={branch}
                                                        onClick={() => {
                                                            setSelectedBranch(branch);
                                                            setBranchOpen(false);
                                                        }}
                                                        className="px-3 py-2 text-sm cursor-pointer"
                                                    >
                                                        {branch}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Dropdown */}
                                    {/* Status Dropdown */}
                                    <div className="space-y-1.5 relative">
                                        <button
                                            onClick={() => setStatusOpen(!statusOpen)}
                                            className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm transition-colors"
                                        >
                                            <span className="">{selectedStatus}</span>
                                            <ChevronDown size={16} className="text-slate-400" />
                                        </button>

                                        {statusOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border rounded-md shadow-md">
                                                {statuses.map((status) => (
                                                    <div
                                                        key={status}
                                                        onClick={() => {
                                                            setSelectedStatus(status);
                                                            setStatusOpen(false);
                                                        }}
                                                        className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        {status}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Range */}
                                    {/* Date Range */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* From Date */}
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-semibold text-[var(--dashboard-text)] uppercase tracking-wider">
                                                From Date
                                            </label>

                                            <button
                                                onClick={() => setOpenPicker(openPicker === "from" ? null : "from")}
                                                className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="" />
                                                    <span className="">
                                                        {fromDate
                                                            ? fromDate.toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            })
                                                            : "Pick start date"}
                                                    </span>
                                                </div>
                                            </button>

                                            {openPicker === "from" && (
                                                <div className="absolute z-20 mt-2 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-lg shadow-xl p-2">
                                                    <DatePicker
                                                        selected={fromDate}
                                                        onChange={(date) => {
                                                            setFromDate(date);

                                                            // If toDate is before new fromDate → reset it
                                                            if (toDate && date > toDate) {
                                                                setToDate(null);
                                                            }

                                                            setOpenPicker(null);
                                                        }}
                                                        inline
                                                        maxDate={toDate || undefined}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* To Date */}
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-semibold text-[var(--dashboard-text)] uppercase tracking-wider">
                                                To Date
                                            </label>

                                            <button
                                                onClick={() => setOpenPicker(openPicker === "to" ? null : "to")}
                                                className="flex h-10 w-full items-center justify-between rounded-md border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] px-3 py-2 text-sm shadow-sm transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="" />
                                                    <span className="">
                                                        {toDate
                                                            ? toDate.toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            })
                                                            : "Pick end date"}
                                                    </span>
                                                </div>
                                            </button>

                                            {openPicker === "to" && (
                                                <div className="absolute right-0 z-20 mt-2 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border  rounded-lg shadow-xl p-2">
                                                    <DatePicker
                                                        selected={toDate}
                                                        onChange={(date) => {
                                                            setToDate(date);
                                                            setOpenPicker(null);
                                                        }}
                                                        inline
                                                        minDate={fromDate || undefined}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 border-t bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] flex justify-end gap-3">
                                    {/* Reset */}
                                    <button
                                        onClick={() => {
                                            setSelectedBranch("All Branches");
                                            setSelectedStatus("All Statuses");
                                            setFilteredAppointments(appointments);
                                        }}
                                        className="px-4 py-2 text-sm font-medium bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] border-[var(--border-color)] border rounded-md shadow-sm transition-colors"
                                    >
                                        Reset
                                    </button>

                                    {/* Apply Filters */}
                                    <button
                                        onClick={() => {
                                            let filtered = appointments;

                                            if (selectedStatus !== "All Statuses") {
                                                filtered = filtered.filter(
                                                    (item) => item.status === selectedStatus
                                                );
                                            }

                                            // (If branch exists in real data, filter here)

                                            setFilteredAppointments(filtered);
                                            setOpenModal(false);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2 text-sm font-medium bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]  rounded-md shadow-sm "
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <>
                    <div className="hidden lg:block  ">
                        <div className="rounded-xl border border-[var(--border-color)] overflow-x-auto bg-[var(--card-bg)] shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                    <tr>
                                        {[
                                            "Reference",
                                            "Item Name",
                                            "Type",
                                            "Quantity",
                                            "Date",
                                            "Reason",
                                            "Cost",
                                            "Actions",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentAppointments.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors"
                                        >
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.reference}</td>
                                            <td className="p-4 text-[var(--dashboard-text-light)]">{item.itemName}</td>
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.type}</td>
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.quantity}</td>
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.date}</td>
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.reason}</td>
                                            <td className="p-4 text-[var(--dashboard-text)]">{item.cost}</td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Button onClick={() => navigate("/inventory/update")} className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                                        Edit
                                                    </Button>
                                                    <Button className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
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
                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {currentAppointments.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-3"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                            {item.itemName}
                                        </p>
                                        <p className="text-xs text-[var(--dashboard-text-light)]">
                                            Reference: {item.reference}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                            item.type
                                        )}`}
                                    >
                                        {item.type}
                                    </span>
                                </div>

                                {/* Reason */}
                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                        Quantity
                                    </p>
                                    <p className="text-sm text-[var(--dashboard-text)]">
                                        {item.quantity}
                                    </p>
                                </div>

                                {/* Client */}
                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                        Date
                                    </p>
                                    <p className="text-sm font-medium text-[var(--dashboard-text)]">
                                        {item.date}
                                    </p>
                                </div>

                                {/* Pet */}
                                <div>
                                    <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                        Reason
                                    </p>
                                    <p className="text-sm font-medium text-[var(--dashboard-text)]">
                                        {item.reason}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center bg-[var(--dashboard-secondary)] rounded-lg px-3 py-2">

                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        Total Amount
                                    </p>

                                    <p className="text-lg font-bold text-[var(--dashboard-text)]">
                                        ₹{item.cost}
                                    </p>

                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => navigate("/appointments/update")}
                                        className="flex-1 h-9 rounded-md border border-[var(--border-color)] text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                                    >
                                        Edit
                                    </Button>

                                    <Button className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
                        <div className="text-sm text-[var(--dashboard-text-light)] hidden md:block">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                        </div>

                        <div className="flex items-center space-x-2 ms-auto md:ms-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="text-sm text-[var(--dashboard-text-light)]">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            </div>


        </div>
    );
};

export default Inventory;
