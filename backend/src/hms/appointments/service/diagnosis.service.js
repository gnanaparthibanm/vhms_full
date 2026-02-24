import Diagnosis from "../models/diagnosis.models.js";
import Admissions from "../../admissions/models/admissions.models.js";
import { Op } from "sequelize";

const diagnosisService = {

  /**
   * ✅ Create Diagnosis
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

    const diagnosis = await Diagnosis.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return diagnosis;
  },

  /**
   * ✅ Get All Diagnosis (Pagination & Filters)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      addmission_id,
      severity,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (addmission_id) where.addmission_id = addmission_id;
    if (severity) where.severity = severity;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Diagnosis.findAndCountAll({
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
   * ✅ Get Diagnosis by ID
   */
  async getById(id) {
    const diagnosis = await Diagnosis.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");
    return diagnosis;
  },

  /**
   * ✅ Get Latest Diagnosis by Admission ID
   */
  async getLatestByAdmission(admissionId) {
    const diagnosis = await Diagnosis.findOne({
      where: {
        addmission_id: admissionId,
        is_active: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return diagnosis;
  },

  /**
   * ✅ Update Diagnosis
   */
  async update(id, data, userInfo = {}) {
    const diagnosis = await Diagnosis.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");

    await diagnosis.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return diagnosis;
  },

  /**
   * ✅ Soft Delete Diagnosis
   */
  async delete(id, userInfo = {}) {
    const diagnosis = await Diagnosis.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");

    await diagnosis.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Diagnosis deleted successfully" };
  },

  /**
   * ✅ Restore Diagnosis
   */
  async restore(id, userInfo = {}) {
    const diagnosis = await Diagnosis.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");

    await diagnosis.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Diagnosis restored successfully" };
  },
};

export default diagnosisService;
