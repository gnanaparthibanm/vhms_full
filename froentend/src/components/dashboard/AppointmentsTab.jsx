import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, CalendarCheck, MoreVertical, Plus } from 'lucide-react';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import StatCard from '../StatCard';

const AppointmentsTab = () => {
    // Mock Data for Status Cards
    const statusData = [
        { label: 'Total', count: 9, icon: Calendar, colorTheme: 'primary', subtext: 'All time appointments' },
        { label: 'Completed', count: 0, icon: CheckCircle, colorTheme: 'emerald', subtext: 'Successfully completed' },
        { label: 'Pending', count: 3, icon: Clock, colorTheme: 'orange', subtext: 'Awaiting confirmation' },
        { label: 'Confirmed', count: 6, icon: CalendarCheck, colorTheme: 'blue', subtext: 'Scheduled appointments' },
        { label: 'Cancelled', count: 0, icon: XCircle, colorTheme: 'rose', subtext: 'Cancelled appointments' },
    ];

    // Mock Data for Chart
    const chartData = [
        { name: 'Completed', value: 0 },
        { name: 'Confirmed', value: 6 },
        { name: 'Pending', value: 3 },
        { name: 'Cancelled', value: 0 },
        { name: 'No Show', value: 0 },
    ];

    // Upcoming Appointment Mock
    const upcomingAppointment = {
        id: 1,
        patient: 'Prasanth s',
        reason: 'vaccination',
        date: 'Feb 11, 2026',
        time: '03:00 PM',
        status: 'Confirmed'
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statusData.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.label}
                        value={item.count}
                        subtext={item.subtext}
                        icon={item.icon}
                        colorTheme={item.colorTheme}
                    />
                ))}
            </div>

            {/* Middle Section: Chart and Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Appointment Status Distribution Chart */}
                <div className="lg:col-span-2 bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                    <div className="mb-6">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Appointment Status Distribution</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">For the selected period</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--dashboard-text)', fontSize: 13 }}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--dashboard-secondary)', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    labelStyle={{ color: 'var(--dashboard-text)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {
                                        chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'Confirmed' ? '#0ea5e9' :
                                                    entry.name === 'Pending' ? '#10b981' :
                                                        '#e5e7eb'
                                            } />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Today's Schedule</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">0 appointments scheduled for today</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-[var(--dashboard-text-light)]">
                        <p className="text-center">No appointments scheduled for today</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                <div className="mb-4">
                    <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Upcoming Appointments</h3>
                    <p className="text-[var(--dashboard-text-light)] text-sm">Next 1 appointments</p>
                </div>

                <div className="bg-[var(--dashboard-primary)]/5 border border-[var(--dashboard-primary)]/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-[var(--dashboard-text)] text-lg">
                            {upcomingAppointment.patient} - <span className="font-normal">{upcomingAppointment.reason}</span>
                        </h4>
                        <p className="text-sm text-[var(--dashboard-text-light)] mt-1">
                            {upcomingAppointment.date} at {upcomingAppointment.time}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)] text-xs font-bold rounded-md uppercase tracking-wide">
                            {upcomingAppointment.status}
                        </span>
                        <button className="px-4 py-2 bg-[var(--card-bg)] text-[var(--dashboard-text)] text-xs font-bold rounded-lg shadow-sm hover:bg-[var(--dashboard-secondary)] transition-colors border border-[var(--border-color)]">
                            View
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AppointmentsTab;
