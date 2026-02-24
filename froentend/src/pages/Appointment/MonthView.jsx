import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const MonthView = ({ appointments, selectedDate, setSelectedDate }) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get first day of the month and number of days
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Generate array of days for the month
    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    const monthName = selectedDate.toLocaleString("default", { month: "long", year: "numeric" });

    // Filter appointments for this month
    const appointmentsThisMonth = appointments.filter((a) => {
        const apptDate = new Date(a.appointmentDate);
        return apptDate.getFullYear() === year && apptDate.getMonth() === month;
    });

    return (
        <div className="w-full mx-auto">
            {/* Header */}
            {/* TOP CONTROLS – MONTH VIEW */}
            <div className="hidden lg:flex items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                    {/* Today Button */}
                    <Button
                        variant="outline"
                        className="h-9 px-4 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        Today
                    </Button>

                    {/* Prev / Next Month Buttons */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(new Date(year, month - 1, 1))
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(new Date(year, month + 1, 1))
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Month Name */}
                    <span className="text-sm font-medium ml-2 text-[var(--dashboard-text)]">{monthName}</span>
                </div>

                {/* Calendar Button */}
                <Button
                    size="sm"
                    className="h-9 bg-[var(--dashboard-primary)] text-white px-3 hover:bg-[var(--dashboard-primary-hover)]"
                >
                    <CalendarIcon className="h-4 w-4 mr-2 text-white" />
                    {selectedDate.toLocaleDateString("default", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </Button>
            </div>
            {/* TOP CONTROLS – MONTH VIEW */}
            <div className="flex flex-col gap-4 lg:hidden items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 justify-between w-full">
                    {/* Today Button */}
                    <Button
                        variant="outline"
                        className="h-9 px-4 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        Today
                    </Button>

                    {/* Prev / Next Month Buttons */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(new Date(year, month - 1, 1))
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(new Date(year, month + 1, 1))
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="ms-auto">
                    {/* Month Name */}
                    {/* <span className="text-sm font-medium ml-2 text-[var(--dashboard-text)]">{monthName}</span> */}
                    {/* Calendar Button */}
                    <Button
                        size="sm"
                        className="h-9 bg-[var(--dashboard-primary)] text-white px-3 hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <CalendarIcon className="h-4 w-4 mr-2 text-white" />
                        {selectedDate.toLocaleDateString("default", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </Button>
                </div>
            </div>



            {/* Calendar Grid */}
            <div className="hidden md:block border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--card-bg)]">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="py-3 text-center text-sm font-bold text-[var(--dashboard-text-light)]"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-7">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b border-[var(--border-color)] min-h-[120px] p-2" />
                    ))}

                    {days.map((day) => {
                        const today = new Date();
                        const isToday =
                            today.getDate() === day &&
                            today.getMonth() === month &&
                            today.getFullYear() === year;

                        // Appointments on this day
                        const events = appointmentsThisMonth.filter(
                            (a) => new Date(a.appointmentDate).getDate() === day
                        );

                        return (
                            <div
                                key={day}
                                className={`min-h-[120px] p-2 bg-[var(--card-bg)] border-r border-b border-[var(--border-color)] relative transition-colors hover:bg-[var(--dashboard-secondary)] ${isToday ? "bg-[var(--dashboard-primary)]/5" : ""
                                    }`}
                            >
                                <span
                                    className={`block text-center mb-2 text-sm ${isToday ? "font-bold text-[var(--dashboard-primary)]" : "text-[var(--dashboard-text-light)]"
                                        }`}
                                >
                                    {day < 10 ? `0${day}` : day}
                                </span>

                                {/* Events */}
                                {events.map((e) => (
                                    <div
                                        key={e.id}
                                        className="mt-1 px-2 py-1 bg-[var(--dashboard-primary)]/10 border-l-4 border-[var(--dashboard-primary)] rounded text-xs font-medium text-[var(--dashboard-text)] truncate dark:text-[var(--dashboard-text)]"
                                        title={`${e.client.name} - ${e.pet.name} (${new Date(
                                            e.appointmentDate
                                        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`}
                                    >
                                        {e.client.name} - {e.pet.name}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden mt-4 space-y-3">
                {days.map((day) => {
                    const today = new Date();
                    const isToday =
                        today.getDate() === day &&
                        today.getMonth() === month &&
                        today.getFullYear() === year;

                    const events = appointmentsThisMonth.filter(
                        (a) => new Date(a.appointmentDate).getDate() === day
                    );

                    return (
                        <div
                            key={day}
                            className={`border border-[var(--border-color)] rounded-lg p-3 bg-[var(--card-bg)] shadow-sm ${isToday ? "bg-[var(--dashboard-primary)]/5" : ""
                                }`}
                        >
                            {/* Date Header */}
                            <div className="flex justify-between items-center mb-2">
                                <h3
                                    className={`text-sm font-semibold ${isToday
                                            ? "text-[var(--dashboard-primary)]"
                                            : "text-[var(--dashboard-text)]"
                                        }`}
                                >
                                    {day < 10 ? `0${day}` : day}
                                </h3>

                                {isToday && (
                                    <span className="text-xs bg-[var(--dashboard-primary)] text-white px-2 py-0.5 rounded-full">
                                        Today
                                    </span>
                                )}
                            </div>

                            {/* Events */}
                            {events.length === 0 ? (
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    No Appointments
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {events.map((e) => (
                                        <div
                                            key={e.id}
                                            className="p-2 bg-[var(--dashboard-primary)]/10 border-l-4 border-[var(--dashboard-primary)] rounded-md"
                                        >
                                            <p className="text-xs font-bold text-[var(--dashboard-text)]">
                                                {e.client.name}
                                            </p>
                                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                                {e.pet.name}
                                            </p>
                                            <p className="text-xs text-[var(--dashboard-text-light)] mt-1">
                                                {new Date(e.appointmentDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
