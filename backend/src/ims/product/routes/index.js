import express from 'express';
import productRoutes from './product.routes.js';
import CategoryRoutes from './category.routes.js';
import SubcategoryRoutes from './subcategory.routes.js';
import billableItemRoutes from './billableitem.routes.js';


const router = express.Router();

router.use('/product', productRoutes);
router.use('/product', CategoryRoutes);
router.use('/product', SubcategoryRoutes);
router.use('/billable-items', billableItemRoutes);

export default router;