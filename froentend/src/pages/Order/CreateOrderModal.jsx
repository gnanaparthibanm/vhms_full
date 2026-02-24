import { useState } from "react";
import { X } from "lucide-react";
import { useEffect } from "react";
export default function CreateOrderModal({ isOpen, onClose, mode, editData }) {
  if (!isOpen) return null;

 const [form, setForm] = useState({
  vendor: "",
  order_date: "",
  total_quantity: "",
  total_amount: "",
  notes: "",
  remarks: "",
  is_active: true,
});

useEffect(() => {
  if (mode === "edit" && editData) {
    setForm({
      vendor: editData.vendor?.vendor_name || "",
      order_date: editData.order_date?.slice(0,10) || "",
      total_quantity: editData.total_quantity || "",
      total_amount: editData.total_amount || "",
      notes: "",
      remarks: "",
      is_active: true,
    });
  }
}, [editData, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!form.vendor || !form.order_date || !form.total_quantity || !form.total_amount) {
      alert("Please fill all mandatory fields");
      return;
    }

    console.log("ORDER DATA:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* CARD */}
      <div className="w-full max-w-3xl rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-color)]">
         <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
  {mode === "edit" ? "Edit Order" : "Create Order"}
</h2>

          <button onClick={onClose}>
            <X size={18}/>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          <h3 className="text-sm font-semibold text-[var(--dashboard-text-light)]">
            ORDER DETAILS
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm">Vendor *</label>
              <input
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                placeholder="Enter vendor name"
className="mt-1 w-full h-10 rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-primary)]"              />
            </div>

            <div>
              <label className="text-sm">Date *</label>
              <input
                type="date"
                name="order_date"
                value={form.order_date}
                onChange={handleChange}
className="mt-1 w-full h-10 rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 text-sm outline-none focus:border-[var(--dashboard-primary)]"              />
            </div>

            <div>
              <label className="text-sm">Total Quantity *</label>
              <input
                name="total_quantity"
                value={form.total_quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
className="mt-1 w-full h-10 rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 text-sm outline-none focus:border-[var(--dashboard-primary)]"              />
            </div>

            <div>
              <label className="text-sm">Amount *</label>
              <input
                name="total_amount"
                value={form.total_amount}
                onChange={handleChange}
                placeholder="Enter total amount"
className="mt-1 w-full h-10 rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 text-sm outline-none focus:border-[var(--dashboard-primary)]"              />
            </div>
          </div>

          {/* ADDITIONAL */}
          <h3 className="text-sm font-semibold text-[var(--dashboard-text-light)]">
            ADDITIONAL DETAILS
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter notes"
className="h-24 w-full rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--dashboard-primary)]"            />
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
className="h-24 w-full rounded-md border border-[var(--border-color)] bg-[var(--dashboard-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--dashboard-primary)]"            />
          </div>

          {/* ACTIVE */}
          <div className="flex justify-between items-center border rounded-md p-4 bg-[var(--dashboard-secondary)]">
            <div>
              <p className="font-medium">Active</p>
              <p className="text-xs text-[var(--dashboard-text-light)]">
                Set active status of order
              </p>
            </div>

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-[var(--border-color)]"
          >
            Cancel
          </button>

         <button
  onClick={handleSubmit}
  className="h-9 px-4 rounded-md text-white bg-[var(--dashboard-primary)]"
>
  {mode === "edit" ? "Update Order" : "Save Order"}
</button>
        </div>

      </div>
    </div>
  );
}