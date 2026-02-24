import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const NotificationView = () => {
    const navigate = useNavigate()
    return (
        <div className=" rounded-2xl bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border p-4 md:p-8">
            <div className="mx-auto space-y-6">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={()=>navigate("/notifications")}
                    className="bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)] shadow-sm"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Notifications
                </Button>

                <Card className=" border-[var(--border-color)] border shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b  border-[var(--border-color)] py-4 px-6">
                        <CardTitle className="text-xl font-bold">
                            Notification Details
                        </CardTitle>
                        <Badge
                            className="bg-[var(--dashboard-primary)] px-4 text-sm text-white hover:bg-[var(--dashboard-primary-hover)] border-none px-4 py-1 rounded-md text-sm font-medium"
                        >
                            Read
                        </Badge>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8">

                        {/* Notification Type */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Notification Type</h4>
                            <div className="inline-block px-3 py-1.5 border  border-[var(--border-color)] rounded-md text-sm">
                                APPOINTMENT
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-3">
                            <h4 className=" text-sm font-medium">Message Content</h4>
                            <div className="w-full bg-[var(--card-bg)] text-[var(--dashboard-text)] border-[var(--border-color)] border rounded-lg p-5">
                                <p className=" font-medium">
                                    New appointment created: Fusionedge Test Hospital - Main Branch
                                </p>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2">
                            <h4 className=" text-sm font-medium">Date & Time</h4>
                            <p className=" font-medium text-lg">
                                Feb 10, 2026, 6:42:45 PM
                            </p>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NotificationView;