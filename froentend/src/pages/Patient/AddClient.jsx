import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import PhoneInput from '../../components/common/PhoneInput';
import { clientService } from '../../services/clientService';

const AddClient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        alternate_phone: '',
        email: '',
        city: '',
        address: '',
        notes: '',
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name || formData.name.length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const payload = { ...formData };
            if (payload.name) {
                const parts = payload.name.trim().split(/\s+/);
                payload.first_name = parts[0] || '';
                payload.last_name = parts.slice(1).join(' ') || '';
            }

            await clientService.createClient(payload);
            navigate('/patients');
        } catch (err) {
            console.error('Error creating client:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create client');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndAddPet = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const payload = { ...formData };
            if (payload.name) {
                const parts = payload.name.trim().split(/\s+/);
                payload.first_name = parts[0] || '';
                payload.last_name = parts.slice(1).join(' ') || '';
            }

            const response = await clientService.createClient(payload);
            const clientId = response.data?.client?.id || response.data?.id || response.data?.data?.id || response.data?.data?.client?.id;

            // Navigate to add pet page with client info
            navigate('/patients/add-pet', {
                state: {
                    clientId: clientId,
                    clientName: formData.name
                }
            });
        } catch (err) {
            console.error('Error creating client:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/patients')}
                        className="h-10 w-10 text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
                            Add New Client
                        </h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">
                            Create a new client record for your veterinary practice
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-sm">
                    {/* Error Message */}
                    {error && (
                        <div className="mx-6 mt-6 p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Phone</label>
                                <PhoneInput
                                    value={formData.phone}
                                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                    placeholder="Phone number"
                                    defaultCountry="91"
                                />
                            </div>

                            {/* Alternate Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Alternate Phone</label>
                                <PhoneInput
                                    value={formData.alternate_phone}
                                    onChange={(value) => setFormData(prev => ({ ...prev, alternate_phone: value }))}
                                    placeholder="Alternate phone number"
                                    defaultCountry="91"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">City</label>
                                <Input
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Address</label>
                                <Input
                                    name="address"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Notes</label>
                                <textarea
                                    name="notes"
                                    placeholder="Enter notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                />
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                            <div>
                                <div className="font-medium text-[var(--dashboard-text)]">Active</div>
                                <div className="text-sm text-[var(--dashboard-text-light)]">Set the active status of this client</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/patients')}
                            disabled={loading}
                            className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAndAddPet}
                            disabled={loading}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            {loading ? 'Saving...' : 'Save & Add Pet'}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                        >
                            {loading ? 'Creating...' : 'Create Client'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClient;
