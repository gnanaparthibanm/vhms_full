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
        { id: 1, label: '', type: 'text', required: false, options: [], subFields: [] }
    ])
    const addField = () => {
        const newId =
            fields.length > 0
                ? Math.max(...fields.map(f => f.id)) + 1
                : 1

        setFields([
            ...fields,
            { id: newId, label: '', type: 'text', required: false, options: [], subFields: [] }
        ])
    }
    const addSubField = (parentId) => {
        setFields(fields.map(field => {
            if (field.id === parentId) {
                const newId =
                    field.subFields.length > 0
                        ? Math.max(...field.subFields.map(f => f.id)) + 1
                        : 1

                return {
                    ...field,
                    subFields: [
                        ...field.subFields,
                        { id: newId, label: '', type: 'text', required: false, options: [], subFields: [] }
                    ]
                }
            }
            return field
        }))
    }

    const updateSubField = (parentId, subId, key, value) => {
        setFields(fields.map(field => {
            if (field.id === parentId) {
                return {
                    ...field,
                    subFields: field.subFields.map(sub =>
                        sub.id === subId ? { ...sub, [key]: value } : sub
                    )
                }
            }
            return field
        }))
    }
    const removeSubOption = (parentId, subId, index) => {
        setFields(fields.map(field => {
            if (field.id === parentId) {
                return {
                    ...field,
                    subFields: field.subFields.map(sub =>
                        sub.id === subId
                            ? { ...sub, options: sub.options.filter((_, i) => i !== index) }
                            : sub
                    )
                }
            }
            return field
        }))
    }
    const removeField = (id) => {
        setFields(fields.filter(field => field.id !== id))
    }

    const updateField = (id, key, value) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, [key]: value } : field
        ))
    }

    const addOption = (fieldId) => {
        setFields(fields.map(field => {
            if (field.id === fieldId) {
                return {
                    ...field,
                    options: [...field.options, '']
                }
            }
            return field
        }))
    }

    const updateOption = (fieldId, index, value) => {
        setFields(fields.map(field => {
            if (field.id === fieldId) {
                const newOptions = [...field.options]
                newOptions[index] = value
                return { ...field, options: newOptions }
            }
            return field
        }))
    }

    const removeOption = (fieldId, index) => {
        setFields(fields.map(field => {
            if (field.id === fieldId) {
                const newOptions = field.options.filter((_, i) => i !== index)
                return { ...field, options: newOptions }
            }
            return field
        }))
    }
