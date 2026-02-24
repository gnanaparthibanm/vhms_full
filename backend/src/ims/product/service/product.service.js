// services/product.service.js
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Subcategory from "../models/subcategory.models.js";
import { Op } from "sequelize";

const productService = {
  async createProduct(data) {
  // ✅ Check if category exists (only if provided)
  if (data.category_id) {
    const categoryExists = await Category.findByPk(data.category_id);
    if (!categoryExists) {
      throw new Error("Category not found. Cannot create product.");
    }
  }

  // ✅ Check if subcategory exists (if provided)
  if (data.sub_category_id) {
    const subcategoryExists = await Subcategory.findByPk(data.sub_category_id);
    if (!subcategoryExists) {
      throw new Error("Subcategory not found. Cannot create product.");
    }

    // Optional: Check if subcategory belongs to the given category (only if both provided)
    if (data.category_id && subcategoryExists.category_id !== data.category_id) {
      throw new Error("Subcategory does not belong to the selected category.");
    }
  }

  // ✅ Create product
  return await Product.create(data);
},


  // ✅ Get all products with filters, pagination, and exclude soft-deleted
  async getAllProducts({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = { is_active: true };

    // 🔎 global search on product_name OR product_code
    if (filters.search) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${filters.search}%` } },
        { product_code: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    // Exact match filter for product_name
    if (filters.product_name) {
      where.product_name = filters.product_name;
    }

    // Other filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.category_id) {
      where.category_id = filters.category_id;
    }
    if (filters.brand) {
      where.brand = { [Op.like]: `%${filters.brand}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Fetch category and subcategory names in bulk
    const categoryIds = [...new Set(rows.map(p => p.category_id))];
    const subcategoryIds = [...new Set(rows.map(p => p.sub_category_id).filter(Boolean))];

    const categories = await Category.findAll({ where: { id: categoryIds }, raw: true });
    const subcategories = await Subcategory.findAll({ where: { id: subcategoryIds }, raw: true });

    // Merge names into product data
    const dataWithNames = rows.map(p => {
      const category = categories.find(c => c.id === p.category_id);
      const subcategory = subcategories.find(s => s.id === p.sub_category_id);
      return {
        ...p.dataValues,
        category_name: category ? category.category_name : null,
        subcategory_name: subcategory ? subcategory.subcategory_name : null,
      };
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: dataWithNames,
    };
  },

  async getProductById(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    const category = await Category.findByPk(product.category_id, { raw: true });
    let subcategory = null;
    if (product.sub_category_id) {
      subcategory = await Subcategory.findByPk(product.sub_category_id, { raw: true });
    }

    return {
      ...product.dataValues,
      category_name: category ? category.category_name : null,
      subcategory_name: subcategory ? subcategory.subcategory_name : null,
    };
  },

  async getProductByCode(product_code) {
    const product = await Product.findOne({ where: { product_code } });
    if (!product) throw new Error("Product not found");

    const category = await Category.findByPk(product.category_id, { raw: true });
    let subcategory = null;
    if (product.sub_category_id) {
      subcategory = await Subcategory.findByPk(product.sub_category_id, { raw: true });
    }
    return {
      ...product.dataValues,
      category_name: category ? category.category_name : null,
      subcategory_name: subcategory ? subcategory.subcategory_name : null,
    };
  },

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.update(data);
    return product;
  },

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    // Soft delete: mark as inactive
    product.is_active = false;
    await product.save();

    return { message: "Product soft deleted successfully" };
  },

  async findByCode(product_code) {
    return await Product.findOne({ where: { product_code } });
  },

  // Get the last product for auto product code generation
  async getLastProduct() {
    return await Product.findOne({
      order: [["createdAt", "DESC"]],
    });
  },

  // ✅ Get prescription-eligible products only
  async getPrescriptionProducts({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = { 
      is_active: true,
      is_prescription_item: true,
      status: 'active'
    };

    // Search filter
    if (filters.search) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${filters.search}%` } },
        { product_code: { [Op.like]: `%${filters.search}%` } },
        { generic_name: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    // Product type filter
    if (filters.product_type) {
      where.product_type = filters.product_type;
    }

    // Dosage form filter
    if (filters.dosage_form) {
      where.dosage_form = filters.dosage_form;
    }

    // Category filter
    if (filters.category_id) {
      where.category_id = filters.category_id;
    }

    // Exclude expired products
    if (filters.exclude_expired !== false) {
      where[Op.or] = [
        { expiry_date: null },
        { expiry_date: { [Op.gt]: new Date() } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["product_name", "ASC"]],
      attributes: [
        'id', 'product_name', 'product_code', 'generic_name', 'strength',
        'dosage_form', 'unit', 'selling_price', 'product_type', 'manufacturer',
        'expiry_date', 'side_effects', 'contraindications', 'requires_prescription'
      ]
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: rows,
    };
  },

  // ✅ Check if product is available for prescription
  async validatePrescriptionProduct(productId) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return { valid: false, message: "Product not found" };
    }

    if (!product.is_prescription_item) {
      return { valid: false, message: "Product is not marked as a prescription item" };
    }

    if (product.status !== 'active') {
      return { valid: false, message: "Product is not active" };
    }

    if (product.expiry_date && new Date(product.expiry_date) < new Date()) {
      return { valid: false, message: "Product has expired" };
    }

    return { valid: true, product };
  },
};

export default productService;
