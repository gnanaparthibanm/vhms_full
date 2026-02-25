import Discount from "../models/discount.model.js";
import { Op } from "sequelize";

const discountService = {
  async create(data, userInfo) {
    return await Discount.create({
      ...data,
      created_by: userInfo.id,
      created_by_name: userInfo.name,
      created_by_email: userInfo.email,
    });
  },

  async getAll(filters = {}) {
    const { page = 1, limit = 10, search, status, type } = filters;
    const offset = (page - 1) * limit;
    const where = { is_active: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const { count, rows } = await Discount.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const discount = await Discount.findByPk(id);
    if (!discount || !discount.is_active) {
      throw new Error("Discount not found");
    }
    return discount;
  },

  async update(id, data, userInfo) {
    const discount = await this.getById(id);

    await discount.update({
      ...data,
      updated_by: userInfo.id,
      updated_by_name: userInfo.name,
      updated_by_email: userInfo.email,
    });

    return discount;
  },

  async delete(id, userInfo) {
    const discount = await this.getById(id);

    await discount.update({
      is_active: false,
      deleted_by: userInfo.id,
      deleted_by_name: userInfo.name,
      deleted_by_email: userInfo.email,
    });

    return { message: "Discount deleted successfully" };
  },
};

export default discountService;
