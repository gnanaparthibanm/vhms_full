import followUpsService from "../service/followups.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createFollowUpSchema,
  updateFollowUpSchema,
} from "../dto/followups.dto.js";

const followUpsController = {

  async create(req, res) {
    try {
      const data = await parseZodSchema(createFollowUpSchema, req.body);
      const followUp = await followUpsService.create(data, req.user);
      return res.sendSuccess(followUp, "Follow-up created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create follow-up");
    }
  },

  async getAll(req, res) {
    try {
      const followUps = await followUpsService.getAll(req.query);
      return res.sendSuccess(followUps, "Follow-ups fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch follow-ups");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const followUp = await followUpsService.getById(id);
      return res.sendSuccess(followUp, "Follow-up fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch follow-up");
    }
  },

  async getUpcoming(req, res) {
    try {
      const { days = 7 } = req.query;
      const followUps = await followUpsService.getUpcoming(Number(days));
      return res.sendSuccess(followUps, "Upcoming follow-ups fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch upcoming follow-ups");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateFollowUpSchema, req.body);
      const followUp = await followUpsService.update(id, data, req.user);
      return res.sendSuccess(followUp, "Follow-up updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update follow-up");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await followUpsService.delete(id, req.user);
      return res.sendSuccess(result, "Follow-up deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete follow-up");
    }
  },
};

export default followUpsController;
