import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { staffService } from "../../services/staffService";
import { hospitalService } from "../../services/hospitalService";

const CreateStaff = () => {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Modal states
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDesignationTitle, setNewDesignationTitle] = useState('');
  const [newDesignationDesc, setNewDesignationDesc] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [newDepartmentCode, setNewDepartmentCode] = useState('');
  // Fetch departments and designations
  useEffect(() => {
    fetchDepartmentsAndDesignations();
  }, []);

  const fetchDepartmentsAndDesignations = async () => {
    try {
      const [deptResponse, desigResponse] = await Promise.all([
        hospitalService.getAllDepartments().catch(() => ({ data: { data: [] } })),
        hospitalService.getAllDesignations().catch(() => ({ data: { data: [] } }))
      ]);

      setDepartments(deptResponse.data?.data || []);
      setDesignations(desigResponse.data?.data || []);
    } catch (err) {
      console.error('Error fetching departments/designations:', err);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    // Staff Profile Data
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Doctor',
    is_active: true,

    // Required Staff Profile Fields
    department_id: '',
    designation_id: '',
    date_of_joining: '',
    qualification: '',
    gender: 'Male',
    dob: '',
    address: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    },

    // Role-specific fields
    // Doctor
    specialties: [],
    consultation_fee: '',
    available_online: false,

    // Nurse
    license_no: '',
    skills: [],
    shift: '',

    // Receptionist
    counter_no: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested emergency_contact fields
    if (name.startsWith('emergency_contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergency_contact: {
          ...prev.emergency_contact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setShowDepartmentModal(true);
    } else {
      setFormData(prev => ({ ...prev, department_id: value }));
    }
  };

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setShowDesignationModal(true);
    } else {
      setFormData(prev => ({ ...prev, designation_id: value }));
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      alert('Please enter department name');
      return;
    }

    try {
      setModalLoading(true);
      const response = await hospitalService.createDepartment({
        name: newDepartmentName,
        code: newDepartmentCode
      });
      const newDept = response.data?.data || response.data;

      setDepartments(prev => [...prev, newDept]);
      setFormData(prev => ({ ...prev, department_id: newDept.id }));
      setNewDepartmentName('');
      setNewDepartmentCode('');
      setShowDepartmentModal(false);
    } catch (err) {
      console.error('Error creating department:', err);
      alert('Failed to create department');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateDesignation = async () => {
    if (!newDesignationTitle.trim()) {
      alert('Please enter designation title');
      return;
    }

    try {
      setModalLoading(true);
      const response = await hospitalService.createDesignation({ title: newDesignationTitle, description: newDesignationDesc });
      const newDesig = response.data?.data || response.data;

      setDesignations(prev => [...prev, newDesig]);
      setFormData(prev => ({ ...prev, designation_id: newDesig.id }));
      setNewDesignationTitle('');
      setNewDesignationDesc('');
      setShowDesignationModal(false);
    } catch (err) {
      console.error('Error creating designation:', err);
      alert('Failed to create designation');
    } finally {
      setModalLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.first_name || formData.first_name.length < 2) {
      setError('First name must be at least 2 characters');
      return false;
    }
    if (!formData.last_name) {
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
    if (!formData.department_id) {
      setError('Department is required');
      return false;
    }
    if (!formData.designation_id) {
      setError('Designation is required');
      return false;
    }
    if (!formData.date_of_joining) {
      setError('Date of joining is required');
      return false;
    }
    if (!formData.qualification) {
      setError('Qualification is required');
      return false;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.address) {
      setError('Address is required');
      return false;
    }
    if (!formData.emergency_contact.name || !formData.emergency_contact.relationship || !formData.emergency_contact.phone) {
      setError('Emergency contact details are required');
      return false;
    }

    // Role-specific validation
    if (formData.role === 'Doctor') {
      if (!formData.specialties.length) {
        setError('At least one specialty is required for doctors');
        return false;
      }
      if (!formData.consultation_fee) {
        setError('Consultation fee is required for doctors');
        return false;
      }
    }

    if (formData.role === 'Nurse') {
      if (!formData.license_no) {
        setError('License number is required for nurses');
        return false;
      }
      if (!formData.skills.length) {
        setError('At least one skill is required for nurses');
        return false;
      }
    }

    if (formData.role === 'Receptionist') {
      if (!formData.counter_no) {
        setError('Counter number is required for receptionists');
        return false;
      }
      if (!formData.shift) {
        setError('Shift is required for receptionists');
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare staff profile data
      const staffData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        department_id: formData.department_id,
        designation_id: formData.designation_id,
        date_of_joining: formData.date_of_joining,
        qualification: formData.qualification,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        emergency_contact: formData.emergency_contact
      };

      // Prepare user data
      const userData = {
        password: formData.password
      };

      // Prepare role-specific data and call appropriate method
      let payload = {};

      switch (formData.role) {
        case 'Doctor':
          payload = {
            doctor_name: `${formData.first_name} ${formData.last_name}`,
            doctor_email: formData.email,
            doctor_phone: formData.phone,
            specialties: formData.specialties,
            consultation_fee: parseFloat(formData.consultation_fee),
            available_online: formData.available_online,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createDoctor(payload);
          break;

        case 'Nurse':
          payload = {
            nurse_name: `${formData.first_name} ${formData.last_name}`,
            nurse_email: formData.email,
            nurse_phone: formData.phone,
            license_no: formData.license_no,
            skills: formData.skills,
            shift: formData.shift,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createNurse(payload);
          break;

        case 'Receptionist':
          payload = {
            receptionist_name: `${formData.first_name} ${formData.last_name}`,
            receptionist_email: formData.email,
            receptionist_phone: formData.phone,
            counter_no: formData.counter_no,
            shift: formData.shift,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createReceptionist(payload);
          break;

        case 'Pharmacist':
          payload = {
            pharmacist_name: `${formData.first_name} ${formData.last_name}`,
            pharmacist_email: formData.email,
            pharmacist_phone: formData.phone,
            license_no: formData.license_no,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createPharmacist(payload);
          break;

        case 'Lab Technician':
          payload = {
            labtech_name: `${formData.first_name} ${formData.last_name}`,
            labtech_email: formData.email,
            labtech_phone: formData.phone,
            license_no: formData.license_no,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createLabTechnician(payload);
          break;

        case 'Accountant':
          payload = {
            accountant_name: `${formData.first_name} ${formData.last_name}`,
            accountant_email: formData.email,
            accountant_phone: formData.phone,
            is_active: formData.is_active,
            staff: staffData,
            user: userData
          };
          await staffService.createAccountant(payload);
          break;

        default:
          throw new Error('Invalid role selected');
      }

      navigate('/staff');
    } catch (err) {
      console.error('Error creating staff:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--dashboard-text)]">
          Add New Staff Member
        </h1>
        <p className="text-sm text-[var(--dashboard-text-light)]">
          Create a new staff member with user account
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* PHOTO UPLOAD */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center space-y-3">
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <div className="w-28 h-28 md:w-40 md:h-40 mx-auto rounded-full bg-[var(--dashboard-secondary)] flex items-center justify-center overflow-hidden">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              className="w-full h-full object-cover"
              alt="Staff"
            />
          ) : (
            <span className="text-6xl">👤</span>
          )}
        </div>

        <Button
          onClick={() => fileRef.current.click()}
          className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-primary)] hover:text-white"
        >
          Change Photo
        </Button>

        <p className="text-sm text-[var(--dashboard-text-light)]">
          Recommended: Square image, max 5MB
        </p>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="last_name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">Phone</label>
          <Input
            name="phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* PASSWORD WITH ICON */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Initial Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create initial password"
              value={formData.password}
              onChange={handleChange}
              className="bg-[var(--card-bg)] border-[var(--border-color)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[var(--dashboard-text-light)] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* STAFF ROLE */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Staff Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleDepartmentChange}
            className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
            <option value="add_new" className="text-[var(--dashboard-primary)] font-semibold">+ Add New Department</option>
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Designation <span className="text-red-500">*</span>
          </label>
          <select
            name="designation_id"
            value={formData.designation_id}
            onChange={handleDesignationChange}
            className="w-full h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
          >
            <option value="">Select Designation</option>
            {designations.map(desig => (
              <option key={desig.id} value={desig.id}>{desig.title}</option>
            ))}
            <option value="add_new" className="text-[var(--dashboard-primary)] font-semibold">+ Add New Designation</option>
          </select>
        </div>

        {/* Date of Joining */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Date of Joining <span className="text-red-500">*</span>
          </label>
          <Input
            name="date_of_joining"
            type="date"
            value={formData.date_of_joining}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Qualification */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Qualification <span className="text-red-500">*</span>
          </label>
          <Input
            name="qualification"
            placeholder="MBBS, MD, etc."
            value={formData.qualification}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Gender */}
        <div>
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
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <Input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Address <span className="text-red-500">*</span>
          </label>
          <Input
            name="address"
            placeholder="Full address"
            value={formData.address}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Emergency Contact Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="emergency_contact.name"
            placeholder="Contact person name"
            value={formData.emergency_contact.name}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Emergency Contact Relationship */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Relationship <span className="text-red-500">*</span>
          </label>
          <Input
            name="emergency_contact.relationship"
            placeholder="Father, Mother, Spouse, etc."
            value={formData.emergency_contact.relationship}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Emergency Contact Phone */}
        <div>
          <label className="text-sm font-medium text-[var(--dashboard-text)]">
            Emergency Contact Phone <span className="text-red-500">*</span>
          </label>
          <Input
            name="emergency_contact.phone"
            placeholder="+1234567890"
            value={formData.emergency_contact.phone}
            onChange={handleChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)]"
          />
        </div>

        {/* Role-specific fields */}
        {formData.role === 'Doctor' && (
          <>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                Specialties <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Cardiology, Surgery (comma separated)"
                onChange={(e) => handleArrayInput('specialties', e.target.value)}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                Consultation Fee <span className="text-red-500">*</span>
              </label>
              <Input
                name="consultation_fee"
                type="number"
                placeholder="500"
                value={formData.consultation_fee}
                onChange={handleChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available_online"
                checked={formData.available_online}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-[var(--dashboard-text)]">Available Online</label>
            </div>
          </>
        )}

        {formData.role === 'Nurse' && (
          <>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                License Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="license_no"
                placeholder="LIC123456"
                value={formData.license_no}
                onChange={handleChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                Skills <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="IV Therapy, Patient Care (comma separated)"
                onChange={(e) => handleArrayInput('skills', e.target.value)}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">Shift</label>
              <Input
                name="shift"
                placeholder="Morning/Evening/Night"
                value={formData.shift}
                onChange={handleChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
          </>
        )}

        {formData.role === 'Receptionist' && (
          <>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                Counter Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="counter_no"
                placeholder="Counter 1"
                value={formData.counter_no}
                onChange={handleChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--dashboard-text)]">
                Shift <span className="text-red-500">*</span>
              </label>
              <Input
                name="shift"
                placeholder="Morning/Evening/Night"
                value={formData.shift}
                onChange={handleChange}
                className="bg-[var(--card-bg)] border-[var(--border-color)]"
              />
            </div>
          </>
        )}

        {(formData.role === 'Pharmacist' || formData.role === 'Lab Technician') && (
          <div>
            <label className="text-sm font-medium text-[var(--dashboard-text)]">
              License Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="license_no"
              placeholder="LIC123456"
              value={formData.license_no}
              onChange={handleChange}
              className="bg-[var(--card-bg)] border-[var(--border-color)]"
            />
          </div>
        )}
      </div>

      {/* ACTIVE TOGGLE */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-[var(--dashboard-text)]">Active Status</h3>
          <p className="text-sm text-[var(--dashboard-text-light)]">
            Inactive staff can't log in or access the system
          </p>
        </div>

        <button
          onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
          className={`w-12 h-6 rounded-full relative transition ${formData.is_active ? "bg-pink-500" : "bg-gray-300"
            }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${formData.is_active ? "left-7" : "left-1"
              }`}
          />
        </button>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <Button
          onClick={() => navigate("/staff")}
          disabled={loading}
          className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          disabled={loading}
          className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
        >
          {loading ? 'Creating...' : 'Create Staff'}
        </Button>
      </div>

      {/* Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full mx-4 border border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--dashboard-text)] mb-4">Add New Department</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  placeholder="Enter department name"
                  className="bg-[var(--card-bg)] border-[var(--border-color)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateDepartment()}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                  Department Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newDepartmentCode}
                  onChange={(e) => setNewDepartmentCode(e.target.value)}
                  placeholder="CARD, ORTHO, etc."
                  className="bg-[var(--card-bg)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setShowDepartmentModal(false);
                    setNewDepartmentName('');
                  }}
                  disabled={modalLoading}
                  className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDepartment}
                  disabled={modalLoading}
                  className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  {modalLoading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Designation Modal */}
      {showDesignationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full mx-4 border border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--dashboard-text)] mb-4">Add New Designation</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                  Designation Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newDesignationTitle}
                  onChange={(e) => setNewDesignationTitle(e.target.value)}
                  placeholder="Enter designation title"
                  className="bg-[var(--card-bg)] border-[var(--border-color)]"
                // onKeyPress={(e) => e.key === 'Enter' && handleCreateDesignation()}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--dashboard-text)]">
                  Designation Description <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newDesignationDesc}
                  onChange={(e) => setNewDesignationDesc(e.target.value)}
                  placeholder="Enter designation description"
                  className="bg-[var(--card-bg)] border-[var(--border-color)]"
                // onKeyPress={(e) => e.key === 'Enter' && handleCreateDesignation()}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setShowDesignationModal(false);
                    setNewDesignationTitle('');
                  }}
                  disabled={modalLoading}
                  className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDesignation}
                  disabled={modalLoading}
                  className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                >
                  {modalLoading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStaff;
