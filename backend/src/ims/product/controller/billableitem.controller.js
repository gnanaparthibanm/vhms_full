import billableItemService from "../service/billableitem.service.js";

const billableItemController = {
  async create(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const item = await billableItemService.create(req.body, userInfo);
      return res.sendSuccess(item, "Billable item created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create billable item");
    }
  },

  async getAll(req, res) {
    try {
      const items = await billableItemService.getAll(req.query);
      return res.sendSuccess(items, "Billable items fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch billable items");
    }
  },

  async getById(req, res) {
    try {
      const item = await billableItemService.getById(req.params.id);
      return res.sendSuccess(item, "Billable item fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch billable item");
    }
  },

  async update(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const item = await billableItemService.update(req.params.id, req.body, userInfo);
      return res.sendSuccess(item, "Billable item updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update billable item");
    }
  },

  async delete(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const result = await billableItemService.delete(req.params.id, userInfo);
      return res.sendSuccess(result, result.message);
    } catch (error) {
      return res.sendError(error.message || "Failed to delete billable item");
    }
  },

  async updateStock(req, res) {
    try {
      const { quantity, operation } = req.body;
      const item = await billableItemService.updateStock(req.params.id, quantity, operation);
      return res.sendSuccess(item, "Stock updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update stock");
    }
  },
};

export default billableItemController;
