import React, { useState } from 'react';
import { Search, Bell, Menu, Sun, Moon, Settings, LogOut, User, LayoutDashboard, Store } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        // authService.logout() already redirects to /login
    };

    const notifications = [
        { id: 1, title: 'New appointment created: Fusionedge Test Hospital', time: 'Nov 19, 2025 19:18' },
        { id: 2, title: 'New appointment created: Fusionedge Test Hospital', time: 'Nov 18, 2025 23:40' },
        { id: 3, title: 'New appointment created: Fusionedge Test Hospital', time: 'Oct 28, 2025 17:25' },
        { id: 4, title: 'New appointment created: Fusionedge Test Hospital', time: 'Oct 6, 2025 23:07' },
        { id: 5, title: 'New appointment created: Fusionedge Test Hospital', time: 'Sep 29, 2025 05:38' },
    ];

    return (
        <header className="bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-40 px-8 py-2 flex items-center justify-between shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-[var(--dashboard-text)]"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative hidden md:block">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dashboard-text-light)]" />
                    <input
                        type="text"
                        placeholder="Search patients, appointments..."
                        className="pl-10 pr-4 py-2 w-64 bg-[var(--dashboard-secondary)] border-none rounded-full text-[var(--dashboard-text)] focus:ring-2 focus:ring-[var(--dashboard-primary)]/20 focus:bg-[var(--card-bg)] transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* POS Button - Reddish Pink */}
                <button
                    onClick={() => navigate('/pos')}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F43F5E] hover:bg-[#E11D48] text-white rounded-lg shadow-sm transition-all duration-200 font-semibold"
                >
                    <Store className="w-4 h-4" />
                    <span>POS</span>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-[var(--dashboard-text-light)]"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notification Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors outline-none">
                            <Bell className="w-6 h-6 text-[var(--dashboard-text-light)]" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-[var(--card-bg)] border-[var(--border-color)]">
                        <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[var(--dashboard-text)]" />
                            <h3 className="font-semibold text-[var(--dashboard-text)]">Notifications</h3>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.map((notif) => (
                                <DropdownMenuItem key={notif.id} className="p-4 border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] cursor-pointer block">
                                    <p className="text-sm font-medium text-[var(--dashboard-text)] mb-1">{notif.title}</p>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">{notif.time}</p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <div className="p-3 bg-[var(--dashboard-secondary)] border-t border-[var(--border-color)] flex justify-between">
                            <button className="text-sm font-medium text-[var(--dashboard-primary)] hover:underline">View All</button>
                            <button className="text-sm font-medium text-[var(--dashboard-primary)] hover:underline">Mark All as Read</button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Dropdown */}
                <div className="pl-6 border-l border-[var(--border-color)]">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 group focus:outline-none">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                        {user?.name || user?.firstName || 'User'}
                                    </p>
                                    <p className="text-xs text-[var(--dashboard-text-light)]">
                                        {user?.role || 'Admin'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--dashboard-primary)] to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--dashboard-primary)]/20 ring-2 ring-transparent group-hover:ring-[var(--dashboard-primary)]/20 transition-all">
                                    {(user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 bg-[var(--card-bg)] border-[var(--border-color)]">
                            <div className="p-4 border-b border-[var(--border-color)]">
                                <p className="font-semibold text-[var(--dashboard-text)]">
                                    {user?.name || user?.firstName || 'User'}
                                </p>
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                            <div className="p-2">
                                <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer gap-3 text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)]">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-3 text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)]">
                                    <User className="w-4 h-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-3 text-[var(--dashboard-text)] focus:bg-[var(--dashboard-secondary)]" onClick={() => navigate('/settings')}>
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[var(--border-color)]" />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-3 text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10">
                                    <LogOut className="w-4 h-4" />
                                    Log out
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;
