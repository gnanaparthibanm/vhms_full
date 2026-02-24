import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { data, useLocation } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { X, Search } from 'lucide-react';
const items = [
    { name: "Pet Carrier - Small", desc: "Small pet carrier for transport", stock: 7, cost: 2200, price: 2500 },
    { name: "Prescription Diet Food", desc: "Special dietary food for medical conditions", stock: 8, cost: 1200, price: 1450 },
    { name: "Heartworm Prevention", desc: "Monthly prevention for heartworms", stock: 199, cost: 300, price: 350 },
    { name: "Flea & Tick Treatment", desc: "Treatment for fleas and ticks", stock: 200, cost: 250, price: 300 },
    { name: "Deworming - Adult Dog", desc: "Deworming medication for adult dogs", stock: 199, cost: 150, price: 200 },
    { name: "Deworming - Puppy", desc: "Deworming medication for puppies", stock: 199, cost: 100, price: 150 },
    { name: "Vaccination - DHPP", desc: "Distemper, Hepatitis, Parvo, Parainfluenza", stock: 100, cost: 500, price: 600 },
    { name: "Vaccination - Rabies", desc: "Rabies vaccine for dogs and cats", stock: 98, cost: 200, price: 250 },
];
const InventoryCreate = () => {
    const location = useLocation()
    const [isActive, setIsActive] = useState(true)
    const [selectedBranch, setSelectedBranch] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const isUpdatePage = location.pathname.includes("update")
    const pageTitle = isUpdatePage ? "Edit Stock Adjustment" : "Add New Stock Adjustment"
    const [formData, setFormData] = useState({
        branch: "",
        status: "Confirmed",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        reason: "",
        notes: "",
    })



    return (
        <div className="mx-auto bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold  mb-6">
                {pageTitle}
            </h1>

            <form className="space-y-8">

                {/* Row 1 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Branch *</Label>
                        <Select onValueChange={(value) => {
                            setSelectedBranch(value)
                        }}>
                            <SelectTrigger className="h-11 bg-[var(--card-bg)]  border-[var(--border-color)]">
                                <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="main">Main Branch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Billable Item *</Label>
                        <Input
                            onClick={() => setOpenModal(true)}
                            className="h-11 bg-[var(--card-bg)]  border-[var(--border-color)]"
                            placeholder="Enter Billable Item"
                        />
                    </div>


                    {/* Modal */}
                    {openModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">

                            {/* Modal Container */}
                            <div className="w-full max-w-4xl bg-[var(--card-bg)]  border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
                                    <h2 className="text-xl font-semibold">Select Item</h2>
                                    <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Search Bar Area */}
                                <div className="px-6 py-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Table Area (Scrollable) */}
                                <div className="flex-1 overflow-auto px-6 pb-6">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-[var(--card-bg)] text-sm font-medium">
                                            <tr className="border-b border-[var(--border-color)]">
                                                <th className="py-3 font-medium">Name</th>
                                                <th className="py-3 font-medium">Description</th>
                                                <th className="py-3 font-medium">Stock</th>
                                                <th className="py-3 font-medium">Cost</th>
                                                <th className="py-3 font-medium">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {items.map((item, idx) => (
                                                <tr key={idx} className="border-b border-[var(--border-color)] cursor-pointer transition-colors">
                                                    <td className="py-4 font-medium">{item.name}</td>
                                                    <td className="py-4">{item.desc}</td>
                                                    <td className="py-4">{item.stock}</td>
                                                    <td className="py-4">{item.cost}</td>
                                                    <td className="py-4">{item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                {/* Row 2 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Type *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            placeholder="Enter Type"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Reference *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            placeholder="Enter Reference"
                        />
                    </div>
                </div>
                {/* Row 3 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Date*</Label>
                        <Input

                            className="h-11 bg-[var(--card-bg)]  border-[var(--border-color)]"
                            type="date"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Reason *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            placeholder="Enter Reason"
                        />
                    </div>
                </div>
                {/* Row 4 */}
                <div className="grid gap-6 md:grid-cols-3 pt-4">
                    <div className="space-y-2">
                        <Label>Cost per Unit*</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            placeholder="Enter Cost per Unit"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            placeholder="Enter Quantity"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Selling Price *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)]  border-[var(--border-color)]"
                            placeholder="Enter Selling Price"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                        className="h-11 bg-[var(--card-bg)]  border-[var(--border-color)]"
                        placeholder="Enter Selling Price"
                    />
                </div>



                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-end gap-3 pt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-[var(--dashboard-primary)] text-white">
                        Create
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default InventoryCreate