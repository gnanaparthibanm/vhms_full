import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ChevronLeft } from 'lucide-react';

// Simple Switch Component (since we might not have one in ui/)
const Switch = ({ checked, onCheckedChange, label }) => (
    <div className="flex items-center space-x-2">
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${checked ? 'bg-[var(--dashboard-primary)]' : 'bg-gray-200 dark:bg-gray-700'}
      `}
        >
            <span
                className={`
          pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
            />
        </button>
        {label && <span className="text-sm text-[var(--dashboard-text)]">{label}</span>}
    </div>
);

const BillableItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        type: 'Service',
        cost: '',
        profitMargin: '',
        price: '',
        branch: '',
        category: '',
        taxRate: '',
        tags: '',
        trackStock: false,
        initialStock: '',
        reorderLevel: '',
        sku: 'Auto-generated if blank',
        barcode: '',
        manufacturer: '',
        duration: '',
        description: '',
        active: true
    });

    useEffect(() => {
        if (isEditMode) {
            // Mock fetch data
            if (id === '1') {
                setFormData({
                    name: "Blood Test - CBC",
                    type: "Service",
                    cost: "0",
                    profitMargin: "Auto-calculated",
                    price: "800",
                    branch: "",
                    category: "",
                    taxRate: "",
                    tags: "diagnostics",
                    trackStock: false,
                    initialStock: "0",
                    reorderLevel: "0",
                    sku: "FTH-S-0017",
                    barcode: "",
                    manufacturer: "",
                    duration: "30",
                    description: "Complete Blood Count test",
                    active: true
                });
            }
        }
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name, checked) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        navigate('/billable-items');
    };

    return (
        <div className="container mx-auto max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/billable-items')}
                    className="hover:bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)]"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">
                        {isEditMode ? 'Edit Item' : 'Add New Item'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-[var(--card-bg)] md:p-8 p-4 rounded-xl border border-[var(--border-color)] shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Name<span className="text-red-500">*</span></label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter item name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Type<span className="text-red-500">*</span></label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Service">Service</option>
                            <option value="Product">Product</option>
                            <option value="Medication">Medication</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Cost</label>
                        <Input
                            name="cost"
                            type="number"
                            value={formData.cost}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Profit Margin (%)</label>
                        <Input
                            name="profitMargin"
                            readOnly
                            value={formData.profitMargin}
                            className="bg-gray-100 dark:bg-gray-800 text-[var(--dashboard-text-light)] border-[var(--border-color)] cursor-not-allowed"
                            placeholder="Auto-calculated"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Price<span className="text-red-500">*</span></label>
                        <Input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Branch</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select branch</option>
                            <option value="Main">Main Clinic</option>
                        </select>
                        <p className="text-xs text-[var(--dashboard-text-light)]">Select if this item is specific to one branch.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select category</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Tax Rate</label>
                        <select
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select tax rate</option>
                            <option value="None">None</option>
                            <option value="VAT">VAT (15%)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Tags</label>
                        <div className="flex gap-2">
                            {/* Simple implementation of tags view */}
                            {formData.tags && (
                                <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                    {formData.tags} <button type="button" className="ml-1 hover:text-pink-900">×</button>
                                </span>
                            )}
                            <Input
                                name="tags"
                                placeholder="Add tags (press Enter)"
                                className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] flex-1"
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })} // Simplified
                                value={formData.tags}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Track Stock</label>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Enable to manage inventory levels.</p>
                        </div>
                        <Switch checked={formData.trackStock} onCheckedChange={(c) => handleSwitchChange('trackStock', c)} />
                    </div>

                    {formData.trackStock && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Initial Stock</label>
                                <Input
                                    name="initialStock"
                                    type="number"
                                    value={formData.initialStock}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Reorder Level</label>
                                <Input
                                    name="reorderLevel"
                                    type="number"
                                    value={formData.reorderLevel}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                />
                                <p className="text-xs text-[var(--dashboard-text-light)]">Stock level at which to reorder.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">SKU</label>
                        <Input
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Barcode</label>
                        <Input
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            placeholder="Enter barcode"
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Manufacturer</label>
                        <Input
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            placeholder="Enter manufacturer"
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Duration (min)</label>
                        <Input
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                        <p className="text-xs text-[var(--dashboard-text-light)]">For services or time-limited products.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">Description</label>
                    <textarea
                        name="description"
                        className="flex min-h-[80px] w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--dashboard-text)] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Active</label>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Set the active status of this item.</p>
                        </div>
                        <Switch checked={formData.active} onCheckedChange={(c) => handleSwitchChange('active', c)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/billable-items')}
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        {isEditMode ? 'Update Item' : 'Create Item'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BillableItemForm;
