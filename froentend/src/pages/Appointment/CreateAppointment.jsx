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
            
            if (isUpdatePage) {
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
        const date = new Date(today.getFullYear(), today.getMonth(), day)
        setSelectedDate(day)
        setFormData(prev => ({
            ...prev,
            scheduled_at: date.toISOString().split('T')[0]
        }))
        // Fetch available slots for selected date and doctor
        if (formData.doctor_id) {
            fetchAvailableSlots(date, formData.doctor_id)
        }
    }
    
    // Fetch available time slots based on doctor's schedule
    const fetchAvailableSlots = async (date, doctorId) => {
        try {
            setLoadingSlots(true)
            
            // Fetch doctor's schedule
            const response = await appointmentService.getDoctorSchedules({
                doctor_id: doctorId
            })
            
            const schedules = response.data?.data || response.data || []
            
            if (schedules.length === 0) {
                setAvailableSlots([])
                return
            }
            
            const schedule = schedules[0] // Get first active schedule
            
            // Check if selected date is the week off day
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
            if (dayName === schedule.weekoffday) {
                setAvailableSlots([])
                return
            }
            
            // Generate time slots based on schedule
            const slots = generateTimeSlots(
                schedule.start_time,
                schedule.end_time,
                schedule.slot_duration_minutes
            )
            
            // Fetch existing appointments for this doctor on this date
            const appointmentsResponse = await appointmentService.getAllAppointments({
                doctor_id: doctorId,
                scheduled_at: date.toISOString().split('T')[0]
            })
            
            const bookedSlots = (appointmentsResponse.data?.data || []).map(apt => apt.scheduled_time)
            
            // Mark slots as available or booked
            const slotsWithAvailability = slots.map(slot => ({
                time: slot,
                available: !bookedSlots.includes(slot)
            }))
            
            setAvailableSlots(slotsWithAvailability)
        } catch (err) {
            console.error('Error fetching slots:', err)
            setAvailableSlots([])
        } finally {
            setLoadingSlots(false)
        }
    }
    
    // Generate time slots
    const generateTimeSlots = (startTime, endTime, durationMinutes) => {
        const slots = []
        
        // Parse start and end times (format: HH:MM:SS)
        const [startHour, startMin] = startTime.split(':').map(Number)
        const [endHour, endMin] = endTime.split(':').map(Number)
        
        let currentHour = startHour
        let currentMin = startMin
        
        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            // Format time as HH:MM
            const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
            slots.push(timeStr)
            
            // Add duration
            currentMin += durationMinutes
            if (currentMin >= 60) {
                currentHour += Math.floor(currentMin / 60)
                currentMin = currentMin % 60
            }
        }
        
        return slots
    }
    
    // Handle time selection
    const handleTimeSelect = (time) => {
        setSelectedTime(time)
        // Convert HH:MM to HH:MM:SS format for backend
        const timeWithSeconds = time.includes(':') && time.split(':').length === 2 
            ? `${time}:00` 
            : time
        setFormData(prev => ({
            ...prev,
            scheduled_time: timeWithSeconds
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
                        <Label>Client *</Label>
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
                                        {pet.name} ({pet.species})
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
                                <div className="grid grid-cols-2 gap-2 py-4 w-full">
                                    {availableSlots.map((slot) => (
                                        <Button
                                            key={slot.time}
                                            type="button"
                                            disabled={!slot.available}
                                            variant={selectedTime === slot.time ? "default" : "outline"}
                                            onClick={() => handleTimeSelect(slot.time)}
                                            className={`h-9 ${
                                                !slot.available 
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' 
                                                    : selectedTime === slot.time
                                                    ? 'bg-[var(--dashboard-primary)] text-white'
                                                    : 'hover:bg-[var(--dashboard-secondary)]'
                                            }`}
                                        >
                                            {slot.time}
                                            {!slot.available && (
                                                <span className="ml-1 text-xs">(Booked)</span>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {formData.doctor_id && selectedDate && !loadingSlots && availableSlots.length === 0 && (
                                <div className="py-8 text-center text-[var(--dashboard-text-light)]">
                                    <p>No available slots for this date.</p>
                                    <p className="text-sm mt-1">This might be the doctor's week off day or no schedule is set.</p>
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