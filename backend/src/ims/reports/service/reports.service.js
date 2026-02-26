import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../../../db/index.js";
import { POSSale, POSSaleItem } from "../../pos/models/associations.js";

const reportsService = {
    // Get Monthly and Yearly Statistics
    async getReportStats({ year, month } = {}) {
        const currentYear = year || new Date().getFullYear();

        // Get monthly breakdown - using stored POS values
        const monthlyStats = await sequelize.query(`
            SELECT 
                MONTH(ps.sale_date) as month_num,
                DATE_FORMAT(ps.sale_date, '%b') as month,
                COUNT(DISTINCT ps.id) as total_invoices,
                SUM(ps.subtotal_amount) as subtotal_amount,
                SUM(ps.discount_amount) as discount_amount,
                SUM(ps.tax_amount) as tax_amount,
                SUM(ps.total_amount) as total_amount,
                SUM(ps.paid_amount) as paid_amount,
                SUM(ps.total_amount - ps.paid_amount) as pending_amount
            FROM pos_sales ps
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
            GROUP BY MONTH(ps.sale_date), DATE_FORMAT(ps.sale_date, '%b')
            ORDER BY MONTH(ps.sale_date)
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        // Get cost data separately for profit calculation
        const monthlyCosts = await sequelize.query(`
            SELECT 
                MONTH(ps.sale_date) as month_num,
                SUM(psi.quantity * COALESCE(bi.cost, 0)) as total_cost
            FROM pos_sales ps
            INNER JOIN pos_sale_items psi ON ps.id = psi.sale_id
            LEFT JOIN billable_items bi ON psi.billable_item_id = bi.id
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
            GROUP BY MONTH(ps.sale_date)
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        // Calculate yearly totals
        const yearlyStats = await sequelize.query(`
            SELECT 
                COUNT(DISTINCT ps.id) as total_invoices,
                SUM(ps.subtotal_amount) as subtotal_amount,
                SUM(ps.discount_amount) as discount_amount,
                SUM(ps.tax_amount) as tax_amount,
                SUM(ps.total_amount) as total_amount,
                SUM(ps.paid_amount) as paid_amount,
                SUM(ps.total_amount - ps.paid_amount) as pending_amount
            FROM pos_sales ps
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        // Get yearly cost
        const yearlyCost = await sequelize.query(`
            SELECT 
                SUM(psi.quantity * COALESCE(bi.cost, 0)) as total_cost
            FROM pos_sales ps
            INNER JOIN pos_sale_items psi ON ps.id = psi.sale_id
            LEFT JOIN billable_items bi ON psi.billable_item_id = bi.id
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        // Format monthly stats to include all 12 months
        const allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const formattedMonthlyStats = allMonths.map((monthName, index) => {
            const monthData = monthlyStats.find(m => m.month === monthName);
            const costData = monthlyCosts.find(c => c.month_num === (index + 1));
            
            const subtotal = monthData ? parseFloat(monthData.subtotal_amount || 0) : 0;
            const cost = costData ? parseFloat(costData.total_cost || 0) : 0;
            const netProfit = subtotal - cost;

            return {
                month: monthName,
                totalInvoices: monthData ? parseInt(monthData.total_invoices) : 0,
                subtotalAmount: subtotal,
                discountAmount: monthData ? parseFloat(monthData.discount_amount || 0) : 0,
                taxAmount: monthData ? parseFloat(monthData.tax_amount || 0) : 0,
                totalAmount: monthData ? parseFloat(monthData.total_amount || 0) : 0,
                paidAmount: monthData ? parseFloat(monthData.paid_amount || 0) : 0,
                pendingAmount: monthData ? parseFloat(monthData.pending_amount || 0) : 0,
                totalCost: cost,
                netProfit: netProfit,
                // Legacy fields for compatibility
                taxableAmount: subtotal,
                cgst: 0,
                sgst: 0,
                igst: 0,
                totalGST: monthData ? parseFloat(monthData.tax_amount || 0) : 0,
                totalRevenue: subtotal
            };
        });

        const yearlyData = yearlyStats[0] || {};
        const yearlySubtotal = parseFloat(yearlyData.subtotal_amount || 0);
        const yearlyCostAmount = parseFloat(yearlyCost[0]?.total_cost || 0);
        const yearlyNetProfit = yearlySubtotal - yearlyCostAmount;

        return {
            year: currentYear,
            monthlyStats: formattedMonthlyStats,
            yearlyStats: {
                totalInvoices: parseInt(yearlyData.total_invoices || 0),
                subtotalAmount: yearlySubtotal,
                discountAmount: parseFloat(yearlyData.discount_amount || 0),
                taxAmount: parseFloat(yearlyData.tax_amount || 0),
                totalAmount: parseFloat(yearlyData.total_amount || 0),
                paidAmount: parseFloat(yearlyData.paid_amount || 0),
                pendingAmount: parseFloat(yearlyData.pending_amount || 0),
                totalCost: yearlyCostAmount,
                netProfit: yearlyNetProfit,
                // Legacy fields for compatibility
                taxableAmount: yearlySubtotal,
                cgst: 0,
                sgst: 0,
                igst: 0,
                totalGST: parseFloat(yearlyData.tax_amount || 0),
                totalRevenue: yearlySubtotal
            }
        };
    },

    // Get Top Customers
    async getTopCustomers({ year, limit = 10 } = {}) {
        const currentYear = year || new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

        const topCustomers = await sequelize.query(`
            SELECT 
                customer_name as name,
                customer_phone as phone,
                COUNT(*) as visits,
                SUM(total_amount) as total_spent
            FROM pos_sales
            WHERE 
                YEAR(sale_date) = :year
                AND is_active = 1
                AND status = 'completed'
                AND customer_name IS NOT NULL
                AND customer_name != 'Walk-in Customer'
            GROUP BY customer_name, customer_phone
            ORDER BY total_spent DESC
            LIMIT :limit
        `, {
            replacements: { year: currentYear, limit },
            type: sequelize.QueryTypes.SELECT
        });

        return topCustomers.map(customer => ({
            name: customer.name,
            phone: customer.phone || 'N/A',
            visits: parseInt(customer.visits),
            totalSpent: parseFloat(customer.total_spent)
        }));
    },

    // Get Item Type Breakdown (Medication, Product, Service)
    async getItemTypeBreakdown({ year } = {}) {
        const currentYear = year || new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

        const breakdown = await sequelize.query(`
            SELECT 
                psi.item_type as name,
                COUNT(DISTINCT ps.id) as value
            FROM pos_sale_items psi
            JOIN pos_sales ps ON psi.sale_id = ps.id
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
                AND psi.item_type IS NOT NULL
            GROUP BY psi.item_type
            ORDER BY value DESC
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        return breakdown.map(item => ({
            name: item.name || 'Other',
            value: parseInt(item.value)
        }));
    },

    // Get Payment Method Breakdown
    async getPaymentMethodBreakdown({ year } = {}) {
        const currentYear = year || new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

        const breakdown = await sequelize.query(`
            SELECT 
                payment_method as name,
                COUNT(*) as count,
                SUM(total_amount) as total_amount
            FROM pos_sales
            WHERE 
                YEAR(sale_date) = :year
                AND is_active = 1
                AND status = 'completed'
            GROUP BY payment_method
            ORDER BY total_amount DESC
        `, {
            replacements: { year: currentYear },
            type: sequelize.QueryTypes.SELECT
        });

        return breakdown.map(item => ({
            name: item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : 'Other',
            count: parseInt(item.count),
            totalAmount: parseFloat(item.total_amount)
        }));
    },

    // Get Top Selling Items
    async getTopSellingItems({ year, limit = 10 } = {}) {
        const currentYear = year || new Date().getFullYear();

        const topItems = await sequelize.query(`
            SELECT 
                psi.item_name as name,
                psi.item_type as type,
                SUM(psi.quantity) as total_quantity,
                SUM(psi.total_price) as total_revenue,
                COUNT(DISTINCT ps.id) as order_count
            FROM pos_sale_items psi
            JOIN pos_sales ps ON psi.sale_id = ps.id
            WHERE 
                YEAR(ps.sale_date) = :year
                AND ps.is_active = 1
                AND ps.status = 'completed'
            GROUP BY psi.item_name, psi.item_type
            ORDER BY total_revenue DESC
            LIMIT :limit
        `, {
            replacements: { year: currentYear, limit },
            type: sequelize.QueryTypes.SELECT
        });

        return topItems.map(item => ({
            name: item.name,
            type: item.type,
            totalQuantity: parseInt(item.total_quantity),
            totalRevenue: parseFloat(item.total_revenue),
            orderCount: parseInt(item.order_count)
        }));
    },

    // Get Sales Trend (Daily sales for a specific month)
    async getSalesTrend({ year, month } = {}) {
        const currentYear = year || new Date().getFullYear();
        const currentMonth = month !== undefined ? month : new Date().getMonth() + 1;

        const trend = await sequelize.query(`
            SELECT 
                DATE(sale_date) as date,
                COUNT(*) as sales_count,
                SUM(total_amount) as total_amount
            FROM pos_sales
            WHERE 
                YEAR(sale_date) = :year
                AND MONTH(sale_date) = :month
                AND is_active = 1
                AND status = 'completed'
            GROUP BY DATE(sale_date)
            ORDER BY DATE(sale_date)
        `, {
            replacements: { year: currentYear, month: currentMonth },
            type: sequelize.QueryTypes.SELECT
        });

        return trend.map(day => ({
            date: day.date,
            salesCount: parseInt(day.sales_count),
            totalAmount: parseFloat(day.total_amount)
        }));
    },

    // Get Dashboard Summary
    async getDashboardSummary({ year } = {}) {
        const currentYear = year || new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

        const summary = await POSSale.findOne({
            attributes: [
                [fn('COUNT', col('id')), 'total_sales'],
                [fn('SUM', col('total_amount')), 'total_revenue'],
                [fn('SUM', col('tax_amount')), 'total_tax'],
                [fn('AVG', col('total_amount')), 'average_sale']
            ],
            where: {
                sale_date: {
                    [Op.between]: [startDate, endDate]
                },
                is_active: true,
                status: 'completed'
            },
            raw: true
        });

        return {
            totalSales: parseInt(summary?.total_sales || 0),
            totalRevenue: parseFloat(summary?.total_revenue || 0),
            totalTax: parseFloat(summary?.total_tax || 0),
            averageSale: parseFloat(summary?.average_sale || 0)
        };
    }
};

export default reportsService;
