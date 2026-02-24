import Vaccinations from "../models/vaccinations.models.js";
import Pet from "../../clients/models/pet.models.js";
import Appointments from "../models/appointments.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import { Op } from "sequelize";

const vaccinationsService = {

  async create(data, userInfo = {}) {
    if (!data.pet_id) throw new Error("Pet ID is required");

    const pet = await Pet.findByPk(data.pet_id);
    if (!pet) throw new Error("Pet not found");

    if (data.appointment_id) {
      const appointment = await Appointments.findByPk(data.appointment_id);
      if (!appointment) throw new Error("Appointment not found");
    }

    if (data.doctor_id) {
      const doctor = await Doctor.findByPk(data.doctor_id);
      if (!doctor) throw new Error("Doctor not found");
    }

    const vaccination = await Vaccinations.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return await this.getById(vaccination.id);
  },

  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_id,
      appointment_id,
      doctor_id,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_id) where.pet_id = pet_id;
    if (appointment_id) where.appointment_id = appointment_id;
    if (doctor_id) where.doctor_id = doctor_id;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.date_given = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Vaccinations.findAndCountAll({
      where,
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
          required: false,
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "first_name", "last_name"],
          required: false,
        },
      ],
      offset,
      limit: Number(limit),
      order: [["date_given", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const vaccination = await Vaccinations.findByPk(id, {
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed", "age"],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
          required: false,
        },
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "first_name", "last_name", "specialization"],
          required: false,
        },
      ],
    });
    
    if (!vaccination) throw new Error("Vaccination not found");
    return vaccination;
  },

  async getByPetId(petId) {
    const vaccinations = await Vaccinations.findAll({
      where: { pet_id: petId, is_active: true },
      include: [
        {
          model: Doctor,
          as: "doctor",
          attributes: ["id", "first_name", "last_name"],
          required: false,
        },
      ],
      order: [["date_given", "DESC"]],
    });

    return vaccinations;
  },

  async getDueVaccinations() {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const vaccinations = await Vaccinations.findAll({
      where: {
        next_due_date: {
          [Op.between]: [today, nextMonth],
        },
        is_active: true,
      },
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed"],
        },
      ],
      order: [["next_due_date", "ASC"]],
    });

    return vaccinations;
  },

  async update(id, data, userInfo = {}) {
    const vaccination = await Vaccinations.findByPk(id);
    if (!vaccination) throw new Error("Vaccination not found");

    await vaccination.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  async delete(id, userInfo = {}) {
    const vaccination = await Vaccinations.findByPk(id);
    if (!vaccination) throw new Error("Vaccination not found");

    await vaccination.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Vaccination deleted successfully" };
  },
};

export default vaccinationsService;
