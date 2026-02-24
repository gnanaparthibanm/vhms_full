import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

const resources = [
  "Activities",
  "Appointments",
  "Billable Items",
  "Billing Invoices",
  "Bills",
  "Bill Items",
  "Branches",
  "Branch Settings",
  "Branch Staff Assignments",
  "Clients",
  "Discount Types",
  "Feature Usages",
  "Hospitals",
  "Hospital Settings",
  "Hospital Subscriptions",
  "Item Categories",
  "Medical Records",
  "Medical Records Audit",
  "Messages",
  "Message Threads",
  "Notifications",
  "Payments",
  "Payment Methods",
  "Pets",
  "Record Types",
  "Sales Audit",
  "Staff Roles",
  "Stock Adjustments",
  "Stock Reservations",
  "Subscription Features",
  "Subscription Plans",
  "Tax Rates",
  "Templates",
  "Users",
];

const CreateRole = () => {

  const navigate = useNavigate();
  const location = useLocation();   // ✅ MOVE UP

  const duplicateRole = location.state?.role;
  const isDuplicate = location.state?.isDuplicate;

  // 👇 NOW useState can use it safely
  const [roleName, setRoleName] = useState(
    isDuplicate ? `${duplicateRole?.title} (Copy)` : ""
  );

  const [desc, setDesc] = useState(
    isDuplicate ? duplicateRole?.desc : ""
  );





  // ✅ permission state
  const [permissions, setPermissions] = useState({});

  // toggle single checkbox
  const togglePermission = (resource, type) => {
    setPermissions(prev => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [type]: !prev?.[resource]?.[type]
      }
    }));
  };

  // ✅ Toggle ALL column (Read/Create/Update/Delete)
 const toggleAll = (type) => {

  // check if all are already selected
  const allSelected = resources.every(
    r => permissions?.[r]?.[type] === true
  );

  const updated = {};

  resources.forEach(r => {
    updated[r] = {
      ...permissions[r],
      [type]: !allSelected   // ✅ toggle logic
    };
  });

  setPermissions(prev => ({ ...prev, ...updated }));
};
// ✅ Toggle ALL permissions for ONE RESOURCE (row)
const toggleRow = (resource) => {

  // check if this row already fully selected
  const allSelected = ["read","create","update","delete"].every(
    type => permissions?.[resource]?.[type] === true
  );

  setPermissions(prev => ({
    ...prev,
    [resource]: {
      read: !allSelected,
      create: !allSelected,
      update: !allSelected,
      delete: !allSelected
    }
  }));
};

  const handleCreate = () => {

    if (!roleName.trim()) {
      alert("Role name required");
      return;
    }

    const newRole = {
      title: roleName,
      desc: desc || "No description",
      permissions: Object.keys(permissions).length
    };

    const old = JSON.parse(localStorage.getItem("roles")) || [];
    localStorage.setItem("roles", JSON.stringify([...old, newRole]));

    navigate("/staff/roles");
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--dashboard-text)]">
          Create New Staff Role
        </h1>
        <p className="text-sm text-[var(--dashboard-text-light)]">
          Define a new staff role with specific permissions
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm">Role Name</label>
          <Input
            placeholder="e.g., Veterinary Assistant"
            value={roleName}
            onChange={(e)=>setRoleName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] p-3 text-sm"
            value={desc}
            onChange={(e)=>setDesc(e.target.value)}
          />
        </div>
      </div>

     <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">

  {/* ================= MOBILE CARD VIEW ================= */}
  <div className="lg:hidden space-y-3 p-3">
    {resources.map((r, i) => (
      <div
        key={i}
        className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm"
      >
        <div className="flex justify-between mb-3">
          <p className="font-semibold">{r}</p>

          <span
            className="text-xs text-red-500 cursor-pointer"
            onClick={() => toggleRow(r)}
          >
            Toggle All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {["read","create","update","delete"].map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-pink-500"
                checked={permissions?.[r]?.[type] || false}
                onChange={()=>togglePermission(r,type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* ================= TABLET + DESKTOP TABLE ================= */}
  <div className="hidden lg:block overflow-x-auto">
    <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-[var(--dashboard-secondary)]">
            <tr>
              <th className="p-3 text-left">Resource</th>

              <th className="text-center">
                Read
                <div
                  className="text-red-500 text-xs cursor-pointer"
                  onClick={()=>toggleAll("read")}
                >
                  Toggle All
                </div>
              </th>

              <th className="text-center">
                Create
                <div
                  className="text-red-500 text-xs cursor-pointer"
                  onClick={()=>toggleAll("create")}
                >
                  Toggle All
                </div>
              </th>

              <th className="text-center">
                Update
                <div
                  className="text-red-500 text-xs cursor-pointer"
                  onClick={()=>toggleAll("update")}
                >
                  Toggle All
                </div>
              </th>

              <th className="text-center">
                Delete
                <div
                  className="text-red-500 text-xs cursor-pointer"
                  onClick={()=>toggleAll("delete")}
                >
                  Toggle All
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {resources.map((r,i)=>(
              <tr key={i} className="border-t border-[var(--border-color)]">

<td className="p-3 font-medium flex justify-between items-center">

  {r}

  <span
    className="text-red-500 text-xs cursor-pointer ml-4"
    onClick={() => toggleRow(r)}
  >
    Toggle All
  </span>

</td>

                {["read","create","update","delete"].map(type=>(
                  <td key={type} className="text-center">
                    <input
                      type="checkbox"
                      className="accent-pink-500"
                      checked={permissions?.[r]?.[type] || false}
                      onChange={()=>togglePermission(r,type)}
                    />
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* FOOTER */}
     <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button
          onClick={()=>navigate("/staff/roles")}
          className="border border-[var(--border-color)] bg-[var(--card-bg)]"
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          className="bg-[var(--dashboard-primary)] text-white"
        >
          Create Role
        </Button>
      </div>
</div>
    </div>
  );
};

export default CreateRole;
