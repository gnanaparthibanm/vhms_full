import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, X } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notificationsData = [
    {
        id: 1,
        type: "APPOINTMENT",
        content: "New appointment created: Fusionedge Test Hospital - Main Branch",
        date: "Feb 10, 2026 18:42",
        status: "Read",
    },
    {
        id: 2,
        type: "APPOINTMENT",
        content: "New appointment created: Fusionedge Test Hospital - Main Branch",
        date: "Feb 10, 2026 12:53",
        status: "Read",
    },
    {
        id: 3,
        type: "USER",
        content: "New user created: Test Staff",
        date: "Sep 29, 2025 03:45",
        status: "Read",
    },
    {
        id: 4,
        type: "APPOINTMENT",
        content: "Appointment rescheduled: Fusionedge Test Hospital - City Branch",
        date: "Feb 11, 2026 09:20",
        status: "Unread",
    },
    {
        id: 5,
        type: "USER",
        content: "New user registered: Dr. Kumar",
        date: "Feb 09, 2026 16:10",
        status: "Read",
    },
    {
        id: 6,
        type: "APPOINTMENT",
        content: "Appointment cancelled: Fusionedge Test Hospital - Main Branch",
        date: "Feb 08, 2026 14:05",
        status: "Unread",
    },
    {
        id: 7,
        type: "SYSTEM",
        content: "System maintenance scheduled for Feb 15, 2026",
        date: "Feb 07, 2026 10:30",
        status: "Read",
    },
    {
        id: 8,
        type: "USER",
        content: "User profile updated: Nurse Priya",
        date: "Feb 06, 2026 08:55",
        status: "Unread",
    },
    {
        id: 9,
        type: "APPOINTMENT",
        content: "New appointment created: Fusionedge Test Hospital - North Wing",
        date: "Feb 05, 2026 11:40",
        status: "Read",
    },
    {
        id: 10,
        type: "SYSTEM",
        content: "Password changed successfully for Admin",
        date: "Feb 04, 2026 17:25",
        status: "Read",
    },
];



const statusClass = (status) => {
    switch (status) {
        case "Read":
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        case "Unread":
            return "bg-pink-500/20 text-pink-600";
        default:
            return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
    }
};

const ITEMS_PER_PAGE = 10;
const Notification = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("Client");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const totalItems = notificationsData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const [openModal, setOpenModal] = useState(false)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentAppointments = notificationsData.slice(startIndex, endIndex);

    return (
        <div className="container mx-auto lg:p-4">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
                            Notifications
                        </h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">
                            View & manage your notifications
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]">
                            Refresh
                        </Button>
                        <Button className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]">
                            Mark all as Read
                        </Button>
                    </div>
                </div>


                <div className="hidden md:block">
                    <div className="rounded-xl border border-[var(--border-color)] overflow-x-auto bg-[var(--card-bg)] shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                <tr>
                                    {[
                                        "Type",
                                        "Content",
                                        "Date",
                                        "Status",
                                        "View",
                                        "Mark"
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
                                        {/* TYPE */}
                                        <td className="p-4">
                                            <span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold border border-[var(--border-color)] bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)]">
                                                {item.type}
                                            </span>
                                        </td>

                                        {/* CONTENT */}
                                        <td className="p-4 text-[var(--dashboard-text)]">
                                            {item.content}
                                        </td>

                                        {/* DATE */}
                                        <td className="p-4 text-[var(--dashboard-text)]">
                                            {item.date}
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold 
                                                ${statusClass(
                                                item.status
                                            )}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* VIEW */}
                                        <td className="p-4">
                                            <Button onClick={() => navigate("/notifications/view")} className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]">
                                                View
                                            </Button>
                                        </td>

                                        {/* MARK */}
                                        <td className="p-4">
                                            <Button className="h-8 rounded-md px-3 text-xs text-white hover:bg-[var(--dashboard-primary-hover)]  bg-[var(--dashboard-primary)]">
                                                Mark
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>

                {/* ================= PREMIUM MOBILE CARD VIEW ================= */}
                <div className="md:hidden space-y-4 mt-4">

                    {currentAppointments.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm p-4 space-y-4 transition hover:shadow-md"
                        >

                            {/* Header */}
                            <div className="flex justify-between items-start">

                                <span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold border border-[var(--border-color)] bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)]">
                                    {item.type}
                                </span>

                                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div>
                                <p className="text-sm text-[var(--dashboard-text)]">
                                    {item.content}
                                </p>
                            </div>

                            {/* Date */}
                            <div className="flex justify-between items-center text-xs text-[var(--dashboard-text-light)]">
                                <span>Date</span>
                                <span>{item.date}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => navigate("/notifications/view")}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-[var(--border-color)]"
                                >
                                    View
                                </Button>

                                <Button
                                    size="sm"
                                    className="flex-1 bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                                >
                                    Mark
                                </Button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 flex-wrap lg:pt-4">
                    <div className="text-sm text-[var(--dashboard-text-light)] md:block hidden">
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

            </div>
        </div>
    );
};

export default Notification;
