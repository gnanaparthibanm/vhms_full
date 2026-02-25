import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { petService } from "../../services/petService";

const statusClass = (status) => {
    switch (status) {
        case "Active":
            return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        case "Pending":
            return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
        case "Cancelled":
            return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
        default:
            return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
    }
};

const ITEMS_PER_PAGE = 10;

const Pets = ({ clients }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("Client");
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pets from backend
    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await petService.getAllPets();
            const responseData = response.data?.data || response.data;
            const petsArray = Array.isArray(responseData) ? responseData : responseData?.data;
            setPets(Array.isArray(petsArray) ? petsArray : []);
        } catch (err) {
            console.error('Error fetching pets:', err);
            setError(err.message || 'Failed to load pets');
        } finally {
            setLoading(false);
        }
    };

    // Delete pet
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pet?')) {
            return;
        }

        try {
            await petService.deletePet(id);
            fetchPets(); // Refresh list
        } catch (err) {
            console.error('Error deleting pet:', err);
            alert('Failed to delete pet');
        }
    };

    const totalItems = pets.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentPets = pets.slice(startIndex, endIndex);
    return (
        <div className="container mx-auto">
            <div className="space-y-4">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                            <p className="text-sm text-[var(--dashboard-text-light)]">Loading pets...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load pets</p>
                        <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={fetchPets}
                            className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && pets.length === 0 && (
                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
                        <p className="text-[var(--dashboard-text)] font-medium mb-2">No pets found</p>
                        <p className="text-sm text-[var(--dashboard-text-light)] mb-4">
                            Get started by adding your first pet
                        </p>
                        <Button
                            onClick={() => navigate("/patients/add-pet")}
                            className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                        >
                            <Plus size={16} className="mr-2" />
                            Add Pet
                        </Button>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && pets.length > 0 && (
                    <>
                        <div className="hidden lg:block">
                            <div className="rounded-xl border border-[var(--border-color)] overflow-x-auto bg-[var(--card-bg)] shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                                        <tr>
                                            {[
                                                "Pet Name",
                                                "Client Name",
                                                "Species",
                                                "Breed",
                                                "Age",
                                                "Status",
                                                "Created At",
                                                "Action",
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentPets.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors"
                                            >
                                                <td className="p-4 text-[var(--dashboard-text)]">{item.name}</td>
                                                {/* <td className="p-4 text-[var(--dashboard-text)]">{item.pet_code || 'N/A'}</td> */}
                                                <td className="p-4 text-[var(--dashboard-text)]">
                                                    {(() => {
                                                        const client = item.client || (clients && clients.find(c => c.id === item.client_id));
                                                        return client ? `${client.first_name || client.name || ''} ${client.last_name || ''}`.trim() : 'Unknown';
                                                    })()}
                                                </td>
                                                <td className="p-4 text-[var(--dashboard-text)]">{item.pet_type}</td>
                                                <td className="p-4 text-[var(--dashboard-text)]">{item.breed}</td>
                                                <td className="p-4 text-[var(--dashboard-text)]">{item.age || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span
                                                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                                            item.is_active ? "Active" : "Inactive"
                                                        )}`}
                                                    >
                                                        {item.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[var(--dashboard-text)]">
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => navigate(`/patients/update-pet/${item.id}`)}
                                                            className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="h-8 rounded-md border border-red-200 dark:border-red-900/30 px-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {currentPets.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm p-4 space-y-3"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-base font-semibold text-[var(--dashboard-text)]">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-[var(--dashboard-text-light)]">
                                                Code: {item.pet_code || 'N/A'}
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                                item.is_active ? "Active" : "Inactive"
                                            )}`}
                                        >
                                            {item.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                                Client
                                            </p>
                                            <p className="text-[var(--dashboard-text)]">
                                                {(() => {
                                                    const client = item.client || (clients && clients.find(c => c.id === item.client_id));
                                                    return client ? `${client.first_name || client.name || ''} ${client.last_name || ''}`.trim() : 'Unknown';
                                                })()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                                Species
                                            </p>
                                            <p className="text-[var(--dashboard-text)]">
                                                {item.pet_type}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                                Breed
                                            </p>
                                            <p className="text-[var(--dashboard-text)]">
                                                {item.breed}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                                Age
                                            </p>
                                            <p className="text-[var(--dashboard-text)]">
                                                {item.age || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div>
                                        <p className="text-xs uppercase text-[var(--dashboard-text-light)]">
                                            Created At
                                        </p>
                                        <p className="text-sm text-[var(--dashboard-text)]">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => navigate(`/patients/update-pet/${item.id}`)}
                                            className="flex-1 h-9 rounded-md border border-[var(--border-color)] text-xs text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
                            <div className="text-sm text-[var(--dashboard-text-light)] md:block hidden">
                                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                            </div>

                            <div className="flex items-center space-x-2 ms-auto md:ms-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <span className="text-sm text-[var(--dashboard-text-light)]">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Pets;
