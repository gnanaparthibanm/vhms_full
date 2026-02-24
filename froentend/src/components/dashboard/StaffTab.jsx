import React, { useState } from 'react';
import { User, IndianRupee, Calendar } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import StatCard from '../StatCard';

const StaffTab = () => {
    // Mock Data for Top Cards
    const summaryCards = [
        {
            title: 'Active Staff',
            value: '2',
            subtext: 'of 2 total staff',
            icon: User,
            colorTheme: 'blue'
        },
        {
            title: 'Top Staff by Appointments',
            value: 'Admin',
            subtext: '6 appointments',
            icon: Calendar,
            colorTheme: 'emerald'
        },
        {
            title: 'Top Staff by Revenue',
            value: 'Admin',
            subtext: '₹ 42,385',
            icon: IndianRupee,
            colorTheme: 'purple'
        }
    ];

    // Mock Data for Performance Chart
    const performanceData = [
        { name: 'Test Admin', appointments: 6, revenue: 42385 },
        { name: 'Test Staff', appointments: 2, revenue: 1800 }
    ];

    // Mock Data for Details Table
    const staffDetails = [
        { id: 1, name: 'Test Admin', role: 'Staff', appointments: 6, revenue: '₹42385.00' },
        { id: 2, name: 'Test Staff', role: 'Staff', appointments: 2, revenue: '₹1800.00' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaryCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtext={card.subtext}
                        icon={card.icon}
                        colorTheme={card.colorTheme}
                    />
                ))}
            </div>

            {/* Staff Performance Chart */}
            <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                <div className="mb-6">
                    <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Staff Performance</h3>
                    <p className="text-[var(--dashboard-text-light)] text-sm">Top staff by appointments and revenue</p>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={performanceData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={{ stroke: '#4f46e5' }}
                                tickLine={false}
                                tick={{ fill: '#4f46e5', fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={{ stroke: '#10b981' }}
                                tickLine={false}
                                tick={{ fill: '#10b981', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                labelStyle={{ color: 'var(--dashboard-text)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="appointments" name="Appointments" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={60} />
                            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Staff Details Table */}
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                <div className="p-6 pb-4">
                    <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Staff Details</h3>
                    <p className="text-[var(--dashboard-text-light)] text-sm">Performance metrics for all staff</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Name</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Role</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Appointments</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffDetails.map((staff) => (
                                <tr key={staff.id} className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors">
                                    <td className="p-6 font-medium text-[var(--dashboard-text)]">{staff.name}</td>
                                    <td className="p-6 text-sm text-[var(--dashboard-text-light)]">{staff.role}</td>
                                    <td className="p-6 text-sm text-[var(--dashboard-text)]">{staff.appointments}</td>
                                    <td className="p-6 text-sm text-[var(--dashboard-text)]">{staff.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default StaffTab;
