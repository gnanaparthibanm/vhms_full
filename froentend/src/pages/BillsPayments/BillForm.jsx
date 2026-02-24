import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import SelectBranchModal from './components/SelectBranchModal';
import SelectPetModal from './components/SelectPetModal';
import SelectItemModal from './components/SelectItemModal';

const BillForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        branch: '',
        pet: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        billType: 'Sale',
        billStatus: 'Pending',
        manualEntry: false,
        notes: '',
        termsAndConditions: '',
    });

    const [items, setItems] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    const addItem = () => {
        setItems([...items, {
            id: Date.now(),
            name: '',
            qty: 1,
            price: 0,
            discount: 'Select discount',
            discountValue: 0,
            tax: 0,
            total: 0
        }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const addPayment = () => {
        setPayments([...payments, {
            id: Date.now(),
            method: 'Cash',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            status: 'Completed'
        }]);
    };

    const removePayment = (id) => {
        setPayments(payments.filter(payment => payment.id !== id));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    };

    const calculateTax = () => {
        return items.reduce((sum, item) => {
            const itemTotal = item.price * item.qty;
            return sum + (itemTotal * item.tax / 100);
        }, 0);
    };

    const calculateDiscount = () => {
        return items.reduce((sum, item) => sum + item.discountValue, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() - calculateDiscount();
    };

    const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const remaining = calculateTotal() - totalPaid;

    return (
        <div className="container mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">
                    {isEdit ? 'Edit Bill' : 'Create New Bill'}
                </h1>
            </div>

            <div className="space-y-6">
                {/* Bill Details */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--dashboard-text)] mb-4">Bill Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Branch *</label>
                            <div className="relative">
                                <Input
                                    value={formData.branch}
                                    onClick={() => setIsBranchModalOpen(true)}
                                    placeholder="Select a branch"
                                    readOnly
                                    className="cursor-pointer bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                />
                                {formData.branch && (
                                    <button
                                        onClick={() => setFormData({ ...formData, branch: '' })}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Select branch to load available items</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Pet</label>
                            <div className="relative">
                                <Input
                                    value={formData.pet}
                                    onClick={() => setIsPetModalOpen(true)}
                                    placeholder="Select a pet or Walk-in Customer"
                                    readOnly
                                    className="cursor-pointer bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                />
                                {formData.pet && (
                                    <button
                                        onClick={() => setFormData({ ...formData, pet: '' })}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-[var(--dashboard-text-light)]">Select a pet or leave blank for Walk-in Customer</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Due Date</label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                placeholder="dd-mm-yyyy"
                                className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Bill Type</label>
                            <Select value={formData.billType} onValueChange={(value) => setFormData({ ...formData, billType: value })}>
                                <SelectTrigger className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                    <SelectValue placeholder="Select bill type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sale">Sale</SelectItem>
                                    <SelectItem value="Service">Service</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Bill Status</label>
                            <div className="text-sm text-[var(--dashboard-text-light)]">
                                {formData.billStatus}
                                <p className="text-xs">Updated automatically based on payments</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manual Entry */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Manual Entry</h2>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={formData.manualEntry}
                            onClick={() => setFormData({ ...formData, manualEntry: !formData.manualEntry })}
                            className={`
                                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
                                ${formData.manualEntry ? 'bg-[var(--dashboard-primary)]' : 'bg-gray-200 dark:bg-gray-700'}
                            `}
                        >
                            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.manualEntry ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <p className="text-sm text-[var(--dashboard-text-light)] mt-2">Enable manual entry</p>
                </div>

                {/* Items */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--dashboard-text)] mb-4">Items</h2>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-7 gap-2 items-center pb-4 border-b border-[var(--border-color)]">
                                <div className="col-span-2">
                                    <Input
                                        value={item.name}
                                        placeholder="Item *"
                                        onClick={() => setIsItemModalOpen(true)}
                                        readOnly
                                        className="cursor-pointer bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                    />
                                </div>
                                <Input type="number" placeholder="Qty" value={item.qty} className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" />
                                <Input type="number" placeholder="Price" value={item.price} className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" />
                                <Input placeholder="Discount" value={item.discount} className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" />
                                <Input type="number" placeholder="Discount %" value={item.discountValue} className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" />
                                <Input type="number" placeholder="Tax" value={item.tax} className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" />
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button onClick={addItem} variant="outline" className="mt-4 border-[var(--border-color)] text-[var(--dashboard-text)]">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>

                    <div className="mt-6 flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[var(--dashboard-text-light)]">Subtotal:</span>
                                <span className="font-medium text-[var(--dashboard-text)]">₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--dashboard-text-light)]">Tax:</span>
                                <span className="font-medium text-[var(--dashboard-text)]">₹{calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--dashboard-text-light)]">Discount:</span>
                                <span className="font-medium text-[var(--dashboard-text)]">₹{calculateDiscount().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-[var(--border-color)]">
                                <span className="font-semibold text-[var(--dashboard-text)]">Total:</span>
                                <span className="font-bold text-[var(--dashboard-text)]">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Payments</h2>
                        <Button onClick={addPayment} variant="outline" size="sm" className="border-[var(--border-color)] text-[var(--dashboard-text)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment
                        </Button>
                    </div>

                    {payments.length === 0 ? (
                        <p className="text-center text-[var(--dashboard-text-light)] py-8">No payments recorded</p>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment.id} className="grid grid-cols-5 gap-2 items-center pb-4 border-b border-[var(--border-color)]">
                                    <Select value={payment.method} onValueChange={(value) => {
                                        const updatedPayments = payments.map(p => p.id === payment.id ? { ...p, method: value } : p);
                                        setPayments(updatedPayments);
                                    }}>
                                        <SelectTrigger className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                            <SelectValue placeholder="Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={payment.amount}
                                        onChange={(e) => {
                                            const updatedPayments = payments.map(p => p.id === payment.id ? { ...p, amount: e.target.value } : p);
                                            setPayments(updatedPayments);
                                        }}
                                        className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                    />
                                    <Input
                                        type="date"
                                        value={payment.date}
                                        onChange={(e) => {
                                            const updatedPayments = payments.map(p => p.id === payment.id ? { ...p, date: e.target.value } : p);
                                            setPayments(updatedPayments);
                                        }}
                                        className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                                    />
                                    <Select value={payment.status} onValueChange={(value) => {
                                        const updatedPayments = payments.map(p => p.id === payment.id ? { ...p, status: value } : p);
                                        setPayments(updatedPayments);
                                    }}>
                                        <SelectTrigger className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <button onClick={() => removePayment(payment.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {payments.length > 0 && (
                        <div className="mt-6 flex justify-end">
                            <div className="w-64 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--dashboard-text-light)]">Total Paid:</span>
                                    <span className="font-medium text-[var(--dashboard-text)]">₹{totalPaid.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--dashboard-text-light)]">Pending:</span>
                                    <span className="font-medium text-[var(--dashboard-text)]">₹{Math.max(0, calculateTotal() - totalPaid).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--dashboard-text-light)]">Remaining:</span>
                                    <span className="font-medium text-[var(--dashboard-text)]">₹{remaining.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[var(--border-color)]">
                                    <span className="font-semibold text-[var(--dashboard-text)]">Payment Status:</span>
                                    <span className={`font-medium px-2 py-1 rounded text-xs ${remaining === 0 ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                                        }`}>
                                        {remaining === 0 ? 'Paid' : 'Partial'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Information */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--dashboard-text)] mb-4">Additional Information</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Add notes visible to staff only"
                                className="flex min-h-[100px] w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--dashboard-text)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Terms and Conditions</label>
                            <textarea
                                value={formData.termsAndConditions}
                                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                                placeholder="Add terms and conditions visible on invoice"
                                className="flex min-h-[100px] w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--dashboard-text)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/bills-payments')}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        {isEdit ? 'Update Bill' : 'Create Bill'}
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <SelectBranchModal
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
                onSelect={(branch) => setFormData({ ...formData, branch: branch.name })}
            />

            <SelectPetModal
                isOpen={isPetModalOpen}
                onClose={() => setIsPetModalOpen(false)}
                onSelect={(pet) => setFormData({ ...formData, pet: `${pet.name} - ${pet.code}` })}
            />

            <SelectItemModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                onSelect={(item) => {
                    // Update the last item in the list
                    const updatedItems = [...items];
                    updatedItems[updatedItems.length - 1] = {
                        ...updatedItems[updatedItems.length - 1],
                        name: item.name,
                        price: item.price,
                        qty: item.qty
                    };
                    setItems(updatedItems);
                }}
            />
        </div>
    );
};

export default BillForm;
