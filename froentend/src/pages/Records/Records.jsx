import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus, Search, Filter, Settings,
    LayoutTemplate, ArrowLeft
} from "lucide-react";
import RecordsList from './RecordsList';
import RecordTypes from './RecordTypes';
import RecordTemplates from './RecordTemplates';
import CreateRecordTypeModal from './CreateRecordTypeModal';
import { useNavigate } from 'react-router-dom';
import { recordsService } from '../../services/recordsService';

const Records = () => {
    const navigate = useNavigate()
    const [currentView, setCurrentView] = useState('list'); // 'list', 'types', 'templates'
    const [searchTerm, setSearchTerm] = useState("");

    const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState(null);

    const [records, setRecords] = useState([]);
    const [recordTypes, setRecordTypes] = useState([]);

    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        fetchRecordTypes();
        fetchTemplates();
        fetchRecords();
    }, []);

    const fetchRecordTypes = async () => {
        try {
            const response = await recordsService.getAllRecordTypes();
            setRecordTypes(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch record types:", error);
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await recordsService.getAllRecords();
            setRecords(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch records:", error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await recordsService.getAllTemplates();
            setTemplates(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        }
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
                        onClick={() => {
                            if (currentView === 'templates') {
                                navigate("/records/create/template");
                            } else if (currentView === 'types') {
                                setTypeToEdit(null);
                                setIsCreateTypeModalOpen(true);
                            } else {
                                navigate("/records/create");
                            }
                        }}
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
                    <RecordsList records={records} searchTerm={searchTerm} refreshRecords={fetchRecords} />
                )}
                {currentView === 'types' && (
                    <RecordTypes
                        types={recordTypes}
                        searchTerm={searchTerm}
                        refreshTypes={fetchRecordTypes}
                        onEdit={(type) => {
                            setTypeToEdit(type);
                            setIsCreateTypeModalOpen(true);
                        }}
                    />
                )}
                {currentView === 'templates' && (
                    <RecordTemplates templates={templates} searchTerm={searchTerm} refreshTemplates={fetchTemplates} />
                )}
            </div>

            {/* Create/Edit Type Modal */}
            <CreateRecordTypeModal
                isOpen={isCreateTypeModalOpen}
                onClose={() => setIsCreateTypeModalOpen(false)}
                onRefresh={fetchRecordTypes}
                typeToEdit={typeToEdit}
            />
        </div>
    );
};

export default Records;
