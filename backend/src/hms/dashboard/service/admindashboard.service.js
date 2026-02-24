import { sequelize } from "../../../db/index.js";
import { Op, QueryTypes } from "sequelize";
import Billing from "../../../ims/billing/models/billing.models.js";
import Appointments from "../../appointments/models/appointments.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Client from "../../clients/models/clients.models.js";
import LabTestsMaster from "../../laboratory/models/labtestsmaster.models.js";
import LabTestOrderItems from "../../laboratory/models/labtestordersiteams.models.js";
import Addmissions from "../../admissions/models/admissions.models.js";
import StaffProfiles from "../../staff/models/staffprofiles.models.js";
import Stock from "../../../ims/stock/models/stock.models.js";

const adminDashboardService = {
    async getAdminDashboard({ month = null, year = null, startDate = null, endDate = null, branchId = null, allTime = false } = {}) {
        try {
            const now = new Date();
            let start, end;

            if (!allTime) {
                if (startDate && endDate) {
                    start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                } else if (startDate && !endDate) {
                    start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    end = new Date(startDate);
                    end.setHours(23, 59, 59, 999);
                } else {
                    const useYear = Number(year ?? now.getFullYear());
                    const useMonth = Number(month ?? now.getMonth() + 1);
                    start = new Date(useYear, useMonth - 1, 1, 0, 0, 0);
                    end = new Date(useYear, useMonth, 0, 23, 59, 59, 999);
                }
            }

            // ---------- DATE FILTERS ----------
            // Where clauses for different models based on their date fields
            const billingWhere = { status: "paid" };
            const appointmentsWhere = {};
            const staffWhere = {};
            const staffNewWhere = {};

            if (!allTime && start && end) {
                billingWhere.billing_date = { [Op.between]: [start, end] };
                appointmentsWhere.scheduled_at = { [Op.between]: [start, end] };
                staffNewWhere.createdAt = { [Op.between]: [start, end] };
            }

            // ---------- 1) Pharmacy Revenue ----------
            const pharmacyRevenue = Number(
                (await Billing.sum("total_amount", {
                    where: billingWhere,
                })) || 0
            );

            // ---------- 2) Doctor Revenue ----------
            let doctorRevenueQuery = `
        SELECT COALESCE(SUM(d.consultation_fee), 0) AS doctorRevenue
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.status = 'Completed'
        `;
            const replacements = (!allTime && start && end) ? { start, end } : {};

            if (!allTime && start && end) {
                doctorRevenueQuery += ` AND a.scheduled_at BETWEEN :start AND :end`;
            }

            const doctorRevenueRes = await sequelize.query(doctorRevenueQuery, {
                type: QueryTypes.SELECT,
                replacements,
            });
            const doctorRevenue = Number(doctorRevenueRes?.[0]?.doctorRevenue || 0);

            // ---------- 3) Lab Revenue ----------
            let labRevenueQuery = `
        SELECT COALESCE(SUM(lm.amount), 0) AS labRevenue
        FROM lab_test_order_items li
        JOIN lab_tests_master lm ON li.lab_test_id = lm.id
        `;
            if (!allTime && start && end) {
                labRevenueQuery += ` WHERE li.createdAt BETWEEN :start AND :end`;
            }

            const labRevenueRes = await sequelize.query(labRevenueQuery, {
                type: QueryTypes.SELECT,
                replacements,
            });
            const labRevenue = Number(labRevenueRes?.[0]?.labRevenue || 0);

            // ---------- 4) Total Revenue ----------
            const totalRevenue = doctorRevenue + labRevenue + pharmacyRevenue;

            // ---------- 5) Admitted Clients Day-wise ----------
            let admittedDayWise = [];
            // We only generate day-wise series if we have start and end dates within a reasonable range (like a month or small custom range)
            if (!allTime && start && end) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Only build date series if duration is less than or equal to 31 days to avoid massive queries
                if (diffDays <= 31) {
                    const admittedDayWiseRes = await sequelize.query(
                        `
          WITH RECURSIVE date_series AS (
            SELECT :start AS day
            UNION ALL
            SELECT DATE_ADD(day, INTERVAL 1 DAY)
            FROM date_series
            WHERE day < :end
          )
          SELECT 
            ds.day,
            COALESCE(COUNT(a.id), 0) AS count
          FROM date_series ds
          LEFT JOIN ${Addmissions.tableName} a 
            ON DATE(a.admission_date) = ds.day
          GROUP BY ds.day
          ORDER BY ds.day ASC
          `,
                        {
                            type: QueryTypes.SELECT,
                            replacements: { start, end },
                        }
                    );

                    admittedDayWise = admittedDayWiseRes.map((r) => ({
                        date: r.day,
                        count: Number(r.count),
                    }));
                }
            }

            // ---------- 6) Recent Admitted Clients (Legacy) ----------
            const admittedWhere = {
                [Op.and]: [
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("status")), {
                        [Op.in]: [
                            "admitted",
                            "inClient",
                            "admitted - in ward",
                            "discharged",
                            "transferred",
                        ],
                    }),
                ],
            };

            if (!allTime && start && end) {
                admittedWhere.admission_date = { [Op.between]: [start, end] };
            }

            const recentAdmitted = await Addmissions.findAll({
                where: admittedWhere,
                include: [{ model: Client, as: "client" }],
                order: [["admission_date", "DESC"]],
                limit: 5,
            });

            // ==========================================
            // NEW API DATA SECTIONS
            // ==========================================

            // ---------- APPOINTMENTS DATA ----------
            const appointmentStatusCountsRes = await Appointments.findAll({
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                where: appointmentsWhere,
                group: ['status'],
                raw: true,
            });
            const appointmentCounts = { Total: 0, Completed: 0, Pending: 0, Cancelled: 0, Confirmed: 0 };
            appointmentStatusCountsRes.forEach(row => {
                const status = row.status || 'Pending';
                appointmentCounts[status] = Number(row.count);
                appointmentCounts.Total += Number(row.count);
            });
            const recentAppointments = await Appointments.findAll({
                where: appointmentsWhere,
                order: [['createdAt', 'DESC']],
                limit: 5,
            });

            // ---------- INVENTORY DATA ----------
            // Inventory stock generally represents current state, so we might not always filter by date unless we calculate historical stock.
            // For now, returning current stock values.
            const totalStock = (await Stock.sum("quantity")) || 0;
            const lowStockItems = await Stock.count({ where: { quantity: { [Op.lt]: 10, [Op.gt]: 0 } } });
            const outOfStockItems = await Stock.count({ where: { quantity: 0 } });
            const totalProducts = await Stock.count();

            // ---------- STAFF DATA ----------
            const totalStaff = await StaffProfiles.count({ where: Object.assign({}, staffWhere, { is_active: true }) });
            const newJoins = await StaffProfiles.count({ where: staffNewWhere });

            // ---------- Return structured data ----------
            return {
                // Legacy wrapper matching (to avoid breaking current UI)
                summary: {
                    total_revenue: totalRevenue,
                    doctor_revenue: doctorRevenue,
                    lab_revenue: labRevenue,
                    pharmacy_revenue: pharmacyRevenue,
                },
                admitted_day_wise: admittedDayWise,
                recent_admitted: recentAdmitted,

                // New specific component wrappers
                overview: {
                    totalAppointments: appointmentCounts.Total,
                    totalRevenue,
                    totalStaff,
                    totalInventoryItems: totalProducts
                },
                appointments: {
                    ...appointmentCounts,
                    recent: recentAppointments
                },
                finance: {
                    totalRevenue,
                    pharmacyRevenue,
                    doctorRevenue,
                    labRevenue,
                },
                inventory: {
                    totalStock,
                    totalProducts,
                    lowStockItems,
                    outOfStockItems
                },
                staff: {
                    total: totalStaff,
                    active: totalStaff,
                    newThisMonth: newJoins
                }
            };
        } catch (error) {
            console.error("❌ Error in admin dashboard service:", error);
            throw new Error("Failed to fetch admin dashboard data");
        }
    },
};

export default adminDashboardService;
