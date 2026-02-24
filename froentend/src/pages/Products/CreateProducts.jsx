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
import { useLocation } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import ReactSelect from "react-select";
const CreateProducts = () => {
    const location = useLocation()
    const isUpdatePage = location.pathname.includes("update")
    const pageTitle = isUpdatePage ? "Edit Product" : "Add New Product"

    const [formData, setFormData] = useState({
        product_name: "",
        product_code: "",
        category_id: "",
        sub_category_id: "",
        brand: "",
        unit: "",
        purchase_price: 0,
        selling_price: 0,
        min_quantity: 0,
        max_quantity: 0,
        tax_percentage: 0,
        description: "",
        status: "active",
        product_type: "", // ✅ No default selection
        is_prescription_item: false,
        generic_name: "",
        strength: "",
        dosage_form: "",
        manufacturer: "",
        batch_number: "",
        expiry_date: "",
        storage_conditions: "",
        side_effects: "",
        contraindications: "",
        requires_prescription: false,
        is_active: true,
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? Number(value)
                        : value
        })
    }

    const isMedicalType = ["medication", "vaccine", "supplement"].includes(formData.product_type)


const categoryOptions = [
  { value: "1", label: "Medications" },
  { value: "2", label: "Vaccines" },
  { value: "3", label: "Supplements" },
  { value: "4", label: "Surgical Equipment" },
  { value: "5", label: "Diagnostic Supplies" },
  { value: "6", label: "Pet Food" },
  { value: "7", label: "Grooming Products" },
  { value: "8", label: "Accessories" },
];

const subCategoryOptions = [
  { value: "1", label: "Antibiotics" },
  { value: "2", label: "Pain Relievers" },
  { value: "3", label: "Dewormers" },
  { value: "4", label: "Rabies Vaccine" },
  { value: "5", label: "Distemper Vaccine" },
  { value: "6", label: "Vitamin Supplements" },
  { value: "7", label: "Surgical Gloves" },
  { value: "8", label: "Syringes & Needles" },
  { value: "9", label: "Bandages & Dressings" },
  { value: "10", label: "Dry Dog Food" },
  { value: "11", label: "Cat Food" },
  { value: "12", label: "Shampoo & Conditioner" },
];
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--dashboard-primary)",
    },
    
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--card-bg)",
    color: "var(--dashboard-text)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--dashboard-text)",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "gray",
    
  }),
  
};
    return (
        <div className="mx-auto bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

            <form className="space-y-8">

                {/* Row 1 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Product Name *</Label>
                        <Input
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Product Code *</Label>
                        <Input
                            name="product_code"
                            value={formData.product_code}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">

                    {/* Category Select */}
                    <div className="space-y-2">
                        <Label>Category Name</Label>
                        <ReactSelect
                            options={categoryOptions}
                            value={categoryOptions.find(
                                (option) => option.value === formData.category_id
                            )}
                            onChange={(selectedOption) =>
                                setFormData({
                                    ...formData,
                                    category_id: selectedOption.value,
                                })
                            }
                            styles={customSelectStyles}
                            classNamePrefix="select"
                            placeholder="Search Category..."
                            isSearchable
                        />
                    </div>

                    {/* Sub Category Select */}
                    <div className="space-y-2">
                        <Label>Sub Category Name</Label>
                        <ReactSelect
                            options={subCategoryOptions}
                            value={subCategoryOptions.find(
                                (option) => option.value === formData.sub_category_id
                            )}
                            onChange={(selectedOption) =>
                                setFormData({
                                    ...formData,
                                    sub_category_id: selectedOption.value,
                                })
                            }
                            styles={customSelectStyles}
                            classNamePrefix="select"
                            placeholder="Search Sub Category..."
                            isSearchable
                        />
                    </div>

                </div>

                {/* Brand & Unit */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input name="brand" value={formData.brand} onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid gap-6 md:grid-cols-3 pt-4">
                    <div className="space-y-2">
                        <Label>Purchase Price *</Label>
                        <Input type="number" name="purchase_price"
                            value={formData.purchase_price}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Selling Price</Label>
                        <Input type="number" name="selling_price"
                            value={formData.selling_price}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tax Percentage</Label>
                        <Input type="number" name="tax_percentage"
                            value={formData.tax_percentage}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>

                {/* Quantity */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Minimum Quantity</Label>
                        <Input type="number" name="min_quantity"
                            value={formData.min_quantity}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Maximum Quantity</Label>
                        <Input type="number" name="max_quantity"
                            value={formData.max_quantity}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>

                {/* Product Type & Status */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Product Type *</Label>
                        <Select
                            value={formData.product_type}
                            onValueChange={(value) =>
                                setFormData({ ...formData, product_type: value })
                            }
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="medication">Medication</SelectItem>
                                <SelectItem value="vaccine">Vaccine</SelectItem>
                                <SelectItem value="supplement">Supplement</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="consumable">Consumable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                            }
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* MEDICAL FIELDS */}

                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Generic Name</Label>
                        <Input name="generic_name" value={formData.generic_name}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Strength</Label>
                        <Input name="strength" value={formData.strength}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2 pt-4">
                        <Label>Dosage Form</Label>
                        <Select
                            value={formData.dosage_form}
                            onValueChange={(value) =>
                                setFormData({ ...formData, dosage_form: value })
                            }
                        >
                            <SelectTrigger className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]">
                                <SelectValue placeholder="Select Dosage Form" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tablet">Tablet</SelectItem>
                                <SelectItem value="capsule">Capsule</SelectItem>
                                <SelectItem value="syrup">Syrup</SelectItem>
                                <SelectItem value="injection">Injection</SelectItem>
                                <SelectItem value="ointment">Ointment</SelectItem>
                                <SelectItem value="drops">Drops</SelectItem>
                                <SelectItem value="powder">Powder</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 pt-4">
                        <Label>Expiry Date</Label>
                        <Input type="date" name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Manufacturer</Label>
                        <Input name="manufacturer" value={formData.manufacturer}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                    <div className="space-y-2">
                        <Label>Batch Number</Label>
                        <Input name="batch_number" value={formData.batch_number}
                            onChange={handleChange}
                            className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <Label>Storage Conditions</Label>
                    <Textarea name="storage_conditions"
                        value={formData.storage_conditions}
                        onChange={handleChange}
                        className="bg-[var(--card-bg)] border-[var(--border-color)]" />
                </div>

                <div className="space-y-2 pt-4">
                    <Label>Side Effects</Label>
                    <Textarea name="side_effects"
                        value={formData.side_effects}
                        onChange={handleChange}
                        className="bg-[var(--card-bg)] border-[var(--border-color)]" />
                </div>

                <div className="space-y-2 pt-4">
                    <Label>Contraindications</Label>
                    <Textarea name="contraindications"
                        value={formData.contraindications}
                        onChange={handleChange}
                        className="bg-[var(--card-bg)] border-[var(--border-color)]" />
                </div>

                {/* Boolean */}
                <div className="grid gap-6 md:grid-cols-3 pt-4">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_prescription_item"
                            checked={formData.is_prescription_item}
                            onChange={handleChange} />
                        <Label>Prescription Item</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="requires_prescription"
                            checked={formData.requires_prescription}
                            onChange={handleChange} />
                        <Label>Requires Prescription</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange} />
                        <Label>Is Active</Label>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-[var(--card-bg)] border-[var(--border-color)]" />
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-end gap-3 pt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-[var(--dashboard-primary)] text-white">
                        {isUpdatePage ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateProducts