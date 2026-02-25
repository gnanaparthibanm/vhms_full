import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Plus, Save, X, Edit, Trash2 } from "lucide-react";
import { procedureService } from "../../../services/procedureService";
import { staffService } from "../../../services/staffService";

const ProceduresTab = ({ appointmentId, appointment }) => {
    const [procedures, setProcedures] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        procedure_name: "",
        procedure_code: "",
        description: "",
        scheduled_date: new Date().toISOString().split('T')[0],
        performed_date: "",
        doctor_id: "",
        status: "Scheduled",
        cost: "",
        duration_minutes: "",
        notes: "",
        complications: "",
    });

    useEffect(() => {
        fetchProcedures();
        fetchDoctors();
    }, [appointmentId]);

    const fetchProcedures = async () => {
        try {
            setLoading(true);
            const response = await procedureService.getAllProcedures({ appointment_id: appointmentId });
            setProcedures(response.data?.data?.data || response.data?.data || []);
        } catch (err) {
            console.error('Error fetching procedures:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await staffService.getAllDoctors();
            setDoctors(response.data?.data || response.data || []);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                appointment_id: appointmentId,
                pet_id: appointment.pet_id,
                cost: formData.cost ? parseFloat(formData.cost) : 0,
                duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
            };

            if (editingItem) {
                await procedureService.updateProcedure(editingItem.id, payload);
            } else {
                await procedureService.createProcedure(payload);
            }

            setShowForm(false);
            setEditingItem(null);
            resetForm();
            fetchProcedures();
        } catch (err) {
            console.error('Error saving procedure:', err);
            alert(err.message || 'Failed to save procedure');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            procedure_name: item.procedure_name,
            procedure_code: item.procedure_code || "",
            description: item.description || "",
            scheduled_date: item.scheduled_date ? new Date(item.scheduled_date).toISOString().split('T')[0] : "",
            performed_date: item.performed_date ? new Date(item.performed_date).toISOString().split('T')[0] : "",
            doctor_id: item.doctor_id || "",
            status: item.status,
            cost: item.cost || "",
            duration_minutes: item.duration_minutes || "",
            notes: item.notes || "",
            complications: item.complications || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this procedure?')) return;
        try {
            await procedureService.deleteProcedure(id);
            fetchProcedures();
        } catch (err) {
            console.error('Error deleting procedure:', err);
            alert('Failed to delete procedure');
        }
    };

    const resetForm = () => {
        setFormData({
            procedure_name: "",
            procedure_code: "",
            description: "",
            scheduled_date: new Date().toISOString().split('T')[0],
            performed_date: "",
            doctor_id: "",
            status: "Scheduled",
            cost: "",
            duration_minutes: "",
            notes: "",
            complications: "",
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null);
        resetForm();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Procedures</h2>
                {!showForm && (
                    <Button 
                        onClick={() => setShowForm(true)}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Procedure
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-semibold text-[var(--dashboard-text)]">
                            {editingItem ? 'Edit Procedure' : 'Add New Procedure'}
                        </h3>
                        <Button onClick={handleCancel} variant="ghost" size="sm">
                            <X size={16} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Procedure Name *</Label>
                                <Input
                                    value={formData.procedure_name}
                                    onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
                                    placeholder="Enter procedure name"
                                    required
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Procedure Code</Label>
                                <Input
                                    value={formData.procedure_code}
                                    onChange={(e) => setFormData({ ...formData, procedure_code: e.target.value })}
                                    placeholder="Enter procedure code"
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Scheduled Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.scheduled_date}
                                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                    required
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Performed Date</Label>
                                <Input
                                    type="date"
                                    value={formData.performed_date}
                                    onChange={(e) => setFormData({ ...formData, performed_date: e.target.value })}
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Doctor</Label>
                                <Select
                                    value={formData.doctor_id}
                                    onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                                >
                                    <SelectTrigger className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        <SelectValue placeholder="Select doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map(doctor => (
                                            <SelectItem key={doctor.id} value={doctor.id}>
                                                {doctor.doctor_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status *</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="In_Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Cost (₹)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="0.00"
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    value={formData.duration_minutes}
                                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                    placeholder="Enter duration"
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter procedure description"
                                rows={3}
                                className="bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes"
                                rows={2}
                                className="bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Complications</Label>
                            <Textarea
                                value={formData.complications}
                                onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
                                placeholder="Any complications"
                                rows={2}
                                className="bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" onClick={handleCancel} variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[var(--dashboard-primary)] text-white">
                                <Save size={16} className="mr-2" />
                                {editingItem ? 'Update' : 'Save'} Procedure
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                </div>
            ) : procedures.length === 0 ? (
                <p className="text-sm text-[var(--dashboard-text-light)] text-center py-8">
                    No procedures added yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {procedures.map((item) => (
                        <div key={item.id} className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-[var(--dashboard-text)]">
                                            {item.procedure_name}
                                        </h4>
                                        {item.procedure_code && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                                                {item.procedure_code}
                                            </span>
                                        )}
                                        <span className={`text-xs px-2 py-1 rounded-md ${
                                            item.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                            item.status === 'In_Progress' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' :
                                            item.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                            'bg-gray-100 dark:bg-gray-800 text-gray-600'
                                        }`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-sm text-[var(--dashboard-text-light)] mb-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[var(--dashboard-text-light)]">
                                        <div>
                                            <span className="font-medium">Scheduled:</span> {new Date(item.scheduled_date).toLocaleDateString()}
                                        </div>
                                        {item.performed_date && (
                                            <div>
                                                <span className="font-medium">Performed:</span> {new Date(item.performed_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        {item.doctor && (
                                            <div>
                                                <span className="font-medium">Doctor:</span> {item.doctor.doctor_name}
                                            </div>
                                        )}
                                        {item.cost > 0 && (
                                            <div>
                                                <span className="font-medium">Cost:</span> ₹{parseFloat(item.cost).toFixed(2)}
                                            </div>
                                        )}
                                        {item.duration_minutes && (
                                            <div>
                                                <span className="font-medium">Duration:</span> {item.duration_minutes} mins
                                            </div>
                                        )}
                                    </div>
                                    {item.notes && (
                                        <p className="text-xs text-[var(--dashboard-text-light)] mt-2 italic">
                                            Note: {item.notes}
                                        </p>
                                    )}
                                    {item.complications && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                            Complications: {item.complications}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="h-8 px-2">
                                        <Edit size={14} />
                                    </Button>
                                    <Button onClick={() => handleDelete(item.id)} size="sm" variant="outline" className="h-8 px-2 border-red-200 text-red-600">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProceduresTab;
