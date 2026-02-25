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
import { Plus, Save, X, Edit, Trash2, Trash } from "lucide-react";
import { prescriptionService } from "../../../services/prescriptionService";
import { productService } from "../../../services/productService";

const PrescriptionsTab = ({ appointmentId, appointment }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        prescription_date: new Date().toISOString().split('T')[0],
        notes: "",
        status: "Pending",
    });
    const [items, setItems] = useState([{
        product_id: "",
        quantity: 1,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
    }]);

    useEffect(() => {
        fetchPrescriptions();
        fetchProducts();
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

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts({ is_prescription_item: true });
            setProducts(response.data?.data?.data || response.data?.data || response.data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const generatePrescriptionNo = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `RX-${timestamp}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate items
        const validItems = items.filter(item => item.product_id && item.quantity > 0);
        if (validItems.length === 0) {
            alert('Please add at least one medicine to the prescription');
            return;
        }

        try {
            const payload = {
                ...formData,
                appointment_id: appointmentId,
                pet_id: appointment.pet_id,
                prescription_no: generatePrescriptionNo(),
                items: validItems
            };

            await prescriptionService.createPrescription(payload);
            
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

    const addItem = () => {
        setItems([...items, {
            product_id: "",
            quantity: 1,
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) {
            alert('At least one item is required');
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const resetForm = () => {
        setFormData({
            prescription_date: new Date().toISOString().split('T')[0],
            notes: "",
            status: "Pending",
        });
        setItems([{
            product_id: "",
            quantity: 1,
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        }]);
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

                        {/* Prescription Items */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>Medicines *</Label>
                                <Button type="button" onClick={addItem} size="sm" variant="outline" className="h-8">
                                    <Plus size={14} className="mr-1" />
                                    Add Medicine
                                </Button>
                            </div>

                            {items.map((item, index) => (
                                <div key={index} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-[var(--dashboard-text)]">Medicine {index + 1}</span>
                                        {items.length > 1 && (
                                            <Button 
                                                type="button" 
                                                onClick={() => removeItem(index)} 
                                                size="sm" 
                                                variant="ghost"
                                                className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash size={14} />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Product *</Label>
                                            <Select
                                                value={item.product_id}
                                                onValueChange={(value) => updateItem(index, 'product_id', value)}
                                            >
                                                <SelectTrigger className="bg-[var(--card-bg)] border-[var(--border-color)] h-9">
                                                    <SelectValue placeholder="Select medicine" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(product => (
                                                        <SelectItem key={product.id} value={product.id}>
                                                            {product.product_name} {product.strength ? `(${product.strength})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Quantity *</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                className="bg-[var(--card-bg)] border-[var(--border-color)] h-9"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Dosage</Label>
                                            <Input
                                                value={item.dosage}
                                                onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                                                placeholder="e.g., 1 tablet"
                                                className="bg-[var(--card-bg)] border-[var(--border-color)] h-9"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Frequency</Label>
                                            <Input
                                                value={item.frequency}
                                                onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                                                placeholder="e.g., Twice daily"
                                                className="bg-[var(--card-bg)] border-[var(--border-color)] h-9"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Duration</Label>
                                            <Input
                                                value={item.duration}
                                                onChange={(e) => updateItem(index, 'duration', e.target.value)}
                                                placeholder="e.g., 7 days"
                                                className="bg-[var(--card-bg)] border-[var(--border-color)] h-9"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Instructions</Label>
                                            <Input
                                                value={item.instructions}
                                                onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                                placeholder="e.g., After meals"
                                                className="bg-[var(--card-bg)] border-[var(--border-color)] h-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Enter prescription notes"
                                rows={3}
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
                                        <p className="text-sm text-[var(--dashboard-text-light)] mb-2">{item.notes}</p>
                                    )}
                                    {item.items && item.items.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-xs font-medium text-[var(--dashboard-text)]">Medicines:</p>
                                            {item.items.map((med, idx) => (
                                                <div key={idx} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded p-2 text-xs">
                                                    <div className="font-medium text-[var(--dashboard-text)] mb-1">
                                                        {med.product?.product_name} {med.product?.strength ? `(${med.product.strength})` : ''} - Qty: {med.quantity}
                                                    </div>
                                                    <div className="text-[var(--dashboard-text-light)] space-y-0.5">
                                                        {med.dosage && <div>• Dosage: {med.dosage}</div>}
                                                        {med.frequency && <div>• Frequency: {med.frequency}</div>}
                                                        {med.duration && <div>• Duration: {med.duration}</div>}
                                                        {med.instructions && <div>• Instructions: {med.instructions}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
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
