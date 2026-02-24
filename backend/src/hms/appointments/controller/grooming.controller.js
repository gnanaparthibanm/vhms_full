import groomingService from "../service/grooming.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createGroomingSchema,
  updateGroomingSchema,
  recommendGroomingSchema,
  createGroomingPackageSchema,
  updateGroomingPackageSchema,
} from "../dto/grooming.dto.js";

const groomingController = {

  // ============================================
  // GROOMING SESSIONS
  // ============================================

  async create(req, res) {
    try {
      const data = await parseZodSchema(createGroomingSchema, req.body);
      const grooming = await groomingService.create(data, req.user);
      return res.sendSuccess(grooming, "Grooming session created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create grooming session");
    }
  },

  async recommendGrooming(req, res) {
    try {
      const data = await parseZodSchema(recommendGroomingSchema, req.body);
      const result = await groomingService.recommendGrooming(data, req.user);
      return res.sendSuccess(result, "Grooming recommended and appointment created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to recommend grooming");
    }
  },

  async getAll(req, res) {
    try {
      const grooming = await groomingService.getAll(req.query);
      return res.sendSuccess(grooming, "Grooming sessions fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch grooming sessions");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const grooming = await groomingService.getById(id);
      return res.sendSuccess(grooming, "Grooming session fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch grooming session");
    }
  },

  async getPetHistory(req, res) {
    try {
      const { pet_id } = req.params;
      const history = await groomingService.getPetHistory(pet_id);
      return res.sendSuccess(history, "Pet grooming history fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch grooming history");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateGroomingSchema, req.body);
      const grooming = await groomingService.update(id, data, req.user);
      return res.sendSuccess(grooming, "Grooming session updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update grooming session");
    }
  },

  async updateServiceStatus(req, res) {
    try {
      const { service_id } = req.params;
      const { status, notes } = req.body;
      const service = await groomingService.updateServiceStatus(service_id, status, notes);
      return res.sendSuccess(service, "Service status updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update service status");
    }
  },

  async startSession(req, res) {
    try {
      const { id } = req.params;
      const grooming = await groomingService.startSession(id, req.user);
      return res.sendSuccess(grooming, "Grooming session started successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to start grooming session");
    }
  },

  async completeSession(req, res) {
    try {
      const { id } = req.params;
      const grooming = await groomingService.completeSession(id, req.body, req.user);
      return res.sendSuccess(grooming, "Grooming session completed successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to complete grooming session");
    }
  },

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const result = await groomingService.cancel(id, req.user);
      return res.sendSuccess(result, "Grooming session cancelled successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to cancel grooming session");
    }
  },

  // ============================================
  // GROOMING PACKAGES
  // ============================================

  async createPackage(req, res) {
    try {
      const data = await parseZodSchema(createGroomingPackageSchema, req.body);
      const groomingPackage = await groomingService.createPackage(data, req.user);
      return res.sendSuccess(groomingPackage, "Grooming package created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create grooming package");
    }
  },

  async getAllPackages(req, res) {
    try {
      const packages = await groomingService.getAllPackages(req.query);
      return res.sendSuccess(packages, "Grooming packages fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch grooming packages");
    }
  },

  async getPackageById(req, res) {
    try {
      const { id } = req.params;
      const groomingPackage = await groomingService.getPackageById(id);
      return res.sendSuccess(groomingPackage, "Grooming package fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch grooming package");
    }
  },

  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateGroomingPackageSchema, req.body);
      const groomingPackage = await groomingService.updatePackage(id, data, req.user);
      return res.sendSuccess(groomingPackage, "Grooming package updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update grooming package");
    }
  },

  async deletePackage(req, res) {
    try {
      const { id } = req.params;
      const result = await groomingService.deletePackage(id, req.user);
      return res.sendSuccess(result, "Grooming package deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete grooming package");
    }
  },
};

export default groomingController;
