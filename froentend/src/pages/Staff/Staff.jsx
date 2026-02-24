import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { staffService } from "../../services/staffService";

const statusClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-[var(--dashboard-secondary)] text-[var(--dashboard-text-light)]";
  }
};

const Staff = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const navigate = useNavigate();
  
  // API Integration State
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all staff from backend
  useEffect(() => {
    fetchAllStaff();
  }, []);

  const fetchAllStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all staff roles in parallel
      const [doctors, nurses, receptionists, pharmacists, labTechs, accountants] = await Promise.all([
        staffService.getAllDoctors().catch(() => ({ data: { data: [] } })),
        staffService.getAllNurses().catch(() => ({ data: { data: [] } })),
        staffService.getAllReceptionists().catch(() => ({ data: { data: [] } })),
        staffService.getAllPharmacists().catch(() => ({ data: { data: [] } })),
        staffService.getAllLabTechnicians().catch(() => ({ data: { data: [] } })),
        staffService.getAllAccountants().catch(() => ({ data: { data: [] } }))
      ]);

      // Combine all staff with role information
      const allStaff = [
        ...(doctors.data?.data || []).map(d => ({ ...d, role: 'Doctor', roleType: 'doctor' })),
        ...(nurses.data?.data || []).map(n => ({ ...n, role: 'Nurse', roleType: 'nurse' })),
        ...(receptionists.data?.data || []).map(r => ({ ...r, role: 'Receptionist', roleType: 'receptionist' })),
        ...(pharmacists.data?.data || []).map(p => ({ ...p, role: 'Pharmacist', roleType: 'pharmacist' })),
        ...(labTechs.data?.data || []).map(l => ({ ...l, role: 'Lab Technician', roleType: 'lab_technician' })),
        ...(accountants.data?.data || []).map(a => ({ ...a, role: 'Accountant', roleType: 'accountant' }))
      ];

      setStaffList(allStaff);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError(err.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staff) => {
    if (!window.confirm(`Are you sure you want to delete ${staff.doctor_name || staff.nurse_name || 'this staff member'}?`)) {
      return;
    }

    try {
      // Call appropriate delete method based on role
      switch (staff.roleType) {
        case 'doctor':
          await staffService.deleteDoctor(staff.id);
          break;
        case 'nurse':
          await staffService.deleteNurse(staff.id);
          break;
        case 'receptionist':
          await staffService.deleteReceptionist(staff.id);
          break;
        case 'pharmacist':
          await staffService.deletePharmacist(staff.id);
          break;
        case 'lab_technician':
          await staffService.deleteLabTechnician(staff.id);
          break;
        case 'accountant':
          await staffService.deleteAccountant(staff.id);
          break;
      }
      
      fetchAllStaff(); // Refresh list
    } catch (err) {
      console.error('Error deleting staff:', err);
      alert('Failed to delete staff member');
    }
  };

  // Search and filter
  const filteredStaff = staffList.filter(staff => {
    const name = staff.doctor_name || staff.nurse_name || staff.receptionist_name || 
                 staff.pharmacist_name || staff.lab_technician_name || staff.accountant_name || '';
    const email = staff.doctor_email || staff.nurse_email || staff.receptionist_email || 
                  staff.pharmacist_email || staff.lab_technician_email || staff.accountant_email || '';
    
    const matchesSearch = searchQuery === '' || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || staff.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">

        {/* HEADER — EXACT SAME STYLE AS CLIENT */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--dashboard-text)]">
              Staff Management
            </h1>
            <p className="text-sm text-[var(--dashboard-text-light)]">
              Manage your hospital staff and their roles
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              className="h-9 w-full sm:w-[300px] rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-9 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] px-3 text-sm focus:border-[var(--dashboard-primary)]"
            >
              <option value="All">All Roles</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Accountant">Accountant</option>
            </select>
            <Button
              onClick={() => navigate("/staff/create")}
              className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
            >
              <Plus size={16} />
              Create Staff Member
            </Button>
          </div>
        </div>

        {/* TABLE — EXACT CLIENT STYLE */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)] mx-auto"></div>
                  <p className="text-sm text-[var(--dashboard-text-light)]">Loading staff...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-6 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load staff</p>
                <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Button 
                  onClick={fetchAllStaff}
                  className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredStaff.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-[var(--dashboard-text)] font-medium mb-2">No staff members found</p>
                <p className="text-sm text-[var(--dashboard-text-light)] mb-4">
                  {searchQuery || selectedRole !== 'All' 
                    ? "Try adjusting your filters or search query" 
                    : "Get started by creating your first staff member"}
                </p>
                <Button 
                  onClick={() => navigate("/staff/create")}
                  className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  <Plus size={16} className="mr-2" />
                  Create Staff Member
                </Button>
              </div>
            )}

            {/* Table View */}
            {!loading && !error && filteredStaff.length > 0 && (
              <>
                {/* ================= MOBILE VIEW ================= */}
                <div className="md:hidden space-y-3 p-3">
                  {filteredStaff.map((item, i) => {
                    const name = item.doctor_name || item.nurse_name || item.receptionist_name || 
                                 item.pharmacist_name || item.lab_technician_name || item.accountant_name;
                    const email = item.doctor_email || item.nurse_email || item.receptionist_email || 
                                  item.pharmacist_email || item.lab_technician_email || item.accountant_email;
                    const phone = item.doctor_phone || item.nurse_phone || item.receptionist_phone || 
                                  item.pharmacist_phone || item.lab_technician_phone || item.accountant_phone;
                    
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
                      >
                        <div className="flex justify-between">
                          <p className="font-semibold text-[var(--dashboard-text)]">
                            {name}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${statusClass(
                              item.is_active ? "Active" : "Inactive"
                            )}`}
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--dashboard-text-light)]">
                          Email: {email}
                        </p>

                        {phone && (
                          <p className="text-xs text-[var(--dashboard-text-light)]">
                            Phone: {phone}
                          </p>
                        )}

                        <p className="text-xs text-[var(--dashboard-text-light)]">
                          Role: {item.role}
                        </p>

                        <div className="flex gap-2 mt-3">
                          <Button 
                            onClick={() => navigate(`/staff/edit/${item.id}`, { state: { staff: item } })}
                            className="flex-1 h-8 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(item)}
                            className="flex-1 h-8 text-xs text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ================= DESKTOP VIEW ================= */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
                      <tr>
                        {[
                          "Name",
                          "Email",
                          "Phone",
                          "Role",
                          "Status",
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
                      {filteredStaff.map((item, i) => {
                        const name = item.doctor_name || item.nurse_name || item.receptionist_name || 
                                     item.pharmacist_name || item.lab_technician_name || item.accountant_name;
                        const email = item.doctor_email || item.nurse_email || item.receptionist_email || 
                                      item.pharmacist_email || item.lab_technician_email || item.accountant_email;
                        const phone = item.doctor_phone || item.nurse_phone || item.receptionist_phone || 
                                      item.pharmacist_phone || item.lab_technician_phone || item.accountant_phone;
                        
                        return (
                          <tr
                            key={i}
                            className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] transition-colors"
                          >
                            <td className="p-4 text-[var(--dashboard-text)]">{name}</td>
                            <td className="p-4 text-[var(--dashboard-text)]">{email}</td>
                            <td className="p-4 text-[var(--dashboard-text)]">{phone || 'N/A'}</td>

                            <td className="p-4">
                              <span className="inline-flex rounded-md px-2.5 py-1 text-xs font-bold border border-[var(--border-color)]">
                                {item.role}
                              </span>
                            </td>

                            <td className="p-4">
                              <span
                                className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(
                                  item.is_active ? "Active" : "Inactive"
                                )}`}
                              >
                                {item.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => navigate(`/staff/edit/${item.id}`, { state: { staff: item } })}
                                  className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs bg-[var(--card-bg)] hover:bg-[var(--dashboard-secondary)]"
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDelete(item)}
                                  className="h-8 rounded-md border border-red-200 px-3 text-xs text-red-600 bg-red-50 hover:bg-red-100"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ===== PAGINATION FOOTER ===== */}
                <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 text-sm text-[var(--dashboard-text-light)]">
                  <div>
                    Showing 1 to {filteredStaff.length} of {filteredStaff.length} entries
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Staff;
