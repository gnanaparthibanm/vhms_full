import FollowUps from "../models/followups.models.js";
import Appointments from "../models/appointments.models.js";
import Diagnosis from "../models/diagnosis.models.js";
import Pet from "../../clients/models/pet.models.js";
import Clients from "../../clients/models/clients.models.js";
import { Op } from "sequelize";

const followUpsService = {

  async create(data, userInfo = {}) {
    if (!data.appointment_id) throw new Error("Appointment ID is required");

    const appointment = await Appointments.findByPk(data.appointment_id);
    if (!appointment) throw new Error("Appointment not found");

    if (data.diagnosis_id) {
      const diagnosis = await Diagnosis.findByPk(data.diagnosis_id);
      if (!diagnosis) throw new Error("Diagnosis not found");
    }

    const followUp = await FollowUps.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return await this.getById(followUp.id);
  },

  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      appointment_id,
      diagnosis_id,
      status,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (appointment_id) where.appointment_id = appointment_id;
    if (diagnosis_id) where.diagnosis_id = diagnosis_id;
    if (status) where.status = status;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.next_visit_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await FollowUps.findAndCountAll({
      where,
      include: [
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "pet_id", "client_id"],
          include: [
            {
              model: Pet,
              as: "pet",
              attributes: ["id", "pet_name", "species", "breed"],
            },
            {
              model: Clients,
              as: "client",
              attributes: ["id", "first_name", "last_name", "phone"],
            },
          ],
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
      order: [["next_visit_date", "ASC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const followUp = await FollowUps.findByPk(id, {
      include: [
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "pet_id", "client_id"],
          include: [
            {
              model: Pet,
              as: "pet",
              attributes: ["id", "pet_name", "species", "breed"],
            },
            {
              model: Clients,
              as: "client",
              attributes: ["id", "first_name", "last_name", "phone", "email"],
            },
          ],
        },
        {
          model: Diagnosis,
          as: "diagnosis",
          attributes: ["id", "diagnosis_name", "severity", "remarks"],
          required: false,
        },
      ],
    });
    
    if (!followUp) throw new Error("Follow-up not found");
    return followUp;
  },

  async getUpcoming(days = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const followUps = await FollowUps.findAll({
      where: {
        next_visit_date: {
          [Op.between]: [today, futureDate],
        },
        status: 'Scheduled',
        is_active: true,
      },
      include: [
        {
          model: Appointments,
          as: "appointment",
          include: [
            {
              model: Pet,
              as: "pet",
              attributes: ["id", "pet_name", "species"],
            },
            {
              model: Clients,
              as: "client",
              attributes: ["id", "first_name", "last_name", "phone"],
            },
          ],
        },
      ],
      order: [["next_visit_date", "ASC"]],
    });

    return followUps;
  },

  async update(id, data, userInfo = {}) {
    const followUp = await FollowUps.findByPk(id);
    if (!followUp) throw new Error("Follow-up not found");

    await followUp.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  async delete(id, userInfo = {}) {
    const followUp = await FollowUps.findByPk(id);
    if (!followUp) throw new Error("Follow-up not found");

    await followUp.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Follow-up deleted successfully" };
  },
};

export default followUpsService;
