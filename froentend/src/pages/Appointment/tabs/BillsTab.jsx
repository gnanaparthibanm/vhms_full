import React from "react";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

const BillsTab = ({ appointmentId, appointment }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Bills</h2>
                <Button className="h-9 rounded-md bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)]">
                    <Plus size={16} className="mr-2" />
                    Create Bill
                </Button>
            </div>
            <p className="text-sm text-[var(--dashboard-text-light)]">No bills created yet.</p>
        </div>
    );
};

export default BillsTab;
