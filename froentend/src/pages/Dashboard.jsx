import React, { useState } from 'react';
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    IndianRupee,
    Plus,
    RotateCw,
    X,
    LayoutDashboard,
    Stethoscope,
    BriefcaseMedical,
    Wallet,
    Package,
    UserCog,
    AlertCircle,
    FileText,
    PawPrint
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import StatCard from '../components/StatCard';
import AppointmentsTab from '../components/dashboard/AppointmentsTab';
import FinanceTab from '../components/dashboard/FinanceTab';
import InventoryTab from '../components/dashboard/InventoryTab';
import StaffTab from '../components/dashboard/StaffTab';

// Data for the Pie Chart
const data = [
    { name: 'Dog', value: 63, color: '#4f46e5' }, // Blue
    { name: 'Cat', value: 25, color: '#0ea5e9' }, // Light Blue
    { name: 'Rabbit', value: 13, color: '#10b981' }, // Green
];

// Data for Revenue Trend
const revenueData = [
    { name: 'Sep 9, 2025', value: 1000 },
    { name: 'Sep 15, 2025', value: 1200 },
    { name: 'Sep 22, 2025', value: 1500 },
    { name: 'Sep 29, 2025', value: 14500 },
    { name: 'Oct 6, 2025', value: 2000 },
    { name: 'Oct 13, 2025', value: 6800 },
    { name: 'Oct 20, 2025', value: 1500 },
    { name: 'Oct 27, 2025', value: 2000 },
    { name: 'Nov 3, 2025', value: 1800 },
    { name: 'Nov 10, 2025', value: 5800 },
    { name: 'Nov 17, 2025', value: 2000 },
    { name: 'Nov 24, 2025', value: 4000 },
    { name: 'Dec 1, 2025', value: 3000 },
    { name: 'Dec 8, 2025', value: 13000 },
    { name: 'Dec 15, 2025', value: 7000 },
    { name: 'Jan 24, 2026', value: 2000 },
];

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981'];

// StatCard removed (imported). FinanceCard removed (unused).

