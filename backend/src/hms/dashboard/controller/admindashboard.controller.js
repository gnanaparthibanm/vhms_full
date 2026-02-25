// src/hms/dashboard/controller/admindashboard.controller.js
import adminDashboardService from "../service/admindashboard.service.js";

/**
 * Admin Dashboard Controller
 * - GET /admindashboard?month=MM&year=YYYY&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&branchId=ID&allTime=true
 *
 * Returns:
 * {
 *   status: "success",
 *   message: "Admin dashboard data fetched successfully",
 *   data: { summary: {...}, admitted_day_wise: [...], recent_admitted: [...], overview: {...}, appointments: {...}, finance: {...}, inventory: {...}, staff: {...} }
 * }
 */
const adminDashboardController = {
  async getDashboard(req, res) {
    try {
      // Optional query params to get specific month/year or explicitly startDate/endDate
      const { month, year, startDate, endDate, branchId, allTime } = req.query;

      const isAllTime = allTime === "true" || allTime === true;

      const dashboardData = await adminDashboardService.getAdminDashboard({
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        branchId,
        allTime: isAllTime
      });

      // Use helper if available, otherwise fallback to standard json response
      if (typeof res.sendSuccess === "function") {
        return res.sendSuccess(dashboardData, "Admin dashboard data fetched successfully");
      }

      return res.json({
        status: "success",
        message: "Admin dashboard data fetched successfully",
        data: dashboardData,
      });
    } catch (error) {
      console.error("❌ Error in adminDashboardController.getDashboard:", error);

      if (typeof res.sendError === "function") {
        return res.sendError(error.message || "Failed to fetch admin dashboard data");
      }

      return res.status(500).json({
        status: "error",
        message: error.message || "Failed to fetch admin dashboard data",
      });
    }
  },
};

export default adminDashboardController;
