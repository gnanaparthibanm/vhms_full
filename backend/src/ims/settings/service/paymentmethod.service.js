import PaymentMethod from "../models/paymentmethod.model.js";
import { Op } from "sequelize";

const paymentMethodService = {
  async create(data, userInfo) {
    return await PaymentMethod.create({
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
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const { count, rows } = await PaymentMethod.findAndCountAll({
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
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod || !paymentMethod.is_active) {
      throw new Error("Payment method not found");
    }
    return paymentMethod;
  },

  async update(id, data, userInfo) {
    const paymentMethod = await this.getById(id);

    await paymentMethod.update({
      ...data,
      updated_by: userInfo.id,
      updated_by_name: userInfo.name,
      updated_by_email: userInfo.email,
    });

    return paymentMethod;
  },

  async delete(id, userInfo) {
    const paymentMethod = await this.getById(id);

    await paymentMethod.update({
      is_active: false,
      deleted_by: userInfo.id,
      deleted_by_name: userInfo.name,
      deleted_by_email: userInfo.email,
    });

    return { message: "Payment method deleted successfully" };
  },
};

export default paymentMethodService;
