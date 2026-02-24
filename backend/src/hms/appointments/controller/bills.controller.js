import billsService from "../service/bills.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createBillSchema,
  updateBillSchema,
  addPaymentSchema,
} from "../dto/bills.dto.js";

const billsController = {

  async create(req, res) {
    try {
      const data = await parseZodSchema(createBillSchema, req.body);
      const bill = await billsService.create(data, req.user);
      return res.sendSuccess(bill, "Bill created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create bill");
    }
  },

  async getAll(req, res) {
    try {
      const bills = await billsService.getAll(req.query);
      return res.sendSuccess(bills, "Bills fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch bills");
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const bill = await billsService.getById(id);
      return res.sendSuccess(bill, "Bill fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch bill");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateBillSchema, req.body);
      const bill = await billsService.update(id, data, req.user);
      return res.sendSuccess(bill, "Bill updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update bill");
    }
  },

  async addPayment(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(addPaymentSchema, req.body);
      const bill = await billsService.addPayment(id, data, req.user);
      return res.sendSuccess(bill, "Payment added successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to add payment");
    }
  },

  async getPaymentHistory(req, res) {
    try {
      const { id } = req.params;
      const payments = await billsService.getPaymentHistory(id);
      return res.sendSuccess(payments, "Payment history fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch payment history");
    }
  },

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const result = await billsService.cancel(id, req.user);
      return res.sendSuccess(result, "Bill cancelled successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to cancel bill");
    }
  },

  async getMonthlyTaxReport(req, res) {
    try {
      const report = await billsService.getMonthlyTaxReport(req.query);
      return res.sendSuccess(report, "Monthly tax report fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch tax report");
    }
  },

  async getTaxSummary(req, res) {
    try {
      const { start_date, end_date } = req.query;
      if (!start_date || !end_date) {
        return res.sendError("Start date and end date are required");
      }
      const summary = await billsService.getTaxSummary(start_date, end_date);
      return res.sendSuccess(summary, "Tax summary fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch tax summary");
    }
  },
};

export default billsController;
