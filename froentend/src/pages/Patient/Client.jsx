import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Pets from "./Pets";
import ImportClientsModal from "./ImportClientsModal";
import FilterPanel from "../../components/common/FilterPanel";
import { clientService } from "../../services/clientService";

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

const Client = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Client");

  // API Integration State
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState("All Status");
  const [appliedFilter, setAppliedFilter] = useState("All Status");

  // Filter options
  const filterOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];

  // Fetch clients from backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getAllClients();
      const clientsData = response.data?.data || response.data || [];
      setClients(clientsData);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await clientService.deleteClient(id);
      fetchClients(); // Refresh list
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client');
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);

    if (!query) {
      fetchClients();
    } else {
      const filtered = clients.filter(client =>
        client.first_name?.toLowerCase().includes(query) ||
        client.last_name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.client_code?.toLowerCase().includes(query)
      );
      setClients(filtered);
    }
  };

  // Handler functions
  const handleImport = (file) => {
    console.log("Importing file:", file);
    // Add API call to import file
  };

  const handleApplyFilter = () => {
    setAppliedFilter(selectedFilter);
    setIsFilterPanelOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSelectedFilter("All Status");
    setAppliedFilter("All Status");
    setCurrentPage(1);
    fetchClients();
  };

  // Filter clients based on applied filter
  const filteredClients = appliedFilter === "All Status"
    ? clients
    : clients.filter(client =>
      appliedFilter === "Active" ? client.is_active : !client.is_active
    );

  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentAppointments = filteredClients.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
              Guardians and Pet Management
            </h1>
            <p className="text-sm text-[var(--dashboard-text-light)]">
              Manage guardians and their pets in one place
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              className="h-9 w-full sm:w-[300px] rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <Button
              onClick={() => setIsFilterPanelOpen(true)}
              className="h-9 rounded-md border border-[var(--border-color)] px-4 text-sm bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] hover:text-white"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => navigate(activeTab === "Pets" ? '/patients/add-pet' : '/patients/add-client')}
              className="h-9 rounded-md bg-[var(--dashboard-primary)] px-3 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
            >
              <Plus size={20} />
              {activeTab === "Pets" ? "Create New Pet" : "Create New"}
            </Button>
            {/* <Button
              onClick={() => setIsImportModalOpen(true)}
              className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
            >
              <Upload size={18} className="me-2" />
              Import
            </Button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex h-9 items-center rounded-lg bg-[var(--dashboard-secondary)] px-1 py-5 border border-[var(--border-color)]">
          {["Client", "Pets"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded-md transition-all shadow-none ${activeTab === tab
                ? "bg-[var(--dashboard-primary)] text-white shadow"
                : "text-[var(--dashboard-text-light)] hover:text-[var(--dashboard-text)] hover:bg-[var(--card-bg)]/50"
                }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Table */}
        {activeTab === "Client" && (
          <div>
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                  <p className="text-sm text-[var(--dashboard-text-light)]">Loading clients...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load clients</p>
                <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Button
                  onClick={fetchClients}
                  className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredClients.length === 0 && (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
                <p className="text-[var(--dashboard-text)] font-medium mb-2">No clients found</p>
                <p className="text-sm text-[var(--dashboard-text-light)] mb-4">
                  {searchQuery || appliedFilter !== "All Status"
                    ? "Try adjusting your filters or search query"
                    : "Get started by creating your first client"}
                </p>
                <Button
                  onClick={() => navigate("/patients/add-client")}
                  className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  <Plus size={16} className="mr-2" />
                  Create New
                </Button>
              </div>
            )}

            {/* Table View */}
            {!loading && !error && filteredClients.length > 0 && (
              <div>
                <div className="rounded-xl md:border border-[var(--border-color)] overflow-hidden md:bg-[var(--card-bg)] md:shadow-sm">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                        <tr>
                          {[
                            "Name",
                            "Phone",
                            "Email",
                            "City",
                            "Status",
                            "created At",
                            "Actions",
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
                        {currentAppointments.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors"
                          >
                            <td className="p-4 text-[var(--dashboard-text)]">
                              {item.first_name} {item.last_name}
                            </td>
                            <td className="p-4 text-[var(--dashboard-text)]">{item.phone || 'No phone'}</td>
                            <td className="p-4 text-[var(--dashboard-text)]">{item.email}</td>
                            <td className="p-4 text-[var(--dashboard-text)]">{item.address || 'Unknown'}</td>
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
                                  onClick={() => navigate(`/patients/update/${item.id}`, { state: { client: item } })}
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

                  {/* Mobile Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {currentAppointments.map((item) => (
                      <div key={item.id} className="bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-[var(--dashboard-text)]">{item.first_name} {item.last_name}</h3>
                            <p className="text-sm text-[var(--dashboard-text-light)] truncate overflow-hidden max-w-[180px]">{item.email}</p>
                          </div>
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                              item.is_active ? "Active" : "Inactive"
                            )}`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-[var(--dashboard-text)] mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--dashboard-text-light)]">Phone:</span>
                            <span className="font-medium text-right">{item.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--dashboard-text-light)]">City:</span>
                            <span className="font-medium text-right max-w-[150px] truncate">{item.address || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--dashboard-text-light)]">Created:</span>
                            <span className="font-medium text-right text-xs">
                              {new Date(item.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
                          <Button
                            onClick={() => navigate(`/patients/update/${item.id}`, { state: { client: item } })}
                            className="flex-1 h-9 rounded-md border border-[var(--border-color)] text-sm font-medium text-[var(--dashboard-text)] bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 h-9 rounded-md border border-red-200 dark:border-red-900/30 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
                  <div className="text-sm text-[var(--dashboard-text-light)]">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                  </div>

                  <div className="flex items-center space-x-2">
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
              </div>
            )}
          </div>
        )}

        {activeTab === "Pets" && <Pets clients={clients} />}

        <ImportClientsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />

        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          title="Filter Clients"
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </div>
    </div>
  );
};

export default Client;
