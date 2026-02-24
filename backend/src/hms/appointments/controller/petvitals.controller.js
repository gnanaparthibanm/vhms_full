import petVitalsService from "../service/petvitals.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createPetVitalsSchema,
  updatePetVitalsSchema,
} from "../dto/petvitals.dto.js";

const petVitalsController = {

  /**
   * ✅ Create Pet Vitals
   */
  async create(req, res) {
    try {
      // Validate input
      const vitalsData = await parseZodSchema(createPetVitalsSchema, req.body);

      // Add audit info
      vitalsData.created_by = req.user?.id;
      vitalsData.created_by_name = req.user?.username;
      vitalsData.created_by_email = req.user?.email;

      const vitals = await petVitalsService.create(vitalsData, req.user);

      return res.sendSuccess(vitals, "Pet vitals created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create pet vitals");
    }
  },

  /**
   * ✅ Get All Pet Vitals
   */
  async getAll(req, res) {
    try {
      const vitals = await petVitalsService.getAll(req.query);
      return res.sendSuccess(vitals, "Pet vitals fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pet vitals");
    }
  },

  /**
   * ✅ Get Pet Vitals By ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const vitals = await petVitalsService.getById(id);
      return res.sendSuccess(vitals, "Pet vitals fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pet vitals");
    }
  },

  /**
   * ✅ Get Latest Vitals By Admission ID
   */
  async getLatestByAdmission(req, res) {
    try {
      const { admission_id } = req.params;

      const vitals = await petVitalsService.getLatestByAdmission(admission_id);

      return res.sendSuccess(
        vitals,
        "Latest pet vitals fetched successfully"
      );
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch latest vitals");
    }
  },

  /**
   * ✅ Update Pet Vitals
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const data = await parseZodSchema(updatePetVitalsSchema, req.body);

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedVitals = await petVitalsService.update(
        id,
        data,
        req.user
      );

      return res.sendSuccess(updatedVitals, "Pet vitals updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update pet vitals");
    }
  },

  /**
   * ✅ Soft Delete Pet Vitals
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await petVitalsService.delete(id, req.user);

      return res.sendSuccess(result, "Pet vitals deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete pet vitals");
    }
  },

  /**
   * ✅ Restore Pet Vitals
   */
  async restore(req, res) {
    try {
      const { id } = req.params;

      const result = await petVitalsService.restore(id, req.user);

      return res.sendSuccess(result, "Pet vitals restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore pet vitals");
    }
  },
};

export default petVitalsController;
