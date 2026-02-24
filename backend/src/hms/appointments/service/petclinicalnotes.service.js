import PetClinicalNotes from "../models/petclinicalnotes.models.js";
import Admissions from "../../admissions/models/admissions.models.js";
import { Op } from "sequelize";

const petClinicalNotesService = {

  /**
   * ✅ Create Pet Clinical Notes
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

    const clinicalNotes = await PetClinicalNotes.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return clinicalNotes;
  },

  /**
   * ✅ Get All Pet Clinical Notes (Pagination & Filters)
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

    const { count, rows } = await PetClinicalNotes.findAndCountAll({
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
   * ✅ Get Pet Clinical Notes by ID
   */
  async getById(id) {
    const notes = await PetClinicalNotes.findByPk(id);
    if (!notes) throw new Error("Pet clinical notes not found");
    return notes;
  },

  /**
   * ✅ Get Latest Clinical Notes by Admission ID
   */
  async getLatestByAdmission(admissionId) {
    const notes = await PetClinicalNotes.findOne({
      where: {
        addmission_id: admissionId,
        is_active: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return notes;
  },

  /**
   * ✅ Update Pet Clinical Notes
   */
  async update(id, data, userInfo = {}) {
    const notes = await PetClinicalNotes.findByPk(id);
    if (!notes) throw new Error("Pet clinical notes not found");

    await notes.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return notes;
  },

  /**
   * ✅ Soft Delete Pet Clinical Notes
   */
  async delete(id, userInfo = {}) {
    const notes = await PetClinicalNotes.findByPk(id);
    if (!notes) throw new Error("Pet clinical notes not found");

    await notes.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Pet clinical notes deleted successfully" };
  },

  /**
   * ✅ Restore Pet Clinical Notes
   */
  async restore(id, userInfo = {}) {
    const notes = await PetClinicalNotes.findByPk(id);
    if (!notes) throw new Error("Pet clinical notes not found");

    await notes.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Pet clinical notes restored successfully" };
  },
};

export default petClinicalNotesService;
