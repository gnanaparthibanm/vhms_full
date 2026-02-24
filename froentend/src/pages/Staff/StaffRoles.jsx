import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
//import React, { useState, useEffect } from "react";



const roles = [
  {
    title: "Billing Specialist",
    desc: "Handles financial transactions and invoicing",
    permissions: 28,
  },
  {
    title: "Inventory Manager",
    desc: "Manages stock and procurement",
    permissions: 18,
  },
  {
    title: "Kennel Assistant",
    desc: "Manages pet care and facility maintenance",
    permissions: 9,
  },
  {
    title: "Practice Manager",
    desc: "Oversees hospital operations and staff",
    permissions: 53,
  },
  {
    title: "Receptionist",
    desc: "Handles client interactions and scheduling",
    permissions: 36,
  },
  {
    title: "Veterinarian",
    desc: "Primary care provider with full clinical access",
    permissions: 51,
  },
];

const StaffRoles = () => {
    const navigate = useNavigate();
    const [roleList,setRoleList]=useState([]);

useEffect(() => {

  const saved = JSON.parse(localStorage.getItem("roles"));

  if(saved && saved.length > 0){
    // combine default roles + created roles
    setRoleList([...roles, ...saved]);
  }else{
    setRoleList(roles);
  }

},[]);

  return (
    <div className="container mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--dashboard-text)]">
            Staff Roles
          </h1>
          <p className="text-sm text-[var(--dashboard-text-light)]">
            Manage staff roles and their permissions
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Input
            placeholder="Search..."
            className="h-9 w-[250px] bg-[var(--card-bg)] border-[var(--border-color)]"
          />

          <Button
  onClick={()=>navigate("/staff/roles/create")}
  className="h-9 bg-[var(--dashboard-primary)] text-white"
>
  <Plus size={16}/>
  Create Role
</Button>

        </div>
      </div>

      {/* ROLE LIST */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4">

        <h3 className="font-semibold text-[var(--dashboard-text)]">
          All Staff Roles
        </h3>

       {roleList.map((r, i) => (
          <div
  key={i}
  className="
    flex flex-col lg:flex-row
    lg:items-center lg:justify-between
    gap-4
    p-5 rounded-xl border border-[var(--border-color)]
    hover:bg-[var(--dashboard-secondary)] transition
  "
>
            <div>
              <h4 className="font-semibold text-[var(--dashboard-text)]">
                {r.title}
              </h4>

              <p className="text-sm text-[var(--dashboard-text-light)]">
                {r.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
             <Button
  onClick={() =>
    navigate("/staff/roles/create", {
      state: {
        role: r,
        isDuplicate: true
      }
    })
  }
  className="border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)]"
>
  Duplicate
</Button>


              <Button className="border border-[var(--border-color)] bg-[var(--dashboard-secondary)] text-[var(--dashboard-text)]">
                {r.permissions} permissions
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StaffRoles;