const removeSubField = (parentId, subId) => {
    setFields(fields.map(field => {
        if (field.id === parentId) {
            return {
                ...field,
                subFields: field.subFields.filter(sub => sub.id !== subId)
            }
        }
        return field
    }))
}
    const addSubOption = (parentId, subId) => {
        setFields(fields.map(field => {
            if (field.id === parentId) {
                return {
                    ...field,
                    subFields: field.subFields.map(sub =>
                        sub.id === subId
                            ? { ...sub, options: [...sub.options, ""] }
                            : sub
                    )
                }
            }
            return field
        }))
    }
    const updateSubOption = (parentId, subId, index, value) => {
        setFields(fields.map(field => {
            if (field.id === parentId) {
                return {
                    ...field,
                    subFields: field.subFields.map(sub => {
                        if (sub.id === subId) {
                            const newOptions = [...sub.options]
                            newOptions[index] = value
                            return { ...sub, options: newOptions }
                        }
                        return sub
                    })
                }
            }
            return field
        }))
    }
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
                            <Input type="number"
                                className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]" />
                        </div>
                    </div>
                </form>
            </div>
            <div>
                {/* Template Fields Card */}
                <Card className="mx-auto bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border rounded-lg shadow mt-5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold tracking-tight">
                            Template Fields *
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 p-6 pt-0">
                        {fields.map((field, index) => (
                            <Card key={field.id} className="shadow-sm border border-[var(--border-color)]">
                                <CardContent className="p-6 space-y-4">

                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium">Field {index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeField(field.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Label + Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Label</Label>
                                            <Input
                                                value={field.label}
                                                onChange={(e) =>
                                                    updateField(field.id, "label", e.target.value)
                                                }
                                                placeholder="Enter field label"
                                                className="h-11 border-[var(--border-color)]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={field.type}
                                                onValueChange={(value) =>
                                                    updateField(field.id, "type", value)
                                                }
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="textarea">Text Area</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="select">Select</SelectItem>
                                                    <SelectItem value="date">Date</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                    <SelectItem value="object">Object ( Group of fields)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* 👇 SHOW ONLY WHEN TYPE IS SELECT */}
                                    {field.type === "select" && (
                                        <div>
                                            <div className="space-y-3 pt-2 flex justify-between items-center">
                                                <Label className="m-0">Options (At least one required)</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addOption(field.id)}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Option
                                                </Button>

                                            </div>
                                            {field.options.map((option, i) => (
                                                <div key={i} className="flex gap-2 pt-4 items-center">
                                                    <Input
                                                        value={option}
                                                        onChange={(e) =>
                                                            updateOption(field.id, i, e.target.value)
                                                        }
                                                        placeholder={`Option ${i + 1}`}
                                                        className="h-11 border-[var(--border-color)]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeOption(field.id, i)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {field.type === "checkbox" && (
                                        <div>
                                            <div className="space-y-3 pt-2 flex justify-between items-center">
                                                <Label className="m-0">Radio Options (At least two required)</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addOption(field.id)}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Radio Option
                                                </Button>

                                            </div>
                                            {field.options.map((option, i) => (
                                                <div key={i} className="flex gap-2 pt-4 items-center">
                                                    <Input
                                                        value={option}
                                                        onChange={(e) =>
                                                            updateOption(field.id, i, e.target.value)
                                                        }
                                                        placeholder={`Option Label ${i + 1}`}
                                                        className="h-11 border-[var(--border-color)]"
                                                    />
                                                    <Input
                                                        value={option}
                                                        onChange={(e) =>
                                                            updateOption(field.id, i, e.target.value)
                                                        }
                                                        placeholder={`Option Value ${i + 1}`}
                                                        className="h-11 border-[var(--border-color)]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeOption(field.id, i)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {field.type === "object" && (
                                        <div className="border border-[var(--border-color)] rounded-md p-4 space-y-4">

                                            <div className="flex justify-between items-center">
                                                <Label className="m-0 font-medium">Sub Fields</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addSubField(field.id)}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Sub Field
                                                </Button>
                                            </div>

                                            {field.subFields.map((subField, subIndex) => (
                                                <Card key={subField.id} className="shadow-sm border border-[var(--border-color)]">
                                                    <CardContent className="p-6 space-y-4">

                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-medium">
                                                                Sub Field {subIndex + 1}
                                                            </h4>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeSubField(field.id, subField.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Label</Label>
                                                                <Input
                                                                    value={subField.label}
                                                                    onChange={(e) =>
                                                                        updateSubField(field.id, subField.id, "label", e.target.value)
                                                                    }
                                                                    placeholder="Enter field label"
                                                                    className="h-11 border-[var(--border-color)]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Type</Label>
                                                                <Select
                                                                    value={subField.type}
                                                                    onValueChange={(value) =>
                                                                        updateSubField(field.id, subField.id, "type", value)
                                                                    }
                                                                >
                                                                    <SelectTrigger className="h-11">
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

                                                        {subField.type === "select" && (
                                                            <div>
                                                                <div className="flex justify-between items-center pt-2">
                                                                    <Label className="m-0">Options</Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => addSubOption(field.id, subField.id)}
                                                                    >
                                                                        <Plus className="mr-2 h-4 w-4" />
                                                                        Add Option
                                                                    </Button>
                                                                </div>

                                                                {subField.options.map((option, i) => (
                                                                    <div key={i} className="flex gap-2 pt-3 items-center">
                                                                        <Input
                                                                            value={option}
                                                                            onChange={(e) =>
                                                                                updateSubOption(field.id, subField.id, i, e.target.value)
                                                                            }
                                                                            placeholder={`Option ${i + 1}`}
                                                                            className="h-11 border-[var(--border-color)]"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                removeSubOption(field.id, subField.id, i)
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {subField.type === "checkbox" && (
                                                            <div>
                                                                <div className="flex justify-between items-center pt-2">
                                                                    <Label className="m-0">Radio Options</Label>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => addSubOption(field.id, subField.id)}
                                                                    >
                                                                        <Plus className="mr-2 h-4 w-4" />
                                                                        Add Option
                                                                    </Button>
                                                                </div>

                                                                {subField.options.map((option, i) => (
                                                                    <div key={i} className="flex gap-2 pt-3 items-center">
                                                                        <Input
                                                                            value={option}
                                                                            onChange={(e) =>
                                                                                updateSubOption(field.id, subField.id, i, e.target.value)
                                                                            }
                                                                            placeholder={`Option Label ${i + 1}`}
                                                                            className="h-11 border-[var(--border-color)]"
                                                                        />
                                                                        <Input
                                                                            value={option}
                                                                            onChange={(e) =>
                                                                                updateSubOption(field.id, subField.id, i, e.target.value)
                                                                            }
                                                                            placeholder={`Option Value ${i + 1}`}
                                                                            className="h-11 border-[var(--border-color)]"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                removeSubOption(field.id, subField.id, i)
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <RadioGroup
                                                            value={subField.required ? "required" : "optional"}
                                                            onValueChange={(value) =>
                                                                updateSubField(field.id, subField.id, "required", value === "required")
                                                            }
                                                            className="flex items-center space-x-6 pt-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="required" id={`sub-req-${subField.id}`} />
                                                                <Label htmlFor={`sub-req-${subField.id}`} className="font-normal cursor-pointer">
                                                                    Required
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>

                                                    </CardContent>
                                                </Card>
                                            ))}

                                        </div>

                                    )}




                                    {/* Required / Optional */}
                                    <RadioGroup
                                        value={field.required ? "required" : "optional"}
                                        onValueChange={(value) =>
                                            updateField(field.id, "required", value === "required")
                                        }
                                        className="flex items-center space-x-6 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="required" id={`req-${field.id}`} />
                                            <Label htmlFor={`req-${field.id}`} className="font-normal cursor-pointer">
                                                Required
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="optional" id={`opt-${field.id}`} />
                                            <Label htmlFor={`opt-${field.id}`} className="font-normal cursor-pointer">
                                                Optional
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                </CardContent>
                            </Card>
                        ))}

                        {/* Add Field */}
                        <div className="flex justify-end pt-2">
                            <Button
                                type="button"
                                onClick={addField}
                                size="sm"
                                className="bg-[var(--dashboard-primary)] text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Field
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-end gap-3 pt-6">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[var(--dashboard-primary)] text-white">
                    {isUpdatePage ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    )
}

export default CreateTemplate