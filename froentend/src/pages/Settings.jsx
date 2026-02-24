import React, { useState } from 'react';
import { Palette, Check, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { primaryColor, updatePrimaryColor, theme, toggleTheme } = useTheme();

    // Pre-defined color palette suggestions
    const colorPalette = [
        { name: 'Default Indigo', value: '#4051c0' },
        { name: 'Royal Purple', value: '#7c3aed' },
        { name: 'Emerald Green', value: '#10b981' },
        { name: 'Rose Red', value: '#f43f5e' },
        { name: 'Sky Blue', value: '#0ea5e9' },
        { name: 'Amber Orange', value: '#d97706' },
        { name: 'Teal', value: '#14b8a6' },
        { name: 'Slate', value: '#475569' },
    ];

    const handleColorChange = (color) => {
        updatePrimaryColor(color);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-[var(--dashboard-text)]">Settings</h2>
                <p className="text-[var(--dashboard-text-light)]">Manage application preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Theme Configuration */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="w-5 h-5 text-[var(--dashboard-primary)]" />
                        <div>
                            <h3 className="font-bold text-[var(--dashboard-text)]">Appearance</h3>
                            <p className="text-sm text-[var(--dashboard-text-light)]">Customize the look and feel</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-[var(--dashboard-text)]">Dark Mode</label>
                                <p className="text-xs text-[var(--dashboard-text-light)]">Switch between light and dark themes</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)] focus:ring-offset-2 ${theme === 'dark' ? 'bg-[var(--dashboard-primary)]' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        <div className="border-t border-[var(--border-color)] pt-4">
                            <label className="block font-medium text-[var(--dashboard-text)] mb-3">Primary Brand Color</label>

                            {/* Color Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                                {colorPalette.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => handleColorChange(color.value)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-[var(--card-bg)] ${primaryColor === color.value ? 'ring-[var(--dashboard-primary)]' : 'ring-transparent'}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {primaryColor === color.value && <Check className="w-5 h-5 text-white" />}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Color Input */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => handleColorChange(e.target.value)}
                                        className="w-10 h-10 rounded-lg p-0 border-0 cursor-pointer overflow-hidden"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(e) => handleColorChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg text-sm bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]/20"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Placeholder for other settings */}
                <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] opacity-60 pointer-events-none">
                    <div className="flex items-center gap-3 mb-6">
                        <Save className="w-5 h-5 text-[var(--dashboard-text-light)]" />
                        <div>
                            <h3 className="font-bold text-[var(--dashboard-text)]">System Settings</h3>
                            <p className="text-sm text-[var(--dashboard-text-light)]">Coming soon...</p>
                        </div>
                    </div>
                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
                        <p className="text-[var(--dashboard-text-light)]">More settings will be available here</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
