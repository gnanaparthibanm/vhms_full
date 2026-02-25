import Procedures from "../models/procedures.models.js";
import Pet from "../../clients/models/pet.models.js";
import Appointments from "../models/appointments.models.js";
import Diagnosis from "../models/diagnosis.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import { Op } from "sequelize";

const proceduresService = {

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

    if (data.doctor_id) {
      const doctor = await Doctor.findByPk(data.doctor_id);
      if (!doctor) throw new Error("Doctor not found");
    }

    const procedure = await Procedures.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return await this.getById(procedure.id);
  },

  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_id,
      appointment_id,
      diagnosis_id,
      doctor_id,
      status,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_id) where.pet_id = pet_id;
    if (appointment_id) where.appointment_id = appointment_id;
    if (diagnosis_id) where.diagnosis_id = diagnosis_id;
    if (doctor_id) where.doctor_id = doctor_id;
    if (status) where.status = status;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.scheduled_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Procedures.findAndCountAll({
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
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "doctor_name", "doctor_email"],
          required: false,
        },
      ],
      offset,
      limit: Number(limit),
      order: [["scheduled_date", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const procedure = await Procedures.findByPk(id, {
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
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "doctor_name", "doctor_email"],
          required: false,
        },
      ],
    });
    
    if (!procedure) throw new Error("Procedure not found");
    return procedure;
  },

  async update(id, data, userInfo = {}) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");

    await procedure.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  async delete(id, userInfo = {}) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");

    await procedure.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Procedure deleted successfully" };
  },
};

export default proceduresService;
