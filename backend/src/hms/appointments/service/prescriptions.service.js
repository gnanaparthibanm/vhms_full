import Prescriptions from "../models/prescriptions.models.js";
import PrescriptionItems from "../models/prescriptionitems.models.js";
import Diagnosis from "../models/diagnosis.models.js";
import Appointments from "../models/appointments.models.js";
import Pet from "../../clients/models/pet.models.js";
import Clients from "../../clients/models/clients.models.js";
import Product from "../../../ims/product/models/product.model.js";
import Stock from "../../../ims/stock/models/stock.models.js";
import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";

const prescriptionsService = {

  /**
   * ✅ Create Prescription with Items
   */
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      if (!data.pet_id) {
        throw new Error("Pet ID is required");
      }

      // Validate pet exists
      const pet = await Pet.findByPk(data.pet_id);
      if (!pet) {
        throw new Error("Pet not found");
      }

      // Validate diagnosis if provided
      if (data.diagnosis_id) {
        const diagnosis = await Diagnosis.findByPk(data.diagnosis_id);
        if (!diagnosis) {
          throw new Error("Diagnosis not found");
        }
      }

      // Validate appointment if provided
      if (data.appointment_id) {
        const appointment = await Appointments.findByPk(data.appointment_id);
        if (!appointment) {
          throw new Error("Appointment not found");
        }
      }

      // Validate all products exist and have stock
      for (const item of data.items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        // Check if product is a prescription item
        if (!product.is_prescription_item) {
          throw new Error(`Product "${product.product_name}" is not marked as a prescription item`);
        }

        // Check if product requires prescription
        if (product.requires_prescription && product.status !== 'active') {
          throw new Error(`Product "${product.product_name}" is not active`);
        }

        // Check expiry date
        if (product.expiry_date && new Date(product.expiry_date) < new Date()) {
          throw new Error(`Product "${product.product_name}" has expired`);
        }

        const stock = await Stock.findOne({
          where: { product_id: item.product_id, is_active: true }
        });
        
        if (!stock || stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.product_name}`);
        }
      }

      // Create prescription
      const prescription = await Prescriptions.create({
        pet_id: data.pet_id,
        diagnosis_id: data.diagnosis_id || null,
        appointment_id: data.appointment_id || null,
        prescription_no: data.prescription_no,
        prescription_date: data.prescription_date || new Date(),
        notes: data.notes,
        status: data.status || 'Pending',
        created_by: userInfo.id || null,
        created_by_name: userInfo.name || null,
        created_by_email: userInfo.email || null,
      }, { transaction });

      // Create prescription items
      const items = data.items.map(item => ({
        prescription_id: prescription.id,
        product_id: item.product_id,
        quantity: item.quantity,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
      }));

      await PrescriptionItems.bulkCreate(items, { transaction });

      await transaction.commit();

      return await this.getById(prescription.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Get All Prescriptions (Pagination & Filters)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      pet_id,
      diagnosis_id,
      appointment_id,
      status,
      start_date,
      end_date,
      is_active = true,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (pet_id) where.pet_id = pet_id;
    if (diagnosis_id) where.diagnosis_id = diagnosis_id;
    if (appointment_id) where.appointment_id = appointment_id;
    if (status) where.status = status;
    if (is_active !== undefined) where.is_active = is_active;

    if (start_date && end_date) {
      where.prescription_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    }

    const { count, rows } = await Prescriptions.findAndCountAll({
      where,
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed"],
          include: [
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
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at"],
          required: false,
        },
        {
          model: PrescriptionItems,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id", "product_name", "product_code", "unit", "selling_price",
                "product_type", "generic_name", "strength", "dosage_form",
                "manufacturer", "expiry_date"
              ],
            },
          ],
        },
      ],
      offset,
      limit: Number(limit),
      order: [["prescription_date", "DESC"]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Prescription by ID
   */
  async getById(id) {
    const prescription = await Prescriptions.findByPk(id, {
      include: [
        {
          model: Pet,
          as: "pet",
          attributes: ["id", "pet_name", "species", "breed", "age", "gender"],
          include: [
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
        {
          model: Appointments,
          as: "appointment",
          attributes: ["id", "appointment_no", "scheduled_at", "visit_type"],
          required: false,
        },
        {
          model: PrescriptionItems,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "id", "product_name", "product_code", "unit", "selling_price",
                "product_type", "generic_name", "strength", "dosage_form",
                "manufacturer", "expiry_date", "side_effects", "contraindications"
              ],
            },
          ],
        },
      ],
    });
    
    if (!prescription) throw new Error("Prescription not found");
    return prescription;
  },

  /**
   * ✅ Update Prescription
   */
  async update(id, data, userInfo = {}) {
    const prescription = await Prescriptions.findByPk(id);
    if (!prescription) throw new Error("Prescription not found");

    await prescription.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return await this.getById(id);
  },

  /**
   * ✅ Dispense Prescription Items (Update Stock)
   */
  async dispense(id, data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      const prescription = await Prescriptions.findByPk(id);
      if (!prescription) throw new Error("Prescription not found");

      if (prescription.status === 'Dispensed') {
        throw new Error("Prescription already fully dispensed");
      }

      if (prescription.status === 'Cancelled') {
        throw new Error("Cannot dispense cancelled prescription");
      }

      // Process each item
      for (const item of data.items) {
        const prescriptionItem = await PrescriptionItems.findByPk(item.prescription_item_id);
        if (!prescriptionItem) {
          throw new Error(`Prescription item ${item.prescription_item_id} not found`);
        }

        if (prescriptionItem.prescription_id !== id) {
          throw new Error(`Item ${item.prescription_item_id} does not belong to this prescription`);
        }

        const remainingQty = prescriptionItem.quantity - prescriptionItem.dispensed_quantity;
        if (item.dispensed_quantity > remainingQty) {
          throw new Error(`Cannot dispense more than remaining quantity for item ${item.prescription_item_id}`);
        }

        // Update stock
        const stock = await Stock.findOne({
          where: { product_id: prescriptionItem.product_id, is_active: true }
        });

        if (!stock || stock.quantity < item.dispensed_quantity) {
          const product = await Product.findByPk(prescriptionItem.product_id);
          throw new Error(`Insufficient stock for product: ${product.product_name}`);
        }

        // Deduct from stock
        await stock.update({
          quantity: stock.quantity - item.dispensed_quantity,
          customer_billing_quantity: stock.customer_billing_quantity + item.dispensed_quantity,
          prescription_quantity: stock.prescription_quantity + item.dispensed_quantity,
        }, { transaction });

        // Update prescription item
        await prescriptionItem.update({
          dispensed_quantity: prescriptionItem.dispensed_quantity + item.dispensed_quantity,
        }, { transaction });
      }

      // Check if all items are fully dispensed
      const allItems = await PrescriptionItems.findAll({
        where: { prescription_id: id }
      });

      const allDispensed = allItems.every(item => item.dispensed_quantity >= item.quantity);
      const partiallyDispensed = allItems.some(item => item.dispensed_quantity > 0);

      let newStatus = 'Pending';
      if (allDispensed) {
        newStatus = 'Dispensed';
      } else if (partiallyDispensed) {
        newStatus = 'Partially_Dispensed';
      }

      await prescription.update({
        status: newStatus,
        updated_by: userInfo.id || null,
        updated_by_name: userInfo.name || null,
        updated_by_email: userInfo.email || null,
      }, { transaction });

      await transaction.commit();

      return await this.getById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * ✅ Soft Delete Prescription
   */
  async delete(id, userInfo = {}) {
    const prescription = await Prescriptions.findByPk(id);
    if (!prescription) throw new Error("Prescription not found");

    if (prescription.status === 'Dispensed' || prescription.status === 'Partially_Dispensed') {
      throw new Error("Cannot delete a prescription that has been dispensed");
    }

    await prescription.update({
      is_active: false,
      status: 'Cancelled',
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Prescription deleted successfully" };
  },
};

export default prescriptionsService;
