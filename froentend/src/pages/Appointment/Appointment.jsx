import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, X } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import DayView from "./DayView";
import Weekview from "./Weekview";
import MonthView from "./MonthView";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.min.css";
import DatePicker from "react-datepicker";
import { appointmentService } from "../../services/appointmentService";

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
const Appointment = () => {
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("List");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [branchOpen, setBranchOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [openPicker, setOpenPicker] = useState(null); // "from" | "to" | null
    const [searchQuery, setSearchQuery] = useState("");

    // API Integration State
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const branches = ["All Branches", "Chennai", "Coimbatore", "Madurai"];
    const statuses = ["All Statuses", "Confirmed", "Pending", "Cancelled", "Completed", "No Show"];

    // Fetch appointments from backend
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await appointmentService.getAllAppointments();
            // Backend returns paginated response: { total, currentPage, totalPages, data }
            const appointmentsData = response.data?.data || response.data || [];
            setAppointments(appointmentsData);
            setFilteredAppointments(appointmentsData);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Failed to load appointments');
            setAppointments([]);
            setFilteredAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        try {
            await appointmentService.deleteAppointment(id);
            // Refresh the list after deletion
            fetchAppointments();
        } catch (err) {
            console.error('Error deleting appointment:', err);
            alert('Failed to delete appointment');
        }
    };

    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);
    return (
        <div className="container mx-auto lg:p-4">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
                            Appointments
                        </h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">
                            Schedule and manage appointments with multiple calendar views
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            className="h-9 w-full sm:w-[300px] rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
                            placeholder="Search by client, pet, or reason..."
                            value={searchQuery}
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
                                setSearchQuery(e.target.value);

                                if (!query) {
                                    setFilteredAppointments(appointments);
                                } else {
                                    const filtered = appointments.filter(apt =>
                                        apt.client?.first_name?.toLowerCase().includes(query) ||
                                        apt.client?.last_name?.toLowerCase().includes(query) ||
                                        apt.pet?.name?.toLowerCase().includes(query) ||
                                        apt.reason?.toLowerCase().includes(query) ||
                                        apt.client?.phone?.includes(query) ||
                                        apt.appointment_no?.toLowerCase().includes(query)
                                    );
                                    setFilteredAppointments(filtered);
                                }
                                setCurrentPage(1);
                            }}
                        />
                        {/* 
                        <Button onClick={() => setOpenModal(true)} className="h-9 rounded-md border border-[var(--border-color)] px-4 text-sm bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] hover:text-white">
                            Filters
                        </Button>*/}
                        <Button onClick={() => navigate("/appointments/create")} className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]">
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
                                            setFromDate(null);
                                            setToDate(null);
                                            setSearchQuery("");
                                            setFilteredAppointments(appointments);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2 text-sm font-medium bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] border-[var(--border-color)] border rounded-md shadow-sm transition-colors"
                                    >
                                        Reset
                                    </button>

                                    {/* Apply Filters */}
                                    <button
                                        onClick={() => {
                                            let filtered = [...appointments];

                                            // Filter by status
                                            if (selectedStatus !== "All Statuses") {
                                                filtered = filtered.filter(
                                                    (item) => item.status === selectedStatus
                                                );
                                            }

                                            // Filter by date range
                                            if (fromDate || toDate) {
                                                filtered = filtered.filter((item) => {
                                                    const appointmentDate = new Date(item.scheduled_at);
                                                    if (fromDate && appointmentDate < fromDate) return false;
                                                    if (toDate && appointmentDate > toDate) return false;
                                                    return true;
                                                });
                                            }

                                            // Apply search query if exists
                                            if (searchQuery) {
                                                const query = searchQuery.toLowerCase();
                                                filtered = filtered.filter(apt =>
                                                    apt.client?.first_name?.toLowerCase().includes(query) ||
                                                    apt.client?.last_name?.toLowerCase().includes(query) ||
                                                    apt.pet?.name?.toLowerCase().includes(query) ||
                                                    apt.reason?.toLowerCase().includes(query) ||
                                                    apt.client?.phone?.includes(query) ||
                                                    apt.appointment_no?.toLowerCase().includes(query)
                                                );
                                            }

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

                {/* Tabs */}
                {/* <div className="inline-flex h-9 w-full md:w-fit items-center rounded-lg bg-[var(--dashboard-secondary)] p-1 border border-[var(--border-color)]">
                    {["List"].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 w-full text-sm rounded-md transition-all shadow-none ${activeTab === tab
                                ? "bg-[var(--dashboard-primary)] text-white shadow"
                                : "text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--card-bg)]/50"
                                }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div> */}


                {/* Table */}
                    <>
                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center space-y-3">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                                    <p className="text-sm text-[var(--dashboard-text-light)]">Loading appointments...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
                                <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load appointments</p>
                                <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                                <Button
                                    onClick={fetchAppointments}
                                    className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && filteredAppointments.length === 0 && (
                            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
                                <p className="text-[var(--dashboard-text)] font-medium mb-2">No appointments found</p>
                                <p className="text-sm text-[var(--dashboard-text-light)] mb-4">
                                    {searchQuery || selectedStatus !== "All Statuses"
                                        ? "Try adjusting your filters or search query"
                                        : "Get started by creating your first appointment"}
                                </p>
                                <Button
                                    onClick={() => navigate("/appointments/create")}
                                    className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Create Appointment
                                </Button>
                            </div>
                        )}

                        {/* Desktop Table View */}
                        {!loading && !error && filteredAppointments.length > 0 && (
                            <>
                                <div className="hidden lg:block  ">
                                    <div className="rounded-xl border border-[var(--border-color)] overflow-x-auto bg-[var(--card-bg)] shadow-sm">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                                <tr>
                                                    {[
                                                        "Appointment Date",
                                                        "Status",
                                                        "Reason",
                                                        "Client",
                                                        "Pet",
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
                                                        <td className="p-4 text-[var(--dashboard-text)]">
                                                            {new Date(item.scheduled_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: '2-digit',
                                                                year: 'numeric'
                                                            })}, {item.scheduled_time}
                                                        </td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                                                    item.status
                                                                )}`}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-[var(--dashboard-text)]">{item.reason || 'No reason provided'}</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-[var(--dashboard-text)]">
                                                                    {item.client?.first_name} {item.client?.last_name}
                                                                </span>
                                                                <span className="text-xs text-[var(--dashboard-text-light)]">
                                                                    {item.client?.phone || item.client?.client_code}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-[var(--dashboard-text)]">
                                                                    {item.pet?.name || 'N/A'}
                                                                </span>
                                                                <span className="text-xs text-[var(--dashboard-text-light)]">
                                                                    {item.pet?.pet_code || ''} {item.pet?.species ? `– ${item.pet.species}` : ''}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button onClick={() => navigate(`/appointments/update/${item.id}`,{state : { appoint : item}})} className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDeleteAppointment(item.id)}
                                                                    className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
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
                                                        {new Date(item.scheduled_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: '2-digit',
                                                            year: 'numeric'
                                                        })}, {item.scheduled_time}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>

                                            {/* Reason */}
                                            <div>
                                                <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                                    Reason
                                                </p>
                                                <p className="text-sm text-[var(--dashboard-text)]">
                                                    {item.reason || 'No reason provided'}
                                                </p>
                                            </div>

                                            {/* Client */}
                                            <div>
                                                <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                                    Client
                                                </p>
                                                <p className="text-sm font-medium text-[var(--dashboard-text)]">
                                                    {item.client?.first_name} {item.client?.last_name}
                                                </p>
                                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                                    {item.client?.phone || item.client?.client_code}
                                                </p>
                                            </div>

                                            {/* Pet */}
                                            <div>
                                                <p className="text-xs text-[var(--dashboard-text-light)] uppercase">
                                                    Pet
                                                </p>
                                                <p className="text-sm font-medium text-[var(--dashboard-text)]">
                                                    {item.pet?.name || 'N/A'}
                                                </p>
                                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                                    {item.pet?.pet_code || ''} {item.pet?.species ? `– ${item.pet.species}` : ''}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => navigate(`/appointments/update/${item.id}`,{state : { appoint : item}})}
                                                    className="flex-1 h-9 rounded-md border border-[var(--border-color)] text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    onClick={() => handleDeleteAppointment(item.id)}
                                                    className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                >
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
                        )}
                    </>
                {/* {activeTab === "Day" && <DayView
                    appointments={filteredAppointments}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />}
                {activeTab === "Week" && <Weekview
                    appointments={filteredAppointments}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />}
                {activeTab === "Month" && <MonthView
                    appointments={filteredAppointments}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />} */}
            </div>


        </div>
    );
};

export default Appointment;
