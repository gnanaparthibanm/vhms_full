import diagnosisService from "../service/diagnosis.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createDiagnosisSchema,
  updateDiagnosisSchema,
} from "../dto/diagnosis.dto.js";

const diagnosisController = {

  /**
   * ✅ Create Diagnosis
   */
  async create(req, res) {
    try {
      // Validate input
      const diagnosisData = await parseZodSchema(
        createDiagnosisSchema,
        req.body
      );

      // Add audit info
      diagnosisData.created_by = req.user?.id;
      diagnosisData.created_by_name = req.user?.username;
      diagnosisData.created_by_email = req.user?.email;

      const diagnosis = await diagnosisService.create(
        diagnosisData,
        req.user
      );

      return res.sendSuccess(
        diagnosis,
        "Diagnosis created successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to create diagnosis"
      );
    }
  },

  /**
   * ✅ Get All Diagnosis
   */
  async getAll(req, res) {
    try {
      const diagnosisList = await diagnosisService.getAll(req.query);

      return res.sendSuccess(
        diagnosisList,
        "Diagnosis fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch diagnosis"
      );
    }
  },

  /**
   * ✅ Get Diagnosis By ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const diagnosis = await diagnosisService.getById(id);

      return res.sendSuccess(
        diagnosis,
        "Diagnosis fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch diagnosis"
      );
    }
  },

  /**
   * ✅ Get Latest Diagnosis By Admission ID
   */
  async getLatestByAdmission(req, res) {
    try {
      const { admission_id } = req.params;

      const diagnosis =
        await diagnosisService.getLatestByAdmission(admission_id);

      return res.sendSuccess(
        diagnosis,
        "Latest diagnosis fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch latest diagnosis"
      );
    }
  },

  /**
   * ✅ Update Diagnosis
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const data = await parseZodSchema(
        updateDiagnosisSchema,
        req.body
      );

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedDiagnosis = await diagnosisService.update(
        id,
        data,
        req.user
      );

      return res.sendSuccess(
        updatedDiagnosis,
        "Diagnosis updated successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to update diagnosis"
      );
    }
  },

  /**
   * ✅ Soft Delete Diagnosis
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await diagnosisService.delete(id, req.user);

      return res.sendSuccess(
        result,
        "Diagnosis deleted successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to delete diagnosis"
      );
    }
  },

  /**
   * ✅ Restore Diagnosis
   */
  async restore(req, res) {
    try {
      const { id } = req.params;

      const result = await diagnosisService.restore(id, req.user);

      return res.sendSuccess(
        result,
        "Diagnosis restored successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to restore diagnosis"
      );
    }
  },
};

export default diagnosisController;