import PetVitals from "../models/petvitals.models.js";
import Admissions from "../../admissions/models/admissions.models.js";
import { Op } from "sequelize";

const petVitalsService = {

  /**
   * ✅ Create Pet Vitals
   */
  async create(data, userInfo = {}) {
    if (!data.addmission_id) {
      throw new Error("Admission ID is required");
    }

    // Validate admission
    const admission = await Admissions.findByPk(data.addmission_id);
    if (!admission) {
      throw new Error("Admission not found");
    }

    const vitals = await PetVitals.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return vitals;
  },

  /**
   * ✅ Get All Pet Vitals (with pagination & filters)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      addmission_id,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (addmission_id) where.addmission_id = addmission_id;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await PetVitals.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Pet Vitals by ID
   */
  async getById(id) {
    const vitals = await PetVitals.findByPk(id);
    if (!vitals) throw new Error("Pet vitals not found");
    return vitals;
  },

  /**
   * ✅ Get Latest Vitals for an Admission
   */
  async getLatestByAdmission(admissionId) {
    const vitals = await PetVitals.findOne({
      where: {
        addmission_id: admissionId,
        is_active: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return vitals;
  },

  /**
   * ✅ Update Pet Vitals
   */
  async update(id, data, userInfo = {}) {
    const vitals = await PetVitals.findByPk(id);
    if (!vitals) throw new Error("Pet vitals not found");

    await vitals.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return vitals;
  },

  /**
   * ✅ Soft Delete Pet Vitals
   */
  async delete(id, userInfo = {}) {
    const vitals = await PetVitals.findByPk(id);
    if (!vitals) throw new Error("Pet vitals not found");

    await vitals.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Pet vitals deleted successfully" };
  },

  /**
   * ✅ Restore Pet Vitals
   */
  async restore(id, userInfo = {}) {
    const vitals = await PetVitals.findByPk(id);
    if (!vitals) throw new Error("Pet vitals not found");

    await vitals.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Pet vitals restored successfully" };
  },
};

export default petVitalsService;
