import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { billableItemService } from '../../services/billableItemService';
import { settingsService } from '../../services/settingsService';

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
        category: '',
        tax_rate: '',
        tags: '',
        stock_tracking: false,
        initial_stock: '',
        reorder_level: '',
        sku: '',
        barcode: '',
        manufacturer: '',
        duration: '',
        description: '',
        status: 'Active'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dynamic dropdown data
    const [categories, setCategories] = useState([]);
    const [taxRates, setTaxRates] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        fetchDropdownData();
        if (isEditMode) {
            fetchItem();
        }
    }, [isEditMode, id]);

    const fetchDropdownData = async () => {
        try {
            const [categoriesRes, taxRatesRes, discountsRes, paymentMethodsRes] = await Promise.all([
                settingsService.getAllCategories({ limit: 100 }),
                settingsService.getAllTaxRates({ limit: 100 }),
                settingsService.getAllDiscounts({ limit: 100 }),
                settingsService.getAllPaymentMethods({ limit: 100 })
            ]);

            setCategories(categoriesRes.data?.data || []);
            setTaxRates(taxRatesRes.data?.data || []);
            setDiscounts(discountsRes.data?.data || []);
            setPaymentMethods(paymentMethodsRes.data?.data || []);
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    const fetchItem = async () => {
        try {
            setIsLoading(true);
            const response = await billableItemService.getItemById(id);
            const item = response.data?.data || response.data;
            
            setFormData({
                name: item.name || '',
                type: item.type || 'Service',
                cost: item.cost || '',
                profitMargin: item.profit_margin || '',
                price: item.price || '',
                category: item.category || '',
                tax_rate: item.tax_rate || '',
                tags: item.tags || '',
                stock_tracking: item.stock_tracking || false,
                initial_stock: item.initial_stock || '',
                reorder_level: item.reorder_level || '',
                sku: item.sku || '',
                barcode: item.barcode || '',
                manufacturer: item.manufacturer || '',
                duration: item.duration || '',
                description: item.description || '',
                status: item.status || 'Active'
            });
        } catch (err) {
            console.error('Error fetching item:', err);
            setError('Failed to load item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            };
            
            // Auto-calculate profit margin when cost or price changes
            if ((name === 'cost' || name === 'price') && updated.cost && updated.price) {
                const cost = parseFloat(updated.cost);
                const price = parseFloat(updated.price);
                if (cost > 0) {
                    updated.profitMargin = (((price - cost) / cost) * 100).toFixed(2);
                }
            }
            
            return updated;
        });
    };

    const handleSwitchChange = (name, checked) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price) {
            alert('Please fill in required fields (Name and Price)');
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            const payload = {
                name: formData.name,
                type: formData.type,
                cost: parseFloat(formData.cost) || 0,
                price: parseFloat(formData.price),
                category: formData.category || null,
                tax_rate: formData.tax_rate || null,
                tags: formData.tags || null,
                stock_tracking: formData.stock_tracking,
                initial_stock: formData.stock_tracking ? parseInt(formData.initial_stock) || 0 : null,
                current_stock: formData.stock_tracking ? parseInt(formData.initial_stock) || 0 : null,
                reorder_level: formData.stock_tracking ? parseInt(formData.reorder_level) || 0 : null,
                sku: formData.sku || null,
                barcode: formData.barcode || null,
                manufacturer: formData.manufacturer || null,
                duration: formData.duration || null,
                description: formData.description || null,
                status: formData.status
            };
            
            if (isEditMode) {
                await billableItemService.updateItem(id, payload);
            } else {
                await billableItemService.createItem(payload);
            }
            
            navigate('/billable-items');
        } catch (err) {
            console.error('Error saving item:', err);
            setError(err.message || 'Failed to save item');
        } finally {
            setIsLoading(false);
        }
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
                    disabled={isLoading}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">
                        {isEditMode ? 'Edit Item' : 'Add New Item'}
                    </h1>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {isLoading && isEditMode ? (
                <div className="bg-[var(--card-bg)] md:p-8 p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                    <p className="text-center text-[var(--dashboard-text-light)]">Loading...</p>
                </div>
            ) : (
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
                            required
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
                            step="0.01"
                            value={formData.cost}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="0.00"
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
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select category</option>
                            {categories.filter(cat => cat.is_active).map((cat) => (
                                <option key={cat.id} value={cat.category_name}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">Tax Rate</label>
                        <select
                            name="tax_rate"
                            value={formData.tax_rate}
                            onChange={handleChange}
                            className="flex h-9 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1 text-sm shadow-sm transition-colors text-[var(--dashboard-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select tax rate</option>
                            {taxRates.filter(tax => tax.status === 'Active').map((tax) => (
                                <option key={tax.id} value={`${tax.rate}%`}>
                                    {tax.name} ({tax.rate}%)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">Tags</label>
                    <Input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        placeholder="Enter tags (comma separated)"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Track Stock</label>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Enable to manage inventory levels.</p>
                        </div>
                        <Switch checked={formData.stock_tracking} onCheckedChange={(c) => handleSwitchChange('stock_tracking', c)} />
                    </div>

                    {formData.stock_tracking && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Initial Stock</label>
                                <Input
                                    name="initial_stock"
                                    type="number"
                                    value={formData.initial_stock}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Reorder Level</label>
                                <Input
                                    name="reorder_level"
                                    type="number"
                                    value={formData.reorder_level}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                    placeholder="0"
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
                            placeholder="Auto-generated if blank"
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
                            placeholder="0"
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
                        <Switch 
                            checked={formData.status === 'Active'} 
                            onCheckedChange={(c) => setFormData(prev => ({ ...prev, status: c ? 'Active' : 'Inactive' }))} 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/billable-items')}
                        className="border-[var(--border-color)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : (isEditMode ? 'Update Item' : 'Create Item')}
                    </Button>
                </div>
            </form>
            )}
        </div>
    );
};

export default BillableItemForm;
