import proceduresService from "../service/procedures.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createProcedureSchema,
  updateProcedureSchema,
} from "../dto/procedures.dto.js";

const proceduresController = {

  async create(req, res) {
    try {
      const data = await parseZodSchema(createProcedureSchema, req.body);
      const procedure = await proceduresService.create(data, req.user);
      return res.sendSuccess(procedure, "Procedure created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create procedure");
    }
  },

  async getAll(req, res) {
    try {
      const procedures = await proceduresService.getAll(req.query);
      return res.sendSuccess(procedures, "Procedures fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch procedures");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const procedure = await proceduresService.getById(id);
      return res.sendSuccess(procedure, "Procedure fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch procedure");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateProcedureSchema, req.body);
      const procedure = await proceduresService.update(id, data, req.user);
      return res.sendSuccess(procedure, "Procedure updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update procedure");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await proceduresService.delete(id, req.user);
      return res.sendSuccess(result, "Procedure deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete procedure");
    }
  },
};

export default proceduresController;
