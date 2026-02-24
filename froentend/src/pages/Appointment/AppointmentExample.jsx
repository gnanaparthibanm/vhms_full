import { useState, useEffect } from 'react';
import { appointmentService } from '../../services';
import { useApi } from '../../hooks';

/**
 * Example component showing how to integrate with the backend API
 * This demonstrates fetching, creating, updating, and deleting appointments
 */
function AppointmentExample() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    doctorId: '',
    appointmentDate: '',
    reason: '',
    status: 'pending'
  });

  // Using the useApi hook for better state management
  const { 
    data: appointmentsData, 
    loading, 
    error, 
    execute: fetchAppointments 
  } = useApi(appointmentService.getAllAppointments);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (appointmentsData) {
      setAppointments(appointmentsData);
    }
  }, [appointmentsData]);

  const loadAppointments = async () => {
    try {
      await fetchAppointments({ status: 'all' });
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await appointmentService.createAppointment(formData);
      console.log('Appointment created:', response);
      
      // Refresh the list
      await loadAppointments();
      
      // Reset form
      setFormData({
        petId: '',
        doctorId: '',
        appointmentDate: '',
        reason: '',
        status: 'pending'
      });
      
      alert('Appointment created successfully!');
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await appointmentService.updateAppointment(id, {
        ...selectedAppointment,
        status: 'confirmed'
      });
      console.log('Appointment updated:', response);
      
      // Refresh the list
      await loadAppointments();
      setSelectedAppointment(null);
      
      alert('Appointment updated successfully!');
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await appointmentService.deleteAppointment(id);
      console.log('Appointment deleted');
      
      // Refresh the list
      await loadAppointments();
      
      alert('Appointment deleted successfully!');
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error Loading Appointments</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadAppointments}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Appointments (API Integration Example)</h1>

      {/* Create Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Appointment</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pet ID</label>
              <input
                type="text"
                name="petId"
                value={formData.petId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor ID</label>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Appointment Date</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Appointment
          </button>
        </form>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Appointments List</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Appointment #{appointment.id}</h3>
                    <p className="text-sm text-gray-600">Pet ID: {appointment.petId}</p>
                    <p className="text-sm text-gray-600">Doctor ID: {appointment.doctorId}</p>
                    <p className="text-sm text-gray-600">Date: {appointment.appointmentDate}</p>
                    <p className="text-sm text-gray-600">Reason: {appointment.reason}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(appointment.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentExample;
