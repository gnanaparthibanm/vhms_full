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
import { treatmentService } from "../../../services/treatmentService";

const TreatmentsTab = ({ appointmentId, appointment }) => {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTreatment, setEditingTreatment] = useState(null);
    const [formData, setFormData] = useState({
        treatment_name: "",
        treatment_type: "Medication",
        description: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        status: "Planned",
        cost: "",
        notes: "",
    });

    useEffect(() => {
        fetchTreatments();
    }, [appointmentId]);

    const fetchTreatments = async () => {
        try {
            setLoading(true);
            const response = await treatmentService.getAllTreatments({ appointment_id: appointmentId });
            setTreatments(response.data?.data?.data || response.data?.data || []);
        } catch (err) {
            console.error('Error fetching treatments:', err);
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
                cost: formData.cost ? parseFloat(formData.cost) : 0,
            };

            if (editingTreatment) {
                await treatmentService.updateTreatment(editingTreatment.id, payload);
            } else {
                await treatmentService.createTreatment(payload);
            }

            setShowForm(false);
            setEditingTreatment(null);
            resetForm();
            fetchTreatments();
        } catch (err) {
            console.error('Error saving treatment:', err);
            alert(err.message || 'Failed to save treatment');
        }
    };

    const handleEdit = (treatment) => {
        setEditingTreatment(treatment);
        setFormData({
            treatment_name: treatment.treatment_name,
            treatment_type: treatment.treatment_type,
            description: treatment.description || "",
            start_date: treatment.start_date ? new Date(treatment.start_date).toISOString().split('T')[0] : "",
            end_date: treatment.end_date ? new Date(treatment.end_date).toISOString().split('T')[0] : "",
            status: treatment.status,
            cost: treatment.cost || "",
            notes: treatment.notes || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this treatment?')) return;
        try {
            await treatmentService.deleteTreatment(id);
            fetchTreatments();
        } catch (err) {
            console.error('Error deleting treatment:', err);
            alert('Failed to delete treatment');
        }
    };

    const resetForm = () => {
        setFormData({
            treatment_name: "",
            treatment_type: "Medication",
            description: "",
            start_date: new Date().toISOString().split('T')[0],
            end_date: "",
            status: "Planned",
            cost: "",
            notes: "",
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTreatment(null);
        resetForm();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Treatments</h2>
                {!showForm && (
                    <Button 
                        onClick={() => setShowForm(true)}
                        className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Treatment
                    </Button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-semibold text-[var(--dashboard-text)]">
                            {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
                        </h3>
                        <Button onClick={handleCancel} variant="ghost" size="sm">
                            <X size={16} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Treatment Name *</Label>
                                <Input
                                    value={formData.treatment_name}
                                    onChange={(e) => setFormData({ ...formData, treatment_name: e.target.value })}
                                    placeholder="Enter treatment name"
                                    required
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Treatment Type *</Label>
                                <Select
                                    value={formData.treatment_type}
                                    onValueChange={(value) => setFormData({ ...formData, treatment_type: value })}
                                >
                                    <SelectTrigger className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Medication">Medication</SelectItem>
                                        <SelectItem value="Therapy">Therapy</SelectItem>
                                        <SelectItem value="Surgery">Surgery</SelectItem>
                                        <SelectItem value="Procedure">Procedure</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Start Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                                        <SelectItem value="Planned">Planned</SelectItem>
                                        <SelectItem value="In_Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Cost</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="0.00"
                                    className="bg-[var(--card-bg)] border-[var(--border-color)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter treatment description"
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

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" onClick={handleCancel} variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[var(--dashboard-primary)] text-white">
                                <Save size={16} className="mr-2" />
                                {editingTreatment ? 'Update' : 'Save'} Treatment
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
            ) : treatments.length === 0 ? (
                <p className="text-sm text-[var(--dashboard-text-light)] text-center py-8">
                    No treatments added yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {treatments.map((treatment) => (
                        <div key={treatment.id} className="bg-[var(--dashboard-secondary)] border border-[var(--border-color)] rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-[var(--dashboard-text)]">
                                            {treatment.treatment_name}
                                        </h4>
                                        <span className="text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                                            {treatment.treatment_type}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-md ${
                                            treatment.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                            treatment.status === 'In_Progress' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' :
                                            treatment.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                            'bg-gray-100 dark:bg-gray-800 text-gray-600'
                                        }`}>
                                            {treatment.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {treatment.description && (
                                        <p className="text-sm text-[var(--dashboard-text-light)] mb-2">
                                            {treatment.description}
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[var(--dashboard-text-light)]">
                                        <div>
                                            <span className="font-medium">Start:</span> {new Date(treatment.start_date).toLocaleDateString()}
                                        </div>
                                        {treatment.end_date && (
                                            <div>
                                                <span className="font-medium">End:</span> {new Date(treatment.end_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        {treatment.cost > 0 && (
                                            <div>
                                                <span className="font-medium">Cost:</span> ₹{parseFloat(treatment.cost).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    {treatment.notes && (
                                        <p className="text-xs text-[var(--dashboard-text-light)] mt-2 italic">
                                            Note: {treatment.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button onClick={() => handleEdit(treatment)} size="sm" variant="outline" className="h-8 px-2">
                                        <Edit size={14} />
                                    </Button>
                                    <Button onClick={() => handleDelete(treatment.id)} size="sm" variant="outline" className="h-8 px-2 border-red-200 text-red-600">
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

export default TreatmentsTab;
