import Grooming from "../models/grooming.models.js";
import GroomingServices from "../models/groomingservices.models.js";
import GroomingPackages from "../models/groomingpackages.models.js";
import Appointments from "../models/appointments.models.js";
import Pet from "../../clients/models/pet.models.js";
import Clients from "../../clients/models/clients.models.js";
import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";

const groomingService = {

  /**
   * ✅ Create Grooming Session with Services
   */
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate appointment
      const appointment = await Appointments.findByPk(data.appointment_id);
      if (!appointment) throw new Error("Appointment not found");
      
      if (appointment.appointment_type !== 'Grooming') {
        throw new Error("Appointment type must be 'Grooming'");
      }

      // Validate pet
      const pet = await Pet.findByPk(data.pet_id);
      if (!pet) throw new Error("Pet not found");

      // Calculate total cost
      let totalCost = 0;
      data.services.forEach(service => {
        totalCost += parseFloat(service.cost);
      });

      // Create grooming session
      const grooming = await Grooming.create({
        appointment_id: data.appointment_id,
        pet_id: data.pet_id,
        groomer_id: data.groomer_id || null,
        grooming_no: data.grooming_no,
        total_cost: totalCost,
        special_instructions: data.special_instructions,
        pet_behavior: data.pet_behavior,
        recommended_by_doctor: data.recommended_by_doctor || false,
        consultation_id: data.consultation_id || null,
        status: 'Scheduled',
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Create grooming services
      const services = data.services.map(service => ({
        grooming_id: grooming.id,
        service_type: service.service_type,
        service_name: service.service_name,
        description: service.description,
        cost: service.cost,
        duration_minutes: service.duration_minutes,
        notes: service.notes,
        status: 'Pending',
      }));

      await GroomingServices.bulkCreate(services, { transaction });

      await transaction.commit();

      return await this.getById(grooming.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Recommend Grooming from Consultation
   */
  async recommendGrooming(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate consultation appointment
      const consultationAppointment = await Appointments.findByPk(data.consultation_appointment_id);
      if (!consultationAppointment) throw new Error("Consultation appointment not found");
      
      if (consultationAppointment.appointment_type !== 'Consultation') {
        throw new Error("Referenced appointment must be a consultation");
      }

      // Validate pet
      const pet = await Pet.findByPk(data.pet_id);
      if (!pet) throw new Error("Pet not found");

      // Get client from consultation appointment
      const client = await Clients.findByPk(consultationAppointment.client_id);
      if (!client) throw new Error("Client not found");

      // Generate grooming appointment number
      const lastAppointment = await Appointments.findOne({
        order: [['createdAt', 'DESC']],
      });
      
      let lastNumber = 0;
      if (lastAppointment && lastAppointment.appointment_no) {
        const match = lastAppointment.appointment_no.match(/APT(\d+)/);
        if (match) lastNumber = parseInt(match[1]);
      }
      const newAppointmentNo = `APT${(lastNumber + 1).toString().padStart(5, '0')}`;

      // Create grooming appointment
      const groomingAppointment = await Appointments.create({
        client_id: client.id,
        pet_id: pet.id,
        doctor_id: null, // No doctor needed for grooming
        appointment_no: newAppointmentNo,
        appointment_type: 'Grooming',
        scheduled_at: new Date(), // Can be updated later
        scheduled_time: '09:00:00', // Default time
        status: 'Pending',
        visit_type: 'OPD',
        reason: data.reason || 'Grooming recommended by doctor',
        notes: `Recommended during consultation ${consultationAppointment.appointment_no}`,
        source: 'Offline',
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Generate grooming number
      const lastGrooming = await Grooming.findOne({
        order: [['createdAt', 'DESC']],
      });
      
      let lastGroomingNumber = 0;
      if (lastGrooming && lastGrooming.grooming_no) {
        const match = lastGrooming.grooming_no.match(/GRM(\d+)/);
        if (match) lastGroomingNumber = parseInt(match[1]);
      }
      const newGroomingNo = `GRM${(lastGroomingNumber + 1).toString().padStart(5, '0')}`;

      // Create grooming session
      const grooming = await Grooming.create({
        appointment_id: groomingAppointment.id,
        pet_id: pet.id,
        grooming_no: newGroomingNo,
        total_cost: 0, // Will be calculated when services are added
        special_instructions: data.special_instructions,
        recommended_by_doctor: true,
        consultation_id: data.consultation_appointment_id,
        status: 'Scheduled',
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Create recommended services
      const services = data.recommended_services.map(serviceType => ({
        grooming_id: grooming.id,
        service_type: serviceType,
        service_name: serviceType.replace(/_/g, ' '),
        cost: 0, // To be set by groomer
        status: 'Pending',
      }));

      await GroomingServices.bulkCreate(services, { transaction });

      await transaction.commit();

      return {
        grooming: await this.getById(grooming.id),
        appointment: groomingAppointment,
        message: "Grooming appointment created successfully from doctor's recommendation"
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Get All Grooming Sessions
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_id,
      appointment_id,
      groomer_id,
      status,
      recommended_by_doctor,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_id) where.pet_id = pet_id;
    if (appointment_id) where.appointment_id = appointment_id;
    if (groomer_id) where.groomer_id = groomer_id;
    if (status) where.status = status;
    if (recommended_by_doctor !== undefined) where.recommended_by_doctor = recommended_by_doctor;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Grooming.findAndCountAll({
      where,
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed", "age"],
          include: [
            {
              model: Clients,
              as: "client",
              attributes: ["id", "first_name", "last_name", "phone"],
            },
          ],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "status"],
        },
        {
          model: GroomingServices,
          as: "services",
        },
      ],
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
   * ✅ Get Grooming by ID
   */
  async getById(id) {
    const grooming = await Grooming.findByPk(id, {
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed", "age", "gender", "weight"],
          include: [
            {
              model: Clients,
              as: "client",
              attributes: ["id", "first_name", "last_name", "phone", "email"],
            },
          ],
        },
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "status"],
        },
        {
          model: GroomingServices,
          as: "services",
        },
      ],
    });
    
    if (!grooming) throw new Error("Grooming session not found");
    return grooming;
  },

  /**
   * ✅ Get Pet Grooming History
   */
  async getPetHistory(petId) {
    const grooming = await Grooming.findAll({
      where: { pet_id: petId, is_active: true },
      include: [
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
        },
        {
          model: GroomingServices,
          as: "services",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return grooming;
  },

  /**
   * ✅ Update Grooming Session
   */
  async update(id, data, userInfo = {}) {
    const grooming = await Grooming.findByPk(id);
    if (!grooming) throw new Error("Grooming session not found");

    await grooming.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  /**
   * ✅ Update Service Status
   */
  async updateServiceStatus(serviceId, status, notes = null) {
    const service = await GroomingServices.findByPk(serviceId);
    if (!service) throw new Error("Grooming service not found");

    await service.update({ status, notes });

    // Check if all services are completed
    const grooming = await Grooming.findByPk(service.grooming_id, {
      include: [{ model: GroomingServices, as: "services" }],
    });

    const allCompleted = grooming.services.every(s => s.status === 'Completed' || s.status === 'Skipped');
    
    if (allCompleted && grooming.status !== 'Completed') {
      await grooming.update({ 
        status: 'Completed',
        end_time: new Date()
      });
    }

    return service;
  },

  /**
   * ✅ Start Grooming Session
   */
  async startSession(id, userInfo = {}) {
    const grooming = await Grooming.findByPk(id);
    if (!grooming) throw new Error("Grooming session not found");

    if (grooming.status !== 'Scheduled') {
      throw new Error("Can only start scheduled grooming sessions");
    }

    await grooming.update({
      status: 'In_Progress',
      start_time: new Date(),
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  /**
   * ✅ Complete Grooming Session
   */
  async completeSession(id, data, userInfo = {}) {
    const grooming = await Grooming.findByPk(id);
    if (!grooming) throw new Error("Grooming session not found");

    await grooming.update({
      status: 'Completed',
      end_time: new Date(),
      health_concerns: data.health_concerns,
      before_photos: data.before_photos,
      after_photos: data.after_photos,
      notes: data.notes,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  /**
   * ✅ Cancel Grooming Session
   */
  async cancel(id, userInfo = {}) {
    const grooming = await Grooming.findByPk(id);
    if (!grooming) throw new Error("Grooming session not found");

    if (grooming.status === 'Completed') {
      throw new Error("Cannot cancel completed grooming session");
    }

    await grooming.update({
      status: 'Cancelled',
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Grooming session cancelled successfully" };
  },

  // ============================================
  // GROOMING PACKAGES
  // ============================================

  /**
   * ✅ Create Grooming Package
   */
  async createPackage(data, userInfo = {}) {
    const groomingPackage = await GroomingPackages.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return groomingPackage;
  },

  /**
   * ✅ Get All Packages
   */
  async getAllPackages(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_size,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_size) where.pet_size = pet_size;
    if (is_active !== undefined) where.is_active = is_active;

    const { count, rows } = await GroomingPackages.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [["package_name", "ASC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Package by ID
   */
  async getPackageById(id) {
    const groomingPackage = await GroomingPackages.findByPk(id);
    if (!groomingPackage) throw new Error("Grooming package not found");
    return groomingPackage;
  },

  /**
   * ✅ Update Package
   */
  async updatePackage(id, data, userInfo = {}) {
    const groomingPackage = await GroomingPackages.findByPk(id);
    if (!groomingPackage) throw new Error("Grooming package not found");

    await groomingPackage.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return groomingPackage;
  },

  /**
   * ✅ Delete Package
   */
  async deletePackage(id, userInfo = {}) {
    const groomingPackage = await GroomingPackages.findByPk(id);
    if (!groomingPackage) throw new Error("Grooming package not found");

    await groomingPackage.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Grooming package deleted successfully" };
  },
};

export default groomingService;
