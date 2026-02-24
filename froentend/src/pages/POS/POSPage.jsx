import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, User, Trash2 } from "lucide-react";
export default function POSPage() {
    const [cart, setCart] = useState([]);
const [activeTab, setActiveTab] = useState("all");
const [entryMode, setEntryMode] = useState("items");
const navigate = useNavigate();
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentType, setPaymentType] = useState("");
const openPayment = (type) => {
  setPaymentType(type);
  setShowPaymentModal(true);
};
// "items" = normal cart
// "manual" = manual amount view
const addToCart = (item) => {
  setCart(prev => {
    const exist = prev.find(p => p.id === item.id);

    if (exist) {
      return prev.map(p =>
        p.id === item.id ? { ...p, qty: p.qty + 1 } : p
      );
    }

    return [...prev, { ...item, qty: 1 }];
  });
};

// ✅ INCREASE QTY
const increaseQty = (id) => {
  setCart(prev =>
    prev.map(p =>
      p.id === id ? { ...p, qty: p.qty + 1 } : p
    )
  );
};

// ✅ DECREASE QTY
const decreaseQty = (id) => {
  setCart(prev =>
    prev
      .map(p =>
        p.id === id ? { ...p, qty: p.qty - 1 } : p
      )
      .filter(p => p.qty > 0)
  );
};

// ✅ REMOVE ITEM
const removeItem = (id) => {
  setCart(prev => prev.filter(p => p.id !== id));
};
const subtotal = cart.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const tax = subtotal * 0.028; 
const total = subtotal + tax;
const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
const products = {
    
  medication: [
    { id:1, name:"Deworming - Adult Dog", code:"FTH-M-0010", price:200 },
    { id:2, name:"Deworming - Puppy", code:"FTH-M-0009", price:150 },
    { id:3, name:"Flea & Tick Treatment", code:"FTH-M-0011", price:300 },
    { id:4, name:"Heartworm Prevention", code:"FTH-M-0012", price:350 },
    { id:5, name:"Vaccination - DHPP", code:"FTH-M-0004", price:600 },
    { id:6, name:"Vaccination - Rabies", code:"FTH-M-0003", price:250 },
  ],

  product: [
    { id:11, name:"Pet Carrier - Small", code:"FTH-P-0029", price:2500 },
    { id:12, name:"Prescription Diet Food", code:"FTH-P-0028", price:1450 },
  ],

  service: [
    { id:21, name:"Blood Test - CBC", code:"FTH-S-0017", price:800 },
    { id:22, name:"Blood Test - Chemistry", code:"FTH-S-0018", price:1500 },
    { id:23, name:"Consultation - General", code:"FTH-S-0001", price:500 },
    { id:24, name:"Cremation - Large Pet", code:"FTH-S-0023", price:5000 },
    { id:25, name:"Dental Cleaning", code:"FTH-S-0014", price:3000 },
    { id:26, name:"Emergency Consultation", code:"FTH-S-0002", price:1200 },
  ]
};
const allProducts = [
  ...products.medication,
  ...products.product,
  ...products.service,
];
  return (
<div className="h-screen w-full bg-[#f6f2fa] flex flex-col overflow-hidden">
               {/* ⭐ POS TOP RIGHT HEADER */}
<div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-end">
<div className="flex flex-wrap gap-3 items-center justify-end">
        <button
  onClick={() => navigate("/bills-payments")}
  className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2
  hover:bg-[var(--dashboard-primary)] hover:text-white
  transition-colors duration-200"
>
      <ArrowLeft className="w-4 h-4"/> Bills & Payments
    </button>

   <button
  onClick={() =>
    setEntryMode(entryMode === "items" ? "manual" : "items")
  }
  className="px-4 py-2 border border-gray-200 rounded-lg
hover:bg-[var(--dashboard-primary)] hover:text-white
transition-colors duration-200"
>
  {entryMode === "manual" ? "Item Entry" : "Manual Entry"}
</button>
   <div className="flex items-center gap-2">
  <span className="text-sm font-medium">Print</span>

  <button className="relative w-11 h-6 bg-[var(--dashboard-primary)] rounded-full transition">
    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
  </button>
</div>
  </div>
</div>


      {/* ⭐ BODY SECTION */}
<div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
            {/* LEFT CART AREA */}
<div className="w-full lg:w-1/2 bg-white lg:border-r lg:border-gray-200 flex flex-col overflow-hidden">
        {/* ⭐ Branch + Customer (MOVE HERE) */}
<div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
     <div className="flex flex-col w-full md:w-1/2">
    <label className="text-sm font-medium">Branch *</label>
    <input
      className="border border-gray-200 rounded-lg px-3 py-2"
      defaultValue="Fusionedge Test Hospital - Main Branch"
    />
  </div>

 <div className="flex flex-col w-full md:w-1/2">
    <label className="text-sm font-medium flex items-center gap-2">
      <User className="w-4 h-4"/> Customer
    </label>
    <input
      className="border border-gray-200 rounded-lg px-3 py-2"
      placeholder="Search and select pet"
    />
  </div>

</div>
     {entryMode === "manual" ? (

  /* =======================
     MANUAL ENTRY VIEW
  ======================= */
  <div className="flex-1 p-4 space-y-3">
    <label className="text-sm font-medium">Total Amount</label>

    <input
      type="number"
      placeholder="Enter amount"
      className="border border-gray-200 rounded-lg px-3 py-2 w-full"
    />

    <p className="text-sm text-gray-500">
      Manual entry mode: Enter the total amount directly
    </p>
  </div>

) : (

  /* =======================
     NORMAL CART VIEW
  ======================= */
<div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
    {cart.length === 0 && (
      <div className="h-full flex flex-col justify-center items-center text-gray-500">
        <p className="text-lg font-semibold">No items in cart</p>
        <p className="text-sm">Select products from the right panel</p>
      </div>
    )}

    {cart.map(item => (
      <div key={item.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">

        <div className="flex flex-col gap-2 w-1/2">
          <p className="font-semibold">{item.name}</p>

          <div className="flex items-center gap-2">
            <button
  onClick={()=>decreaseQty(item.id)}
  className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center
  text-gray-600
  hover:bg-[var(--dashboard-primary)] hover:text-white hover:border-[var(--dashboard-primary)]
  transition-all duration-200"
>
  -
</button>

<span className="w-14 h-10 border border-gray-200 rounded-lg flex items-center justify-center">
  {item.qty}
</span>

<button
  onClick={()=>increaseQty(item.id)}
  className="w-10 h-10 border border-gray-200 flex items-center justify-center
  text-gray-600
  hover:bg-[var(--dashboard-primary)] hover:text-white hover:border-[var(--dashboard-primary)]
  transition-all duration-200"
>
  +
</button>
</div>
        </div>

        <div className="w-1/4 flex justify-center">
          <button className="border border-gray-200 px-6 py-2 rounded-lg text-gray-500">
            Discount
          </button>
        </div>

        <div className="text-right w-1/4">
          <button onClick={()=>removeItem(item.id)} className="text-red-500 hover:text-red-600 transition">
            <Trash2 size={18} />
          </button>

          <p className="font-bold">
            {formatINR(item.price * item.qty)}
          </p>

          <p className="text-sm text-gray-500">
            {item.qty} x {formatINR(item.price)}
          </p>
        </div>

      </div>
    ))}

  </div>

)}
        <div className="p-4 border-t border-gray-200 space-y-2 bg-white">
            <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax:</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between text-sm"><span>Discount:</span><span>RS 0.00</span></div>

            <div className="flex justify-between text-xl font-bold pt-2">
              <span>Total:</span><span>{formatINR(total)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3">
              <button
  onClick={() => openPayment("Cash")}
  className="bg-green-600 text-white py-2 rounded-lg"
>
  Cash
</button>

<button
  onClick={() => openPayment("Card")}
  className="bg-blue-600 text-white py-2 rounded-lg"
>
  Card
</button>

<button
  onClick={() => openPayment("Mobile Money")}
  className="bg-purple-600 text-white py-2 rounded-lg"
>
  Mobile Money
</button>

<button
  onClick={() => openPayment("Custom")}
  className="bg-gray-500 text-white py-2 rounded-lg"
>
  Custom
</button>
</div>
          </div>
        </div>

        {/* RIGHT PRODUCTS PANEL */}
<div className="w-full lg:w-1/2 p-4 overflow-y-auto border-l-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4"/>
            <input placeholder="Search products..." className="w-full pl-9 border border-gray-200 rounded-lg px-3 py-2"/>
          </div>

<div className="flex gap-2 mb-4">
<button
onClick={()=>setActiveTab("all")}
 className={`px-4 py-1 rounded-lg ${
   activeTab==="all"
     ? "bg-[var(--dashboard-primary)] text-white"
     : "border border-gray-200"
 }`}
>
All Items
</button>
<button
 onClick={()=>setActiveTab("medication")}
 className={`px-4 py-1 rounded-lg ${
   activeTab==="medication"
     ? "bg-[var(--dashboard-primary)] text-white"
     : "border border-gray-200"
 }`}
>
Medication
</button>

<button
 onClick={()=>setActiveTab("product")}
 className={`px-4 py-1 rounded-lg ${
   activeTab==="product"
     ? "bg-[var(--dashboard-primary)] text-white"
     : "border border-gray-200"
 }`}
>
Product
</button>

<button
 onClick={()=>setActiveTab("service")}
 className={`px-4 py-1 rounded-lg ${
   activeTab==="service"
     ? "bg-[var(--dashboard-primary)] text-white"
     : "border border-gray-200"
 }`}
>
Service
</button>

</div>
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
{(activeTab === "all" ? allProducts : products[activeTab]).map(item => (
      <div
    key={item.id}
    onClick={()=>addToCart(item)}
className="
bg-white p-6 rounded-2xl shadow-sm
border border-gray-200
cursor-pointer
hover:border-[var(--dashboard-primary)]
hover:ring-2 hover:ring-[var(--dashboard-primary)]/20
hover:shadow-md
transition-all duration-200
"  >
    <p className="font-semibold">{item.name}</p>
    <p className="text-sm text-gray-500">{item.code}</p>
    <p className="text-pink-500 font-bold mt-3">{formatINR(item.price)}</p>
  </div>
))}

</div>
        </div>

      </div>
      {showPaymentModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowPaymentModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Confirm Payment
      </h2>

      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <p>Customer: Walk-in Customer</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Items: {cart.length}</p>

        <p className="text-xl font-bold mt-2">
          Total: {formatINR(total)}
        </p>
      </div>

      <p className="mb-4">
        {paymentType}: {formatINR(total)}
      </p>

      <textarea
        placeholder="Add any terms, conditions, or notes..."
        className="w-full border border-gray-200 rounded-lg p-2 mb-4"
      />

      <button className="w-full bg-pink-400 text-white py-2 rounded-lg">
        Confirm Payment
      </button>

    </div>

  </div>
)}
    </div>
  );
}