import taxRateService from "../service/taxrate.service.js";
import discountService from "../service/discount.service.js";
import paymentMethodService from "../service/paymentmethod.service.js";
import categoryService from "../../product/service/category.service.js";

const settingsController = {
  // ============ TAX RATES ============
  async createTaxRate(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const taxRate = await taxRateService.create(req.body, userInfo);
      return res.sendSuccess(taxRate, "Tax rate created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create tax rate");
    }
  },

  async getAllTaxRates(req, res) {
    try {
      const taxRates = await taxRateService.getAll(req.query);
      return res.sendSuccess(taxRates, "Tax rates fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch tax rates");
    }
  },

  async getTaxRateById(req, res) {
    try {
      const taxRate = await taxRateService.getById(req.params.id);
      return res.sendSuccess(taxRate, "Tax rate fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch tax rate");
    }
  },

  async updateTaxRate(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const taxRate = await taxRateService.update(req.params.id, req.body, userInfo);
      return res.sendSuccess(taxRate, "Tax rate updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update tax rate");
    }
  },

  async deleteTaxRate(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const result = await taxRateService.delete(req.params.id, userInfo);
      return res.sendSuccess(result, result.message);
    } catch (error) {
      return res.sendError(error.message || "Failed to delete tax rate");
    }
  },

  // ============ DISCOUNTS ============
  async createDiscount(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const discount = await discountService.create(req.body, userInfo);
      return res.sendSuccess(discount, "Discount created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create discount");
    }
  },

  async getAllDiscounts(req, res) {
    try {
      const discounts = await discountService.getAll(req.query);
      return res.sendSuccess(discounts, "Discounts fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch discounts");
    }
  },

  async getDiscountById(req, res) {
    try {
      const discount = await discountService.getById(req.params.id);
      return res.sendSuccess(discount, "Discount fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch discount");
    }
  },

  async updateDiscount(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const discount = await discountService.update(req.params.id, req.body, userInfo);
      return res.sendSuccess(discount, "Discount updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update discount");
    }
  },

  async deleteDiscount(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const result = await discountService.delete(req.params.id, userInfo);
      return res.sendSuccess(result, result.message);
    } catch (error) {
      return res.sendError(error.message || "Failed to delete discount");
    }
  },

  // ============ PAYMENT METHODS ============
  async createPaymentMethod(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const paymentMethod = await paymentMethodService.create(req.body, userInfo);
      return res.sendSuccess(paymentMethod, "Payment method created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create payment method");
    }
  },

  async getAllPaymentMethods(req, res) {
    try {
      const paymentMethods = await paymentMethodService.getAll(req.query);
      return res.sendSuccess(paymentMethods, "Payment methods fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch payment methods");
    }
  },

  async getPaymentMethodById(req, res) {
    try {
      const paymentMethod = await paymentMethodService.getById(req.params.id);
      return res.sendSuccess(paymentMethod, "Payment method fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch payment method");
    }
  },

  async updatePaymentMethod(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const paymentMethod = await paymentMethodService.update(req.params.id, req.body, userInfo);
      return res.sendSuccess(paymentMethod, "Payment method updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update payment method");
    }
  },

  async deletePaymentMethod(req, res) {
    try {
      const userInfo = {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      };

      const result = await paymentMethodService.delete(req.params.id, userInfo);
      return res.sendSuccess(result, result.message);
    } catch (error) {
      return res.sendError(error.message || "Failed to delete payment method");
    }
  },

  // ============ CATEGORIES (using existing service) ============
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories(req.query);
      return res.sendSuccess(categories, "Categories fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch categories");
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      return res.sendSuccess(category, "Category fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch category");
    }
  },

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      return res.sendSuccess(category, "Category created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create category");
    }
  },

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      return res.sendSuccess(category, "Category updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update category");
    }
  },

  async deleteCategory(req, res) {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      return res.sendSuccess(result, result.message);
    } catch (error) {
      return res.sendError(error.message || "Failed to delete category");
    }
  },
};

export default settingsController;
