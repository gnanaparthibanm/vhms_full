import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { petService } from '../../services/petService';
import { clientService } from '../../services/clientService';

const AddPet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const clientIdFromState = location.state?.clientId || '';
    const clientNameFromState = location.state?.clientName || '';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [showClientSearch, setShowClientSearch] = useState(!clientIdFromState);
    const [clientSearchQuery, setClientSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        client_id: clientIdFromState,
        name: '',
        pet_type: 'Dog',
        breed: '',
        dob: '',
        age: '',
        weight: '',
        pet_color: '',
        gender: 'Male',
        is_active: true
    });

    const [selectedClient, setSelectedClient] = useState(
        clientNameFromState ? { name: clientNameFromState, id: clientIdFromState } : null
    );

    // Fetch clients for selection
    useEffect(() => {
        if (!clientIdFromState) {
            fetchClients();
        }
    }, [clientIdFromState]);

    const fetchClients = async () => {
        try {
            const response = await clientService.getAllClients();
            const clientsData = response.data?.data || response.data || [];
            setClients(clientsData);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClientSelect = (client) => {
        setSelectedClient({ 
            name: `${client.first_name} ${client.last_name}`, 
            id: client.id 
        });
        setFormData(prev => ({ ...prev, client_id: client.id }));
        setShowClientSearch(false);
        setClientSearchQuery('');
    };

    const filteredClients = clients.filter(client => {
        const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
        const query = clientSearchQuery.toLowerCase();
        return fullName.includes(query) || client.email?.toLowerCase().includes(query);
    });

    const validateForm = () => {
        if (!formData.client_id) {
            setError('Please select a client (owner)');
            return false;
        }
        if (!formData.name || formData.name.length < 2) {
            setError('Pet name must be at least 2 characters');
            return false;
        }
        if (!formData.dob) {
            setError('Date of birth is required');
            return false;
        }
        if (!formData.age) {
            setError('Age is required');
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
                age: parseInt(formData.age),
                weight: formData.weight ? parseFloat(formData.weight) : undefined
            };
            
            await petService.createPet(payload);
            navigate('/patients');
        } catch (err) {
            console.error('Error creating pet:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create pet');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndAddAnother = async () => {
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                age: parseInt(formData.age),
                weight: formData.weight ? parseFloat(formData.weight) : undefined
            };
            
            await petService.createPet(payload);
            
            // Reset form for another pet but keep the same client
            setFormData({
                client_id: formData.client_id,
                name: '',
                pet_type: 'Dog',
                breed: '',
                dob: '',
                age: '',
                weight: '',
                pet_color: '',
                gender: 'Male',
                is_active: true
            });
            
            setError(null);
            alert('Pet created successfully! You can add another pet.');
        } catch (err) {
            console.error('Error creating pet:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create pet');
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
                            Add New Pet
                        </h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">
                            Create a new pet record for your client
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
                            {/* Client (Owner) Selection */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Client (Owner) <span className="text-red-500">*</span>
                                </label>
                                {selectedClient ? (
                                    <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                                        <span className="text-sm text-[var(--dashboard-text)] flex-1">{selectedClient.name}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedClient(null);
                                                setFormData(prev => ({ ...prev, client_id: '' }));
                                                setShowClientSearch(true);
                                            }}
                                            className="text-[var(--dashboard-text-light)] hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--dashboard-text-light)]" />
                                            <Input
                                                placeholder="Search clients by name or email..."
                                                value={clientSearchQuery}
                                                onChange={(e) => setClientSearchQuery(e.target.value)}
                                                onFocus={() => setShowClientSearch(true)}
                                                className="bg-[var(--card-bg)] !h-10 pl-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                            />
                                        </div>
                                        {showClientSearch && filteredClients.length > 0 && (
                                            <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)]">
                                                {filteredClients.map(client => (
                                                    <button
                                                        key={client.id}
                                                        onClick={() => handleClientSelect(client)}
                                                        className="w-full text-left px-4 py-2 hover:bg-[var(--dashboard-secondary)] text-sm text-[var(--dashboard-text)] border-b border-[var(--border-color)] last:border-b-0"
                                                    >
                                                        <div className="font-medium">{client.first_name} {client.last_name}</div>
                                                        <div className="text-xs text-[var(--dashboard-text-light)]">{client.email}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Pet Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="name"
                                    placeholder="Enter pet name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Pet Type (Species) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Pet Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="pet_type"
                                    value={formData.pet_type}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                                >
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Rabbit">Rabbit</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Breed */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Breed</label>
                                <Input
                                    name="breed"
                                    placeholder="Enter breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
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
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                    Age (years) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="age"
                                    type="number"
                                    placeholder="Enter age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
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

                            {/* Color */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Color</label>
                                <Input
                                    name="pet_color"
                                    placeholder="Enter color"
                                    value={formData.pet_color}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>

                            {/* Weight */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--dashboard-text)]">Weight (kg)</label>
                                <Input
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="Enter weight in kg"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="bg-[var(--card-bg)] !h-10 border-[var(--border-color)] text-[var(--dashboard-text)]"
                                />
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                            <div>
                                <div className="font-medium text-[var(--dashboard-text)]">Active Status</div>
                                <div className="text-sm text-[var(--dashboard-text-light)]">Set whether this pet is currently active</div>
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
                            onClick={handleSaveAndAddAnother}
                            disabled={loading}
                            className="bg-pink-500 text-white hover:bg-pink-600"
                        >
                            {loading ? 'Saving...' : 'Save & Add Another Pet'}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                        >
                            {loading ? 'Creating...' : 'Create Pet'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPet;
