import { Button } from '@/components/ui/button'
import { Calendar1, ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const START_HOUR = 8
const END_HOUR = 19
const HOUR_HEIGHT = 60

const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

const getTopFromTime = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return ((hours - START_HOUR) * HOUR_HEIGHT) + (minutes / 60) * HOUR_HEIGHT
}

function DayView({ appointments, selectedDate, setSelectedDate }) {

    const dayAppointments = appointments.filter(a =>
        isSameDay(new Date(a.appointmentDate), selectedDate)
    )

    return (
        <div className="mt-2">
            <div className="flex flex-col h-[700px] space-y-4">

                {/* Top Controls */}
                <div className="hidden lg:flex items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
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
                                    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                onClick={() =>
                                    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <span className="text-sm font-medium ml-2 text-[var(--dashboard-text)]">
                            {selectedDate.toDateString()}
                        </span>
                    </div>

                    <Button size="sm" className="h-9 bg-[var(--dashboard-primary)] text-white px-2 hover:bg-[var(--dashboard-primary-hover)]">
                        <Calendar1 className="h-4 w-4 mr-2" />
                        {selectedDate.toLocaleDateString()}
                    </Button>
                </div>
                {/* Mobile Top Controls */}
                <div className="flex flex-col gap-4 lg:hidden items-center justify-between bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
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
                                    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 px-2 border border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                onClick={() =>
                                    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className='flex justify-between  items-center w-full'>
                        <Button size="sm" className="h-9 bg-[var(--dashboard-primary)] text-white px-2 hover:bg-[var(--dashboard-primary-hover)]">
                            <Calendar1 className="h-4 w-4 mr-2" />
                            {selectedDate.toLocaleDateString()}
                        </Button>
                    </div>
                </div>

                {/* Calendar */}
                <div className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm lg:overflow-auto">
                    <table className="w-full table-fixed border-collapse">
                        <thead>
                            <tr className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)]">
                                <th className="w-20 border-r border-[var(--border-color)]" />
                                <th className="border-r border-[var(--border-color)] py-3 text-sm font-semibold text-[var(--dashboard-text)]">
                                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}
                                    <div className="text-xs text-[var(--dashboard-text-light)]">
                                        {selectedDate.getDate()}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => {
                                const hour = START_HOUR + i;
                                const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

                                const events = dayAppointments.filter(appt => {
                                    const apptDate = new Date(appt.appointmentDate);
                                    return apptDate.getHours() === hour;
                                });

                                return (
                                    <tr key={i} className="h-20">
                                        <td className="border-r border-b border-[var(--border-color)] text-xs text-[var(--dashboard-text-light)] text-center pt-2 font-medium align-top">
                                            {timeLabel}
                                        </td>
                                        <td className="border-r border-b border-[var(--border-color)] relative hover:bg-[var(--dashboard-secondary)] transition-colors bg-[var(--card-bg)] text-left">
                                            {events.map((appt) => (
                                                <div
                                                    key={appt.id}
                                                    className="absolute inset-x-2 top-1 bottom-1 bg-[var(--dashboard-primary)]/10 border-l-4 border-[var(--dashboard-primary)] rounded-r-md p-2 shadow-sm cursor-pointer overflow-hidden"
                                                >
                                                    <div className="font-semibold text-[var(--dashboard-primary)] text-sm truncate">
                                                        {appt.client.name}
                                                    </div>
                                                    <div className="text-xs text-[var(--dashboard-text-light)] truncate">
                                                        {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appt.reason}
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DayView
