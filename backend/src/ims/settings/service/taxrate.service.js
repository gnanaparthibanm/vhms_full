import TaxRate from "../models/taxrate.model.js";
import { Op } from "sequelize";

const taxRateService = {
  async create(data, userInfo) {
    // If setting as default, unset other defaults
    if (data.is_default) {
      await TaxRate.update({ is_default: false }, { where: { is_default: true } });
    }

    return await TaxRate.create({
      ...data,
      created_by: userInfo.id,
      created_by_name: userInfo.name,
      created_by_email: userInfo.email,
    });
  },

  async getAll(filters = {}) {
    const { page = 1, limit = 10, search, status } = filters;
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

    const { count, rows } = await TaxRate.findAndCountAll({
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
    const taxRate = await TaxRate.findByPk(id);
    if (!taxRate || !taxRate.is_active) {
      throw new Error("Tax rate not found");
    }
    return taxRate;
  },

  async update(id, data, userInfo) {
    const taxRate = await this.getById(id);

    // If setting as default, unset other defaults
    if (data.is_default && !taxRate.is_default) {
      await TaxRate.update({ is_default: false }, { where: { is_default: true } });
    }

    await taxRate.update({
      ...data,
      updated_by: userInfo.id,
      updated_by_name: userInfo.name,
      updated_by_email: userInfo.email,
    });

    return taxRate;
  },

  async delete(id, userInfo) {
    const taxRate = await this.getById(id);

    await taxRate.update({
      is_active: false,
      deleted_by: userInfo.id,
      deleted_by_name: userInfo.name,
      deleted_by_email: userInfo.email,
    });

    return { message: "Tax rate deleted successfully" };
  },
};

export default taxRateService;
