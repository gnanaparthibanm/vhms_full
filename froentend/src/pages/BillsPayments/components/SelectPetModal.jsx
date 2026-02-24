import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const SelectPetModal = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock pet data
    const mockPets = [
        { id: 1, name: "Moana", code: "M26PXN6D", species: "cat", clientName: "Maricar Navales" },
        { id: 2, name: "Rose", code: "R26P9FJV", species: "dog", clientName: "Prasanth s" },
        { id: 3, name: "saqer", code: "S25PGKL6", species: "cat", clientName: "test" },
        { id: 4, name: "Bella", code: "B25PLFJZ", species: "dog", clientName: "Phos Yung" },
        { id: 5, name: "Harper", code: "H25PINHP", species: "dog", clientName: "mark" },
        { id: 6, name: "Harper", code: "H25PDQO7", species: "dog", clientName: "Isadora Gould" },
        { id: 7, name: "Chaney", code: "C25PZGPF", species: "rabbit", clientName: "Mariam Byrd" },
        { id: 8, name: "Dd", code: "D25P9GJG", species: "dog", clientName: "Russel Bling" },
        { id: 9, name: "uml", code: "U25PVN7F", species: "cat", clientName: "mark" },
        { id: 10, name: "Bruno", code: "B25PNTQC", species: "dog", clientName: "Russel Bling" },
    ];

    if (!isOpen) return null;

    const filteredPets = mockPets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-xl bg-[var(--card-bg)] shadow-lg border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Select Item</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        />
                    </div>

                    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--dashboard-secondary)] border-b border-[var(--border-color)] sticky top-0">
                                <tr>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Name</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Code</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Species</th>
                                    <th className="h-12 px-4 text-left font-medium text-[var(--dashboard-text-light)] text-xs">Client Name</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {filteredPets.map((pet) => (
                                    <tr
                                        key={pet.id}
                                        onClick={() => {
                                            onSelect(pet);
                                            onClose();
                                        }}
                                        className="cursor-pointer hover:bg-[var(--dashboard-secondary)] transition-colors"
                                    >
                                        <td className="p-4 text-[var(--dashboard-text)]">{pet.name}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{pet.code}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{pet.species}</td>
                                        <td className="p-4 text-[var(--dashboard-text-light)]">{pet.clientName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-sm text-[var(--dashboard-text-light)] text-center">
                        Showing 1 to 10 of 10 entries
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectPetModal;
