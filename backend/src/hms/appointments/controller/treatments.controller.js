import treatmentsService from "../service/treatments.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createTreatmentSchema,
  updateTreatmentSchema,
} from "../dto/treatments.dto.js";

const treatmentsController = {

  async create(req, res) {
    try {
      const data = await parseZodSchema(createTreatmentSchema, req.body);
      const treatment = await treatmentsService.create(data, req.user);
      return res.sendSuccess(treatment, "Treatment created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create treatment");
    }
  },

  async getAll(req, res) {
    try {
      const treatments = await treatmentsService.getAll(req.query);
      return res.sendSuccess(treatments, "Treatments fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch treatments");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const treatment = await treatmentsService.getById(id);
      return res.sendSuccess(treatment, "Treatment fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch treatment");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateTreatmentSchema, req.body);
      const treatment = await treatmentsService.update(id, data, req.user);
      return res.sendSuccess(treatment, "Treatment updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update treatment");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await treatmentsService.delete(id, req.user);
      return res.sendSuccess(result, "Treatment deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete treatment");
    }
  },
};

export default treatmentsController;
