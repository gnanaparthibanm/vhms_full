import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const activities = [

  // ===== LOGIN =====
  {
    date: "Feb 19, 2026",
    type: "LOGIN",
    content: "User admin@gmail.com logged in",
    time: "2:15 PM",
  },
  {
    date: "Feb 19, 2026",
    type: "LOGIN",
    content: "User vet@example.com logged in",
    time: "11:05 AM",
  },

  // ===== USAGE =====
  {
    date: "Feb 18, 2026",
    type: "USAGE",
    content: "POS system used for billing",
    time: "4:30 PM",
  },
  {
    date: "Feb 18, 2026",
    type: "USAGE",
    content: "Appointment module accessed",
    time: "1:10 PM",
  },

  // ===== DELETION =====
  {
    date: "Feb 17, 2026",
    type: "DELETION",
    content: "Old invoice deleted",
    time: "3:45 PM",
  },
  {
    date: "Feb 17, 2026",
    type: "DELETION",
    content: "Patient record removed",
    time: "10:25 AM",
  },

  // ===== CREATION =====
  {
    date: "Feb 19, 2026",
    type: "CREATION",
    content: "Pet RAAF created",
    time: "10:17 AM",
  },
  {
    date: "Feb 19, 2026",
    type: "CREATION",
    content: "New client profile created",
    time: "9:55 AM",
  },

  // ===== UPDATE =====
  {
    date: "Feb 19, 2026",
    type: "UPDATE",
    content: "Client updated: Marie",
    time: "10:16 AM",
  },
  {
    date: "Feb 19, 2026",
    type: "UPDATE",
    content: "Billing info updated",
    time: "9:45 AM",
  },

  // ===== SYSTEM =====
  {
    date: "Feb 16, 2026",
    type: "SYSTEM",
    content: "System backup completed",
    time: "8:00 AM",
  },
  {
    date: "Feb 16, 2026",
    type: "SYSTEM",
    content: "Server restarted successfully",
    time: "7:40 AM",
  },

  // ===== SECURITY =====
  {
    date: "Feb 19, 2026",
    type: "SECURITY",
    content: "OTP login initiated",
    time: "10:14 AM",
  },
  {
    date: "Feb 19, 2026",
    type: "SECURITY",
    content: "Password reset requested",
    time: "10:01 AM",
  },

  // ===== BRANCHES =====
  {
    date: "Feb 15, 2026",
    type: "BRANCHES",
    content: "Staff assigned to Main Branch",
    time: "3:10 PM",
  },
  {
    date: "Feb 15, 2026",
    type: "BRANCHES",
    content: "New branch added: East Wing",
    time: "11:22 AM",
  },

  // ===== BILLING =====
  {
    date: "Feb 14, 2026",
    type: "BILLING",
    content: "Invoice #INV1023 generated",
    time: "5:05 PM",
  },
  {
    date: "Feb 14, 2026",
    type: "BILLING",
    content: "Payment received via POS",
    time: "2:20 PM",
  },
];

const typeClass = (type) => {
  switch (type) {
    case "LOGIN":
      return "bg-pink-100 text-pink-600";
    case "CREATION":
      return "bg-emerald-100 text-emerald-600";
    case "UPDATE":
      return "bg-yellow-100 text-yellow-700";
    case "SECURITY":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Activities = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const tabMap = {
  Logins: "LOGIN",
  Usage: "USAGE",
  Deletions: "DELETION",
  Creations: "CREATION",
  Updates: "UPDATE",
  System: "SYSTEM",
  Security: "SECURITY",
  Branches: "BRANCHES",
  Billing: "BILLING"
};
const filteredActivities =
  activeTab === "All"
    ? activities
    : activities.filter(
        (a) => a.type === tabMap[activeTab]
      );
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;

const paginatedActivities =
  filteredActivities.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
const [filterActive, setFilterActive] = useState(false);
const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">

        {/* HEADER — SAME AS STAFF */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--dashboard-text)]">
              Activities
            </h1>
            <p className="text-sm text-[var(--dashboard-text-light)]">
              View system activities - for Admin(s) only
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              className="h-9 w-[250px] bg-[var(--card-bg)] border-[var(--border-color)]"
            />
          <Button
  onClick={() => setFilterActive(!filterActive)}
  className={`h-9 border border-[var(--border-color)] transition-all
    ${
      filterActive
        ? "bg-[var(--dashboard-primary)] text-white"
        : "bg-[var(--card-bg)] text-[var(--dashboard-text)]"
    }
  `}
>
  Filters
</Button>

          </div>
        </div>

        {/* TABS */}
<div className="w-full rounded-xl bg-[var(--dashboard-primary)]/20 p-1 overflow-x-auto">
  <div className="flex gap-2 whitespace-nowrap">

    {[
      "All",
     // "Subscriptions",
      "Logins",
      "Usage",
      "Deletions",
      "Creations",
      "Updates",
      "System",
      "Security",
      "Branches",
      "Billing"
    ].map(tab => (

      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-1.5 text-sm rounded-lg transition-all font-medium
        ${
          activeTab === tab
            ? "bg-[var(--dashboard-primary)] text-white shadow"
            : "text-[var(--dashboard-text)] hover:bg-white/40"
        }
        `}
      >
        {tab}
      </button>

    ))}

  </div>
</div>


        {/* TABLE */}
        <div className="rounded-xl border border-[var(--border-color)] overflow-x-auto bg-[var(--card-bg)] shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-color)] bg-[var(--dashboard-secondary)]">
              <tr>
                {["Date","Type","Activity Content","Time","Actions"].map(h=>(
                  <th key={h} className="h-10 px-4 text-left font-semibold text-[var(--dashboard-text)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedActivities.map((a,i)=>(
                <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]">
                  <td className="p-4">{a.date}</td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${typeClass(a.type)}`}>
                      {a.type}
                    </span>
                  </td>

                  <td className="p-4">{a.content}</td>
                  <td className="p-4">{a.time}</td>
                  <td className="p-4">
  <Button
    onClick={() => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this activity?"
      );
      if (confirmDelete) {
        console.log("Delete action here"); // later call backend delete API
      }
    }}
    className="h-8 w-8 flex items-center justify-center rounded-md 
    border border-red-200 text-red-600 bg-red-50 hover:bg-red-100"
  >
    <Trash2 size={14} />
  </Button>
</td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER — EXACT STAFF STYLE */}
        <div className="flex flex-col md:flex-row justify-between items-center px-2 py-3 text-sm text-[var(--dashboard-text-light)]">

          <div>
            Showing 1 to {activities.length} of {activities.length} entries
          </div>

          <div className="flex items-center gap-3 mt-3 md:mt-0">

  <Button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="h-8 w-8 border bg-[var(--card-bg)]"
  >
    {"<"}
  </Button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <Button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="h-8 w-8 border bg-[var(--card-bg)]"
  >
    {">"}
  </Button>

</div>

        </div>

      </div>
    </div>
  );
};

export default Activities;
