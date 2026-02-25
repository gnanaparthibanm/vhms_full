import posService from "../service/pos.service.js";

const posController = {
    // Create new POS Sale
    async create(req, res) {
        try {
            const data = req.body;

            // Attach user info from token
            if (req.user) {
                data.created_by = req.user.id;
                data.created_by_name = req.user.username || req.user.name;
                data.created_by_email = req.user.email;
            }

            const sale = await posService.createSale(data);
            return res.status(201).json({
                status: "success",
                message: "Sale created successfully",
                data: sale,
            });
        } catch (err) {
            return res.status(400).json({
                status: "error",
                message: err.message,
            });
        }
    },

    // Get all Sales with filters + pagination
    async getAll(req, res) {
        try {
            let { page = 1, limit = 10, ...filters } = req.query;

            page = parseInt(page, 10);
            limit = parseInt(limit, 10);
            const offset = (page - 1) * limit;

            const result = await posService.getAllSales({
                filters,
                limit,
                offset,
            });

            return res.json({
                status: "success",
                message: "Sales fetched successfully",
                data: result,
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: err.message,
            });
        }
    },

    // Get Sale by ID
    async getById(req, res) {
        try {
            const sale = await posService.getSaleById(req.params.id);
            if (!sale) {
                return res.status(404).json({
                    status: "error",
                    message: "Sale not found",
                });
            }
            return res.json({
                status: "success",
                message: "Sale fetched successfully",
                data: sale,
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: err.message,
            });
        }
    },

    // Update Sale
    async update(req, res) {
        try {
            const data = req.body;

            // Attach updater info
            if (req.user) {
                data.updated_by = req.user.id;
                data.updated_by_name = req.user.username || req.user.name;
                data.updated_by_email = req.user.email;
            }

            const sale = await posService.updateSale(req.params.id, data);

            if (!sale) {
                return res.status(404).json({
                    status: "error",
                    message: "Sale not found",
                });
            }

            return res.json({
                status: "success",
                message: "Sale updated successfully",
                data: sale,
            });
        } catch (err) {
            return res.status(400).json({
                status: "error",
                message: err.message,
            });
        }
    },

    // Delete Sale
    async delete(req, res) {
        try {
            const sale = await posService.getSaleById(req.params.id);
            if (!sale) {
                return res.status(404).json({
                    status: "error",
                    message: "Sale not found",
                });
            }

            const result = await posService.deleteSale(
                req.params.id,
                req.user || {}
            );

            return res.json({
                status: "success",
                message: "Sale deleted successfully",
                data: result,
            });
        } catch (err) {
            return res.status(500).json({
                status: "error",
                message: err.message,
            });
        }
    },
};

export default posController;
