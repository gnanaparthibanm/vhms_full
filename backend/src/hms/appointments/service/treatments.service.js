import Treatments from "../models/treatments.models.js";
import Pet from "../../clients/models/pet.models.js";
import Appointments from "../models/appointments.models.js";
import Diagnosis from "../models/diagnosis.models.js";
import { Op } from "sequelize";

const treatmentsService = {

  async create(data, userInfo = {}) {
    if (!data.pet_id) throw new Error("Pet ID is required");
    if (!data.appointment_id) throw new Error("Appointment ID is required");

    const pet = await Pet.findByPk(data.pet_id);
    if (!pet) throw new Error("Pet not found");

    const appointment = await Appointments.findByPk(data.appointment_id);
    if (!appointment) throw new Error("Appointment not found");

    if (data.diagnosis_id) {
      const diagnosis = await Diagnosis.findByPk(data.diagnosis_id);
      if (!diagnosis) throw new Error("Diagnosis not found");
    }

    const treatment = await Treatments.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return await this.getById(treatment.id);
  },

  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_id,
      appointment_id,
      diagnosis_id,
      status,
      treatment_type,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_id) where.pet_id = pet_id;
    if (appointment_id) where.appointment_id = appointment_id;
    if (diagnosis_id) where.diagnosis_id = diagnosis_id;
    if (status) where.status = status;
    if (treatment_type) where.treatment_type = treatment_type;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.start_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Treatments.findAndCountAll({
      where,
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "name", "pet_type", "breed"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
        },
        {
          model: Diagnosis,
          as: "diagnosis",
          attributes: ["id", "diagnosis_name", "severity"],
          required: false,
        },
      ],
      offset,
      limit: Number(limit),
      order: [["start_date", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const treatment = await Treatments.findByPk(id, {
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "name", "pet_type", "breed"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
        },
        {
          model: Diagnosis,
          as: "diagnosis",
          attributes: ["id", "diagnosis_name", "severity", "remarks"],
          required: false,
        },
      ],
    });
    
    if (!treatment) throw new Error("Treatment not found");
    return treatment;
  },

  async update(id, data, userInfo = {}) {
    const treatment = await Treatments.findByPk(id);
    if (!treatment) throw new Error("Treatment not found");

    await treatment.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  async delete(id, userInfo = {}) {
    const treatment = await Treatments.findByPk(id);
    if (!treatment) throw new Error("Treatment not found");

    await treatment.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Treatment deleted successfully" };
  },
};

export default treatmentsService;
