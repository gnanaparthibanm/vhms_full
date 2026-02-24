import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Reusable Filter Panel Component
 * @param {boolean} isOpen - Whether the filter panel is open
 * @param {function} onClose - Function to close the filter panel
 * @param {string} title - Title of the filter panel
 * @param {Array} filterOptions - Array of filter options with label and value
 * @param {string} selectedFilter - Currently selected filter value
 * @param {function} onFilterChange - Function to handle filter change
 * @param {function} onApply - Function to apply filters
 * @param {function} onReset - Function to reset filters
 */
const FilterPanel = ({
    isOpen,
    onClose,
    title = "Filter",
    filterOptions = [],
    selectedFilter,
    onFilterChange,
    onApply,
    onReset
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
            <div className="h-full w-full max-w-md bg-[var(--card-bg)] shadow-2xl border-l border-[var(--border-color)] animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">{title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Filter Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        {filterOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => onFilterChange(option.value)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedFilter === option.value
                                        ? 'border-[var(--dashboard-primary)] bg-[var(--dashboard-primary)]/10'
                                        : 'border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[var(--dashboard-text)]">
                                        {option.label}
                                    </span>
                                    {selectedFilter === option.value && (
                                        <svg
                                            className="h-5 w-5 text-[var(--dashboard-primary)]"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={onApply}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
