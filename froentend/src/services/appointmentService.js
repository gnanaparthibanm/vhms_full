import apiClient from '../lib/api';

export const appointmentService = {
  // Appointments
  getAllAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/appointment${queryString ? `?${queryString}` : ''}`);
  },

  getAppointmentById: async (id) => {
    return await apiClient.get(`/hms/appointments/appointment/${id}`);
  },

  createAppointment: async (appointmentData) => {
    return await apiClient.post('/hms/appointments/appointment', appointmentData);
  },

  updateAppointment: async (id, appointmentData) => {
    return await apiClient.put(`/hms/appointments/appointment/${id}`, appointmentData);
  },

  deleteAppointment: async (id) => {
    return await apiClient.delete(`/hms/appointments/appointment/${id}`);
  },

  // Doctor Schedules
  getDoctorSchedules: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/doctor-schedule${queryString ? `?${queryString}` : ''}`);
  },

  createDoctorSchedule: async (scheduleData) => {
    return await apiClient.post('/hms/appointments/doctor-schedule', scheduleData);
  },
  
  updateDoctorSchedule: async (id, scheduleData) => {
    return await apiClient.put(`/hms/appointments/doctor-schedule/${id}`, scheduleData);
  },

  // Pet Vitals
  getPetVitals: async (petId) => {
    return await apiClient.get(`/hms/appointments/petvitals/${petId}`);
  },

  createPetVitals: async (vitalsData) => {
    return await apiClient.post('/hms/appointments/petvitals', vitalsData);
  },

  // Clinical Notes
  getClinicalNotes: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/petclinicalnotes/${appointmentId}`);
  },

  createClinicalNote: async (noteData) => {
    return await apiClient.post('/hms/appointments/petclinicalnotes', noteData);
  },

  // Diagnosis
  getDiagnosis: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/diagnosis/${appointmentId}`);
  },

  createDiagnosis: async (diagnosisData) => {
    return await apiClient.post('/hms/appointments/diagnosis', diagnosisData);
  },

  // Prescriptions
  getPrescriptions: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/prescriptions`);
  },

  createPrescription: async (prescriptionData) => {
    return await apiClient.post('/hms/appointments/prescriptions', prescriptionData);
  },

  // Treatments
  getTreatments: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/treatments`);
  },

  createTreatment: async (treatmentData) => {
    return await apiClient.post('/hms/appointments/treatments', treatmentData);
  },

  // Procedures
  getProcedures: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/procedures`);
  },

  createProcedure: async (procedureData) => {
    return await apiClient.post('/hms/appointments/procedures', procedureData);
  },

  // Vaccinations
  getVaccinations: async (petId) => {
    return await apiClient.get(`/hms/appointments/vaccinations/${petId}`);
  },

  createVaccination: async (vaccinationData) => {
    return await apiClient.post('/hms/appointments/vaccinations', vaccinationData);
  },

  // Follow-ups
  getFollowUps: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/followups`);
  },

  createFollowUp: async (followUpData) => {
    return await apiClient.post('/hms/appointments/followups', followUpData);
  },

  // Grooming
  getGroomingServices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/grooming${queryString ? `?${queryString}` : ''}`);
  },

  createGroomingService: async (groomingData) => {
    return await apiClient.post('/hms/appointments/grooming', groomingData);
  },
};

export default appointmentService;
