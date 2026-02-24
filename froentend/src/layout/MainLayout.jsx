import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth >= 1024) {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        } else {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--dashboard-secondary)] font-sans transition-colors duration-300">
            <Sidebar
                isOpen={isMobileMenuOpen}
                toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={toggleSidebar} />
                <main className="flex-1 px-4 sm:px-5 py-3 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
