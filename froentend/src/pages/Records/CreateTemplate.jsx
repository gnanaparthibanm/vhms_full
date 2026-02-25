import React, { useState, useEffect } from "react"
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
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { recordsService } from "../../services/recordsService"

const CreateTemplate = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdatePage = location.pathname.includes("update") || Boolean(id)
    const pageTitle = isUpdatePage ? "Edit Template" : "Create Template"

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDefault, setIsDefault] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        record_type: "",
        version: 1,
        is_active: true
    })

    const [fields, setFields] = useState([
        { id: 1, label: '', type: 'text', required: false }
    ]);
    const [recordTypes, setRecordTypes] = useState([]);

    useEffect(() => {
        fetchRecordTypes()
        if (isUpdatePage && id) {
            fetchTemplate()
        }
    }, [id, isUpdatePage])

    const fetchRecordTypes = async () => {
        try {
            const response = await recordsService.getAllRecordTypes();
            setRecordTypes(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch record types:", error);
        }
    };

    const fetchTemplate = async () => {
        try {
            setLoading(true)
            const response = await recordsService.getTemplateById(id)
            const template = response.data?.data || response.data
            setFormData({
                name: template.name || "",
                record_type: template.record_type || "",
                version: template.version || 1,
                is_active: template.is_active !== undefined ? template.is_active : true
            })
            setIsDefault(template.is_default || false);
            let parsedFields = [];
            if (template.fields) {
                try {
                    parsedFields = typeof template.fields === 'string' ? JSON.parse(template.fields) : template.fields;
                } catch (e) {
                    console.error("Failed to parse fields JSON", e);
                }
            }

            if (Array.isArray(parsedFields) && parsedFields.length > 0) {
                // Ensure all items have an id
                const loadedFields = parsedFields.map((f, i) => ({
                    ...f,
                    id: f.id || Date.now() + i
                }))
                setFields(loadedFields)
            }
        } catch (err) {
            setError(err.message || "Failed to fetch template")
        } finally {
            setLoading(false)
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const addField = () => {
        const newId = Date.now();
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
        setFields(fields.filter(field => field.id !== id));
    };

    const handleFieldChange = (id, key, value) => {
        setFields(fields.map(field => {
            if (field.id === id) {
                return { ...field, [key]: value }
            }
            return field
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isDefault) {
            setError("You cannot modify system default templates.");
            return;
        }

        if (!formData.name || !formData.record_type) {
            setError("Please fill all required fields (Name & Record Type)")
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Remove temporary ids from fields before sending
            const sanitizedFields = fields.map(f => {
                const { id, ...rest } = f
                return rest
            })

            const payload = {
                ...formData,
                version: parseInt(formData.version, 10) || 1,
                fields: sanitizedFields
            }

            if (isUpdatePage) {
                await recordsService.updateTemplate(id, payload)
                alert("Template updated successfully!")
            } else {
                await recordsService.createTemplate(payload)
                alert("Template created successfully!")
            }
            navigate("/admin/records/templates") // Assuming typical route
        } catch (err) {
            setError(err.message || "Failed to save template")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-auto p-4">
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {isDefault && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-md text-blue-700 dark:text-blue-400 text-sm flex items-center justify-between">
                    <span><strong>System Default Template:</strong> This template is provided by default. You cannot edit or delete it, but you can use it to create records.</span>
                    <Button variant="outline" size="sm" onClick={() => navigate('/records')}>Go Back</Button>
                </div>
            )}

            <div className={`bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-6 rounded-lg shadow ${isDefault ? 'opacity-70 pointer-events-none' : ''}`}>
                <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* Template Details */}
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Annual Wellness Exam Template"
                                className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Record Type *</Label>
                            <Select
                                value={formData.record_type}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, record_type: val }))}
                            >
                                <SelectTrigger className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]">
                                    <SelectValue placeholder="Select Record Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recordTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.name}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                    {recordTypes.length === 0 && (
                                        <SelectItem value="none" disabled>No types available. Create one first.</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Version</Label>
                            <Input
                                type="number"
                                name="version"
                                value={formData.version}
                                onChange={handleFormChange}
                                className="h-11 bg-[var(--card-bg)] border-[var(--border-color)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.is_active ? "active" : "inactive"}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, is_active: val === "active" }))}
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

                    <Card className="bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border rounded-lg shadow mt-5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold tracking-tight">
                                Template Fields *
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-6 pt-0">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="shadow-sm border border-[var(--border-color)] bg-[var(--card-bg)]">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-medium">Field {index + 1}</h4>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeField(field.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`label-${field.id}`}>Label</Label>
                                                <Input
                                                    id={`label-${field.id}`}
                                                    placeholder="Enter field label"
                                                    value={field.label}
                                                    onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                                                    className="h-11 border-[var(--border-color)] bg-[var(--card-bg)]"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`type-${field.id}`}>Type</Label>
                                                <Select
                                                    value={field.type}
                                                    onValueChange={(val) => handleFieldChange(field.id, 'type', val)}
                                                >
                                                    <SelectTrigger id={`type-${field.id}`} className="h-11 border-[var(--border-color)] bg-[var(--card-bg)]">
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
                                        {field.type === 'select' && (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor={`options-${field.id}`}>Options (comma separated) *</Label>
                                                <Input
                                                    id={`options-${field.id}`}
                                                    placeholder="e.g. Normal, Abnormal, Not Evaluated"
                                                    value={field.options || ""}
                                                    onChange={(e) => handleFieldChange(field.id, 'options', e.target.value)}
                                                    className="h-11 border-[var(--border-color)] bg-[var(--card-bg)]"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between border md:col-span-2 rounded-md p-4 bg-[var(--card-bg)] border-[var(--border-color)]">
                                            <div className="space-y-0.5">
                                                <Label htmlFor={`req-switch-${field.id}`} className="text-base font-medium">
                                                    Required Field
                                                </Label>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Decide if this field must be filled when creating a record.
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Label className="text-sm text-gray-500">{field.required ? "Required" : "Optional"}</Label>
                                                <Switch
                                                    id={`req-switch-${field.id}`}
                                                    checked={field.required}
                                                    onCheckedChange={(val) => handleFieldChange(field.id, 'required', val)}
                                                    className="
                                                        data-[state=checked]:bg-[var(--dashboard-primary)]
                                                        data-[state=unchecked]:bg-gray-500
                                                        border border-[var(--border-color)]
                                                        text-[var(--dashboard-text)]
                                                        [&>span]:bg-white
                                                    "
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    onClick={addField}
                                    size="sm"
                                    className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Field
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)]">
                            {loading ? "Saving..." : (isUpdatePage ? "Update Template" : "Create Template")}
                        </Button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default CreateTemplate