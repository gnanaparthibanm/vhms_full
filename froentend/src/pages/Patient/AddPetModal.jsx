import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const AddPetModal = ({ isOpen, onClose, onSave, clientName = "" }) => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        dateOfBirth: '',
        gender: 'Unknown',
        color: '',
        microchipNumber: '',
        weight: '',
        allergies: '',
        client: clientName,
        active: true
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--card-bg)] z-10">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Add New Pet</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="name"
                                placeholder="Enter pet name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Species */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                Species <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="species"
                                placeholder="Select or type species..."
                                value={formData.species}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Breed */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Breed</label>
                            <Input
                                name="breed"
                                placeholder="Enter breed"
                                value={formData.breed}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="dateOfBirth"
                                type="date"
                                placeholder="dd-mm-yyyy"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                            >
                                <option value="Unknown">Unknown</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        {/* Microchip Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Microchip Number</label>
                            <Input
                                name="microchipNumber"
                                placeholder="Enter microchip number"
                                value={formData.microchipNumber}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Color */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Color</label>
                            <Input
                                name="color"
                                placeholder="Enter color"
                                value={formData.color}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Weight (kg)</label>
                            <Input
                                name="weight"
                                type="number"
                                placeholder="Enter weight in kg"
                                value={formData.weight}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Allergies */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Allergies</label>
                            <Input
                                name="allergies"
                                placeholder="Enter allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                            />
                        </div>

                        {/* Client (Owner) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[var(--dashboard-text)]">Client (Owner)</label>
                            <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                                <span className="text-sm text-[var(--dashboard-text)]">{formData.client || "No client selected"}</span>
                                {formData.client && (
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, client: '' }))}
                                        className="ml-auto text-[var(--dashboard-text-light)] hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)]">
                        <div>
                            <div className="font-medium text-[var(--dashboard-text)]">Active</div>
                            <div className="text-sm text-[var(--dashboard-text-light)]">Set the active status of this pet</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleSubmit();
                            // Keep modal open to add another pet
                            setFormData({
                                name: '',
                                species: '',
                                breed: '',
                                dateOfBirth: '',
                                gender: 'Unknown',
                                color: '',
                                microchipNumber: '',
                                weight: '',
                                allergies: '',
                                client: clientName,
                                active: true
                            });
                        }}
                        className="bg-pink-500 text-white hover:bg-pink-600"
                    >
                        Save & Add Another Pet
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                    >
                        Create Pet
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddPetModal;
