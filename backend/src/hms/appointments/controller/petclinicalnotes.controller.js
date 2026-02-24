import petClinicalNotesService from "../service/petclinicalnotes.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createPetClinicalNotesSchema,
  updatePetClinicalNotesSchema,
} from "../dto/petclinicalnotes.dto.js";

const petClinicalNotesController = {

  /**
   * ✅ Create Pet Clinical Notes
   */
  async create(req, res) {
    try {
      // Validate input
      const notesData = await parseZodSchema(
        createPetClinicalNotesSchema,
        req.body
      );

      // Add audit info
      notesData.created_by = req.user?.id;
      notesData.created_by_name = req.user?.username;
      notesData.created_by_email = req.user?.email;

      const notes = await petClinicalNotesService.create(
        notesData,
        req.user
      );

      return res.sendSuccess(
        notes,
        "Pet clinical notes created successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to create pet clinical notes"
      );
    }
  },

  /**
   * ✅ Get All Pet Clinical Notes
   */
  async getAll(req, res) {
    try {
      const notes = await petClinicalNotesService.getAll(req.query);
      return res.sendSuccess(
        notes,
        "Pet clinical notes fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch pet clinical notes"
      );
    }
  },

  /**
   * ✅ Get Pet Clinical Notes By ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const notes = await petClinicalNotesService.getById(id);
      return res.sendSuccess(
        notes,
        "Pet clinical notes fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch pet clinical notes"
      );
    }
  },

  /**
   * ✅ Get Latest Clinical Notes By Admission ID
   */
  async getLatestByAdmission(req, res) {
    try {
      const { admission_id } = req.params;

      const notes =
        await petClinicalNotesService.getLatestByAdmission(admission_id);

      return res.sendSuccess(
        notes,
        "Latest pet clinical notes fetched successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to fetch latest clinical notes"
      );
    }
  },

  /**
   * ✅ Update Pet Clinical Notes
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const data = await parseZodSchema(
        updatePetClinicalNotesSchema,
        req.body
      );

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedNotes = await petClinicalNotesService.update(
        id,
        data,
        req.user
      );

      return res.sendSuccess(
        updatedNotes,
        "Pet clinical notes updated successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to update pet clinical notes"
      );
    }
  },

  /**
   * ✅ Soft Delete Pet Clinical Notes
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await petClinicalNotesService.delete(id, req.user);

      return res.sendSuccess(
        result,
        "Pet clinical notes deleted successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to delete pet clinical notes"
      );
    }
  },

  /**
   * ✅ Restore Pet Clinical Notes
   */
  async restore(req, res) {
    try {
      const { id } = req.params;

      const result = await petClinicalNotesService.restore(id, req.user);

      return res.sendSuccess(
        result,
        "Pet clinical notes restored successfully"
      );
    } catch (error) {
      return res.sendError(
        error.message || "Failed to restore pet clinical notes"
      );
    }
  },
};

export default petClinicalNotesController;
