import React, { useState } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, AlertCircle, Clock, IndianRupee, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../StatCard';

const InventoryTab = () => {
    // Mock Data for Status Cards
    const statusData = [
        { label: 'Total Items', count: 28, icon: Package, colorTheme: 'primary', subtext: 'Total items in stock' },
        { label: 'Low Stock Items', count: 0, icon: AlertCircle, colorTheme: 'rose', subtext: 'Items below reorder level' },
        { label: 'Expiring Soon', count: 0, icon: Clock, colorTheme: 'orange', subtext: 'Items expiring < 30 days' },
        { label: 'Inventory Value', count: '₹ 251,850', icon: IndianRupee, colorTheme: 'purple', subtext: 'Total value of assets' },
    ];

    // Mock Data for Distribution Pie Chart
    const distributionData = [
        { name: 'Service', value: 71, color: '#4f46e5' }, // Indigo
        { name: 'Medication', value: 21, color: '#0ea5e9' }, // Sky Blue
        { name: 'Product', value: 7, color: '#10b981' }, // Emerald
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Low Stock Items Section */}
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                <div className="p-6 pb-4">
                    <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Low Stock Items</h3>
                    <p className="text-[var(--dashboard-text-light)] text-sm">Items below reorder level</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Item Name</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Current Stock</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Reorder Level</th>
                                <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-[var(--dashboard-text-light)]">
                                    No items below reorder level
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Middle Section: Distribution Chart and Expiring Items */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

                {/* Inventory Distribution Chart */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                    <div className="mb-6">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Inventory Distribution</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">By item type</p>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-[var(--dashboard-text)]">100%</span>
                            <span className="text-xs text-[var(--dashboard-text-light)]">Total Inventory</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--dashboard-text)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value, entry) => (
                                        <span className="text-sm font-medium text-[var(--dashboard-text)] ml-2">{value.toLowerCase()}: {entry.payload.value}%</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expiring Items Section */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
                    <div className="p-6 pb-4">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Expiring Items</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">Items expiring within 30 days</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                    <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Item Name</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Expiry Date</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Days Until Expiry</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--dashboard-text)]">Current Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[var(--dashboard-text-light)]">
                                        No items expiring soon
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default InventoryTab;
