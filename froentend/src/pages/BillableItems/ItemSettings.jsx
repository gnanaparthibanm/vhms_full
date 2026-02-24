import React, { useState } from 'react';
import {
    Plus,
    Search,
    ChevronLeft,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import CategoriesTab from './components/CategoriesTab';
import TaxRatesTab from './components/TaxRatesTab';
import DiscountTypesTab from './components/DiscountTypesTab';
import PaymentMethodsTab from './components/PaymentMethodsTab';
import CategoryModal from './components/CategoryModal';
import TaxRateModal from './components/TaxRateModal';
import DiscountModal from './components/DiscountModal';
import PaymentMethodModal from './components/PaymentMethodModal';

const ItemSettings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Categories");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTaxRateModalOpen, setIsTaxRateModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

    const tabs = [
        { name: "Categories", component: CategoriesTab },
        { name: "Tax Rates", component: TaxRatesTab },
        { name: "Discount Types", component: DiscountTypesTab },
        { name: "Payment Methods", component: PaymentMethodsTab },
    ];

    const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component || (() => null);

    const handleAddClick = () => {
        if (activeTab === "Categories") {
            setIsCategoryModalOpen(true);
        } else if (activeTab === "Tax Rates") {
            setIsTaxRateModalOpen(true);
        } else if (activeTab === "Discount Types") {
            setIsDiscountModalOpen(true);
        } else if (activeTab === "Payment Methods") {
            setIsPaymentMethodModalOpen(true);
        }
    };

    const getButtonLabel = () => {
        switch (activeTab) {
            case "Categories": return "Add Category";
            case "Tax Rates": return "Add Tax Rate";
            case "Discount Types": return "Add Discount";
            case "Payment Methods": return "Add Payment Method";
            default: return "Add";
        }
    };

    return (
        <div className="container mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        onClick={() => navigate('/billable-items')}
                        className=" bg-white text-black"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--dashboard-text)]">Item Settings</h1>
                        <p className="text-sm text-[var(--dashboard-text-light)]">Manage category, tax, discount, and payment methods</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--dashboard-text-light)]" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 w-full md:w-[250px] bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                        />
                    </div>

                    <Button
                        onClick={handleAddClick}
                        className="bg-[var(--dashboard-primary)] text-white hover:bg-[var(--dashboard-primary-hover)] shadow-md hover:shadow-lg transition-all w-full md:w-fit"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {getButtonLabel()}
                    </Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="md:w-full w-screen bg-[var(--dashboard-secondary)] p-1 rounded-lg flex space-x-1 border border-[var(--border-color)] overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all flex-1 text-center
                            ${activeTab === tab.name
                                ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] shadow-sm'
                                : 'text-[var(--dashboard-text-light)] hover:bg-[var(--card-bg)]/50 hover:text-[var(--dashboard-text)]'
                            }
                        `}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "Categories" && (
                    <>
                        <CategoriesTab />
                        <CategoryModal
                            isOpen={isCategoryModalOpen}
                            onClose={() => setIsCategoryModalOpen(false)}
                            onSave={(data) => console.log("Save category", data)}
                        />
                    </>
                )}

                {activeTab === "Tax Rates" && (
                    <TaxRatesTab
                        isAddModalOpen={isTaxRateModalOpen}
                        onCloseAddModal={() => setIsTaxRateModalOpen(false)}
                    />
                )}

                {activeTab === "Discount Types" && (
                    <DiscountTypesTab
                        isAddModalOpen={isDiscountModalOpen}
                        onCloseAddModal={() => setIsDiscountModalOpen(false)}
                    />
                )}

                {activeTab === "Payment Methods" && (
                    <PaymentMethodsTab
                        isAddModalOpen={isPaymentMethodModalOpen}
                        onCloseAddModal={() => setIsPaymentMethodModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ItemSettings;
