import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateInwardModal({ isOpen, onClose, mode, editData }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    supplier: "",
    received_date: "",
    total_quantity: "",
    amount: "",
    notes: "",
    remarks: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    // REQUIRED FIELD VALIDATION
    if (
      !form.supplier ||
      !form.received_date ||
      !form.total_quantity ||
      !form.amount
    ) {
      alert("Please fill all required fields");
      return;
    }

    console.log("SAVE INWARD:", form);
    onClose();
  };
useEffect(() => {
  if (mode === "edit" && editData) {
   setForm({
  supplier: editData.vendor?.vendor_name || "",
  received_date: editData.received_date?.slice(0,10) || "",
  total_quantity: editData.total_quantity || "",
  amount: editData.total_amount || "",   // ✅ MATCH STATE NAME
  notes: "",
  remarks: "",
  is_active: true,
});
  }
}, [editData, mode]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      <div className="w-full max-w-4xl rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl overflow-hidden">

        {/* HEADER */}
       <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
  <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
    {mode === "edit" ? "Edit Inward" : "Create Inward"}
  </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* ===== INWARD DETAILS ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-4">
              INWARD DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm">Supplier *</label>
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="Enter supplier name"
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

              <div>
                <label className="text-sm">Date *</label>
                <input
                  type="date"
                  name="received_date"
                  value={form.received_date}
                  onChange={handleChange}
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

              <div>
                <label className="text-sm">Total Quantity *</label>
                <input
                  name="total_quantity"
                  value={form.total_quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

              <div>
                <label className="text-sm">Amount *</label>
                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter total amount"
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

            </div>
          </div>

          {/* ===== ADDITIONAL DETAILS ===== */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--dashboard-text)] mb-4">
              ADDITIONAL DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter notes"
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

              <div>
                <label className="text-sm">Remarks</label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                  className="mt-1 w-full border border-[var(--border-color)] rounded-md p-2 bg-[var(--dashboard-secondary)]"
                />
              </div>

            </div>
          </div>

          {/* ACTIVE TOGGLE STYLE */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] p-4 bg-[var(--dashboard-secondary)]">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-[var(--dashboard-text-light)]">
                Set the active status of this inward
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={() =>
                setForm({ ...form, is_active: !form.is_active })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="h-9 px-4 rounded-md text-white bg-[var(--dashboard-primary)] hover:bg-[var(--dashboard-primary-hover)]"
          >
            Save Inward
          </button>
        </div>

      </div>
    </div>
  );
}