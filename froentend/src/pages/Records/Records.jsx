import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Plus, Search, Filter, Settings, 
    LayoutTemplate, ArrowLeft
} from "lucide-react";
import RecordsList from './RecordsList';
import RecordTypes from './RecordTypes';
import RecordTemplates from './RecordTemplates';
import CreateRecordModal from './CreateRecordModal';

const Records = () => {
    const [currentView, setCurrentView] = useState('list'); // 'list', 'types', 'templates'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Dummy Data Management
    const [records, setRecords] = useState([
        { 
            id: 1, 
            date: "September 27th, 2025", 
            pet: { name: "umi", detail: "Scottish Fold, cat" }, 
            type: "Vaccination Record", 
            description: "No description", 
            createdAt: "Sep 27, 2025, 2:47 PM", 
            status: "Active" 
        },
        { 
            id: 2, 
            date: "September 19th, 2025", 
            pet: { name: "Dd", detail: "Golden, dog" }, 
            type: "Vaccination Record", 
            description: "No description", 
            createdAt: "Sep 20, 2025, 1:40 AM", 
            status: "Active" 
        },
        { 
            id: 3, 
            date: "September 13th, 2025", 
            pet: { name: "umi", detail: "Scottish Fold, cat" }, 
            type: "Vaccination Record", 
            description: "No description", 
            createdAt: "Sep 14, 2025, 4:06 AM", 
            status: "Active" 
        },
        { 
            id: 4, 
            date: "September 1st, 2025", 
            pet: { name: "umi", detail: "Scottish Fold, cat" }, 
            type: "Vaccination Record", 
            description: "No description", 
            createdAt: "Sep 2, 2025, 1:09 AM", 
            status: "Active" 
        }
    ]);

    const [recordTypes, setRecordTypes] = useState([
        { id: 1, name: "Annual Wellness Exam", category: "examination", templateRequired: true, templates: 2, created: "Aug 31, 2025", status: "Active" },
        { id: 2, name: "Dental Examination", category: "examination", templateRequired: true, templates: 1, created: "Aug 31, 2025", status: "Active" },
        { id: 3, name: "Emergency Visit", category: "urgent", templateRequired: true, templates: 1, created: "Aug 31, 2025", status: "Active" },
        { id: 4, name: "Medical Consultation", category: "consultation", templateRequired: true, templates: 1, created: "Aug 31, 2025", status: "Active" },
        { id: 5, name: "Surgical Procedure", category: "procedure", templateRequired: true, templates: 1, created: "Aug 31, 2025", status: "Active" },
        { id: 6, name: "Vaccination Record", category: "preventive", templateRequired: true, templates: 2, created: "Aug 31, 2025", status: "Active" },
    ]);

    const [templates, setTemplates] = useState([
        { id: 1, name: "Annual Wellness Exam Template", type: "Annual Wellness Exam", version: 1, status: "Active" },
        { id: 2, name: "Annual Wellness Exam Template (Copy)", type: "Annual Wellness Exam", version: 1, status: "Active" },
        { id: 3, name: "Dental Examination Template", type: "Dental Examination", version: 1, status: "Active" },
        { id: 4, name: "Emergency Visit Template", type: "Emergency Visit", version: 1, status: "Active" },
        { id: 5, name: "Medical Consultation Template", type: "Medical Consultation", version: 1, status: "Active" },
        { id: 6, name: "Surgical Procedure Template", type: "Surgical Procedure", version: 1, status: "Active" },
        { id: 7, name: "Vaccination Record Template", type: "Vaccination Record", version: 1, status: "Active" },
    ]);

    const handleCreateRecord = (newRecord) => {
        setRecords([newRecord, ...records]);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-none mx-auto px-3 sm:px-4 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
                        {currentView === 'list' && "Medical Records"}
                        {currentView === 'types' && "Record Types"}
                        {currentView === 'templates' && "Record Templates"}
                    </h1>
                    <p className="text-sm text-[var(--dashboard-text-light)]">
                        {currentView === 'list' && "Manage and track all medical records"}
                        {currentView === 'types' && "Manage different types of medical records"}
                        {currentView === 'templates' && "Manage templates for medical records"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        className="h-9 w-full sm:w-[300px] rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {currentView === 'list' && (
                        <Button className="h-9 rounded-md border border-[var(--border-color)] px-4 text-sm bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] hover:text-white">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    )}

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </div>
            </div>

            {/* Navigation / Status Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
                {currentView === 'list' ? (
                    <>
                        <div className="bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center border border-[var(--dashboard-primary)]/20">
                            Status: Active <span className="ml-2 cursor-pointer hover:opacity-75">×</span>
                        </div>
                        <Button 
                            className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]" 
                            onClick={() => setCurrentView('types')}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Record Types
                        </Button>
                        <Button 
                            className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]" 
                            onClick={() => setCurrentView('templates')}
                        >
                            <LayoutTemplate className="mr-2 h-4 w-4" />
                            Templates
                        </Button>
                    </>
                ) : (
                    <Button 
                        onClick={() => setCurrentView('list')}
                        className="h-9 rounded-md border border-[var(--border-color)] px-4 text-sm bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Records
                    </Button>
                )}
            </div>

            {/* Content View */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm overflow-hidden">
                {currentView === 'list' && (
                    <RecordsList records={records} searchTerm={searchTerm} />
                )}
                {currentView === 'types' && (
                    <RecordTypes types={recordTypes} searchTerm={searchTerm} />
                )}
                {currentView === 'templates' && (
                    <RecordTemplates templates={templates} searchTerm={searchTerm} />
                )}
            </div>

            {/* Create Modal */}
            <CreateRecordModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSubmit={handleCreateRecord}
                recordTypes={recordTypes}
                templates={templates}
            />
        </div>
    );
};

export default Records;
