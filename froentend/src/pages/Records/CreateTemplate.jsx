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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CreateTemplate = () => {
    const location = useLocation()
    const isUpdatePage = location.pathname.includes("update")
    const pageTitle = isUpdatePage ? "Edit Template" : "Create Template"

    const [fields, setFields] = useState([
        { id: 1, label: '', type: 'text', required: false }
    ]);

    const addField = () => {
        const newId =
            fields.length > 0
                ? Math.max(...fields.map(f => f.id)) + 1
                : 1;

        setFields([
            ...fields,
            { id: newId, label: '', type: 'text', required: false }
        ]);
    };

    const removeField = (id) => {
        setFields(fields.filter(field => field.id !== id));
    };

    return (
        <div>
            <div className="mx-auto bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

                <form className="space-y-8">

                    {/* Row 1 */}
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                name="product_name"
                                className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Record Type *</Label>
                            <Select
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

                    {/* Brand & Unit */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Version</Label>
                            <Input name="brand"
                                className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                        </div>
                    </div>

                    {/* Boolean */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_prescription_item" />
                            <Label>Prescription Item</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="requires_prescription" />
                            <Label>Requires Prescription</Label>
                        </div>
                    </div>
                </form>
            </div>
            <Card className="w-full max-w-4xl mx-auto shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <CardTitle className="text-lg font-semibold tracking-tight">
                        Template Fields *
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-6 pt-0">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="bg-card shadow-sm border">
                            <CardContent className="p-6 space-y-4">
                                {/* Header: Field Name and Delete */}
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium">Field {index + 1}</h4>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeField(field.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Grid: Label and Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`label-${field.id}`}>Label</Label>
                                        <Input
                                            id={`label-${field.id}`}
                                            placeholder="Enter field label"
                                            className="h-9"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`type-${field.id}`}>Type</Label>
                                        <Select defaultValue={field.type}>
                                            <SelectTrigger id={`type-${field.id}`} className="h-9">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="textarea">Text Area</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="select">Select</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Radio Group: Required/Optional */}
                                <RadioGroup
                                    defaultValue={field.required ? "required" : "optional"}
                                    className="flex items-center space-x-6 pt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="required" id={`req-${field.id}`} />
                                        <Label htmlFor={`req-${field.id}`} className="font-normal cursor-pointer">Required</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="optional" id={`opt-${field.id}`} />
                                        <Label htmlFor={`opt-${field.id}`} className="font-normal cursor-pointer">Optional</Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Footer: Add Field Button */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={addField}
                            size="sm"
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Field
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateTemplate