# Frontend-Backend Integration Guide

## Overview
This guide explains how the frontend integrates with the backend API for the Veterinary Hospital Management System.

## Configuration

### Environment Variables
Create a `.env` file in the frontend root directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_APP_NAME=Veterinary HMS
```

### Backend Setup
Ensure the backend is running on port 4000 (or update the VITE_API_BASE_URL accordingly).

## API Client

The API client is located at `src/lib/api.js` and provides:
- Automatic token management
- Error handling
- Request/response interceptors
- Automatic redirect on 401 (unauthorized)

### Usage Example
```javascript
import apiClient from '../lib/api';

// GET request
const data = await apiClient.get('/hms/appointments');

// POST request
const result = await apiClient.post('/hms/appointments', appointmentData);

// PUT request
const updated = await apiClient.put('/hms/appointments/123', updatedData);

// DELETE request
await apiClient.delete('/hms/appointments/123');
```

## Services

All API endpoints are organized into service modules:

### 1. Authentication Service (`services/authService.js`)
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `getCurrentUser()` - Get current user from localStorage
- `isAuthenticated()` - Check if user is authenticated
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password

### 2. Appointment Service (`services/appointmentService.js`)
- `getAllAppointments(params)` - Get all appointments
- `getAppointmentById(id)` - Get appointment by ID
- `createAppointment(data)` - Create new appointment
- `updateAppointment(id, data)` - Update appointment
- `deleteAppointment(id)` - Delete appointment
- `getDoctorSchedules(params)` - Get doctor schedules
- `getPetVitals(petId)` - Get pet vitals
- `createPrescription(data)` - Create prescription
- And more...

### 3. Client Service (`services/clientService.js`)
- `getAllClients(params)` - Get all clients
- `getClientById(id)` - Get client by ID
- `createClient(data)` - Create new client
- `updateClient(id, data)` - Update client
- `deleteClient(id)` - Delete client
- `getClientContacts(clientId)` - Get client contacts
- `getClientInsurance(clientId)` - Get client insurance

### 4. Pet Service (`services/petService.js`)
- `getAllPets(params)` - Get all pets
- `getPetById(id)` - Get pet by ID
- `getPetsByClientId(clientId)` - Get pets by client
- `createPet(data)` - Create new pet
- `updatePet(id, data)` - Update pet
- `deletePet(id)` - Delete pet

### 5. Staff Service (`services/staffService.js`)
- `getAllStaff(params)` - Get all staff
- `getStaffById(id)` - Get staff by ID
- `createStaff(data)` - Create new staff
- `updateStaff(id, data)` - Update staff
- `deleteStaff(id)` - Delete staff
- `getAllRoles()` - Get all roles
- `createRole(data)` - Create new role

### 6. Bill Service (`services/billService.js`)
- `getAllBills(params)` - Get all bills
- `getBillById(id)` - Get bill by ID
- `createBill(data)` - Create new bill
- `updateBill(id, data)` - Update bill
- `deleteBill(id)` - Delete bill
- `createPayment(billId, data)` - Create payment

### 7. Inventory Service (`services/inventoryService.js`)
- `getAllItems(params)` - Get all inventory items
- `getItemById(id)` - Get item by ID
- `createItem(data)` - Create new item
- `updateItem(id, data)` - Update item
- `deleteItem(id)` - Delete item
- `getLowStockItems()` - Get low stock items
- `updateStock(id, quantity, type)` - Update stock

### 8. Dashboard Service (`services/dashboardService.js`)
- `getDashboardStats(params)` - Get dashboard statistics
- `getRecentAppointments(limit)` - Get recent appointments
- `getUpcomingAppointments(limit)` - Get upcoming appointments
- `getRevenueStats(startDate, endDate)` - Get revenue statistics
- `getPatientStats()` - Get patient statistics

## Custom Hooks

### useApi Hook
Simplifies API calls with loading and error states:

```javascript
import { useApi } from '../hooks';
import { appointmentService } from '../services';

function MyComponent() {
  const { data, loading, error, execute } = useApi(appointmentService.getAllAppointments);

  useEffect(() => {
    execute({ status: 'pending' });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
}
```

### useAuth Hook
Manages authentication state:

```javascript
import { useAuth } from '../hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };

  return <div>{/* Your component */}</div>;
}
```

## Usage in Components

### Example: Fetching Appointments

```javascript
import { useState, useEffect } from 'react';
import { appointmentService } from '../services';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {appointments.map(appointment => (
        <div key={appointment.id}>{appointment.title}</div>
      ))}
    </div>
  );
}
```

### Example: Creating a New Client

```javascript
import { useState } from 'react';
import { clientService } from '../services';

function CreateClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await clientService.createClient(formData);
      console.log('Client created:', response.data);
      // Redirect or show success message
    } catch (error) {
      console.error('Error creating client:', error);
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## API Endpoints Reference

### Base URL
```
http://localhost:4000/api/v1
```

### Main Routes
- `/user/*` - User authentication and management
- `/hms/appointments/*` - Appointments, schedules, vitals, prescriptions
- `/hms/clients/*` - Clients, pets, contacts, insurance
- `/hms/staff/*` - Staff and roles management
- `/hms/dashboard/*` - Dashboard statistics
- `/ims/inventory/*` - Inventory management

## Error Handling

All API calls return errors in the following format:

```javascript
{
  status: 404,
  message: 'Resource not found',
  errors: [
    { field: 'email', message: 'Invalid email format' }
  ]
}
```

Handle errors in your components:

```javascript
try {
  await appointmentService.createAppointment(data);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 422) {
    // Show validation errors
    error.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`);
    });
  } else {
    // Show generic error
    console.error(error.message);
  }
}
```

## Authentication Flow

1. User logs in via `authService.login()`
2. Token is stored in localStorage
3. All subsequent API calls include the token in headers
4. On 401 response, user is redirected to login
5. User can logout via `authService.logout()`

## CORS Configuration

Ensure the backend has CORS enabled for the frontend URL:

```javascript
// Backend: src/index.js
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

## Testing the Integration

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd froentend && npm run dev`
3. Open browser to `http://localhost:5173`
4. Check browser console for any API errors
5. Use browser DevTools Network tab to inspect API calls

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that API_BASE_URL in .env is correct

### 401 Unauthorized
- Check if token is being sent in headers
- Verify token is valid and not expired
- Check backend JWT configuration

### Network Errors
- Ensure backend is running
- Check API_BASE_URL is correct
- Verify network connectivity

## Next Steps

1. Implement authentication in login page
2. Update components to use services
3. Add error handling UI components
4. Implement loading states
5. Add form validation
6. Create protected routes
