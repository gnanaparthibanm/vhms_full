import vaccinationsService from "../service/vaccinations.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createVaccinationSchema,
  updateVaccinationSchema,
} from "../dto/vaccinations.dto.js";

const vaccinationsController = {

  async create(req, res) {
    try {
      const data = await parseZodSchema(createVaccinationSchema, req.body);
      const vaccination = await vaccinationsService.create(data, req.user);
      return res.sendSuccess(vaccination, "Vaccination created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create vaccination");
    }
  },

  async getAll(req, res) {
    try {
      const vaccinations = await vaccinationsService.getAll(req.query);
      return res.sendSuccess(vaccinations, "Vaccinations fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vaccinations");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const vaccination = await vaccinationsService.getById(id);
      return res.sendSuccess(vaccination, "Vaccination fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vaccination");
    }
  },

  async getByPetId(req, res) {
    try {
      const { pet_id } = req.params;
      const vaccinations = await vaccinationsService.getByPetId(pet_id);
      return res.sendSuccess(vaccinations, "Pet vaccination history fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vaccination history");
    }
  },

  async getDueVaccinations(req, res) {
    try {
      const vaccinations = await vaccinationsService.getDueVaccinations();
      return res.sendSuccess(vaccinations, "Due vaccinations fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch due vaccinations");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateVaccinationSchema, req.body);
      const vaccination = await vaccinationsService.update(id, data, req.user);
      return res.sendSuccess(vaccination, "Vaccination updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update vaccination");
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await vaccinationsService.delete(id, req.user);
      return res.sendSuccess(result, "Vaccination deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete vaccination");
    }
  },
};

export default vaccinationsController;
