import prescriptionsService from "../service/prescriptions.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  dispensePrescriptionSchema,
} from "../dto/prescriptions.dto.js";

const prescriptionsController = {

  /**
   * ✅ Create Prescription
   */
  async create(req, res) {
    try {
      const prescriptionData = await parseZodSchema(
        createPrescriptionSchema,
        req.body
      );

      const prescription = await prescriptionsService.create(
        prescriptionData,
        req.user
      );

      return res.sendSuccess(
        prescription,
        "Prescription created successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to create prescription"
      );
    }
  },

  /**
   * ✅ Get All Prescriptions
   */
  async getAll(req, res) {
    try {
      const prescriptions = await prescriptionsService.getAll(req.query);

      return res.sendSuccess(
        prescriptions,
        "Prescriptions fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch prescriptions"
      );
    }
  },

  /**
   * ✅ Get Prescription By ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const prescription = await prescriptionsService.getById(id);

      return res.sendSuccess(
        prescription,
        "Prescription fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch prescription"
      );
    }
  },

  /**
   * ✅ Update Prescription
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const data = await parseZodSchema(
        updatePrescriptionSchema,
        req.body
      );

      const updatedPrescription = await prescriptionsService.update(
        id,
        data,
        req.user
      );

      return res.sendSuccess(
        updatedPrescription,
        "Prescription updated successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to update prescription"
      );
    }
  },

  /**
   * ✅ Dispense Prescription (Update Stock)
   */
  async dispense(req, res) {
    try {
      const { id } = req.params;

      const data = await parseZodSchema(
        dispensePrescriptionSchema,
        req.body
      );

      const prescription = await prescriptionsService.dispense(
        id,
        data,
        req.user
      );

      return res.sendSuccess(
        prescription,
        "Prescription dispensed successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to dispense prescription"
      );
    }
  },

  /**
   * ✅ Delete Prescription
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await prescriptionsService.delete(id, req.user);

      return res.sendSuccess(
        result,
        "Prescription deleted successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to delete prescription"
      );
    }
  },
};

export default prescriptionsController;
