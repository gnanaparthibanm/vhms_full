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
import { useNavigate } from 'react-router-dom';

const AppointmentsTab = ({ data }) => {
    const navigate = useNavigate();
    // Real Data for Status Cards
    const statusData = [
        { label: 'Total', count: data?.Total || 0, icon: Calendar, colorTheme: 'primary', subtext: 'All time appointments' },
        { label: 'Completed', count: data?.Completed || 0, icon: CheckCircle, colorTheme: 'emerald', subtext: 'Successfully completed' },
        { label: 'Pending', count: data?.Pending || 0, icon: Clock, colorTheme: 'orange', subtext: 'Awaiting confirmation' },
        { label: 'Confirmed', count: data?.Confirmed || 0, icon: CalendarCheck, colorTheme: 'blue', subtext: 'Scheduled appointments' },
        { label: 'Cancelled', count: data?.Cancelled || 0, icon: XCircle, colorTheme: 'rose', subtext: 'Cancelled appointments' },
    ];

    // Real Data for Chart
    const chartData = [
        { name: 'Completed', value: data?.Completed || 0 },
        { name: 'Confirmed', value: data?.Confirmed || 0 },
        { name: 'Pending', value: data?.Pending || 0 },
        { name: 'Cancelled', value: data?.Cancelled || 0 }
    ];

    // Upcoming Appointments
    const recentAppointments = data?.recent || [];

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
                                            <Cell key={"cell-" + index} fill={
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

                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Today's Schedule</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">{recentAppointments.length} appointments available</p>
                    </div>
                    {recentAppointments.length > 0 ? (
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {recentAppointments.map(apt => (
                                <div key={apt.id} onClick={() => navigate("/appointments")} className="p-3 cursor-pointer border border-[var(--border-color)] rounded-lg flex justify-between items-center bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)] transition-colors">
                                    <div>
                                        <p className="font-medium text-sm text-[var(--dashboard-text)]">{apt.patient_name || apt.appointment_no}</p>
                                        <p className="text-xs text-[var(--dashboard-text-light)]">{new Date(apt.scheduled_at).toLocaleDateString()} at {apt.scheduled_time || 'N/A'}</p>
                                    </div>
                                    <span className={
                                        "text-xs font-bold uppercase px-2 py-1 rounded " +
                                        (apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                            apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700')
                                    }>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--dashboard-text-light)]">
                            <p className="text-center">No appointments scheduled</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Appointments section could be separate, but let's reuse recent */}
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                <div className="mb-4">
                    <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Recent Appointments Details</h3>
                </div>

                {recentAppointments.slice(0, 3).map((apt, index) => (
                    <div key={index} className="bg-[var(--dashboard-primary)]/5 border border-[var(--dashboard-primary)]/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                        <div>
                            <h4 className="font-bold text-[var(--dashboard-text)] text-lg">
                                {apt.patient_name || apt.appointment_no} - <span className="font-normal">{apt.reason || apt.appointment_type}</span>
                            </h4>
                            <p className="text-sm text-[var(--dashboard-text-light)] mt-1">
                                {new Date(apt.scheduled_at).toLocaleDateString()} at {apt.scheduled_time}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)] text-xs font-bold rounded-md uppercase tracking-wide">
                                {apt.status}
                            </span>
                            <button onClick={() => navigate("/appointments")} className="px-4 py-2 bg-[var(--card-bg)] text-[var(--dashboard-text)] text-xs font-bold rounded-lg shadow-sm hover:bg-[var(--dashboard-secondary)] transition-colors border border-[var(--border-color)]">
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    );
};

export default AppointmentsTab;
