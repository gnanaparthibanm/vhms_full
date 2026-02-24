import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import PhoneInput from '../../components/common/PhoneInput';
import { clientService } from '../../services/clientService';

const AddClient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        gender: 'Male',
        dob: '',
        age: '',
        address: '',
        blood_group: 'O+',
        marital_status: 'Single',
        notes: '',
        is_active: true,
        password: '' // Add password field
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.first_name || formData.first_name.length < 2) {
            setError('First name must be at least 2 characters');
            return false;
        }
        if (!formData.last_name || formData.last_name.length < 1) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Valid email is required');
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!formData.dob) {
            setError('Date of birth is required');
            return false;
        }
        if (!formData.address || formData.address.length < 5) {
            setError('Address must be at least 5 characters');
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
            const payload = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : undefined,
                user: {
                    password: formData.password
                }
            };
            
            // Remove password from top level
            delete payload.password;
            
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
            const payload = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : undefined,
                user: {
                    password: formData.password
                }
            };
            
            // Remove password from top level
            delete payload.password;
            
            const response = await clientService.createClient(payload);
            const clientId = response.data?.id || response.data?.data?.id;
            
            // Navigate to add pet page with client info
            navigate('/patients/add-pet', { 
                state: { 
                    clientId: clientId,
                    clientName: `${formData.first_name} ${formData.last_name}` 
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
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="last_name"
                                    placeholder="Enter last name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create password (min 6 characters)"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)]"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-[var(--dashboard-text-light)]">
                                    This will be used for client login
                                </p>
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

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Age</label>
                                <Input
                                    name="age"
                                    type="number"
                                    placeholder="Enter age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Blood Group */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Blood Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="blood_group"
                                    value={formData.blood_group}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            {/* Marital Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Marital Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="marital_status"
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>

                            {/* Address */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="address"
                                    placeholder="Enter full address"
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
                                    placeholder="Enter any additional notes"
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
                                <div className="font-medium text-[var(--dashboard-text)]">Active Status</div>
                                <div className="text-sm text-[var(--dashboard-text-light)]">Set whether this client is currently active</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
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
                            className="bg-pink-500 text-white hover:bg-pink-600"
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
