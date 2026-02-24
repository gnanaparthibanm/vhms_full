import React from 'react';
import { IndianRupee, ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';
import StatCard from '../StatCard'; // Reusing StatCard component
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const FinanceTab = () => {
    // Mock Data for Charts
    const revenueData = [
        { name: 'Jan 23', value: 12000, expense: 8000 },
        { name: 'Feb 23', value: 19000, expense: 12000 },
        { name: 'Mar 23', value: 3000, expense: 4000 },
        { name: 'Apr 23', value: 5000, expense: 3000 },
        { name: 'May 23', value: 2000, expense: 2000 },
        { name: 'Jun 23', value: 3000, expense: 2500 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-[var(--dashboard-text)]">Financial Overview</h2>
                    <p className="text-sm text-[var(--dashboard-text-light)]">Track your revenue and expenses</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-[var(--dashboard-text)] bg-[var(--dashboard-secondary)] rounded-lg hover:bg-opacity-80 transition-colors">
                        Generate Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--dashboard-primary)] rounded-lg hover:bg-opacity-90 transition-colors shadow-lg shadow-[var(--dashboard-primary)]/20">
                        <Plus className="w-4 h-4" />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="₹ 45,231" subtext="+20.1% from last month" icon={IndianRupee} colorTheme="emerald" />
                <StatCard title="Expenses" value="₹ 12,234" subtext="+4.5% from last month" icon={TrendingUp} colorTheme="rose" />
                <StatCard title="Net Profit" value="₹ 32,997" subtext="+18.2% from last month" icon={CreditCard} colorTheme="blue" />
                <StatCard title="Active Subscriptions" value="573" subtext="+201 since last week" icon={ShoppingBag} colorTheme="purple" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses Chart */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                    <div className="mb-6">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Revenue vs Expenses</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">Monthly comparison</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--dashboard-secondary)', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    labelStyle={{ color: 'var(--dashboard-text)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="value" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Profit Trend Chart */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                    <div className="mb-6">
                        <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Profit Trend</h3>
                        <p className="text-[var(--dashboard-text-light)] text-sm">Growth over time</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={revenueData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    labelStyle={{ color: 'var(--dashboard-text)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for 'Plus' icon import if needed, or assume it's imported at top
import { Plus } from 'lucide-react';

export default FinanceTab;