const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative cursor-pointer
      ${active
                ? 'bg-[var(--dashboard-secondary)] text-[var(--dashboard-primary)] rounded-xl shadow-sm z-10'
                : 'text-white/70 hover:text-white hover:bg-white/10 hover:rounded-xl'
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [dateRange, setDateRange] = useState("today");
    const [branch, setBranch] = useState("all");

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">Dashboard</h1>
                <div className="flex md:flex-row flex-col gap-3 w-full md:w-fit">
                    <button className="flex w-full md:w-fit items-center gap-2 px-4 py-2 text-white bg-[var(--dashboard-primary)] border border-[var(--dashboard-primary)] rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-[var(--dashboard-primary)]/20">
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">New Appointment</span>
                    </button>
                    <button className="flex w-full md:w-fit items-center gap-2 px-4 py-2 text-[var(--dashboard-text-light)] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--dashboard-secondary)] transition-colors">
                        <PawPrint className="w-4 h-4" />
                        <span className="font-medium">New Patient</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div data-aos="fade-down" className="bg-[var(--card-bg)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">

                {/* Filters Group */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full xl:w-auto md:ms-auto lg:ms-0">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="md:w-full lg:w-fit sm:w-[180px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] h-10">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                            <SelectItem value="today" className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)] cursor-pointer">Today</SelectItem>
                            <SelectItem value="yesterday" className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)] cursor-pointer">Yesterday</SelectItem>
                            <SelectItem value="last7days" className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)] cursor-pointer">Last 7 Days</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="md:w-full lg:w-fit sm:w-[180px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] h-10">
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                            <SelectItem value="all" className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)] cursor-pointer">All Branches</SelectItem>
                            <SelectItem value="main" className="text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)] cursor-pointer">Main Clinic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions Group */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full xl:w-auto border-t xl:border-none border-[var(--border-color)] pt-4 xl:pt-0">
                    <span className="text-xs sm:text-sm text-[var(--dashboard-text-light)] hidden sm:inline mr-auto sm:mr-0">Data showing Today for all branches</span>

                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <button className="flex items-center gap-2 px-3 py-2 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] transition-colors text-sm">
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--dashboard-primary)] text-white rounded-lg hover:opacity-90 transition-colors shadow-sm shadow-[var(--dashboard-primary)]/20 h-10">
                            <RotateCw className="w-4 h-4" />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div data-aos="fade-down" data-aos-delay="100" className="bg-[var(--dashboard-primary)] p-1 rounded-xl flex items-center justify-between gap-1 overflow-x-auto shadow-md shadow-[var(--dashboard-primary)]/10 md:w-full w-screen">
                <TabButton active={activeTab === 'Overview'} icon={LayoutDashboard} label="Overview" onClick={() => setActiveTab('Overview')} />
                <TabButton active={activeTab === 'Appointments'} icon={Calendar} label="Appointments" onClick={() => setActiveTab('Appointments')} />
                <TabButton active={activeTab === 'Finance'} icon={Wallet} label="Finance" onClick={() => setActiveTab('Finance')} />
                <TabButton active={activeTab === 'Inventory'} icon={Package} label="Inventory" onClick={() => setActiveTab('Inventory')} />
                <TabButton active={activeTab === 'Staff'} icon={UserCog} label="Staff" onClick={() => setActiveTab('Staff')} />
            </div>

            {/* Main Content Area */}
            {activeTab === 'Overview' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div data-aos="zoom-in" data-aos-delay="100">
                            <StatCard title="Today's Appointments" value="0" subtext="0 confirmed, 0 pending" icon={Calendar} colorTheme="primary" />
                        </div>
                        <div data-aos="zoom-in" data-aos-delay="200">
                            <StatCard title="Active Patients" value="8" subtext="0 new this period" icon={PawPrint} colorTheme="emerald" />
                        </div>
                        <div data-aos="zoom-in" data-aos-delay="300">
                            <StatCard title="Period Revenue" value="₹0.00" subtext="today" icon={IndianRupee} colorTheme="blue" />
                        </div>
                        <div data-aos="zoom-in" data-aos-delay="400">
                            <StatCard title="Active Staff" value="2" subtext="of 2 total staff" icon={UserCog} colorTheme="primary" />
                        </div>
                    </div>

                    {/* Revenue Trend Chart */}
                    <div data-aos="fade-up" data-aos-delay="200" className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                        <div className="mb-6">
                            <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Revenue Trend</h3>
                            <p className="text-[var(--dashboard-text-light)] text-sm">Revenue for the selected period</p>
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
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                        tickMargin={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--dashboard-text-light)', fontSize: 12 }}
                                        tickFormatter={(value) => `${value.toFixed(2)}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                        labelStyle={{ color: 'var(--dashboard-text)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Appointments List */}
                        <div data-aos="fade-right" data-aos-delay="300" className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col h-[400px]">
                            <div className="mb-6">
                                <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Today's Appointments</h3>
                                <p className="text-[var(--dashboard-text-light)] text-sm">0 scheduled for today</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-[var(--dashboard-text-light)]">
                                <Calendar className="w-16 h-16 mb-4 opacity-20" />
                                <p>No appointments scheduled for today</p>
                            </div>
                        </div>

                        {/* Patient Distribution Chart */}
                        <div data-aos="fade-left" data-aos-delay="400" className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] h-[400px]">
                            <div className="mb-2">
                                <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Patient Distribution</h3>
                                <p className="text-[var(--dashboard-text-light)] text-sm">By species</p>
                            </div>
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            verticalAlign="middle"
                                            align="right"
                                            layout="vertical"
                                            iconType="circle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    {/* Could put total here */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Financial Summary */}
                        <div data-aos="fade-up" data-aos-delay="500" className="lg:col-span-2 bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                            <div className="mb-6">
                                <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Financial Summary</h3>
                                <p className="text-[var(--dashboard-text-light)] text-sm">For the selected period</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-100/20">
                                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">Total Billed</p>
                                    <p className="text-blue-700 dark:text-blue-300 text-2xl font-bold mt-1">₹ 0.00</p>
                                </div>
                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-100/20">
                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">Total Paid</p>
                                    <p className="text-emerald-700 dark:text-emerald-300 text-2xl font-bold mt-1">₹ 0.00</p>
                                </div>
                                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-100/20">
                                    <p className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">Outstanding</p>
                                    <p className="text-yellow-700 dark:text-yellow-300 text-2xl font-bold mt-1">₹ 0.00</p>
                                </div>
                                <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-100/20">
                                    <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">Payment Rate</p>
                                    <p className="text-purple-700 dark:text-purple-300 text-2xl font-bold mt-1">0%</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center gap-6 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-[var(--dashboard-text)]">Paid</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    <span className="text-[var(--dashboard-text)]">Outstanding</span>
                                </div>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div data-aos="fade-up" data-aos-delay="600" className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                            <div className="mb-6">
                                <h3 className="font-bold text-[var(--dashboard-text)] text-lg">Alerts</h3>
                                <p className="text-[var(--dashboard-text-light)] text-sm">Items needing attention</p>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-yellow-500/10 border border-yellow-100/20 rounded-lg p-4 flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-medium">0 pending appointments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholder for other tabs */}
            {/* Tab Content */}
            {activeTab === 'Appointments' && <AppointmentsTab />}
            {activeTab === 'Finance' && <FinanceTab />}
            {activeTab === 'Inventory' && <InventoryTab />}
            {activeTab === 'Staff' && <StaffTab />}
        </div>
    );
};

export default Dashboard;
