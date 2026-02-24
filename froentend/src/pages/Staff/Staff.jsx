import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { staffService } from "../../services/staffService";
import { appointmentService } from "../../services/appointmentService";

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

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    start_time: '',
    end_time: '',
    weekoffday: 'Sunday',
    slot_duration_minutes: 30,
    location: '',
    is_active: true
  });

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

  // Handle doctor schedule
  const handleManageSchedule = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleModal(true);
    setScheduleLoading(true);

    try {
      // Fetch existing schedule for this doctor
      const response = await appointmentService.getDoctorSchedules({ doctor_id: doctor.id });
      const schedules = response.data?.data || response.data || [];
      
      if (schedules.length > 0) {
        // Doctor has existing schedule
        const schedule = schedules[0];
        setDoctorSchedule(schedule);
        setScheduleFormData({
          start_time: schedule.start_time || '',
          end_time: schedule.end_time || '',
          weekoffday: schedule.weekoffday || 'Sunday',
          slot_duration_minutes: schedule.slot_duration_minutes || 30,
          location: schedule.location || '',
          is_active: schedule.is_active !== false
        });
      } else {
        // No schedule exists
        setDoctorSchedule(null);
        setScheduleFormData({
          start_time: '',
          end_time: '',
          weekoffday: 'Sunday',
          slot_duration_minutes: 30,
          location: '',
          is_active: true
        });
      }
    } catch (err) {
      console.error('Error fetching doctor schedule:', err);
      setDoctorSchedule(null);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!scheduleFormData.start_time || !scheduleFormData.end_time || !scheduleFormData.location) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setScheduleLoading(true);
      
      const payload = {
        doctor_id: selectedDoctor.id,
        start_time: scheduleFormData.start_time + ':00', // Add seconds
        end_time: scheduleFormData.end_time + ':00',
        weekoffday: scheduleFormData.weekoffday,
        slot_duration_minutes: parseInt(scheduleFormData.slot_duration_minutes),
        location: scheduleFormData.location,
        is_active: scheduleFormData.is_active
      };

      if (doctorSchedule) {
        // Update existing schedule
        await appointmentService.updateDoctorSchedule(doctorSchedule.id, payload);
        alert('Schedule updated successfully!');
      } else {
        // Create new schedule
        await appointmentService.createDoctorSchedule(payload);
        alert('Schedule created successfully!');
      }

      setShowScheduleModal(false);
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setScheduleLoading(false);
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
                          {item.roleType === 'doctor' && (
                            <Button 
                              onClick={() => handleManageSchedule(item)}
                              className="flex-1 h-8 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              title="Manage Schedule"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule
                            </Button>
                          )}
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
                                {item.roleType === 'doctor' && (
                                  <Button 
                                    onClick={() => handleManageSchedule(item)}
                                    className="h-8 rounded-md border border-[var(--border-color)] px-3 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    title="Manage Schedule"
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </Button>
                                )}
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

      {/* Doctor Schedule Modal */}
      {showScheduleModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
            <h3 className="text-xl font-semibold text-[var(--dashboard-text)] mb-2">
              {doctorSchedule ? 'Edit Schedule' : 'Add Schedule'}
            </h3>
            <p className="text-sm text-[var(--dashboard-text-light)] mb-6">
              Doctor: {selectedDoctor.doctor_name}
            </p>

            {scheduleLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-primary)]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={scheduleFormData.start_time}
                      onChange={(e) => setScheduleFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="bg-[var(--card-bg)] border-[var(--border-color)]"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={scheduleFormData.end_time}
                      onChange={(e) => setScheduleFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="bg-[var(--card-bg)] border-[var(--border-color)]"
                    />
                  </div>

                  {/* Week Off Day */}
                  <div>
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">
                      Week Off Day <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleFormData.weekoffday}
                      onChange={(e) => setScheduleFormData(prev => ({ ...prev, weekoffday: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>

                  {/* Slot Duration */}
                  <div>
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">
                      Slot Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="5"
                      max="240"
                      value={scheduleFormData.slot_duration_minutes}
                      onChange={(e) => setScheduleFormData(prev => ({ ...prev, slot_duration_minutes: e.target.value }))}
                      className="bg-[var(--card-bg)] border-[var(--border-color)]"
                    />
                    <p className="text-xs text-[var(--dashboard-text-light)] mt-1">5-240 minutes</p>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-[var(--dashboard-text)]">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={scheduleFormData.location}
                      onChange={(e) => setScheduleFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Room 101, Building A"
                      className="bg-[var(--card-bg)] border-[var(--border-color)]"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)] bg-[var(--dashboard-secondary)]/30">
                  <div>
                    <div className="font-medium text-[var(--dashboard-text)]">Active Status</div>
                    <div className="text-sm text-[var(--dashboard-text-light)]">Enable or disable this schedule</div>
                  </div>
                  <button
                    onClick={() => setScheduleFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    className={`w-12 h-6 rounded-full relative transition ${
                      scheduleFormData.is_active ? "bg-pink-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                        scheduleFormData.is_active ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedDoctor(null);
                      setDoctorSchedule(null);
                    }}
                    disabled={scheduleLoading}
                    className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSchedule}
                    disabled={scheduleLoading}
                    className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                  >
                    {scheduleLoading ? 'Saving...' : (doctorSchedule ? 'Update Schedule' : 'Create Schedule')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
