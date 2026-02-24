import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { ArrowLeft, Plus, Save, X, Edit, Trash2 } from "lucide-react";
import { appointmentService } from "../../services/appointmentService";
import { treatmentService } from "../../services/treatmentService";
import { prescriptionService } from "../../services/prescriptionService";
import { procedureService } from "../../services/procedureService";
import { vaccinationService } from "../../services/vaccinationService";
import { followupService } from "../../services/followupService";
import { billService } from "../../services/billService";

const Consultation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Prescriptions");
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState(null);

    // Fetch appointment details
    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAppointmentById(id);
            setAppointment(response.data);
        } catch (err) {
            console.error('Error fetching appointment:', err);
            setError(err.message || 'Failed to load appointment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                    <p className="text-sm text-[var(--dashboard-text-light)]">Loading consultation...</p>
                </div>
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="container mx-auto p-6">
                <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load appointment</p>
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <Button 
                        onClick={() => navigate('/appointments')}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Back to Appointments
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <Button
                    onClick={() => navigate('/appointments')}
                    variant="ghost"
                    className="mb-4 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)]"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Appointments
                </Button>

                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)] mb-4">
                        Consultation
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Appointment No</p>
                            <p className="text-sm font-semibold text-[var(--dashboard-text)]">{appointment.appointment_no}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Client</p>
                            <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                {appointment.client?.first_name} {appointment.client?.last_name}
                            </p>
                            <p className="text-xs text-[var(--dashboard-text-light)]">{appointment.client?.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Pet</p>
                            <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                {appointment.pet?.name || 'N/A'}
                            </p>
                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                {appointment.pet?.pet_type} {appointment.pet?.breed ? `- ${appointment.pet.breed}` : ''}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Date & Time</p>
                            <p className="text-sm font-semibold text-[var(--dashboard-text)]">
                                {new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })}, {appointment.scheduled_time}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Status</p>
                            <span className="inline-flex rounded-md px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-600">
                                {appointment.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--dashboard-text-light)] uppercase mb-1">Reason</p>
                            <p className="text-sm text-[var(--dashboard-text)]">{appointment.reason || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="inline-flex h-10 w-full md:w-fit items-center rounded-lg bg-[var(--dashboard-secondary)] p-1 border border-[var(--border-color)] overflow-x-auto">
                    {["Prescriptions", "Treatments", "Procedures", "Vaccinations", "Follow-ups", "Bills"].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm rounded-md transition-all shadow-none whitespace-nowrap ${
                                activeTab === tab
                                    ? "bg-[var(--dashboard-primary)] text-white shadow"
                                    : "text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--card-bg)]/50"
                            }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                {activeTab === "Prescriptions" && <PrescriptionsTab appointmentId={id} appointment={appointment} />}
                {activeTab === "Treatments" && <TreatmentsTab appointmentId={id} appointment={appointment} />}
                {activeTab === "Procedures" && <ProceduresTab appointmentId={id} appointment={appointment} />}
                {activeTab === "Vaccinations" && <VaccinationsTab appointmentId={id} appointment={appointment} />}
                {activeTab === "Follow-ups" && <FollowUpsTab appointmentId={id} appointment={appointment} />}
                {activeTab === "Bills" && <BillsTab appointmentId={id} appointment={appointment} />}
            </div>
        </div>
    );
};

export default Consultation;


// Import tab components
import PrescriptionsTab from "./tabs/PrescriptionsTab";
import TreatmentsTab from "./tabs/TreatmentsTab";
import ProceduresTab from "./tabs/ProceduresTab";
import VaccinationsTab from "./tabs/VaccinationsTab";
import FollowUpsTab from "./tabs/FollowUpsTab";
import BillsTab from "./tabs/BillsTab";
