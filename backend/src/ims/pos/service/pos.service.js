import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";
import { POSSale, POSSaleItem } from "../models/associations.js";

const posService = {
    // Create POS Sale with Items
    async createSale(data) {
        return await sequelize.transaction(async (t) => {
            // Generate sale_no automatically
            const lastSale = await POSSale.findOne({
                order: [["createdAt", "DESC"]],
                transaction: t,
            });
            const lastNo = lastSale
                ? parseInt(lastSale.sale_no.split("-")[1])
                : 1000;
            const saleNo = `POS-${lastNo + 1}`;

            // Validate items
            if (!data.items || data.items.length === 0) {
                throw new Error("Sale must have at least one item");
            }

            // Calculate totals
            let subtotal = 0;
            const itemsToCreate = [];

            for (const item of data.items) {
                const itemTotal = item.quantity * item.unit_price;
                const itemDiscount = item.discount_amount || 0;
                const itemTax = item.tax_amount || 0;
                const itemTotalPrice = itemTotal - itemDiscount + itemTax;

                subtotal += itemTotal;

                itemsToCreate.push({
                    billable_item_id: item.billable_item_id,
                    item_name: item.item_name,
                    item_type: item.item_type || null,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discount_amount: itemDiscount,
                    tax_amount: itemTax,
                    total_price: itemTotalPrice,
                });
            }

            // Calculate final totals
            const discountAmount = data.discount_amount || 0;
            const taxAmount = data.tax_amount || 0;
            const totalAmount = subtotal - discountAmount + taxAmount;
            const paidAmount = data.paid_amount || totalAmount;
            const changeAmount = Math.max(paidAmount - totalAmount, 0);

            // Create POSSale
            const sale = await POSSale.create(
                {
                    sale_no: saleNo,
                    customer_name: data.customer_name || null,
                    customer_phone: data.customer_phone || null,
                    sale_date: data.sale_date || new Date(),
                    subtotal_amount: subtotal,
                    discount_amount: discountAmount,
                    discount_type: data.discount_type || null,
                    tax_amount: taxAmount,
                    tax_rate: data.tax_rate || null,
                    total_amount: totalAmount,
                    paid_amount: paidAmount,
                    change_amount: changeAmount,
                    payment_method: data.payment_method || 'cash',
                    status: data.status || 'completed',
                    notes: data.notes || null,
                    created_by: data.created_by,
                    created_by_name: data.created_by_name,
                    created_by_email: data.created_by_email,
                },
                { transaction: t }
            );

            // Create POSSaleItems
            const itemsWithSaleId = itemsToCreate.map((it) => ({
                ...it,
                sale_id: sale.id,
            }));

            await POSSaleItem.bulkCreate(itemsWithSaleId, { transaction: t });

            // Return Sale with Items
            return await POSSale.findByPk(sale.id, {
                include: [{ model: POSSaleItem, as: "items" }],
                transaction: t,
            });
        });
    },

    // Get All Sales with Filters + Pagination
    async getAllSales({ filters = {}, limit = 10, offset = 0 } = {}) {
        const where = { is_active: true };

        if (filters.sale_no) {
            where.sale_no = { [Op.like]: `%${filters.sale_no}%` };
        }
        if (filters.customer_name) {
            where.customer_name = { [Op.like]: `%${filters.customer_name}%` };
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.payment_method) {
            where.payment_method = filters.payment_method;
        }
        if (filters.sale_date) {
            where.sale_date = filters.sale_date;
        }

        const { count, rows } = await POSSale.findAndCountAll({
            where,
            distinct: true,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: POSSaleItem,
                    as: "items",
                },
            ],
        });

        return {
            total: count,
            currentPage: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(count / limit),
            data: rows,
        };
    },

    // Get Sale by ID
    async getSaleById(id) {
        return await POSSale.findByPk(id, {
            include: [
                {
                    model: POSSaleItem,
                    as: "items",
                },
            ],
        });
    },

    // Update Sale
    async updateSale(id, data) {
        return await sequelize.transaction(async (t) => {
            const sale = await POSSale.findByPk(id, {
                include: [{ model: POSSaleItem, as: "items" }],
                transaction: t,
            });
            if (!sale) return null;

            // If items are provided, replace them
            if (Array.isArray(data.items) && data.items.length > 0) {
                // Delete old items
                await POSSaleItem.destroy({ where: { sale_id: sale.id }, transaction: t });

                // Calculate new totals
                let subtotal = 0;
                const itemsToCreate = [];

                for (const item of data.items) {
                    const itemTotal = item.quantity * item.unit_price;
                    const itemDiscount = item.discount_amount || 0;
                    const itemTax = item.tax_amount || 0;
                    const itemTotalPrice = itemTotal - itemDiscount + itemTax;

                    subtotal += itemTotal;

                    itemsToCreate.push({
                        sale_id: sale.id,
                        billable_item_id: item.billable_item_id,
                        item_name: item.item_name,
                        item_type: item.item_type || null,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        discount_amount: itemDiscount,
                        tax_amount: itemTax,
                        total_price: itemTotalPrice,
                    });
                }

                await POSSaleItem.bulkCreate(itemsToCreate, { transaction: t });

                // Recalculate totals
                const discountAmount = data.discount_amount || 0;
                const taxAmount = data.tax_amount || 0;
                const totalAmount = subtotal - discountAmount + taxAmount;
                const paidAmount = data.paid_amount || totalAmount;
                const changeAmount = Math.max(paidAmount - totalAmount, 0);

                data.subtotal_amount = subtotal;
                data.total_amount = totalAmount;
                data.change_amount = changeAmount;
            }

            // Update sale
            await sale.update(
                {
                    customer_name: data.customer_name ?? sale.customer_name,
                    customer_phone: data.customer_phone ?? sale.customer_phone,
                    sale_date: data.sale_date ?? sale.sale_date,
                    subtotal_amount: data.subtotal_amount ?? sale.subtotal_amount,
                    discount_amount: data.discount_amount ?? sale.discount_amount,
                    discount_type: data.discount_type ?? sale.discount_type,
                    tax_amount: data.tax_amount ?? sale.tax_amount,
                    tax_rate: data.tax_rate ?? sale.tax_rate,
                    total_amount: data.total_amount ?? sale.total_amount,
                    paid_amount: data.paid_amount ?? sale.paid_amount,
                    change_amount: data.change_amount ?? sale.change_amount,
                    payment_method: data.payment_method ?? sale.payment_method,
                    status: data.status ?? sale.status,
                    notes: data.notes ?? sale.notes,
                    updated_by: data.updated_by,
                    updated_by_name: data.updated_by_name,
                    updated_by_email: data.updated_by_email,
                },
                { transaction: t }
            );

            return await POSSale.findByPk(sale.id, {
                include: [{ model: POSSaleItem, as: "items" }],
                transaction: t,
            });
        });
    },

    // Delete Sale (soft delete)
    async deleteSale(id, user) {
        return await sequelize.transaction(async (t) => {
            const sale = await POSSale.findByPk(id, { transaction: t });
            if (!sale) return null;

            await sale.update(
                {
                    is_active: false,
                    deleted_by: user.id || null,
                    deleted_by_name: user.username || user.name || null,
                    deleted_by_email: user.email || null,
                },
                { transaction: t }
            );

            return { message: "Sale soft deleted successfully" };
        });
    },
};

export default posService;
