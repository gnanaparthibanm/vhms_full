import React, { useState, useEffect } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { appointmentService } from "../../services/appointmentService"
import { clientService } from "../../services/clientService"
import { petService } from "../../services/petService"
import { staffService } from "../../services/staffService"

const CreateAppointment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id
    const isUpdatePage = location.pathname.includes("update")
    const pageTitle = isUpdatePage ? "Update Appointment" : "Create Appointment"

    // Form state
    const [formData, setFormData] = useState({
        client_id: "",
        pet_id: "",
        doctor_id: "",
        scheduled_at: "",
        scheduled_time: "",
        visit_type: "OPD",
        status: "Pending",
        reason: "",
        notes: "",
        appointment_type: "Consultation",
    })

    useEffect(() => {
        if (isEditMode && location.state?.appoint) {
            const appointmentData = location.state.appoint;
            console.log(appointmentData);

            const dateParts = appointmentData.scheduled_at
                ? appointmentData.scheduled_at.split("-")
                : null; // ["2026","02","26"]
            const day = dateParts ? parseInt(dateParts[2], 10) : null;

            setSelectedDate(day); // Highlight the date in calendar
            setSelectedTime(appointmentData.scheduled_time); // Highlight the time slot

            setFormData(prev => ({
                ...prev,
                client_id: appointmentData.client_id || "",
                pet_id: appointmentData.pet_id || "",
                doctor_id: appointmentData.doctor_id || appointmentData.doctor?.id || "",
                scheduled_at: appointmentData.scheduled_at || "",
                scheduled_time: appointmentData.scheduled_time || "",
                visit_type: appointmentData.visit_type || "OPD",
                status: appointmentData.status || "Pending",
                reason: appointmentData.reason || "",
                notes: appointmentData.notes || "",
                appointment_type: appointmentData.appointment_type || "Consultation",
            }));

            // Fetch pets for the client
            if (appointmentData.client_id) {
                fetchPetsByClient(appointmentData.client_id);
            }

            // Fetch available slots for this doctor and date
            if (appointmentData.doctor_id && dateParts) {
                const date = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1], 10) - 1,
                    parseInt(dateParts[2], 10)
                );
                fetchAvailableSlots(date, appointmentData.doctor_id);
            }
        } else if (!isEditMode && location.state?.appointmentFormData) {
            const appointmentData = location.state.appointmentFormData;
            const newClientId = location.state.newClientId;
            const newPetId = location.state.newPetId;

            const dateParts = appointmentData.scheduled_at
                ? appointmentData.scheduled_at.split("-")
                : null;
            const day = dateParts ? parseInt(dateParts[2], 10) : null;

            setSelectedDate(day);
            setSelectedTime(appointmentData.scheduled_time);

            const finalClientId = newClientId || appointmentData.client_id || "";
            const finalPetId = newPetId || appointmentData.pet_id || "";

            setFormData(prev => ({
                ...prev,
                client_id: finalClientId,
                pet_id: finalPetId,
                doctor_id: appointmentData.doctor_id || "",
                scheduled_at: appointmentData.scheduled_at || "",
                scheduled_time: appointmentData.scheduled_time || "",
                visit_type: appointmentData.visit_type || "OPD",
                status: appointmentData.status || "Pending",
                reason: appointmentData.reason || "",
                notes: appointmentData.notes || "",
                appointment_type: appointmentData.appointment_type || "Consultation",
            }));

            if (finalClientId) {
                fetchPetsByClient(finalClientId);
            }

            if (appointmentData.doctor_id && dateParts) {
                const date = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1], 10) - 1,
                    parseInt(dateParts[2], 10)
                );
                fetchAvailableSlots(date, appointmentData.doctor_id);
            }
        }
    }, [isEditMode, location.state]);

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [clients, setClients] = useState([])
    const [pets, setPets] = useState([])
    const [doctors, setDoctors] = useState([])
    const [availableSlots, setAvailableSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    const today = new Date()
    const currentDay = today.getDate()
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState("")

    const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1)
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Fetch initial data
    useEffect(() => {
        fetchClients()
        fetchDoctors()
        if (isUpdatePage && id) {
            fetchAppointment()
        }
    }, [id, isUpdatePage])

    // Fetch clients
    const fetchClients = async () => {
        try {
            const response = await clientService.getAllClients()
            setClients(response.data?.data || response.data || [])
        } catch (err) {
            console.error('Error fetching clients:', err)
        }
    }

    // Fetch doctors
    const fetchDoctors = async () => {
        try {
            const response = await staffService.getAllDoctors()
            setDoctors(response.data?.data || response.data || [])
        } catch (err) {
            console.error('Error fetching doctors:', err)
        }
    }

    // Fetch pets when client is selected
    const fetchPetsByClient = async (clientId) => {
        try {
            const response = await petService.getPetsByClient(clientId)
            setPets(response.data?.data || response.data || [])
        } catch (err) {
            console.error('Error fetching pets:', err)
            setPets([])
        }
    }

    // Fetch appointment for update
    const fetchAppointment = async () => {
        try {
            setLoading(true)
            const response = await appointmentService.getAppointmentById(id)
            const appointment = response.data
            setFormData({
                client_id: appointment.client_id || "",
                pet_id: appointment.pet_id || "",
                doctor_id: appointment.doctor_id || "",
                scheduled_at: appointment.scheduled_at || "",
                scheduled_time: appointment.scheduled_time || "",
                visit_type: appointment.visit_type || "OPD",
                status: appointment.status || "Pending",
                reason: appointment.reason || "",
                notes: appointment.notes || "",
                appointment_type: appointment.appointment_type || "Consultation",
            })
            if (appointment.client_id) {
                fetchPetsByClient(appointment.client_id)
            }
        } catch (err) {
            setError('Failed to load appointment')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.client_id || !formData.doctor_id || !formData.scheduled_at || !formData.scheduled_time) {
            setError('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)
            setError(null)

            if (isEditMode && id) {
                await appointmentService.updateAppointment(id, formData)
                alert('Appointment updated successfully!')
            } else {
                await appointmentService.createAppointment(formData)
                alert('Appointment created successfully!')
            }

            navigate('/appointments')
        } catch (err) {
            setError(err.message || 'Failed to save appointment')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Handle date selection
    const handleDateSelect = (day) => {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const localDateString = `${year}-${month}-${formattedDay}`;

        const date = new Date(year, today.getMonth(), day)
        setSelectedDate(day)
        setFormData(prev => ({
            ...prev,
            scheduled_at: localDateString
        }))
        // Fetch available slots for selected date and doctor
        if (formData.doctor_id) {
            fetchAvailableSlots(date, formData.doctor_id)
        }
    }

    // Helper: Convert time string to minutes
    const timeToMinutes = (time) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    // Helper: Convert minutes to HH:MM:SS format
    const minutesToTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0')
        const m = (minutes % 60).toString().padStart(2, '0')
        return `${h}:${m}:00`
    }

    // Fetch available time slots based on doctor schedule
    const fetchAvailableSlots = async (date, doctorId) => {
        try {
            setLoadingSlots(true)

            // Get doctor's schedule
            const scheduleResponse = await appointmentService.getDoctorSchedules({
                doctor_id: doctorId
            })

            const schedules = scheduleResponse.data?.data || []
            if (schedules.length === 0) {
                setAvailableSlots([])
                return
            }

            const schedule = schedules[0]

            // Check if selected date is doctor's week off day
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' })
            if (schedule.weekoffday === dayOfWeek) {
                setAvailableSlots([])
                return
            }

            // Generate time slots based on schedule, excluding lunch break
            const startMinutes = timeToMinutes(schedule.start_time)
            const endMinutes = timeToMinutes(schedule.end_time)
            const slotDuration = schedule.slot_duration_minutes
            const lunchStartMinutes = schedule.lunch_start_time ? timeToMinutes(schedule.lunch_start_time) : null
            const lunchEndMinutes = schedule.lunch_end_time ? timeToMinutes(schedule.lunch_end_time) : null

            const allSlots = []
            for (let t = startMinutes; t + slotDuration <= endMinutes; t += slotDuration) {
                const slotMinutes = t
                const slotEndMinutes = slotMinutes + slotDuration

                // Skip slots that fall within lunch break
                if (lunchStartMinutes !== null && lunchEndMinutes !== null) {
                    if (slotMinutes < lunchEndMinutes && slotEndMinutes > lunchStartMinutes) {
                        continue // Skip this slot as it overlaps with lunch
                    }
                }

                allSlots.push(minutesToTime(t))
            }

            // Fetch existing appointments for this doctor on this date
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');
            const localDateString = `${yearStr}-${monthStr}-${dayStr}`;

            const appointmentsResponse = await appointmentService.getAllAppointments({
                doctor_id: doctorId,
                scheduled_at: localDateString
            })

            const appointments = appointmentsResponse.data?.data?.data || appointmentsResponse.data?.data || []

            // Extract booked times and normalize format to HH:MM:SS
            const bookedTimes = appointments
                .filter(apt => apt.status !== 'Cancelled')
                .map(apt => {
                    const time = apt.scheduled_time;
                    // Ensure time is in HH:MM:SS format
                    if (time && time.split(':').length === 2) {
                        return time + ':00'; // Add seconds if missing
                    }
                    return time;
                })
                .filter(time => time); // Remove null/undefined values

            console.log('Generated slots:', allSlots);
            console.log('Booked times:', bookedTimes);

            // Filter out booked slots
            const availableSlots = allSlots.filter(slot => {
                // Allow currently selected time in edit mode
                if (isEditMode && slot === formData.scheduled_time) {
                    return true
                }
                return !bookedTimes.includes(slot)
            })

            console.log('Available slots after filtering:', availableSlots);

            setAvailableSlots(availableSlots)
        } catch (err) {
            console.error('Error fetching slots:', err)
            setAvailableSlots([])
        } finally {
            setLoadingSlots(false)
        }
    }

    // Handle time selection
    const handleTimeSelect = (time) => {
        setSelectedTime(time)
        // Ensure time is in HH:MM:SS format
        const formattedTime = time.includes(':') && time.split(':').length === 3
            ? time
            : `${time}:00`
        setFormData(prev => ({
            ...prev,
            scheduled_time: formattedTime
        }))
    }

    return (
        <div className="mx-auto bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-[var(--dashboard-text)] mb-6">
                {pageTitle}
            </h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Row 1 */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Doctor *</Label>
                        <Select
                            value={formData.doctor_id}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, doctor_id: value }))
                                if (selectedDate) {
                                    const date = new Date(today.getFullYear(), today.getMonth(), selectedDate)
                                    fetchAvailableSlots(date, value)
                                }
                            }}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doctor => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                        {doctor.doctor_name || doctor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Client *</Label>
                            <span
                                onClick={() => navigate('/patients/add-client', {
                                    state: { returnTo: '/appointments/create', appointmentFormData: formData }
                                })}
                                className="text-xs text-[var(--dashboard-primary)] font-medium cursor-pointer hover:underline"
                            >
                                + Add New
                            </span>
                        </div>
                        <Select
                            value={formData.client_id}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, client_id: value, pet_id: "" }))
                                fetchPetsByClient(value)
                            }}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.first_name} {client.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Pet (Optional)</Label>
                        <Select
                            value={formData.pet_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, pet_id: value }))}
                            disabled={!formData.client_id}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select pet" />
                            </SelectTrigger>
                            <SelectContent>
                                {pets.map(pet => (
                                    <SelectItem key={pet.id} value={pet.id}>
                                        {pet.name} ({pet.breed} - {pet.pet_type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Select Date *</Label>

                        <Card className={`p-4 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]
                            ${!formData.doctor_id ? "opacity-50 pointer-events-none" : ""}`}>
                            <div className="flex justify-between items-center mb-4">
                                <Button variant="ghost" size="icon" type="button">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <span className="font-semibold text-sm ">
                                    February 2026
                                </span>

                                <Button variant="ghost" size="icon" type="button">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 text-center">
                                {weekDays.map((day) => (
                                    <span
                                        key={day}
                                        className="text-xs text-muted-foreground font-medium"
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 items-center">
                                {daysInMonth.map((day) => {
                                    const isPast = day < currentDay
                                    const isSelected = selectedDate === day
                                    return (
                                        <Button
                                            key={day}
                                            type="button"
                                            variant="ghost"
                                            disabled={isPast}
                                            onClick={() => !isPast && handleDateSelect(day)}
                                            className={`
        h-8 p-0 text-sm transition-colors
        ${isSelected
                                                    ? "bg-[var(--dashboard-primary)] text-white"
                                                    : "hover:bg-[var(--dashboard-primary)]"
                                                }
        ${isPast ? "opacity-40 cursor-not-allowed hover:bg-transparent " : ""}
      `}
                                        >
                                            {day}
                                        </Button>
                                    )
                                })}
                            </div>
                        </Card>

                        {!formData.doctor_id && (
                            <p className="text-sm text-destructive">
                                Please select a doctor first
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Available Time Slots *</Label>

                        <Card className="h-[260px] flex flex-col items-start px-5 justify-start bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                            {!formData.doctor_id && (
                                <div className="flex flex-col items-center justify-center h-full opacity-50 w-full">
                                    <CalendarIcon className="h-10 w-10 mb-2" />
                                    <p>Please select a doctor first</p>
                                </div>
                            )}

                            {formData.doctor_id && !selectedDate && (
                                <div className="flex flex-col items-center justify-center h-full opacity-50 w-full">
                                    <CalendarIcon className="h-10 w-10 mb-2" />
                                    <p>Please select a date</p>
                                </div>
                            )}

                            {formData.doctor_id && selectedDate && loadingSlots && (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-primary)]"></div>
                                    <p className="mt-2 text-sm">Loading slots...</p>
                                </div>
                            )}

                            {formData.doctor_id && selectedDate && !loadingSlots && availableSlots.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <p className="text-sm text-[var(--dashboard-text-light)]">No available slots</p>
                                </div>
                            )}

                            {formData.doctor_id && selectedDate && !loadingSlots && availableSlots.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 py-4 w-full overflow-y-auto max-h-[220px]">
                                    {availableSlots.map((slot) => {
                                        // Display time without seconds for better UX
                                        const displayTime = slot.substring(0, 5) // HH:MM
                                        return (
                                            <Button
                                                key={slot}
                                                type="button"
                                                onClick={() => handleTimeSelect(slot)}
                                                className={`h-9 border transition-colors ${selectedTime === slot
                                                    ? "bg-[var(--dashboard-primary)] text-white border-[var(--dashboard-primary)] hover:bg-[var(--dashboard-primary-hover)]"
                                                    : "bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)] hover:text-[var(--dashboard-primary)] hover:border-[var(--dashboard-primary)]"
                                                    }`}
                                            >
                                                {displayTime}
                                            </Button>
                                        )
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Row 4 - Visit Type and Appointment Type */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Visit Type *</Label>
                        <Select
                            value={formData.visit_type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, visit_type: value }))}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPD">OPD</SelectItem>
                                <SelectItem value="teleconsult">Teleconsult</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Appointment Type *</Label>
                        <Select
                            value={formData.appointment_type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_type: value }))}
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Consultation">Consultation</SelectItem>
                                <SelectItem value="Grooming">Grooming</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Reason for Visit</Label>
                    <Textarea
                        rows={3}
                        placeholder="Enter reason for visit"
                        className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        value={formData.reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                        rows={3}
                        placeholder="Enter additional notes"
                        className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/appointments')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[var(--dashboard-primary)] text-white"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : isUpdatePage ? 'Update Appointment' : 'Create Appointment'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateAppointment