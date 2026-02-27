import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, User, Trash2, Plus, X } from "lucide-react";
import { posService } from "../../services/posService";
import clientService from "../../services/clientService";

// Simple toast notification
const toast = {
  success: (message) => alert(message),
  error: (message) => alert(message)
};

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [entryMode, setEntryMode] = useState("items");
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeDiscountItem, setActiveDiscountItem] = useState(null);

  // Client management
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const clientDropdownRef = useRef(null);

  // New client form - ensure all fields have default empty strings
  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    client_email: "",
    client_phone: "",
    client_address: ""
  });

  // Dynamic data from backend
  const [products, setProducts] = useState({ medication: [], product: [], service: [] });
  const [allProducts, setAllProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    fetchData();
    fetchClients();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients({ limit: 1000 });
      const clientData = response.data?.data || response.data || [];
      setClients(clientData);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, paymentMethodsRes, taxRatesRes, discountsRes] = await Promise.all([
        posService.getAllItems({ limit: 1000, status: 'Active' }),
        posService.getPaymentMethods(),
        posService.getTaxRates(),
        posService.getDiscounts()
      ]);

      const items = itemsRes.data?.data?.data || itemsRes.data?.data || [];

      // Group items by type
      const grouped = {
        medication: items.filter(item => item.type === 'Medication'),
        product: items.filter(item => item.type === 'Product'),
        service: items.filter(item => item.type === 'Service')
      };

      setProducts(grouped);
      setAllProducts(items);
      setPaymentMethods(paymentMethodsRes.data?.data?.data || paymentMethodsRes.data?.data || []);
      setTaxRates(taxRatesRes.data?.data?.data || taxRatesRes.data?.data || []);

      // Extract the discount array safely since payload shape can vary
      let extractedDiscounts = discountsRes.data?.data?.data || discountsRes.data?.data || [];
      if (!Array.isArray(extractedDiscounts) && extractedDiscounts.data) {
        extractedDiscounts = extractedDiscounts.data;
      }
      setDiscounts(Array.isArray(extractedDiscounts) ? extractedDiscounts : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };
  const openPayment = (type) => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    setClientSearchQuery(fullName);
    setShowClientDropdown(false);
  };

  const handleAddNewClient = async () => {
    if (!newClient.first_name || !newClient.client_phone) {
      toast.error('Please fill in required fields (First Name and Phone)');
      return;
    }

    try {
      const response = await clientService.createClient(newClient);
      const createdClient = response.data?.data || response.data;

      toast.success('Client added successfully!');

      // Add to clients list and select it
      setClients(prev => [...prev, createdClient]);
      setSelectedClient(createdClient);
      const fullName = `${createdClient.first_name || ''} ${createdClient.last_name || ''}`.trim();
      setClientSearchQuery(fullName);

      // Reset form and close modal
      setNewClient({
        first_name: "",
        last_name: "",
        client_email: "",
        client_phone: "",
        client_address: ""
      });
      setShowAddClientModal(false);
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error(err.response?.data?.message || 'Failed to add client');
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = (clientSearchQuery || '').toLowerCase();
    const firstName = (client?.first_name || '').toLowerCase();
    const lastName = (client?.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const clientPhone = (client?.phone || '').toLowerCase();
    const clientCode = (client?.client_code || '').toLowerCase();

    return firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      fullName.includes(searchLower) ||
      clientPhone.includes(searchLower) ||
      clientCode.includes(searchLower);
  });

  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === item.id);

      if (exist) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      // Extract tax rate from item (e.g., "5.00%" -> 5.00)
      let itemTaxRate = 0;
      if (item.tax_rate) {
        const taxStr = item.tax_rate.toString().replace('%', '');
        itemTaxRate = parseFloat(taxStr) || 0;
      }

      return [...prev, {
        id: item.id,
        name: item.name,
        code: item.sku,
        price: parseFloat(item.price),
        type: item.type,
        qty: 1,
        tax_rate: itemTaxRate // Store the tax rate with the item
      }];
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

  // ✅ APPLY DISCOUNT
  const applyDiscount = (discount) => {
    setCart(prev => prev.map(p => {
      if (p.id === activeDiscountItem) {
        if (!discount) { // Clear discount
          return {
            ...p,
            discount_id: null,
            discount_name: null,
            discount_type: null,
            discount_value: null
          };
        }
        return {
          ...p,
          discount_id: discount.id,
          discount_name: discount.name,
          discount_type: discount.type,
          discount_value: discount.value
        };
      }
      return p;
    }));
    setShowDiscountModal(false);
    setActiveDiscountItem(null);
  };

  const openDiscountModal = (itemId) => {
    setActiveDiscountItem(itemId);
    setShowDiscountModal(true);
  };

  const clearAllDiscounts = () => {
    setCart(prev => prev.map(p => ({
      ...p,
      discount_id: null,
      discount_name: null,
      discount_type: null,
      discount_value: null
    })));
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  let totalDiscount = 0;

  // Calculate tax based on individual item tax rates and discounts
  const tax = cart.reduce((sum, item) => {
    const itemSubtotal = item.price * item.qty;
    let itemDisc = 0;
    if (item.discount_value) {
      if (item.discount_type?.toLowerCase() === 'percentage') {
        itemDisc = itemSubtotal * (parseFloat(item.discount_value) / 100);
      } else {
        itemDisc = parseFloat(item.discount_value) || 0;
        if (itemDisc > itemSubtotal) itemDisc = itemSubtotal;
      }
    }
    totalDiscount += itemDisc;
    const afterDiscount = itemSubtotal - itemDisc;

    const itemTaxRate = (item.tax_rate || 0) / 100;
    const itemTax = afterDiscount * itemTaxRate;
    return sum + itemTax;
  }, 0);

  const total = subtotal - totalDiscount + tax;

  console.log('Tax Calculation Debug:', {
    subtotal,
    tax,
    total,
    cartItems: cart.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty,
      tax_rate: item.tax_rate,
      itemSubtotal: item.price * item.qty,
      itemTax: (item.price * item.qty * (item.tax_rate || 0) / 100)
    }))
  });

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsSaving(true);

      const saleData = {
        customer_name: selectedClient ? `${selectedClient.first_name} ${selectedClient.last_name}` : 'Walk-in Customer',
        customer_phone: selectedClient ? selectedClient.phone : null,
        sale_date: new Date().toISOString(),
        subtotal_amount: subtotal,
        discount_amount: totalDiscount,
        tax_amount: tax,
        tax_rate: null, // Individual items have their own tax rates
        total_amount: total,
        paid_amount: total,
        payment_method: paymentType.toLowerCase(),
        status: 'completed',
        notes: notes || null,
        items: cart.map(item => {
          const itemSubtotal = item.price * item.qty;
          let itemDisc = 0;
          if (item.discount_value) {
            if (item.discount_type?.toLowerCase() === 'percentage') {
              itemDisc = itemSubtotal * (parseFloat(item.discount_value) / 100);
            } else {
              itemDisc = parseFloat(item.discount_value) || 0;
              if (itemDisc > itemSubtotal) itemDisc = itemSubtotal;
            }
          }
          const afterDiscount = itemSubtotal - itemDisc;
          const itemTaxRate = (item.tax_rate || 0) / 100;
          const itemTax = afterDiscount * itemTaxRate;
          const itemTotal = afterDiscount + itemTax;

          return {
            billable_item_id: item.id,
            item_name: item.name,
            item_type: item.type,
            quantity: item.qty,
            unit_price: item.price,
            discount_amount: itemDisc,
            tax_amount: itemTax,
            total_price: itemTotal
          };
        })
      };

      await posService.createSale(saleData);

      toast.success('Sale completed successfully!');

      // Reset form
      setCart([]);
      setSelectedClient(null);
      setClientSearchQuery('');
      setNotes('');
      setShowPaymentModal(false);
      setPaymentType('');
    } catch (err) {
      console.error('Error creating sale:', err);
      toast.error(err.response?.data?.message || 'Failed to complete sale');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products by search query
  const filteredProducts = (activeTab === "all" ? allProducts : products[activeTab] || [])
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  return (
    <div className="h-screen w-full bg-[#f6f2fa] flex flex-col overflow-hidden">
      {/* ⭐ POS TOP RIGHT HEADER */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between">
        <button
            onClick={() => navigate("/bills-payments")}
            className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2
  hover:bg-[var(--dashboard-primary)] hover:text-white
  transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Bills & Payments
          </button>
        <div className="flex flex-wrap gap-3 items-center justify-end">
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
          {/* ⭐ Client Selection */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative" ref={clientDropdownRef}>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User className="w-4 h-4" /> Client
              </label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                placeholder="Search client by name, phone, or code..."
                value={clientSearchQuery || ""}
                onChange={(e) => {
                  setClientSearchQuery(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
              />

              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {/* Add New Client Option */}
                  <button
                    onClick={() => {
                      setShowAddClientModal(true);
                      setShowClientDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-200 flex items-center gap-2 text-blue-600 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Client
                  </button>

                  {/* Walk-in Customer Option */}
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setClientSearchQuery('Walk-in Customer');
                      setShowClientDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="font-medium">Walk-in Customer</div>
                    <div className="text-xs text-gray-500">No client information</div>
                  </button>

                  {/* Client List */}
                  {filteredClients.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No clients found
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100"
                      >
                        <div className="font-medium">{client.first_name} {client.last_name}</div>
                        <div className="text-xs text-gray-500">
                          {client.client_code} • {client.phone}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
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
                        onClick={() => decreaseQty(item.id)}
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
                        onClick={() => increaseQty(item.id)}
                        className="w-10 h-10 border border-gray-200 flex items-center justify-center
  text-gray-600
  hover:bg-[var(--dashboard-primary)] hover:text-white hover:border-[var(--dashboard-primary)]
  transition-all duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-1/4 flex justify-center flex-col items-center">
                    <button
                      onClick={() => openDiscountModal(item.id)}
                      className="border border-gray-200 px-6 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      {item.discount_name ? item.discount_name : "Discount"}
                    </button>
                    {item.discount_value && (
                      <span className="text-xs text-green-600 mt-1">
                        {item.discount_type?.toLowerCase() === 'percentage' ? `${item.discount_value}%` : `₹${item.discount_value}`} Off
                      </span>
                    )}
                  </div>

                  <div className="text-right w-1/4">
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 transition">
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
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Discount:</span>
              <div className="flex items-center gap-2">
                {totalDiscount > 0 && (
                  <button
                    onClick={clearAllDiscounts}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    title="Remove all discounts"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <span className="text-green-600">- {formatINR(totalDiscount)}</span>
              </div>
            </div>

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
            <Search className="absolute left-3 top-3 w-4 h-4" />
            <input
              placeholder="Search products..."
              className="w-full pl-9 border border-gray-200 rounded-lg px-3 py-2"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1 rounded-lg ${activeTab === "all"
                ? "bg-[var(--dashboard-primary)] text-white"
                : "border border-gray-200"
                }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab("medication")}
              className={`px-4 py-1 rounded-lg ${activeTab === "medication"
                ? "bg-[var(--dashboard-primary)] text-white"
                : "border border-gray-200"
                }`}
            >
              Medication
            </button>

            <button
              onClick={() => setActiveTab("product")}
              className={`px-4 py-1 rounded-lg ${activeTab === "product"
                ? "bg-[var(--dashboard-primary)] text-white"
                : "border border-gray-200"
                }`}
            >
              Product
            </button>

            <button
              onClick={() => setActiveTab("service")}
              className={`px-4 py-1 rounded-lg ${activeTab === "service"
                ? "bg-[var(--dashboard-primary)] text-white"
                : "border border-gray-200"
                }`}
            >
              Service
            </button>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading items...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No items found
              </div>
            ) : (
              filteredProducts.map(item => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
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
                  <p className="text-sm text-gray-500">{item.sku || 'N/A'}</p>
                  <p className="text-pink-500 font-bold mt-3">{formatINR(parseFloat(item.price))}</p>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

      {/* Add New Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAddClientModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Add New Client
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter first name"
                  value={newClient.first_name || ""}
                  onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter last name"
                  value={newClient.last_name || ""}
                  onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter phone number"
                  value={newClient.client_phone || ""}
                  onChange={(e) => setNewClient({ ...newClient, client_phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter email address"
                  value={newClient.client_email || ""}
                  onChange={(e) => setNewClient({ ...newClient, client_email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter address"
                  rows="3"
                  value={newClient.client_address || ""}
                  onChange={(e) => setNewClient({ ...newClient, client_address: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddClientModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewClient}
                className="flex-1 px-4 py-2 bg-[var(--dashboard-primary)] text-white rounded-lg hover:bg-[var(--dashboard-primary-hover)]"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

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
              <p>Customer: {selectedClient ? `${selectedClient.first_name} ${selectedClient.last_name}` : 'Walk-in Customer'}</p>
              {selectedClient && selectedClient.phone && (
                <p>Phone: {selectedClient.phone}</p>
              )}
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Items: {cart.length}</p>

              <p className="text-xl font-bold mt-2">
                Total: {formatINR(total)}
              </p>
            </div>

            <p className="mb-4">
              Payment Method: {paymentType}
            </p>

            <textarea
              placeholder="Add any terms, conditions, or notes..."
              className="w-full border border-gray-200 rounded-lg p-2 mb-4"
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              onClick={handleConfirmPayment}
              disabled={isSaving}
              className="w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Processing...' : 'Confirm Payment'}
            </button>

          </div>
        </div>
      )}

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6 relative max-h-[80vh] flex flex-col">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowDiscountModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              <span>Select Discount</span>
              {cart.find(item => item.id === activeDiscountItem)?.discount_id && (
                <button
                  onClick={() => applyDiscount(null)}
                  className="text-sm text-red-500 hover:text-red-700 font-normal px-2 py-1 rounded border border-transparent hover:border-red-200 transition-colors"
                >
                  Remove Discount
                </button>
              )}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2">
              {discounts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No discounts available</p>
              ) : (
                discounts.map(discount => {
                  // calculate what it looks like
                  const discValue = discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`;
                  return (
                    <div
                      key={discount.id}
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-[var(--dashboard-primary)] hover:bg-gray-50 transition"
                      onClick={() => applyDiscount(discount)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">{discount.name}</span>
                        <span className="text-green-600 font-bold">{discValue}</span>
                      </div>
                      <p className="text-xs text-gray-500">{discount.description || 'No description'}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}