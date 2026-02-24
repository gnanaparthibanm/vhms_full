import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const startHour = 8;   // calendar starts at 8 AM
const endHour = 20;    // calendar ends at 8 PM

const Weekview = ({ appointments, selectedDate, setSelectedDate }) => {
    /* ---------------- TIME SLOTS ---------------- */
    const timeSlots = Array.from(
        { length: endHour - startHour },
        (_, i) => `${String(i + startHour).padStart(2, "0")}:00`
    );

    /* ---------------- CURRENT WEEK ---------------- */
    const weekStart = useMemo(() => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        return d;
    }, [selectedDate]);

    const weekDates = useMemo(
        () =>
            Array.from({ length: 7 }, (_, i) => {
                const d = new Date(weekStart);
                d.setDate(d.getDate() + i);
                return d;
            }),
        [weekStart]
    );

    /* ---------------- PARSE APPOINTMENTS ---------------- */
    const parsedAppointments = useMemo(
        () =>
            appointments.map((a) => {
                const date = new Date(a.appointmentDate);
                return {
                    ...a,
                    date,
                    day: date.getDay(),
                    hour: date.getHours(),
                };
            }),
        [appointments]
    );

    /* ---------------- CURRENT TIME RED LINE ---------------- */
    const now = new Date();
    const todayIndex = now.getDay();

    const minutesFromStart =
        (now.getHours() - startHour) * 60 + now.getMinutes();

    const totalMinutes = (endHour - startHour) * 60;

    const currentTimeTop =
        (minutesFromStart / totalMinutes) * 100;

    const showRedLine =
        weekDates[todayIndex]?.toDateString() === now.toDateString() &&
        now.getHours() >= startHour &&
        now.getHours() <= endHour;

    /* ---------------- RENDER ---------------- */
    return (
        <div className="flex flex-col w-full text-[var(--dashboard-text)]">
            {/* HEADER */}
            {/* TOP CONTROLS – WEEK VIEW */}
            <div className="lg:flex hidden items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-9 px-4 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        Today
                    </Button>

                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(
                                    new Date(selectedDate.setDate(selectedDate.getDate() - 7))
                                )
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(
                                    new Date(selectedDate.setDate(selectedDate.getDate() + 7))
                                )
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <span className="text-sm font-medium ml-2 text-[var(--dashboard-text)]">
                        {weekDates[0].toDateString()} – {weekDates[6].toDateString()}
                    </span>
                </div>

                <Button
                    size="sm"
                    className="h-9 bg-[var(--dashboard-primary)] text-white px-3 hover:bg-[var(--dashboard-primary-hover)]"
                >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate.toDateString()}
                </Button>
            </div>
            {/* Mobile TOP CONTROLS – WEEK VIEW */}
            <div className="lg:hidden flex flex-col gap-4  items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
                <div className="flex items-center space-x-2 justify-between w-full">
                    <Button
                        variant="outline"
                        className="h-9 px-4 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        Today
                    </Button>

                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(
                                    new Date(selectedDate.setDate(selectedDate.getDate() - 7))
                                )
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                            onClick={() =>
                                setSelectedDate(
                                    new Date(selectedDate.setDate(selectedDate.getDate() + 7))
                                )
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* <span className="text-sm font-medium ml-2 text-[var(--dashboard-text)]">
                        {weekDates[0].toDateString()} – {weekDates[6].toDateString()}
                    </span> */}
                </div>

                <Button
                    size="sm"
                    className="h-9 ms-auto bg-[var(--dashboard-primary)] text-white px-3 hover:bg-[var(--dashboard-primary-hover)]"
                >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate.toDateString()}
                </Button>
            </div>



            {/* CALENDAR GRID */}
            <div className="hidden md:flex flex-1 overflow-auto border border-[var(--border-color)] mt-4 rounded-md relative bg-[var(--card-bg)]">
                {/* 🔴 CURRENT TIME INDICATOR */}
                {/* {showRedLine && (
                    <div
                        className="absolute left-20 right-0 z-30 pointer-events-none"
                        style={{ top: `${currentTimeTop}%` }}
                    >
                        <div className="relative">
                            <div className="absolute left-0 right-0 border-t-2 border-red-500" />
                            <div className="absolute -left-2 top-[-4px] w-3 h-3 bg-red-500 rounded-full" />
                        </div>
                    </div>
                )} */}

                <table className="w-full table-fixed border-collapse overflow-x-auto">
                    <thead>
                        <tr className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                            <th className="w-20 border-r border-[var(--border-color)]" />
                            {days.map((day, i) => (
                                <th
                                    key={day}
                                    className="border-r border-[var(--border-color)] py-3 text-sm font-semibold text-[var(--dashboard-text)]"
                                >
                                    {day}
                                    <div className="text-xs text-[var(--dashboard-text-light)]">
                                        {weekDates[i].getDate()}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {timeSlots.map((time, rowIndex) => (
                            <tr key={time} className="h-20">
                                <td className="border-r border-b border-[var(--border-color)] text-xs text-[var(--dashboard-text-light)] text-center pt-2 font-medium">
                                    {time}
                                </td>

                                {days.map((_, colIndex) => {
                                    const slotHour = startHour + rowIndex;

                                    const events = parsedAppointments.filter(
                                        (a) =>
                                            a.day === colIndex &&
                                            a.hour === slotHour &&
                                            a.date >= weekStart &&
                                            a.date < new Date(weekStart.getTime() + 7 * 86400000)
                                    );

                                    return (
                                        <td
                                            key={`${colIndex}-${time}`}
                                            className="border-r border-b border-[var(--border-color)] relative hover:bg-[var(--dashboard-secondary)] transition-colors bg-[var(--card-bg)]"
                                        >
                                            {events.map((evt) => (
                                                <div
                                                    key={evt.id}
                                                    className="absolute inset-x-1 top-1 bottom-1 bg-[var(--dashboard-primary)]/10 border-l-2 border-[var(--dashboard-primary)] rounded-r-md p-2 shadow-sm cursor-pointer overflow-hidden"
                                                >
                                                    <p className="text-[10px] font-bold text-[var(--dashboard-primary)] uppercase truncate">
                                                        {evt.client.name}
                                                    </p>
                                                    <p className="text-xs font-semibold text-[var(--dashboard-text)] truncate opacity-90">
                                                        {evt.pet.name} — {evt.reason}
                                                    </p>
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            {/* MOBILE VIEW */}
            <div className="md:hidden mt-4 space-y-4">
                {days.map((day, dayIndex) => {
                    const dayEvents = parsedAppointments.filter(
                        (a) =>
                            a.day === dayIndex &&
                            a.date >= weekStart &&
                            a.date < new Date(weekStart.getTime() + 7 * 86400000)
                    );

                    return (
                        <div
                            key={day}
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-3 shadow-sm"
                        >
                            {/* Day Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-[var(--dashboard-text)]">
                                    {day}
                                </h3>
                                <span className="text-xs text-[var(--dashboard-text-light)]">
                                    {weekDates[dayIndex].getDate()}
                                </span>
                            </div>

                            {/* Appointments */}
                            {dayEvents.length === 0 ? (
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    No Appointments
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {dayEvents.map((evt) => (
                                        <div
                                            key={evt.id}
                                            className="p-3 rounded-md bg-[var(--dashboard-primary)]/10 border-l-4 border-[var(--dashboard-primary)]"
                                        >
                                            <p className="text-xs font-bold text-[var(--dashboard-primary)] uppercase">
                                                {evt.client.name}
                                            </p>
                                            <p className="text-sm font-medium text-[var(--dashboard-text)]">
                                                {evt.pet.name} — {evt.reason}
                                            </p>
                                            <p className="text-xs text-[var(--dashboard-text-light)] mt-1">
                                                {evt.hour}:00
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

export default Weekview;
