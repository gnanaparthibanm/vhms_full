import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
//import BASE_API from "@/config";
import CreateOrderModal from "./CreateOrderModal";
export default function Order() {
  const navigate = useNavigate();

const [orders, setOrders] = useState([
  {
    id: "1",
    po_no: "PO00001",
    vendor: { vendor_name: "ABC Suppliers" },
    order_date: "2026-02-10",
    total_quantity: 25,
    total_amount: 5000,
    status: "pending",
  },
  {
    id: "2",
    po_no: "PO00002",
    vendor: { vendor_name: "Medico Pharma" },
    order_date: "2026-02-11",
    total_quantity: 40,
    total_amount: 7200,
    status: "approved",
  },
  {
    id: "3",
    po_no: "PO00003",
    vendor: { vendor_name: "PetCare Distributors" },
    order_date: "2026-02-12",
    total_quantity: 18,
    total_amount: 3200,
    status: "completed",
  },
  {
    id: "4",
    po_no: "PO00004",
    vendor: { vendor_name: "VetLine Pvt Ltd" },
    order_date: "2026-02-13",
    total_quantity: 50,
    total_amount: 12000,
    status: "pending",
  },
  {
    id: "5",
    po_no: "PO00005",
    vendor: { vendor_name: "Global Vet Supplies" },
    order_date: "2026-02-14",
    total_quantity: 60,
    total_amount: 14500,
    status: "approved",
  },
  {
    id: "6",
    po_no: "PO00006",
    vendor: { vendor_name: "Animal Health Corp" },
    order_date: "2026-02-15",
    total_quantity: 22,
    total_amount: 4100,
    status: "completed",
  },
  {
    id: "7",
    po_no: "PO00007",
    vendor: { vendor_name: "CareVet Suppliers" },
    order_date: "2026-02-16",
    total_quantity: 33,
    total_amount: 6800,
    status: "pending",
  },
  {
    id: "8",
    po_no: "PO00008",
    vendor: { vendor_name: "BlueCross Pharma" },
    order_date: "2026-02-17",
    total_quantity: 27,
    total_amount: 5600,
    status: "approved",
  },
  {
    id: "9",
    po_no: "PO00009",
    vendor: { vendor_name: "VetCare India" },
    order_date: "2026-02-18",
    total_quantity: 44,
    total_amount: 9100,
    status: "completed",
  },
  {
    id: "10",
    po_no: "PO00010",
    vendor: { vendor_name: "PetLife Distributors" },
    order_date: "2026-02-19",
    total_quantity: 12,
    total_amount: 2100,
    status: "pending",
  },
]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
const [isCreateOpen, setIsCreateOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_API}/order?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${BASE_API}/order/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchOrders();
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">
            Orders
          </h1>
          <p className="text-[var(--dashboard-text-light)]">
            Manage purchase orders and vendor supplies
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* SEARCH */}
          <div className="flex items-center border rounded-lg px-3 bg-[var(--card-bg)]">
            <Search size={18} className="text-gray-400" />
            <input
              className="p-2 outline-none bg-transparent"
              placeholder="Search PO..."
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
            <Plus size={16} /> Create Order
          </button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-[var(--dashboard-secondary)]">
  <tr className="text-[var(--dashboard-text-light)]">
    <th className="px-4 py-3 text-left">PO No</th>
    <th className="px-4 py-3 text-left">Vendor</th>
    <th className="px-4 py-3 text-center">Date</th>
    <th className="px-4 py-3 text-center">Total Qty</th>
    <th className="px-4 py-3 text-center">Amount</th>
    <th className="px-4 py-3 text-center">Status</th>
    <th className="px-4 py-3 text-right">Actions</th>
  </tr>
</thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6">No orders found</td>
              </tr>
            ) : (
              orders
                .filter((o) =>
                  o.po_no?.toLowerCase().includes(search.toLowerCase())
                )
                .map((order) => (
                  <tr
  key={order.id}
  className="border-t border-[var(--border-color)] hover:bg-[var(--dashboard-secondary)]"
>
  <td className="px-4 py-3 font-medium text-left">
    {order.po_no}
  </td>

  <td className="px-4 py-3 text-left">
    {order.vendor?.vendor_name || "-"}
  </td>

  <td className="px-4 py-3 text-center">
    {new Date(order.order_date).toLocaleDateString()}
  </td>

  <td className="px-4 py-3 text-center">
    {order.total_quantity}
  </td>

  <td className="px-4 py-3 text-center">
    ₹{order.total_amount}
  </td>

  <td className="px-4 py-3 text-center">
    <span className="inline-flex items-center justify-center bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)] px-3 py-1 rounded-md text-xs font-medium capitalize">
      {order.status}
    </span>
  </td>

  <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
  setSelectedOrder(order);
  setIsEditOpen(true);
}}
                        className="h-8 px-3 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-sm hover:bg-[var(--dashboard-secondary)]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(order.id)}
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

        <div className="text-[var(--dashboard-text-light)]">
          Showing 1 to {orders.length} of {orders.length} entries
        </div>

        <div className="flex items-center gap-2">
          <select className="h-8 px-2 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]">
            <option>Show 10</option>
            <option>Show 25</option>
          </select>

          <button className="h-8 w-8 border rounded-md">‹</button>

          <div className="px-2 text-[var(--dashboard-text-light)]">
            Page 1 of 1
          </div>

          <button className="h-8 w-8 border rounded-md">›</button>
        </div>
      </div>
<CreateOrderModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
/>
{/* CREATE */}
<CreateOrderModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  mode="create"
/>

{/* EDIT */}
<CreateOrderModal
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  mode="edit"
  editData={selectedOrder}
/>
    </div>
  );
}