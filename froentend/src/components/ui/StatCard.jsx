import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, colorTheme }) => {
    const themes = {
        primary: { bg: 'bg-[var(--dashboard-primary)]/10', text: 'text-[var(--dashboard-primary)]', sub: 'text-[var(--dashboard-primary)]/80' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', sub: 'text-rose-500 dark:text-rose-300' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', sub: 'text-emerald-500 dark:text-emerald-300' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', sub: 'text-blue-500 dark:text-blue-300' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', sub: 'text-purple-500 dark:text-purple-300' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', sub: 'text-orange-500 dark:text-orange-300' },
    };

    const theme = themes[colorTheme] || themes.primary;

    return (
        <div className="rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-lg transition-all bg-[var(--card-bg)] overflow-hidden">
            {/* Header Section */}
            <div className={`p-4 flex items-center gap-3 ${theme.bg}`}>
                <Icon className={`w-5 h-5 ${theme.text}`} />
                <h5 className={`font-semibold text-sm ${theme.text}`}>{title}</h5>
            </div>

            {/* Body Section */}
            <div className="p-6 pt-4">
                <p className="text-2xl font-bold text-[var(--dashboard-text)] mb-2">{value}</p>
                <p className="text-sm font-medium text-[var(--dashboard-text-light)]">{subtext}</p>
            </div>
        </div>
    );
};

export default StatCard;
