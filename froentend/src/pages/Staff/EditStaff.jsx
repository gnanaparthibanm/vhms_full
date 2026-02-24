import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Calendar } from "@/components/ui/calendar";

const EditStaff = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const staff = location.state?.staff || {};
  const openTab = location.state?.openTab || "StaffDetails";

  // TAB STATE
  const [activeTab,setActiveTab] = useState(openTab);

  // FORM STATES
  const [firstName,setFirstName] = useState(staff.name?.split(" ")[0] || "");
  const [lastName,setLastName] = useState(staff.name?.split(" ")[1] || "");
  const [email,setEmail] = useState(staff.email || "");
  const [role,setRole] = useState(staff.role || "");
  const [active,setActive] = useState(true);
  const [admin,setAdmin] = useState(false);
  const [photo,setPhoto] = useState(null);
  const fileRef = useRef();
  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);


  return (
    <div className="container mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-semibold text-[var(--dashboard-text)]">
          Edit Staff Member
        </h1>

        <p className="text-sm text-[var(--dashboard-text-light)]">
          Update staff details and their branch assignments
        </p>
      </div>

      {/* TAB SWITCH */}
<div className="flex flex-col sm:flex-row rounded-lg bg-[var(--dashboard-secondary)] p-1 border border-[var(--border-color)] gap-1">        {["StaffDetails","BranchAssignment"].map(tab => (
          <Button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`flex-1 ${
              activeTab===tab
              ? "bg-[var(--card-bg)] text-[var(--dashboard-text)]"
              : "bg-[var(--dashboard-primary)] text-white"
            }`}
          >
            {tab==="StaffDetails" ? "Staff Details" : "Branch Assignment"}
          </Button>
        ))}
      </div>

      {/* ================= STAFF DETAILS TAB ================= */}
{activeTab==="StaffDetails" && (

  <div className="space-y-6">

    {/* PROFILE PHOTO SECTION */}
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center space-y-3">
<input
  type="file"
  ref={fileRef}
  className="hidden"
  accept="image/*"
  onChange={(e)=>setPhoto(e.target.files[0])}
/>

     <div className="w-40 h-40 mx-auto rounded-full bg-[var(--dashboard-secondary)] flex items-center justify-center overflow-hidden">
  {photo ? (
    <img
      src={URL.createObjectURL(photo)}
      className="w-full h-full object-cover"
    />
  ) : (
    "👤"
  )}
</div>

<Button
  onClick={()=>fileRef.current.click()}
  className="border border-[var(--border-color)] bg-[var(--card-bg)]"
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
        <label className="text-sm font-medium">First Name *</label>
        <Input
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Last Name</label>
        <Input
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email *</label>
        <Input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone (Optional)</label>
        <Input placeholder="+1" />
      </div>

      <div>
        <label className="text-sm font-medium">Initial Password *</label>
        <Input placeholder="Create initial password" />
      </div>

      <div>
        <label className="text-sm font-medium">Staff Role</label>
        <Input
          value={role}
          onChange={(e)=>setRole(e.target.value)}
        />

        <p className="text-xs mt-1 text-[var(--dashboard-text-light)]">
          Defines this staff member's permissions. Can't be combined with admin access.
        </p>
      </div>

    </div>

    {/* ACTIVE + ADMIN CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold">Active</h3>
          <p className="text-sm text-[var(--dashboard-text-light)]">
            Inactive staff can't log in or be assigned to branches
          </p>
        </div>

        <button
          onClick={()=>setActive(!active)}
          className={`w-12 h-6 rounded-full relative ${
            active ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              active ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Administrator</h3>
          <p className="text-sm text-[var(--dashboard-text-light)]">
            Gives full access, overrides any staff role
          </p>
        </div>

        <button
          onClick={()=>setAdmin(!admin)}
          className={`w-12 h-6 rounded-full relative ${
            admin ? "bg-pink-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              admin ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

    </div>

    {/* FOOTER BUTTON */}
    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
       
      <Button
        onClick={()=>navigate("/staff")}
        className="bg-[var(--dashboard-primary)] text-white"
      >
        Update Staff
      </Button>
       <Button onClick={()=> navigate("/staff")}>
        Cancel
      </Button>
    </div>

  </div>
)}

      {/* ================= BRANCH ASSIGNMENT TAB ================= */}
      {activeTab==="BranchAssignment" && (

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-6">

          <div className="text-center space-y-2">
            <h3 className="font-semibold">{staff.name}</h3>
            <p className="text-sm text-[var(--dashboard-text-light)]">
              {staff.email}
            </p>
            <p className="text-sm">{staff.role}</p>
          </div>

          <div>
            <label>Branch *</label>
            <Input placeholder="Select a branch" />
          </div>

          <div className="flex justify-between items-center border p-4 rounded-lg">
            <div>
              <h3>Active Assignment</h3>
              <p className="text-sm text-[var(--dashboard-text-light)]">
                Indicates whether assignment is active
              </p>
            </div>

            <div className="w-12 h-6 bg-pink-500 rounded-full" />
          </div>
{/* ===== REAL START + END DATE PICKER ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

  {/* START DATE */}
  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
    <label className="text-sm font-medium">
      Start Date (Optional)
    </label>

    <Calendar
  mode="single"
  selected={startDate}
  onSelect={setStartDate}
  className="mt-3 w-full p-3"
/>

  </div>

  {/* END DATE */}
  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
    <label className="text-sm font-medium">
      End Date (Optional)
    </label>

    <Calendar
  mode="single"
  selected={endDate}
  onSelect={setEndDate}
  className="mt-3 w-full p-3"
/>

  </div>

</div>
          <div className="flex justify-end">
            <Button className="bg-[var(--dashboard-primary)] text-white">
              Save Branch Assignment
            </Button>
          </div>

        </div>
      )}

    </div>
  );
};

export default EditStaff;
