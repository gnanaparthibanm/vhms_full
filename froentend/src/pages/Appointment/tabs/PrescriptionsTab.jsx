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
import { prescriptionService } from "../../../services/prescriptionService";

const PrescriptionsTab = ({ appointmentId, appointment }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        prescription_date: new Date().toISOString().split('T')[0],
        notes: "",
        status: "Pending",
    });

    useEffect(() => {
        fetchPrescriptions();
    }, [appointmentId]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await prescriptionService.getAllPrescriptions({ appointment_id: appointmentId });
            setPrescriptions(response.data?.data?.data || response.data?.data || []);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                appointment_id: appointmentId,
                pet_id: appointment.pet_id,
            };

            if (editingItem) {
                await prescriptionService.updatePrescription(editingItem.id, payload);
            } else {
                await prescriptionService.createPrescription(payload);
            }

            setShowForm(false);
            setEditingItem(null);
            resetForm();
            fetchPrescriptions();
        } catch (err) {
            console.error('Error saving prescription:', err);
            alert(err.message || 'Failed to save prescription');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            prescription_date: item.prescription_date ? new Date(item.prescription_date).toISOString().split('T')[0] : "",
            notes: item.notes || "",
            status: item.status,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this prescription?')) return;
        try {
            await prescriptionService.deletePrescription(id);
            fetchPrescriptions();
        } catch (err) {
            console.error('Error deleting prescription:', err);
            alert('Failed to delete prescription');
        }
    };

    const resetForm = () => {
        setFormData({
            prescription_date: new Date().toISOString().split('T')[0],
            notes: "",
            status: "Pending",
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
                <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Prescriptions</h2>
                {!showForm && (
                    <Button 
                        onClick={() => setShowForm(true)}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Prescription
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-semibold text-[var(--dashboard-text)]">
                            {editingItem ? 'Edit Prescription' : 'Add New Prescription'}
                        </h3>
                        <Button onClick={handleCancel} variant="ghost" size="sm">
                            <X size={16} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Prescription Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.prescription_date}
                                    onChange={(e) => setFormData({ ...formData, prescription_date: e.target.value })}
                                    required
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
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
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Dispensed">Dispensed</SelectItem>
                                        <SelectItem value="Partially_Dispensed">Partially Dispensed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Enter prescription notes"
                                rows={4}
                                className="bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" onClick={handleCancel} variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[var(--dashboard-primary)] text-white">
                                <Save size={16} className="mr-2" />
                                {editingItem ? 'Update' : 'Save'} Prescription
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
            ) : prescriptions.length === 0 ? (
                <p className="text-sm text-[var(--dashboard-text-light)] text-center py-8">
                    No prescriptions added yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {prescriptions.map((item) => (
                        <div key={item.id} className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-[var(--dashboard-text)]">
                                            {item.prescription_no}
                                        </h4>
                                        <span className={`text-xs px-2 py-1 rounded-md ${
                                            item.status === 'Dispensed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                            item.status === 'Partially_Dispensed' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' :
                                            item.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                            'bg-gray-100 dark:bg-gray-800 text-gray-600'
                                        }`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[var(--dashboard-text-light)] mb-2">
                                        Date: {new Date(item.prescription_date).toLocaleDateString()}
                                    </div>
                                    {item.notes && (
                                        <p className="text-sm text-[var(--dashboard-text-light)]">{item.notes}</p>
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

export default PrescriptionsTab;
