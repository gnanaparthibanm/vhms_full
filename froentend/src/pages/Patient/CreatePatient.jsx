import React, { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocation } from "react-router-dom"

const CreatePatient = () => {
    const location = useLocation()
    const [isActive, setIsActive] = useState(true)
    const isUpdatePage = location.pathname.includes("update")
    const pageTitle = isUpdatePage ? "Update Client" : "Add New Client"
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
                        <Label>Name *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Phone *</Label>
                        <div className="flex">
                            <div className="flex items-center px-3 border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-l-md bg-muted text-sm">
                                IND +91
                            </div>
                            <Input className="h-11 rounded-l-none bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" type="tel" />
                        </div>
                    </div>
                </div>
                {/* Row 2 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Alternate Phone *</Label>
                        <div className="flex">
                            <div className="flex items-center px-3 border bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] rounded-l-md bg-muted text-sm">
                                IND +91
                            </div>
                            <Input className="h-11 rounded-l-none bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]" type="tel" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter Email"
                        />
                    </div>
                </div>
                {/* Row 3 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>City*</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter City"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Address *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter Address"
                        />
                    </div>
                </div>
                {/* Row 4 */}
                <div className="grid gap-6 md:grid-cols-2 pt-4">
                    <div className="space-y-2">
                        <Label>Purpose of Visit*</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter Purpose of Visit"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Notes *</Label>
                        <Input
                            className="h-11 bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)]"
                            placeholder="Enter Notes"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-row items-center justify-between rounded-lg bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-4 space-y-0">

                        {/* Left Content */}
                        <div className="space-y-0.5">
                            <Label htmlFor="active-status" className="text-base font-medium">
                                Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Set the active status of this client
                            </p>
                        </div>

                        {/* Right Switch */}
                        <Switch
                            id="active-status"
                            checked={isActive}
                            onCheckedChange={setIsActive}
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





                {/* Actions */}
                <div className="flex flex-col md:flex-row justify-end gap-3 pt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-[var(--dashboard-primary)] text-white">
                        Create Client
                    </Button>
                    <Button className="bg-[var(--dashboard-primary)] text-white">
                        Save & Add Pet
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreatePatient