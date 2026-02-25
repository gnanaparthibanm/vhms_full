import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Auth from './pages/AuthPage/Auth';
import Register from './pages/AuthPage/Register';
import ForgotPass from './pages/AuthPage/ForgotPass';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Appointment from './pages/Appointment/Appointment';
import Client from './pages/Patient/Client';
import AddClient from './pages/Patient/AddClient';
import AddPet from './pages/Patient/AddPet';
import Records from './pages/Records/Records';
import Settings from './pages/Settings';

// Billable Items
import BillableItems from './pages/BillableItems/BillableItems';
import BillableItemForm from './pages/BillableItems/BillableItemForm';
import ItemSettings from './pages/BillableItems/ItemSettings';

// Bills & Payments
import Bills from './pages/BillsPayments/Bills';
import BillForm from './pages/BillsPayments/BillForm';
import CreateAppointment from './pages/Appointment/CreateAppointment';
//staff
import Staff from './pages/Staff/Staff';
import CreateStaff from "./pages/Staff/CreateStaff";
import StaffRoles from "./pages/Staff/StaffRoles";
import CreateRole from "./pages/Staff/CreateRole";

import EditStaff from "./pages/Staff/EditStaff";
//activity
import Activities from "./pages/Activities/Activities";

//import EditStaff from "./pages/staff/EditStaff";


import CreatePatient from './pages/Patient/CreatePatient';
import Notification from './pages/NotificationPage/Notification';
import NotificationView from './pages/NotificationPage/NotificationView';
import Inventory from './pages/Inventory/Inventory';
import InventoryCreate from './pages/Inventory/InventoryCreate';
import Report from './pages/Report';
import POSPage from './pages/POS/POSPage';
import TechPharmacy from './pages/TechPharmacy';
import CreateProducts from './pages/CreateProducts';
import CreateTemplate from './pages/Records/CreateTemplate';


// Placeholder component for new pages
const PlaceholderPage = ({ title }) => (
  <div className="">
    <h2 className="text-2xl font-bold text-[var(--dashboard-text)] mb-4">{title}</h2>
    <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
      Content for {title} will go here
    </div>
  </div>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass />} />

          {/* Protected POS Route standalone */}
          <Route path="/pos" element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/appointments/create" element={<CreateAppointment />} />
            <Route path="/appointments/update" element={<CreateAppointment />} />
            <Route path="patients" element={<Client />} />
            <Route path="patients/create" element={<CreatePatient />} />
            <Route path="patients/add-client" element={<AddClient />} />
            <Route path="patients/add-pet" element={<AddPet />} />
            <Route path="patients/update" element={<CreatePatient />} />
            <Route path="patients/update/:id" element={<AddClient />} />
            <Route path="records" element={<Records />} />
            <Route path="/records/create/template" element={<CreateTemplate />} />
            <Route path="report" element={<Report />} />
            <Route path="techPharma" element={<TechPharmacy />} />
            <Route path="/product/create" element={<CreateProducts />} />
            <Route path="/product/update" element={<CreateProducts />} />

            <Route path="billable-items" element={<BillableItems />} />
            <Route path="billable-items/create" element={<BillableItemForm />} />
            <Route path="billable-items/edit/:id" element={<BillableItemForm />} />
            <Route path="billable-items/settings" element={<ItemSettings />} />

            <Route path="bills-payments" element={<Bills />} />
            <Route path="bills-payments/create" element={<BillForm />} />
            <Route path="bills-payments/edit/:id" element={<BillForm />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/create" element={<InventoryCreate />} />
            <Route path="inventory/update" element={<InventoryCreate />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="notifications/view" element={<NotificationView />} />
            <Route path="staff" element={<Staff />} />
            <Route path="staff/create" element={<CreateStaff />} />
            <Route path="staff/roles" element={<StaffRoles />} />
            <Route path="staff/roles/create" element={<CreateRole />} />
            <Route path="/staff/edit" element={<EditStaff />} />

            <Route path="settings" element={<Settings />} />
            <Route path="subscription" element={<PlaceholderPage title="Subscription" />} />
            <Route path="/activities" element={<Activities />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
