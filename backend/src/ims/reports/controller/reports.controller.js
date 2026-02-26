import reportsService from "../service/reports.service.js";

const reportsController = {
    // Get Report Statistics (Monthly & Yearly)
    async getReportStats(req, res) {
        try {
            const { year, month } = req.query;
            const data = await reportsService.getReportStats({ 
                year: year ? parseInt(year) : undefined,
                month: month ? parseInt(month) : undefined
            });
            return res.json({
                status: "success",
                message: "Report statistics fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching report stats:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Top Customers
    async getTopCustomers(req, res) {
        try {
            const { year, limit } = req.query;
            const data = await reportsService.getTopCustomers({ 
                year: year ? parseInt(year) : undefined,
                limit: limit ? parseInt(limit) : 10
            });
            return res.json({
                status: "success",
                message: "Top customers fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching top customers:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Item Type Breakdown
    async getItemTypeBreakdown(req, res) {
        try {
            const { year } = req.query;
            const data = await reportsService.getItemTypeBreakdown({ 
                year: year ? parseInt(year) : undefined
            });
            return res.json({
                status: "success",
                message: "Item type breakdown fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching item type breakdown:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Payment Method Breakdown
    async getPaymentMethodBreakdown(req, res) {
        try {
            const { year } = req.query;
            const data = await reportsService.getPaymentMethodBreakdown({ 
                year: year ? parseInt(year) : undefined
            });
            return res.json({
                status: "success",
                message: "Payment method breakdown fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching payment method breakdown:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Top Selling Items
    async getTopSellingItems(req, res) {
        try {
            const { year, limit } = req.query;
            const data = await reportsService.getTopSellingItems({ 
                year: year ? parseInt(year) : undefined,
                limit: limit ? parseInt(limit) : 10
            });
            return res.json({
                status: "success",
                message: "Top selling items fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching top selling items:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Sales Trend
    async getSalesTrend(req, res) {
        try {
            const { year, month } = req.query;
            const data = await reportsService.getSalesTrend({ 
                year: year ? parseInt(year) : undefined,
                month: month ? parseInt(month) : undefined
            });
            return res.json({
                status: "success",
                message: "Sales trend fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching sales trend:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    // Get Dashboard Summary
    async getDashboardSummary(req, res) {
        try {
            const { year } = req.query;
            const data = await reportsService.getDashboardSummary({ 
                year: year ? parseInt(year) : undefined
            });
            return res.json({
                status: "success",
                message: "Dashboard summary fetched successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error fetching dashboard summary:", error);
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
};

export default reportsController;
