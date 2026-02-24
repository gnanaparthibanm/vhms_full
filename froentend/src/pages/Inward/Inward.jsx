import { useEffect, useState } from "react";
import { Plus, Upload, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
//import BASE_API from "@/config";
import CreateInwardModal from "./CreateInwardModal";
export default function Inward() {
  const navigate = useNavigate();

const [inwards, setInwards] = useState([
  {
    id: "1",
    inward_no: "INV-1001",
    vendor: { vendor_name: "ABC Suppliers" },
    received_date: "2026-02-10",
    total_quantity: 50,
    total_amount: 12000,
    status: "completed",
  },
  {
    id: "2",
    inward_no: "INV-1002",
    vendor: { vendor_name: "Medico Pharma" },
    received_date: "2026-02-11",
    total_quantity: 30,
    total_amount: 5400,
    status: "pending",
  },
  {
    id: "3",
    inward_no: "INV-1003",
    vendor: { vendor_name: "PetCare Distributors" },
    received_date: "2026-02-12",
    total_quantity: 80,
    total_amount: 22000,
    status: "cancelled",
  },
]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
const [isCreateOpen, setIsCreateOpen] = useState(false);
  // 🔥 Fetch Inward List
  const fetchInwards = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_API}/inward`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setInwards(data.data || []);
    } catch (err) {
      console.error("Error loading inward:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwards();
  }, []);

  // 🔥 Delete inward
  const handleDelete = async (id) => {
    if (!confirm("Delete this inward?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${BASE_API}/inward/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchInwards();
  };
const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedInward, setSelectedInward] = useState(null);
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">
            Inward
          </h1>
          <p className="text-[var(--dashboard-text-light)]">
            Manage inward stock and received orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="flex items-center border rounded-lg px-3 bg-[var(--card-bg)]">
            <Search size={18} className="text-gray-400" />
            <input
              className="p-2 outline-none bg-transparent"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="px-4 py-2 border rounded-lg flex gap-2 items-center">
            <Filter size={16} /> Filters
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-lg text-white flex gap-2 items-center"
            style={{ backgroundColor: "var(--dashboard-primary)" }}
          >
            <Plus size={16} /> Create New
          </button>

         
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
<div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm overflow-hidden">
  <table className="w-full text-sm">
    
    {/* HEADER */}
    <thead className="bg-[var(--dashboard-secondary)]">
      <tr className="text-[var(--dashboard-text-light)]">
        <th className="px-4 py-3 text-left font-medium">Inward No</th>
        <th className="px-4 py-3 text-left font-medium">Supplier</th>
        <th className="px-4 py-3 text-left font-medium">Date</th>
        <th className="px-4 py-3 text-left font-medium">Total Qty</th>
        <th className="px-4 py-3 text-left font-medium">Amount</th>
        <th className="px-4 py-3 text-left font-medium">Status</th>
        <th className="px-4 py-3 text-right font-medium">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {loading ? (
        <tr>
          <td className="px-4 py-6">Loading...</td>
        </tr>
      ) : inwards.length === 0 ? (
        <tr>
          <td className="px-4 py-6">No inward records</td>
        </tr>
      ) : (
        inwards
          .filter((i) =>
            i.inward_no?.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <tr
              key={item.id}
              className="border-t border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]"
            >
              <td className="px-4 py-3 font-medium text-[var(--dashboard-text)]">
                {item.inward_no}
              </td>

              <td className="px-4 py-3">
                {item.vendor?.vendor_name || "-"}
              </td>

              <td className="px-4 py-3">
                {item.received_date
                  ? new Date(item.received_date).toLocaleDateString()
                  : "-"}
              </td>

              <td className="px-4 py-3">{item.total_quantity}</td>

              <td className="px-4 py-3">₹{item.total_amount}</td>

              {/* STATUS BADGE (Records Style) */}
              <td className="px-4 py-3">
                <span className="bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)] px-3 py-1 rounded-md text-xs font-medium">
                  {item.status}
                </span>
              </td>

              {/* ACTION BUTTONS (Records Style) */}
              <td className="px-4 py-3 text-right space-x-2">
                <button
                 onClick={() => {
  setSelectedInward(item);
  setIsEditOpen(true);
}}
                  className="h-8 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-sm hover:bg-[var(--dashboard-secondary)]"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="h-8 px-3 rounded-md border border-red-400 text-red-500 text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
      )}
    </tbody>
  </table>
  
</div>
{/* ================= PAGINATION ================= */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-sm">
  
  {/* LEFT SIDE */}
  <div className="text-[var(--dashboard-text-light)]">
    Showing 1 to {inwards.length} of {inwards.length} entries
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-2">

    {/* SHOW SELECT */}
    <select className="h-8 px-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)]">
      <option>Show 10</option>
      <option>Show 25</option>
      <option>Show 50</option>
    </select>

    {/* PREVIOUS BUTTON */}
    <button className="h-8 w-8 flex items-center justify-center rounded-md border border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]">
      ‹
    </button>

    {/* PAGE INFO */}
    <div className="px-2 text-[var(--dashboard-text-light)]">
      Page 1 of 1
    </div>

    {/* NEXT BUTTON */}
    <button className="h-8 w-8 flex items-center justify-center rounded-md border border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]">
      ›
    </button>

  </div>
</div>

{/* CREATE */}
<CreateInwardModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  mode="create"
/>

{/* EDIT */}
<CreateInwardModal
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  mode="edit"
  editData={selectedInward}
/>
    </div>
  );
}