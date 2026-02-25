import { sequelize } from "../../../db/index.js";
import BillableItem from "../models/billableitem.model.js";

// Helper: Generate SKU
function generateSKU(type) {
  const prefix = type === 'Service' ? 'SRV' : type === 'Medication' ? 'MED' : 'PRD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

const billableItemService = {
  // Create Billable Item
  async create(data, userInfo = {}) {
    if (!data.name || !data.type || !data.price) {
      throw new Error("name, type, and price are required");
    }

    // Generate SKU if not provided
    if (!data.sku || data.sku === 'Auto-generated if blank') {
      data.sku = generateSKU(data.type);
    }

    // Calculate profit margin if cost and price provided
    if (data.cost && data.price) {
      const cost = parseFloat(data.cost);
      const price = parseFloat(data.price);
      data.profit_margin = ((price - cost) / cost * 100).toFixed(2);
    }

    const item = await BillableItem.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return item;
  },

  // Get All Billable Items
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      type,
      category,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[sequelize.Op.or] = [
        { name: { [sequelize.Op.like]: `%${search}%` } },
        { sku: { [sequelize.Op.like]: `%${search}%` } },
        { tags: { [sequelize.Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    const { count, rows } = await BillableItem.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  // Get Billable Item by ID
  async getById(id) {
    const item = await BillableItem.findByPk(id);
    if (!item) throw new Error("Billable item not found");
    return item;
  },

  // Update Billable Item
  async update(id, data, userInfo = {}) {
    const item = await BillableItem.findByPk(id);
    if (!item) throw new Error("Billable item not found");

    // Recalculate profit margin if cost or price changed
    if (data.cost || data.price) {
      const cost = parseFloat(data.cost || item.cost);
      const price = parseFloat(data.price || item.price);
      if (cost > 0) {
        data.profit_margin = ((price - cost) / cost * 100).toFixed(2);
      }
    }

    await item.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return item;
  },

  // Delete Billable Item
  async delete(id, userInfo = {}) {
    const item = await BillableItem.findByPk(id);
    if (!item) throw new Error("Billable item not found");

    await item.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Billable item deleted successfully" };
  },

  // Update Stock
  async updateStock(id, quantity, operation = 'add') {
    const item = await BillableItem.findByPk(id);
    if (!item) throw new Error("Billable item not found");

    if (!item.stock_tracking) {
      throw new Error("Stock tracking is not enabled for this item");
    }

    const currentStock = item.current_stock || 0;
    const newStock = operation === 'add' 
      ? currentStock + quantity 
      : currentStock - quantity;

    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }

    await item.update({ current_stock: newStock });
    return item;
  },
};

export default billableItemService;
